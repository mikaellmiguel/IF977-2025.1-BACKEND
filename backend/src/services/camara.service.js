const axios = require('axios');
const AppError = require('../utils/AppError');

const CAMARA_DEPUTADOS_API_URL = 'https://dadosabertos.camara.leg.br/api/v2/deputados';

const api = axios.create({
    baseURL: CAMARA_DEPUTADOS_API_URL
});


async function getDetailsDeputadoById(id) {

    if (!id || isNaN(Number(id))) {
        throw new AppError('ID do deputado inválido', 400);
    }

    try {
        const response = await api.get(`/${id}`);
        
        if(!response.data || !response.data.dados) {
            throw new Error(`ERROR (services/camara.service): Erro ao buscar deputado ${id}`);
        }

        const dados = response.data.dados;

        return dados;

    } 
    catch (error) {
        
        if (error.response && error.response.status === 404) {
            throw new AppError('Deputado não encontrado', 404);
        }

        throw error;
    }
}

module.exports = {
    getDetailsDeputadoById,
    api
};