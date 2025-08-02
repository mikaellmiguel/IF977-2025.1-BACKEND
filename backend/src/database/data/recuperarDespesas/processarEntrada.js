const axios = require('axios');
const inserirEmLotes = require('./inserirEmLotes');
const mapearDespesas = require('./mapearDespesas');

async function processarEntrada (entry, deputadosIds, BATCH_SIZE = 200) {
    const fileName = entry.path;

    if (!fileName.endsWith('.json')) {
        entry.autodrain();
        return;
    }

    let jsonStr = '';
    return new Promise((resolve) => {
        entry.on('data', chunk => { jsonStr += chunk.toString(); });
        entry.on('end', async () => {
            try {
                const { dados } = JSON.parse(jsonStr);
                const despesas = mapearDespesas(dados, deputadosIds);
                console.log(`→ ${fileName}: ${despesas.length} despesas filtradas`);
                await inserirEmLotes(despesas, BATCH_SIZE);
                resolve();
            } catch (err) {
                console.error(`Erro ao processar ${fileName}:`, err);
                resolve();
            }
        });
    });
}

module.exports = processarEntrada;