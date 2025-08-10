
function mensagemVerificacaoEmail({ nome, codigo, url }) {
  return `
  <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 24px; border-radius: 8px; color: #222; max-width: 500px; margin: auto;">
    <h2 style="color: #2F7958;">Bem-vindo${nome ? `, ${nome}` : ''}!</h2>
    <p>Seu código de verificação é:</p>
    <div style="font-size: 1.5em; font-weight: bold; background: #eaf4fd; padding: 12px; border-radius: 6px; display: inline-block; margin-bottom: 16px;">${codigo}</div>
    <p>Para concluir seu cadastro, clique no botão abaixo:</p>
    <a href="${url}" style="display: inline-block; background: #2F7958; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; margin-bottom: 16px;">Verificar e-mail</a>
    <p style="font-size: 0.95em; color: #555; margin-top: 24px;">Se você não solicitou este cadastro, ignore este e-mail.</p>
    <hr style="margin: 24px 0; border: none; border-top: 1px solid #eee;">
    <p style="font-size: 0.9em; color: #888;">Atenciosamente,<br>Equipe FiscalizaDeputado</p>
  </div>
  `;
}

module.exports = mensagemVerificacaoEmail;
