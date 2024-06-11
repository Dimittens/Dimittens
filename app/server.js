const express = require('express');
const app = express();
const path = require('path');
const port = 3000;

// Define a engine de visualização como EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Aponta para 'app/views'

// Servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Rota para a página principal
app.get('/', (req, res) => {
    res.render('pages/index'); // Renderiza 'app/views/pages/index.ejs'
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
