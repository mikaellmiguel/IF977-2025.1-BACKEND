function mapearDespesas(despesas, deputadosIds) {
    const despesasFiltradas = despesas.filter(despesa => deputadosIds.has(despesa.idDeputado));
    return despesasFiltradas.map(d => ({
        id_deputado: d.idDeputado,
        numero_carteira: d.numeroCarteiraParlamentar,
        sigla_uf: d.siglaUF,
        sigla_partido: d.siglaPartido,
        descricao: d.descricao,
        fornecedor: d.fornecedor,
        cnpj: d.cnpjCPF || null,
        numero_documento: d.numero,
        data_emissao: d.dataEmissao,
        valor_documento: d.valorLiquido,
        mes: d.mes,
        ano: d.ano,
        id_documento: d.idDocumento,
        url_documento: d.urlDocumento || null,
        trecho: d.trecho || null
    }));
}

module.exports = mapearDespesas;
