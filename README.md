# FiscalizaDeputado

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![GitHub Issues](https://img.shields.io/github/issues/mikaellmiguel/IF977-2025.1-BACKEND.svg)](https://github.com/mikaellmiguel/IF977-ES)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/mikaellmiguel/IF977-ES.svg)](https://github.com/mikaellmiguel/IF977-2025.1-BACKEND/pulls)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)


🏛️ Descrição Geral
O FiscalizaDeputado é uma aplicação web desenvolvida para ampliar o acesso da população aos dados de despesas declaradas por deputados federais. Utilizando como fonte principal o portal de dados abertos da Câmara dos Deputados (Câmara Aberta), o sistema visa facilitar a fiscalização, aumentar a transparência e promover o controle social por meio de relatórios, visualizações e mapas interativos.

Além de organizar e exibir os dados de forma clara, o FiscalizaDeputado permite que qualquer cidadão acompanhe os parlamentares de seu interesse, visualize onde e com o quê os recursos públicos estão sendo utilizados (com destaque geográfico por cidade e estado) e identifique padrões de uso dos recursos da cota parlamentar.

## 👥 Público-Alvo

Cidadãos, jornalistas, pesquisadores, órgãos de controle, organizações da sociedade civil e qualquer pessoa interessada em **transparência pública**, **gastos parlamentares** e **fiscalização do uso do dinheiro público**.

## 🎯 Objetivos Principais

* 📊 Facilitar o acesso e a compreensão dos dados de gastos parlamentares.
* 🔎 Promover a transparência e o controle social dos recursos públicos.
* 🗺️ Disponibilizar análises visuais e geográficas sobre os locais e tipos de gastos.
* 👤 Possibilitar o acompanhamento de políticos específicos ao longo do tempo.
* 📂 Estimular o uso de dados abertos para fins jornalísticos, educacionais e sociais.


## ⚙️ Funcionalidades Esperadas (Requisitos Funcionais)

* 📥 **Importação e Armazenamento de Dados Públicos**: coleta automatizada ou manual dos dados de despesas parlamentares.
* 📋 **Painel de Visualização por Parlamentar**: resumo e detalhes das despesas por deputado.
* 🧮 **Filtros por Tipo de Gasto, Período e Região**: navegação dinâmica e filtragem dos dados.
* 📍 **Geolocalização de Gastos**: exibição dos locais onde ocorreram os gastos, com mapas interativos.
* 📈 **Relatórios e Comparações**: gráficos analíticos com comparações por parlamentar, categoria de despesa, região ou período.
* 🥇 **Ranking de Gastos**: permitir listar dos deputados que mais gastaram.
* ⭐ **Sistema de Seguimento de Parlamentares**: usuários podem "seguir" deputados e receber notificações de novos gastos declarados.
* 👥 **Área do Usuário**: cada cidadão pode criar um perfil, salvar filtros personalizados e acompanhar os políticos de seu interesse.

## 🚀 Início Rápido

Essas instruções fornecerão uma cópia do projeto instalada e funcionando na sua máquina local para fins de desenvolvimento e teste.

### Pré-requisitos

1. **Node.js e npm**

Node.js é necessário para executar o JavaScript no backend e gerenciar pacotes através do npm. O npm (Node Package Manager) vem integrado ao instalar o Node.js.

Como instalar: Acesse o site oficial do [Node.js](https://nodejs.org/) e baixe a versão LTS recomendada.
Após a instalação, verifique se o Node.js e o npm estão instalados com:

```bash
node -v
npm -v
```
2. **Editor de Código**

Um editor como o Visual Studio Code (VS Code) é recomendado para desenvolvimento.

Como instalar: Baixe o Visual Studio Code no site oficial: [VS Code](https://code.visualstudio.com/).

3. **Git (opcional, mas recomendado)**

Para gerenciar o versionamento de código.

Como instalar: Acesse o site oficial do [Git](https://git-scm.com/downloads) e siga as instruções para o seu sistema operacional.


## Estrutura do Código (Previsão)

O código a ser desenvolvido será organizado de acordo com a seguinte estrutura, com o objetivo de garantir uma arquitetura limpa, escalável e fácil de manter. Cada parte do sistema será distribuída entre as pastas e módulos apropriados, seguindo boas práticas de desenvolvimento.

```txt
IF977-ES/
│
├── README.md                # Documentação principal do projeto
├── CONTRIBUTING.md          # Diretrizes para contribuição
├── BUILD.md                 # Instruções para compilar e construir o projeto
│
├── docs                    # Documentos criados ao longo do projeto
│
├── backend/                # Código backend do projeto
   ├── node_modules/        # Módulos do Node.js (gerados automaticamente)
   ├── src/                 # Código fonte do projeto
   │   ├── controllers/     # Funções responsáveis por manipular a lógica de cada rota
   │   ├── routes/          # Definição das rotas da API
   │   ├── services/        # Consumo de APIs externas
   │   ├── utils/           # Funções utilitárias
   │   ├── middlewares/     # Funções de middleware (ex: autenticação)
   │   └── config/          # Arquivos de configuração (ex: DB)
   ├── .env                 # Arquivo de variáveis de ambiente
   ├── .gitignore           # Arquivos e pastas a serem ignorados pelo git
   ├── package.json         # Dependências e scripts do projeto
   ├── package-lock.json    # Versões fixas das dependências
   └── server.js            # Ponto de entrada da aplicação

```

## Links Importantes ‼️
- [Workspace do Projeto - Github Projects](https://github.com/users/mikaellmiguel/projects/4)
- [Issues](https://github.com/mikaellmiguel/IF977-2025.1-BACKEND/issues)



## Como Contribuir 🤝
Contribuições são sempre bem-vindas! Se você está interessado em melhorar este projeto, fique à vontade para enviar suas sugestões ou mudanças. 


### Diretrizes 

Antes de começar a contribuir, orientamos consultar o arquivo [`CONTRIBUTING.md`](https://github.com/mikaellmiguel/IF977-2025.1-BACKEND/blob/main/CONTRIBUTING.MD), onde você encontrará diretrizes detalhadas sobre como contribuir, boas práticas de codificação, como criar branches, e como submeter pull requests.

Estamos abertos a todas as contribuições e ficaremos felizes em revisar e integrar melhorias feitas pela comunidade.

## Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE.md](LICENSE) para detalhes.

## Créditos

- Mikael Miguel da Silva
- Pablo Henrique Ferreira da Silva
- Sandrirames Albino Fausto
- Flavio Henrique Miranda Junior

## FAQ

**Pergunta 1:** Como faço para configurar o ambiente?

**Resposta:** Siga as instruções de instalação e qualquer etapa de configuração adicional indicada acima.

**Pergunta 2:** Como reportar um bug ou sugerir melhorias?

**Resposta:** Você pode abrir uma issue no repositório do GitHub descrevendo o problema ou sugestão. Ao abrir a issue:
1. Use um título claro e descritivo.
2. Explique os passos para reproduzir o problema (se aplicável).
3. Inclua sugestões ou ideias para melhorias.

## Estado do Projeto

Este projeto está em desenvolvimento ativo. Você pode esperar mudanças frequentes e atualizações.


<center><b>Agradecemos por verificar este projeto! Se você tiver dúvidas, sugestões ou encontrar algum problema, sinta-se à vontade para abrir uma issue ou enviar um pull request. Seu feedback é sempre bem-vindo.</b></center>