const express = require('express');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const pool = require('./config/pool_de_conexao');
const app = express();
const port = 3000;
require('dotenv').config();

const sessionStore = new MySQLStore({}, pool);

// Configuração da sessão
app.use(
  session({
    key: 'user_session',
    secret: 'pudimcombolodecenoura',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }, // 24 horas
  })
);

// Middleware para adicionar o nome do usuário às views
app.use((req, res, next) => {
  res.locals.usuarioNome = req.session.autenticado
    ? req.session.autenticado.usuarioNome
    : null;
  next();
});

// Middleware para arquivos estáticos
app.use(express.static('app/public'));

// Configuração do EJS como view engine
app.set('view engine', 'ejs');
app.set('views', './app/views');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Importar rotas definidas
const rotas = require('./app/routes/router');
app.use('/', rotas);

// Middleware de autenticação para rotas protegidas
function verificarAutenticacao(req, res, next) {
  if (req.session.autenticado) {
    return next();
  } else {
    res.redirect('/loginpacientes');
  }
}

// Rota protegida que renderiza uma view
app.get('/homelogged', verificarAutenticacao, (req, res) => {
  res.render('home', {
    usuarioNome: req.session.autenticado.usuarioNome,
    mensagem: 'Bem-vindo à rota protegida!',
  });
});



// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor aberto na porta ${port}\nhttp://localhost:${port}`);
});
