function generateExpiration(minutes = 10) {
  return new Date(Date.now() + minutes * 60 * 1000).toISOString(); // agora + 10 minutos
}

module.exports = generateExpiration;