const axios = require('axios');
const AppError = require('../utils/AppError');

const CAMARA_DEPUTADOS_API_URL = 'https://dadosabertos.camara.leg.br/api/v2/deputados';

const api = axios.create({
    baseURL: CAMARA_DEPUTADOS_API_URL
});