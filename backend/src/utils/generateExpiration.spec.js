const generateExpiration = require('./generateExpiration');

describe('generateExpiration', () => {
  it('deve retornar uma data futura em formato ISO', () => {
    const now = Date.now();
    const expiration = generateExpiration(10);
    const date = new Date(expiration);
    expect(typeof expiration).toBe('string');
    expect(date.toISOString()).toBe(expiration);
    expect(date.getTime()).toBeGreaterThan(now);
  });

  it('deve adicionar o número de minutos correto', () => {
    const minutes = 5;
    const now = Date.now();
    const expiration = generateExpiration(minutes);
    const date = new Date(expiration);
    const diff = Math.round((date.getTime() - now) / 1000);
    expect(diff).toBeGreaterThanOrEqual(minutes * 60 - 1); // tolerância de 1s
    expect(diff).toBeLessThanOrEqual(minutes * 60 + 1);
  });

  it('deve usar 10 minutos como padrão', () => {
    const now = Date.now();
    const expiration = generateExpiration();
    const date = new Date(expiration);
    const diff = Math.round((date.getTime() - now) / 1000);
    expect(diff).toBeGreaterThanOrEqual(600 - 1);
    expect(diff).toBeLessThanOrEqual(600 + 1);
  });

  it('deve funcionar com valores decimais', () => {
    const expiration = generateExpiration(0.5);
    const date = new Date(expiration);
    const now = Date.now();
    const diff = Math.round((date.getTime() - now) / 1000);
    expect(diff).toBeGreaterThanOrEqual(30 - 1);
    expect(diff).toBeLessThanOrEqual(30 + 1);
  });

  it('deve funcionar com valores negativos (data passada)', () => {
    const expiration = generateExpiration(-1);
    const date = new Date(expiration);
    expect(date.getTime()).toBeLessThan(Date.now());
  });

  it('deve lançar erro se parâmetro não for número', () => {
    expect(() => generateExpiration('dez')).toThrow();
    expect(() => generateExpiration(null)).not.toThrow(); // null vira padrão 10
    expect(() => generateExpiration(undefined)).not.toThrow(); // undefined vira padrão 10
  });
});
