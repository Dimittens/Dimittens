const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const router = require('./routes'); // Certifique-se de que você tem o arquivo routes.js

// Conexão com o MongoDB
mongoose.connect('mongodb://localhost:27017/mercadopago', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("🔥 Conectado ao MongoDB com sucesso!");
}).catch((err) => {
  console.error("Erro ao conectar ao MongoDB:", err);
});

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(router);

// Tratamento de erros
app.use((err, request, response, next) => {
  if (err instanceof Error) {
    return response.status(400).json({
      message: err.message
    });
  }

  return response.status(500).json({
    status: 'error',
    message: 'Internal Server Error'
  });
});

// Iniciar o servidor na porta 5000
app.listen(5000, () => console.log(`🔥 Server started on port 5000!`));
