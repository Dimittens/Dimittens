const express = require('express');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const pool = require('./config/pool_de_conexao'); // Conexão com o banco
const app = express();
const port = 3000;
require('dotenv').config();

// Configuração do MySQLStore para sessões
const sessionStore = new MySQLStore({}, pool);

// Configuração da sessão
app.use(
    session({
        key: 'user_session',
        secret: 'pudimcombolodecenoura',
        store: sessionStore,
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 horas
    })
);

// Middleware para passar o nome do usuário para as views
app.use((req, res, next) => {
    res.locals.usuarioNome = req.session.autenticado ? req.session.autenticado.usuarioNome : null;
    next();
});

app.use(express.static('app/public'));
app.set('view engine', 'ejs');
app.set('views', './app/views');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Importando as rotas
const rotas = require('./app/routes/router');
app.use('/', rotas);

// Middleware para verificar autenticação
function verificarAutenticacao(req, res, next) {
    if (req.session.autenticado) {
        return next(); // Usuário autenticado, prosseguir
    } else {
        res.redirect('/loginpacientes'); // Redirecionar para o login
    }
}

// Exemplo de rota protegida
app.get('/homelogged', verificarAutenticacao, (req, res) => {
    res.send(`Bem-vindo à rota protegida! Você está logado como ${req.session.autenticado.usuarioNome}.`);
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor aberto na porta ${port}\nhttp://localhost:${port}`);
});
