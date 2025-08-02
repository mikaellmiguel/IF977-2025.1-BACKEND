const mapearDespesas = require('./mapearDespesas');

describe('mapearDespesas', () => {
    it('deve filtrar e mapear despesas corretamente', () => {
        const despesas = [
            {
                idDeputado: 1,
                numeroCarteiraParlamentar: '123',
                siglaUF: 'PE',
                siglaPartido: 'PT',
                descricao: 'Passagem',
                fornecedor: 'Azul',
                cnpjCPF: '12345678000199',
                numero: 'A1',
                dataEmissao: '2024-01-01',
                valorLiquido: 100.5,
                mes: 1,
                ano: 2024,
                idDocumento: 999,
                urlDocumento: 'http://doc',
                trecho: 'Recife-SP'
            },
            {
                idDeputado: 2,
                numeroCarteiraParlamentar: '456',
                siglaUF: 'SP',
                siglaPartido: 'PSDB',
                descricao: 'Hotel',
                fornecedor: 'Ibis',
                cnpjCPF: null,
                numero: 'B2',
                dataEmissao: '2024-01-02',
                valorLiquido: 200.0,
                mes: 1,
                ano: 2024,
                idDocumento: 1000,
                urlDocumento: null,
                trecho: null
            }
        ];
        const deputadosIds = new Set([1]);
        const resultado = mapearDespesas(despesas, deputadosIds);
        expect(resultado).toHaveLength(1);
        expect(resultado[0]).toEqual({
            id_deputado: 1,
            numero_carteira: '123',
            sigla_uf: 'PE',
            sigla_partido: 'PT',
            descricao: 'Passagem',
            fornecedor: 'Azul',
            cnpj: '12345678000199',
            numero_documento: 'A1',
            data_emissao: '2024-01-01',
            valor_documento: 100.5,
            mes: 1,
            ano: 2024,
            id_documento: 999,
            url_documento: 'http://doc',
            trecho: 'Recife-SP'
        });
    });

    it('deve retornar array vazio se nenhum id bater', () => {
        const despesas = [
            { idDeputado: 3, numero: 'X' },
            { idDeputado: 4, numero: 'Y' }
        ];
        const deputadosIds = new Set([1, 2]);
        const resultado = mapearDespesas(despesas, deputadosIds);
        expect(resultado).toEqual([]);
    });

    it('deve lidar com campos opcionais corretamente', () => {
        const despesas = [
            {
                idDeputado: 1,
                numeroCarteiraParlamentar: '123',
                siglaUF: 'PE',
                siglaPartido: 'PT',
                descricao: 'Passagem',
                fornecedor: 'Azul',
                numero: 'A1',
                dataEmissao: '2024-01-01',
                valorLiquido: 100.5,
                mes: 1,
                ano: 2024,
                idDocumento: 999
                // cnpjCPF, urlDocumento, trecho ausentes
            }
        ];
        const deputadosIds = new Set([1]);
        const resultado = mapearDespesas(despesas, deputadosIds);
        expect(resultado[0].cnpj).toBeNull();
        expect(resultado[0].url_documento).toBeNull();
        expect(resultado[0].trecho).toBeNull();
    });
});
