require('dotenv').config();
const express = require('express');

const app = express();
app.use(express.json());

// ROTA INICIAL PARA TESTE
app.get('/', (req, res) => {
  res.send({
    message: 'Bem vindo ao servidor Express!',
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`INFO: O Server está rodando em http://localhost:${PORT}`);
});