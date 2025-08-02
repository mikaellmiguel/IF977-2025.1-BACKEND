/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const fs = require('fs');
const path = require('path');
const recuperarDespesas = require("../../data/recuperarDespesas");

const BATCH_SIZE = 200; // Tamanho do lote para evitar erro do SQLite

exports.seed = async function (knex) {

	// Verifica se já existem registros na tabela
	const exisitsDeputados = await knex('deputados').select("*").first();
	// Lê os dados do arquivo JSON
	const deputadosPath = path.resolve(__dirname, '..', '..', 'data', 'deputados.json');
	const deputados = JSON.parse(fs.readFileSync(deputadosPath, 'utf-8'));

	if (exisitsDeputados) {
		console.log('Seed não executada: tabela deputados já possui dados.');
	} else {
		// Prepara os dados para inserir conforme o schema da tabela
		const deputadosInsert = deputados.map(dep => ({
			id: dep.id,
			nome: dep.nome,
			partido: dep.siglaPartido,
			url_partido: dep.uriPartido,
			sigla_uf: dep.siglaUf,
			id_legislatura: dep.idLegislatura,
			url_foto: dep.urlFoto,
			email: dep.email,
			data_nascimento: dep.dataNascimento
		}));

		// Insere os dados na tabela em lotes para evitar erro de muitos termos no SQLite
		await knex.batchInsert('deputados', deputadosInsert, 200);
		console.log(`Seed executada: ${deputadosInsert.length} deputados inseridos.`);
	}

	const exisitsDespesas = await knex('despesas').select("*").first();

	if (exisitsDespesas) {
		console.log('Seed não executada: tabela despesas já possui dados.');
	} else {
		console.log('Iniciando seed de despesas...');
		const inicio = Date.now();
		await recuperarDespesas(2023, deputados);
		await recuperarDespesas(2024, deputados);
		await recuperarDespesas(2025, deputados);
		const fim = Date.now();
		const msPerformance = fim - inicio;
		console.log(`Processo finalizado!`);
		console.log(`Tempo total (S): ${msPerformance / 1000} s`);
	}
};
