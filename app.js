const express = require('express');
var session = require('express-session');
const app = express();
const port = 3000;
const env = require('dotenv').config();

// Configuração da sessão
app.use(session({ 
    secret: "pudimcombolodecenoura",
    resave: false,
    saveUninitialized: false, 
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 horas em milissegundos
}));

app.use((req, res, next) => {
    res.locals.usuarioNome = req.session.autenticado ? req.session.autenticado.usuarioNome : null;
    next();
});


app.use(express.static("app/public"));
app.set("view engine", "ejs");
app.set("views", "./app/views");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var rotas = require("./app/routes/router");
app.use("/", rotas);

// Middleware para proteger rotas
function verificarAutenticacao(req, res, next) {
    if (req.session.autenticado) {
        return next(); // O usuário está autenticado, prossiga
    } else {
        res.redirect('/loginpacientes'); // Redirecionar para a página de login
    }
}

// Exemplo de uso da verificação em uma rota protegida
app.get('/homelogged', verificarAutenticacao, (req, res) => {
    res.send('Bem-vindo à rota protegida! Você está logado.');
});

app.listen(port, () => {
    console.log(`Servidor aberto na: ${port}\nhttp://localhost:${port}`);
});
