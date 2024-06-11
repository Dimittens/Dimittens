require('dotenv').config(); // Carrega variáveis de ambiente do arquivo .env

const express = require('express');
const mysql = require('mysql');
const app = express();
const path = require('path');

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
