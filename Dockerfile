# Dockerfile para Node.js 22
FROM node:22-alpine

# Diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependências
COPY backend/package*.json ./

# Instala as dependências
RUN npm install --production

# Copia o restante do código da aplicação
COPY backend/ ./

# Expõe a porta padrão do servidor (ajuste se necessário)
EXPOSE 3000

# Comando para iniciar o servidor
CMD ["npm", "run", "start:prod"]
