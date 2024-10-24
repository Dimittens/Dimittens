const express = require('express');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const http = require('http');
<<<<<<< HEAD
const WebSocket = require('ws');
const multer = require('multer');
const path = require('path');
const pool = require('./config/pool_de_conexao'); // Conexão com o banco de dados
const router = require('./app/routes/router'); // Importação das rotas
require('dotenv').config(); // Carregar variáveis de ambiente

=======
const pool = require('./config/pool_de_conexao');
>>>>>>> a6f05cbbe5fa7a016462fd8bc39753544a86db13
const app = express();
const server = http.createServer(app);
const port = 3000;

// Configuração do armazenamento de sessões no MySQL
const sessionStore = new MySQLStore({}, pool);
<<<<<<< HEAD

=======
const activeConnections = new Map();
>>>>>>> a6f05cbbe5fa7a016462fd8bc39753544a86db13
app.use(
  session({
    key: 'user_session',
    secret: 'pudimcombolodecenoura',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
<<<<<<< HEAD
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }, // Sessão de 24 horas
  })
);

// Middleware global para variáveis nas views
=======
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 },
  })
);

>>>>>>> a6f05cbbe5fa7a016462fd8bc39753544a86db13
app.use((req, res, next) => {
  res.locals.usuarioNome = req.session.autenticado ? req.session.autenticado.usuarioNome : null;
  next();
});

<<<<<<< HEAD
// Middleware para arquivos estáticos
app.use(express.static(path.join(__dirname, 'app/public')));

// Configuração da view engine EJS
=======
app.use(express.static('app/public'));

>>>>>>> a6f05cbbe5fa7a016462fd8bc39753544a86db13
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'app/views'));

// Parsing do corpo das requisições
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

<<<<<<< HEAD
// Configuração do Multer para uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});
const upload = multer({ storage });

// Importação e uso das rotas
app.use('/', router);

// Middleware para verificar autenticação
=======
const rotas = require('./app/routes/router');
app.use('/', rotas);


>>>>>>> a6f05cbbe5fa7a016462fd8bc39753544a86db13
function verificarAutenticacao(req, res, next) {
  if (req.session.autenticado) {
    return next(); // Usuário autenticado
  }
  res.redirect('/loginpacientes'); // Redirecionar se não autenticado
}
<<<<<<< HEAD
=======
app.post('/api/denunciar', async (req, res) => {
    const { nomeDenunciante, nomeDenunciado, motivoDenuncia, textoDenuncia } = req.body;
    const usuarioId = req.session.autenticado.usuarioId;
>>>>>>> a6f05cbbe5fa7a016462fd8bc39753544a86db13

// Configuração do WebSocket
const wss = new WebSocket.Server({ server });
const activeConnections = new Map();

<<<<<<< HEAD
// WebSocket: Lidar com novas conexões
wss.on('connection', (ws) => {
  console.log('Nova conexão WebSocket estabelecida');
  ws.isAlive = true;
=======
        res.status(201).json({ message: 'Denúncia registrada com sucesso!' });
    } catch (error) {
        console.error("Erro ao registrar denúncia:", error);
        res.status(500).json({ error: 'Erro ao registrar a denúncia.' });
    }
});
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + '-' + file.originalname)
    }
});
const upload = multer({ storage: storage });

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Tipo de arquivo não permitido'), false);
    }
};


app.post('/api/banir', async (req, res) => {
    const { nomeUsuario } = req.body;
  
    try {
      const [usuario] = await pool.query(
        `SELECT ID_USUARIO FROM usuario WHERE NOME_USUARIO = ?`, 
        [nomeUsuario]
      );
  
      if (usuario.length === 0) {
        return res.status(404).json({ success: false, message: 'Usuário não encontrado.' });
      }
  
      const usuarioId = usuario[0].ID_USUARIO;
  
      await pool.query(
        `UPDATE usuario SET DIFERENCIACAO_USUARIO = 'Banido' WHERE ID_USUARIO = ?`, 
        [usuarioId]
      );
  
      res.json({ success: true });
    } catch (error) {
      console.error("Erro ao banir usuário:", error);
      res.status(500).json({ success: false, message: 'Erro ao banir usuário.' });
    }
  });

