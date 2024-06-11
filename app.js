const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

// Define a engine de visualização como EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'app', 'views')); // Caminho atualizado

// Log para verificar o caminho das views
console.log('Views directory:', path.join(__dirname, 'app', 'views'));

// Verifique o conteúdo do diretório 'views'
const viewsDir = path.join(__dirname, 'app', 'views');
console.log('Views directory contents:', fs.readdirSync(viewsDir));

// Verifique o conteúdo do diretório 'views/pages'
const pagesDir = path.join(viewsDir, 'pages');
console.log('Pages directory contents:', fs.readdirSync(pagesDir));

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
