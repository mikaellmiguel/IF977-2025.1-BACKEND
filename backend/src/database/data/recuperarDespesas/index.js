const axios = require('axios');
const unzipper = require('unzipper');
const processarEntrada = require('./processarEntrada');

async function recuperarDespesas(ano, deputados) {
    const url = `https://www.camara.leg.br/cotas/Ano-${ano}.json.zip`;
    const response = await axios.get(url, { responseType: 'stream' });
    const deputadosIds = new Set(deputados.map(dep => dep.id));
    const BATCH_SIZE = 200;
    const processPromises = [];

    await new Promise((resolve, reject) => {
        response.data
            .pipe(unzipper.Parse())
            .on('entry', entry => {
                // Cada processarEntrada retorna uma promise
                processPromises.push(processarEntrada(entry, deputadosIds, BATCH_SIZE));
            })
            .on('close', async () => {
                try {
                    await Promise.all(processPromises);
                    resolve();
                } catch (err) {
                    reject(err);
                }
            })
            .on('error', reject);
    });
}

module.exports = recuperarDespesas;
