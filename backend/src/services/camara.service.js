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

        return {
            id: dados.id,
            nome_civel: dados.nomeCivil,
            nome: dados.ultimoStatus.nome,
            partido: dados.ultimoStatus.siglaPartido,
            sigla_uf: dados.ultimoStatus.siglaUf,
            email: dados.ultimoStatus.gabinete.email || null,
            telefone: dados.ultimoStatus.gabinete.telefone || null,
            url_foto: dados.ultimoStatus.urlFoto || null,
            gabinete: {
                nome: dados.ultimoStatus.gabinete.nome|| null,
                predio: dados.ultimoStatus.gabinete.predio || null,
                sala: dados.ultimoStatus.gabinete.sala || null,
            },
            redes_social: dados.redeSocial || [],
            escolaridade: dados.escolaridade,
            data_nascimento: dados.dataNascimento 
        };

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