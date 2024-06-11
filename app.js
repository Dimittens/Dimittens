const express = require('express');
const app = express();
const path = require('path');
<<<<<<< HEAD
=======
// Use a porta fornecida pelo ambiente ou 3000 como padrão
>>>>>>> 0d7b96436c05c201f30659bf884cab68d68ad810
const port = process.env.APP_PORT || 3000;

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
