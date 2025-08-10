const generateVerificationCode = require('./generateVerificationCode');

describe('generateVerificationCode', () => {
  it('deve retornar uma string de 6 dígitos', () => {
    const code = generateVerificationCode();
    expect(typeof code).toBe('string');
    expect(code).toMatch(/^\d{6}$/);
  });

  it('deve estar entre 100000 e 999999', () => {
    for (let i = 0; i < 100; i++) {
      const code = Number(generateVerificationCode());
      expect(code).toBeGreaterThanOrEqual(100000);
      expect(code).toBeLessThanOrEqual(999999);
    }
  });

  it('deve gerar códigos diferentes na maioria das vezes', () => {
    const codes = new Set();
    for (let i = 0; i < 1000; i++) {
      codes.add(generateVerificationCode());
    }
    // Espera pelo menos 900 códigos únicos em 1000 execuções
    expect(codes.size).toBeGreaterThan(900);
  });

  it('não deve gerar código fora do intervalo', () => {
    for (let i = 0; i < 1000; i++) {
      const code = Number(generateVerificationCode());
      expect(code >= 100000 && code <= 999999).toBe(true);
    }
  });

  it('deve sempre retornar string, nunca número', () => {
    for (let i = 0; i < 100; i++) {
      expect(typeof generateVerificationCode()).toBe('string');
    }
  });
});
