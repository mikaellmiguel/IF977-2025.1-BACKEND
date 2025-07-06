# 📋 Elicitação e Levantamento de Requisitos – FiscalizaDeputado

> **Observação:** Este é um levantamento inicial dos requisitos do projeto **FiscalizaDeputado**. Os requisitos poderão ser ajustados conforme o projeto evolui e novas funcionalidades forem identificadas.

---

## ✅ Requisitos Funcionais

---

### História 1: Consultar Gastos de um Deputado

```txt
Como cidadão,  
Eu quero consultar os gastos de um deputado federal específico  
Para saber como ele está utilizando a cota parlamentar.
```

**Critérios de Aceitação**:

* O sistema deve permitir buscar deputados pelo nome, partido ou estado.
* Os dados devem ser obtidos da API da Câmara dos Deputados (Câmara Aberta).
* A exibição deve conter: tipo de despesa, valor, data, fornecedor e localização.

---

### História 2: Visualizar Gastos com Geolocalização

```txt
Como cidadão,  
Eu quero visualizar no mapa onde ocorreram os gastos dos deputados  
Para entender melhor o destino regional dos recursos públicos.
```

**Critérios de Aceitação**:

* O sistema deve exibir um mapa interativo com marcadores por cidade/estado.
* Cada marcador deve mostrar os gastos agregados naquela localidade.
* Deve haver filtros por deputado, tipo de despesa, partido e período.

---

### História 3: Seguir Deputados de Interesse

```txt
Como cidadão,  
Eu quero seguir deputados específicos  
Para receber atualizações sobre seus novos gastos declarados.
```

**Critérios de Aceitação**:

* O sistema deve permitir que o usuário marque deputados como “favoritos”.
* O usuário deve receber notificações sobre novos gastos desses deputados.
* Os deputados seguidos devem aparecer em uma seção dedicada do perfil do usuário.

---

### História 4: Comparar Gastos entre Deputados

```txt
Como cidadão,  
Eu quero comparar os gastos entre diferentes deputados  
Para avaliar padrões e detectar excessos.
```

**Critérios de Aceitação**:

* O sistema deve permitir selecionar dois ou mais deputados.
* Deve exibir gráficos comparativos por período, tipo de despesa e total acumulado.
* Deve ser possível exportar os dados em CSV ou PDF.

---

### História 5: Ranking de Gastos Parlamentares

```txt
Como cidadão,  
Eu quero ver o ranking de deputados que mais gastam  
Para identificar quais utilizam mais recursos públicos.
```

**Critérios de Aceitação**:

* O sistema deve listar os deputados com maiores gastos totais em um período selecionado.
* Deve ser possível ordenar por estado, partido, tipo de gasto e data.
* Os dados devem ser atualizados automaticamente com base na API.

---

### História 6: Criar Conta e Personalizar Experiência

```txt
Como cidadão,  
Eu quero criar uma conta pessoal  
Para seguir deputados, salvar comparações e receber notificações.
```

**Critérios de Aceitação**:

* Cadastro via email/senha ou autenticação Google.
* O perfil deve conter nome, e-mail e preferências de acompanhamento.
* O sistema deve permitir ativar/desativar notificações por deputado ou tipo de gasto.

---

## ⚙️ Requisitos Não Funcionais

---

### Interface Responsiva e Acessível

**Critérios de Aceitação**:

* Design compatível com desktop e mobile (responsivo).
* Interface clara, com foco em dados e navegação acessível.
* Ícones e gráficos com legendas e contraste adequado.

---

### Segurança

**Critérios de Aceitação**:

* Senhas criptografadas no banco de dados.
* Validação de senha forte (mínimo 8 caracteres).
* Autenticação segura com tokens (JWT) e OAuth para login social.

---

### Performance e Disponibilidade

**Critérios de Aceitação**:

* O carregamento de páginas com grandes volumes de dados deve ocorrer em até 3 segundos.
* O sistema deve suportar acesso simultâneo de centenas de usuários sem queda de desempenho.
* Os dados da API da Câmara devem ser cacheados quando possível para reduzir tempo de resposta.

---

### Compatibilidade

**Critérios de Aceitação**:

* Compatível com navegadores modernos: Chrome, Firefox, Safari e Edge.
* As funcionalidades principais devem funcionar em todos os principais sistemas operacionais.


