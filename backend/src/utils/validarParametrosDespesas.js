const AppError = require("../utils/AppError");

function validarLimitOffset(limit, offset) {

    limit = limit ? Number(limit) : 10; // valor padrão
    offset = offset ? Number(offset) : 0; // valor padrão
    
    if (!/^\d+$/.test(limit) || !/^\d+$/.test(offset)) {
        throw new AppError("Parâmetros 'limit' e 'offset' devem ser números inteiros positivos", 400);
    }
    return { limit: Number(limit), offset: Number(offset) };
}

function validarValores(valor_min, valor_max) {
    if (valor_min && (Number(valor_min) < 0 || Number.isNaN(Number(valor_min)))) {
        throw new AppError("Parâmetro 'valor_min' deve ser um número válido e positivo", 400);
    }
    if (valor_max && (Number(valor_max) < 0 || Number.isNaN(Number(valor_max)))) {
        throw new AppError("Parâmetro 'valor_max' deve ser um número válido e positivo", 400);
    }
    if (Number(valor_min) > Number(valor_max)) {
        throw new AppError("Parâmetro 'valor_min' não pode ser maior que 'valor_max'", 400);
    }

    return true;
}

function validarTipo(tipo) {
    if (tipo && typeof tipo !== 'string') {
        throw new AppError("Parâmetro 'tipo' deve ser uma string", 400);
    }
    return true;
}

module.exports = {
    validarLimitOffset,
    validarValores,
    validarTipo
};