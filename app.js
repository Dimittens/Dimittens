const express = require('express');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const http = require('http');
const WebSocket = require('ws');
const multer = require('multer');
const path = require('path');
const pool = require('./config/pool_de_conexao'); // Conexão com o banco de dados
const router = require('./app/routes/router'); // Importação das rotas
require('dotenv').config(); // Carregar variáveis de ambiente

const app = express();
const server = http.createServer(app);
const port = 3000;

// **Configuração do trust proxy** (Render usa HTTPS por padrão)
app.set('trust proxy', 1);

// **Configuração do MySQLStore**
let sessionStore;
try {
  sessionStore = new MySQLStore({}, pool);
  console.log('MySQL Store configurado corretamente.');
} catch (error) {
  console.error('Erro ao inicializar MySQLStore:', error);
  process.exit(1); // Finaliza a aplicação se houver erro
}

// **Configuração do middleware de sessão**
app.use(
  session({
    key: 'user_session',
    secret: 'pudimcombolodecenoura',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 horas
    },
  })
);

// **Middleware global para variáveis nas views**
app.use((req, res, next) => {
  const autenticado = req.session.autenticado || false;
  res.locals.autenticado = autenticado;
  res.locals.usuarioNome = autenticado ? autenticado.usuarioNome : null;
  next();
});

// **Middleware para arquivos estáticos**
app.use(express.static(path.join(__dirname, 'app/public')));

// **Configuração da view engine EJS**
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'app/views'));

// **Parsing do corpo das requisições**
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// **Configuração do Multer para upload de arquivos**
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Pasta onde os arquivos serão salvos
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);  // Nome único para o arquivo
  },
});
const upload = multer({ storage });

// **Rota de upload de arquivos**
app.post('/api/upload', upload.single('arquivo'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Nenhum arquivo enviado' });
  }

  const { consultaId, remetenteId } = req.body;

  try {
    await pool.query(
      `INSERT INTO chat (ID_CONSULTA, ID_REMETENTE, DOCUMENTOS_CHAT, DATA_HORA_CHAT) 
       VALUES (?, ?, ?, NOW())`,
      [consultaId, remetenteId, req.file.filename]
    );

    const connections = activeConnections.get(consultaId) || new Set();
    connections.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          type: 'novo_arquivo',
          consultaId,
          remetenteId,
          arquivo: req.file.filename,
        }));
      }
    });

    res.status(200).json({
      success: true,
      arquivo: req.file.filename,
      path: `/uploads/${req.file.filename}`,
    });
  } catch (error) {
    console.error('Erro ao salvar arquivo:', error);
    res.status(500).json({ error: 'Erro ao salvar arquivo' });
  }
});

// **Servir arquivos da pasta 'uploads'**
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// **Importação e uso das rotas**
app.use('/', router);

// **Configuração do WebSocket**
const wss = new WebSocket.Server({ server });
const activeConnections = new Map();

// **Lidar com novas conexões WebSocket**
wss.on('connection', (ws) => {
  console.log('Nova conexão WebSocket estabelecida');
  ws.isAlive = true;

  ws.on('pong', () => {
    ws.isAlive = true;
  });

  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message);
      console.log('Mensagem recebida:', data);

      if (data.type === 'join') {
        if (!activeConnections.has(data.consultaId)) {
          activeConnections.set(data.consultaId, new Set());
        }
        activeConnections.get(data.consultaId).add(ws);
      } else if (data.type === 'nova_mensagem') {
        const connections = activeConnections.get(data.consultaId) || new Set();
        connections.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
              type: 'nova_mensagem',
              consultaId: data.consultaId,
              mensagem: data.mensagem,
            }));
          }
        });
      }
    } catch (error) {
      console.error('Erro ao processar mensagem:', error);
    }
  });

  ws.on('close', () => {
    activeConnections.forEach((conjunto, consultaId) => {
      conjunto.delete(ws);
      if (conjunto.size === 0) {
        activeConnections.delete(consultaId);
      }
    });
    console.log('Conexão WebSocket fechada');
  });
});

// **Verificar e encerrar conexões inativas a cada 30 segundos**
setInterval(() => {
  wss.clients.forEach((ws) => {
    if (!ws.isAlive) return ws.terminate();
    ws.isAlive = false;
    ws.ping();
  });
}, 30000);

// **Inicializar o servidor**
server.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}\nhttp://localhost:${port}`);
});
