const express = require('express');
const mysql = require('mysql');
const app = express();
const path = require('path');

// Use a porta fornecida pelo ambiente ou 3000 como padrão
const port = process.env.PORT || 3000;

// Configurar a conexão com o banco de dados
const db = mysql.createConnection({
    host: process.env.Key_1,
    user: process.env.Key_2,
    password: process.env.Key_3,
    // Adicione outras variáveis de acordo com a sua configuração
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Conectado ao banco de dados.');
});

// Define a engine de visualização como EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Rota para a página principal
app.get('/', (req, res) => {
    res.render('pages/index');
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
