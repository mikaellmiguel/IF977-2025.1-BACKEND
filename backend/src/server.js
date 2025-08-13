require('dotenv').config();
require("express-async-error");

const express = require('express');
const errorHandler = require('./middlewares/errorHandler');
const routes = require('./routes');
const cors = require('cors');

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../swagger');

const app = express();
app.use(express.json());
app.use(cors());

// Documentação Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(routes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`INFO: O Server está rodando em http://localhost:${PORT}`);
});