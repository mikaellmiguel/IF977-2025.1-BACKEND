const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API FiscalizaDeputado',
      version: '1.0.0',
      description: 'Documentação da API do projeto FiscalizaDeputado',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}`,
        description: 'Servidor local',
      },
    ],
  },
  apis: [
    './src/routes/*.js', // Caminho dos arquivos de rotas para anotações Swagger
  ],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

module.exports = swaggerSpec;
