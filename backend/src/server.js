require('dotenv').config();
require("express-async-errors");

const express = require('express');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
app.use(express.json());

// ROTA INICIAL PARA TESTE
app.get('/', (req, res) => {
  res.send({
    message: 'Bem vindo ao servidor Express!',
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`INFO: O Server está rodando em http://localhost:${PORT}`);
});