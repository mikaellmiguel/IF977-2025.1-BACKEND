function validarEmail(email) {
    if (typeof email !== 'string') return false;
    // Regex melhorada para aceitar subdomínios e hífens
    const regex = /^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/;
    if (!regex.test(email)) return false;
    // Não permite dois pontos consecutivos no domínio
    const [user, domain] = email.split('@');
    if (!user || !domain) return false;
    if (domain.includes('..')) return false;
    return true;
}

module.exports = validarEmail;
