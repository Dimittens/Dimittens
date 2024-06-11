const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

// Define a engine de visualização como EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'app', 'views')); 

// Servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Rota para a página principal
app.get('/', (req, res) => {
    res.render('pages/index');
});

// Inicia o servidor
const port = process.env.APP_PORT || 3000;
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
