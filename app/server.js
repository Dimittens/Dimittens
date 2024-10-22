const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');

const { router } = require('../routes');

// Conecta ao MongoDB
mongoose.connect('mongodb://localhost:27017/mercadopago', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Cria uma instância do Express
const app = express();

// Middleware para processar JSON
app.use(express.json());
app.use(cors());

// Rotas
app.use(router);

// Middleware para tratamento de erros
app.use((err, req, res) => {
  if (err instanceof Error) {
    return res.status(400).json({
      message: err.message
    });
  }

  return res.status(500).json({
    status: 'error',
    message: 'Internal Server Error'
  });
});

// Inicia o servidor na porta 5000
app.listen(5000, () => console.log(`🔥 Server started on port 5000!`));