app.get('/chat', checkAuthenticatedUser, async (req, res) => {
    try {
        const [sessoesChatAtivas] = await pool.query(`
            SELECT DISTINCT
                c.ID_CONSULTAS as consultaId,
                u.NOME_USUARIO as psicologoNome,
                u.AVATAR_USUARIO as psicologoAvatar,
                (SELECT MENSAGEM_CHAT 
                 FROM chat 
                 WHERE ID_CONSULTA = c.ID_CONSULTAS 
                 ORDER BY DATA_HORA_CHAT DESC 
                 LIMIT 1) as ultimaMensagem,
                c.DATAHORA_CONSULTAS as ultimaAtualizacao
            FROM consultas c
            JOIN usuario u ON (
                CASE 
                    WHEN c.USUARIO_ID_USUARIO = ? THEN c.PSICOLOGO_ID_PSICOLOGO = u.ID_USUARIO
                    ELSE c.USUARIO_ID_USUARIO = u.ID_USUARIO
                END
            )
            WHERE (c.USUARIO_ID_USUARIO = ? OR c.PSICOLOGO_ID_PSICOLOGO = ?)
            AND c.STATUS_CONSULTAS = 'Agendada'
        `, [req.session.autenticado.usuarioId, req.session.autenticado.usuarioId, req.session.autenticado.usuarioId]);

        res.render('pages/index', {
            pagina: 'chat',
            autenticado: req.session.autenticado,
            sessoesChatAtivas: sessoesChatAtivas
        });
    } catch (error) {
        console.error('Erro ao carregar chat:', error);
        res.status(500).render('pages/index', {
            pagina: 'chat',
            autenticado: req.session.autenticado,
            error: 'Erro ao carregar sessões de chat'
        });
    }
});
app.get('/api/usuario/cpf/:cpf', async (req, res) => {
    const cpf = req.params.cpf;
    
    if (!cpf) {
      return res.status(400).json({ error: 'CPF não fornecido' });
    }
  
    try {
      const [rows] = await pool.query(
        'SELECT ID_USUARIO FROM usuario WHERE CPF_USUARIO = ?',
        [cpf]
      );
  
      if (rows.length > 0) {
        return res.status(200).json({ idUsuario: rows[0].ID_USUARIO });
      } else {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }
    } catch (error) {
      console.error('Erro ao consultar o banco de dados:', error);
      return res.status(500).json({ error: 'Erro interno no servidor' });
    }
  });
  app.post('/api/consultas', async (req, res) => {
    const { dataHora, status, preferencias, valor, tempo, anotacoes, usuarioId, psicologoId } = req.body;
  
    try {
      await pool.query(`
        INSERT INTO consultas (DATAHORA_CONSULTAS, STATUS_CONSULTAS, PREFERENCIAS_REMOTAS_CONSULTAS, 
                               VALOR_CONSULTA, TEMPO_CONSULTA, ANOTACOES_CONSULTAS, 
                               USUARIO_ID_USUARIO, PSICOLOGO_ID_PSICOLOGO)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [dataHora, status, preferencias, valor, tempo, anotacoes, usuarioId, psicologoId]
      );
  
      res.json({ success: true });
    } catch (error) {
      console.error('Erro ao inserir consulta:', error);
      res.status(500).json({ success: false, message: 'Erro ao agendar consulta' });
    }
  });
wss.on('connection', (ws, req) => {
    console.log('Nova conexão WebSocket estabelecida');
>>>>>>> a6f05cbbe5fa7a016462fd8bc39753544a86db13

  ws.on('pong', () => {
    ws.isAlive = true;
<<<<<<< HEAD
  });
=======
    ws.on('pong', () => {
        ws.isAlive = true;
    });

    ws.on('message', async (message) => {
        try {
            const data = JSON.parse(message);
            console.log('Mensagem recebida:', data);

            switch (data.type) {
                case 'join':
                    ws.consultaId = data.consultaId;
                    ws.usuarioId = data.usuarioId;
                    
                    if (!activeConnections.has(data.consultaId)) {
                        activeConnections.set(data.consultaId, new Set());
                    }
                    activeConnections.get(data.consultaId).add(ws);
                    
                    console.log(`Usuário ${data.usuarioId} entrou na consulta ${data.consultaId}`);
                    break;

                case 'nova_mensagem':
                    const connections = activeConnections.get(data.consultaId) || new Set();
                    connections.forEach(client => {
                        if (client.readyState === WebSocket.OPEN) {
                            client.send(JSON.stringify({
                                type: 'nova_mensagem',
                                consultaId: data.consultaId,
                                mensagem: data.mensagem
                            }));
                        }
                    });
                    break;
                case 'novo_arquivo':
                        const arquivoConnections = activeConnections.get(data.consultaId) || new Set();
                        arquivoConnections.forEach(client => {
                            if (client.readyState === WebSocket.OPEN) {
                                client.send(JSON.stringify({
                                    type: 'novo_arquivo',
                                    consultaId: data.consultaId,
                                    arquivo: data.arquivo
                                }));
                            }
                        });
                        break;
            }
        } catch (error) {
            console.error('Erro ao processar mensagem:', error);
        }
    });

    ws.on('close', () => {
        if (ws.consultaId && activeConnections.has(ws.consultaId)) {
            activeConnections.get(ws.consultaId).delete(ws);
            if (activeConnections.get(ws.consultaId).size === 0) {
                activeConnections.delete(ws.consultaId);
            }
        }
        console.log('Conexão WebSocket fechada');
    });
});
app.post('/api/upload', upload.single('arquivo'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    const { consultaId, remetenteId } = req.body;
>>>>>>> a6f05cbbe5fa7a016462fd8bc39753544a86db13

  ws.on('message', async (message) => {
    try {
<<<<<<< HEAD
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
=======
        console.log('File:', req.file);
        console.log('Body:', req.body);

        if (!consultaId || !remetenteId) {
            return res.status(400).json({ 
                error: 'consultaId e remetenteId são obrigatórios',
                receivedData: { consultaId, remetenteId }
            });
        }

        await pool.query(`
            INSERT INTO chat (ID_CONSULTA, ID_REMETENTE, MENSAGEM_CHAT, DOCUMENTOS_CHAT, DATA_HORA_CHAT) 
            VALUES (?, ?, ?, ?, NOW())
        `, [consultaId, remetenteId, '', req.file.filename]);

        const connections = activeConnections.get(consultaId) || new Set();
        connections.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                    type: 'novo_arquivo',
                    consultaId: consultaId,
                    remetenteId: remetenteId,
                    arquivo: req.file.filename
                }));
            }
        });

        res.status(200).json({ 
            success: true, 
            arquivo: req.file.filename,
            path: `/uploads/${req.file.filename}`
>>>>>>> a6f05cbbe5fa7a016462fd8bc39753544a86db13
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

<<<<<<< HEAD
// Verificar e encerrar conexões inativas a cada 30 segundos
setInterval(() => {
  wss.clients.forEach((ws) => {
    if (!ws.isAlive) return ws.terminate();
    ws.isAlive = false;
    ws.ping();
  });
=======
app.use('/uploads', express.static('uploads'));
const interval = setInterval(() => {
    wss.clients.forEach(ws => {
        if (ws.isAlive === false) {
            return ws.terminate();
        }
        ws.isAlive = false;
        ws.ping();
    });
>>>>>>> a6f05cbbe5fa7a016462fd8bc39753544a86db13
}, 30000);

// Rota de upload de arquivos
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

<<<<<<< HEAD
// Servir arquivos da pasta 'uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
=======

app.get('/homelogged', verificarAutenticacao, (req, res) => {
  res.render('home', {
    usuarioNome: req.session.autenticado.usuarioNome,
    mensagem: 'Bem-vindo à rota protegida!',
  });
});


>>>>>>> a6f05cbbe5fa7a016462fd8bc39753544a86db13

server.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}\nhttp://localhost:${port}`);
});
