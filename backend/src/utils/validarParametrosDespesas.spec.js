
const { validarLimitOffset, validarValores, validarTipo } = require("./validarParametrosDespesas");
const AppError = require("../utils/AppError");

describe("validarParametrosDespesas", () => {
  describe("validarLimitOffset", () => {
    it("deve aceitar limit e offset válidos", () => {
      expect(() => validarLimitOffset(10, 0)).not.toThrow();
      expect(() => validarLimitOffset("5", "2")).not.toThrow();
      expect(() => validarLimitOffset(undefined, undefined)).not.toThrow();
    });

    it("deve lançar erro para limit negativo ou não inteiro", () => {
      expect(() => validarLimitOffset(-1, 0)).toThrow(AppError);
      expect(() => validarLimitOffset("-1", 0)).toThrow(AppError);
      expect(() => validarLimitOffset("abc", 0)).toThrow(AppError);
      expect(() => validarLimitOffset(1.5, 0)).toThrow(AppError);
    });

    it("deve lançar erro para offset negativo ou não inteiro", () => {
      expect(() => validarLimitOffset(10, -2)).toThrow(AppError);
      expect(() => validarLimitOffset(10, "-2")).toThrow(AppError);
      expect(() => validarLimitOffset(10, "xyz")).toThrow(AppError);
      expect(() => validarLimitOffset(10, 1.1)).toThrow(AppError);
    });
  });

  describe("validarValores", () => {
    it("deve aceitar valores válidos ou indefinidos", () => {
      expect(() => validarValores(undefined, undefined)).not.toThrow();
      expect(() => validarValores(0, 10)).not.toThrow();
      expect(() => validarValores("0", "10")).not.toThrow();
      expect(() => validarValores(5, 5)).not.toThrow();
      expect(() => validarValores(undefined, 10)).not.toThrow();
      expect(() => validarValores(0, undefined)).not.toThrow();
    });

    it("deve lançar erro se valor_min for negativo ou inválido", () => {
      expect(() => validarValores(-1, 10)).toThrow(AppError);
      expect(() => validarValores("-1", 10)).toThrow(AppError);
      expect(() => validarValores("abc", 10)).toThrow(AppError);
    });

    it("deve lançar erro se valor_max for negativo ou inválido", () => {
      expect(() => validarValores(0, -5)).toThrow(AppError);
      expect(() => validarValores(0, "-5")).toThrow(AppError);
      expect(() => validarValores(0, "xyz")).toThrow(AppError);
    });

    it("deve lançar erro se valor_min > valor_max", () => {
      expect(() => validarValores(11, 10)).toThrow(AppError);
      expect(() => validarValores("20", "10")).toThrow(AppError);
    });
  });

  describe("validarTipo", () => {
    it("deve aceitar tipo string ou indefinido", () => {
      expect(() => validarTipo("alimentação")).not.toThrow();
      expect(() => validarTipo(undefined)).not.toThrow();
      expect(() => validarTipo("")).not.toThrow();
    });

    it("deve lançar erro se tipo não for string", () => {
      expect(() => validarTipo(123)).toThrow(AppError);
      expect(() => validarTipo({})).toThrow(AppError);
      expect(() => validarTipo([])).toThrow(AppError);
      expect(() => validarTipo(true)).toThrow(AppError);
    });
  });
});
