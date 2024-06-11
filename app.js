const express = require('express');
const path = require('path');
const app = express();

// Define a engine de visualização como EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'app', 'views')); // Configuração do diretório de views

// Servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'app', 'public')));

// Rota para a página principal
app.get('/', (req, res) => {
    res.render('pages/index'); // Renderizando o arquivo index.ejs dentro de /views/pages
});

// Inicia o servidor
const port = process.env.APP_PORT || 3000;
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
