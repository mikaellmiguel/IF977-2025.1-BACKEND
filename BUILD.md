# 🚀 Instruções para Build Local e Produção com Docker

## 🛠️ Ferramentas Necessárias
Para desenvolvimento local:
- **Node.js** (versão 18+)
- **NPM** (Node Package Manager)
Para produção:
- **Docker**

## ⚙️ Configuração Inicial
### 1. **Clone o repositório**:
```bash
git clone https://github.com/mikaellmiguel/IF977-2025.1-BACKEND.git
cd IF977-2025.1-BACKEND
```

### 2. 📦 Instalar Dependências (Desenvolvimento Local)
```bash
cd backend
npm install
```

### 3. 🔑 Configuração de Variáveis de Ambiente
Verifique o arquivo `backend/.env.example` e crie um arquivo `.env` na pasta `backend` com as configurações adequadas.
```bash
cp backend/.env.example backend/.env
```
Edite o arquivo `.env` conforme necessário para o seu ambiente.

### 4. ▶️ Executar o Projeto Localmente
```bash
npm start
```

---

## 🚢 Build e Deploy em Produção com Docker

### 1. Build da imagem Docker
Na raiz do projeto, execute:
```bash
docker build -t fiscaliza-deputado .
```

### 2. Publicar no Docker Hub (opcional)
```bash
docker tag fiscaliza-deputado mikaellmiguel/fiscaliza-deputado:latest
docker push mikaellmiguel/fiscaliza-deputado:latest
```

### 3. Rodar localmente com Docker
```bash
docker run --env-file backend/.env -p 3000:3000 fiscaliza-deputado
```
Acesse o backend em `http://localhost:3000`

### 4. Deploy em nuvem (exemplo Azure Web App)
1. Configure o Web App para usar a imagem do Docker Hub:
	- Nome da imagem: `mikaellmiguel/fiscaliza-deputado:latest` ou com tag específica
2. Defina as variáveis de ambiente na interface do serviço.
3. Reinicie o Web App para atualizar a versão.

---
Consulte o README para detalhes de variáveis e configurações específicas do projeto.
npm start
```

## 📈 Status do Projeto
Este projeto está atualmente em fase inicial de desenvolvimento. O código está sendo estruturado e as funcionalidades principais serão implementadas em breve. As instruções de build serão atualizadas conforme o progresso do desenvolvimento.

## 📝 Planejamento Futuro
As seguintes funcionalidades e etapas estão previstas:
- Implementação do código-fonte e estruturação dos módulos.
- Testes automatizados.
- Documentação detalhada.