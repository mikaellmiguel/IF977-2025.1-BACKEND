const validarEmail = require('./validarEmail');

describe('validarEmail', () => {
  it('retorna true para e-mails válidos comuns', () => {
    expect(validarEmail('teste@email.com')).toBe(true);
    expect(validarEmail('usuario.nome@dominio.com')).toBe(true);
    expect(validarEmail('user-123@sub.dominio.com')).toBe(true);
    expect(validarEmail('user.name@dominio.co')).toBe(true);
    expect(validarEmail('user_name@dominio.com')).toBe(true);
    expect(validarEmail('user@dominio.com.br')).toBe(true);
    expect(validarEmail('user@dominio.io')).toBe(true);
  });

  it('retorna false para e-mails sem @', () => {
    expect(validarEmail('testemail.com')).toBe(false);
    expect(validarEmail('user.dominio.com')).toBe(false);
  });

  it('retorna false para e-mails sem domínio', () => {
    expect(validarEmail('user@')).toBe(false);
    expect(validarEmail('user@.com')).toBe(false);
    expect(validarEmail('user@com')).toBe(false);
  });

  it('retorna false para e-mails sem usuário', () => {
    expect(validarEmail('@dominio.com')).toBe(false);
    expect(validarEmail('@dominio')).toBe(false);
  });

  it('retorna false para e-mails com caracteres inválidos', () => {
    expect(validarEmail('user!@dominio.com')).toBe(false);
    expect(validarEmail('user@dominio,com')).toBe(false);
    expect(validarEmail('user@dominio com')).toBe(false);
    expect(validarEmail('user@dominio..com')).toBe(false);
  });

  it('retorna false para e-mails com TLD inválido', () => {
    expect(validarEmail('user@dominio.c')).toBe(false);
    expect(validarEmail('user@dominio.123')).toBe(false);
  });

  it('retorna false para valores não string', () => {
    expect(validarEmail(null)).toBe(false);
    expect(validarEmail(undefined)).toBe(false);
    expect(validarEmail(123)).toBe(false);
    expect(validarEmail({})).toBe(false);
    expect(validarEmail([])).toBe(false);
  });

  it('retorna false para string vazia', () => {
    expect(validarEmail('')).toBe(false);
  });
});
