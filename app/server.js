require('dotenv').config(); // Carrega variáveis de ambiente do arquivo .env

const express = require('express');
const mysql = require('mysql');
const app = express();
const path = require('path');

// Use a porta fornecida pelo ambiente ou 3000 como padrão
const port = process.env.APP_PORT || 3000;

// Configurar a conexão com o banco de dados
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
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
