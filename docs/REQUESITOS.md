#  Elicitação e Levantamento de Requisitos – RedeLeitura

> **Observação:** Este é um levantamento inicial dos requisitos do projeto **RedeLeitura**. Os requisitos podem ser ajustados ou modificados conforme o desenvolvimento do projeto avança e novas necessidades forem identificadas.

---

##  Requisitos Funcionais

---

### História 1: Gerenciar Biblioteca Pessoal

```txt
Como usuário,  
Eu gostaria de adicionar e organizar livros na minha biblioteca pessoal  
Para acompanhar minhas leituras.
```

**Critérios de Aceitação**:

* O usuário deve poder adicionar livros às categorias: "Lido", "Lendo", "Quero Ler".
* O sistema deve permitir edição e remoção dos livros da biblioteca pessoal.
* Os dados do livro (título, autor, capa, descrição) devem ser obtidos automaticamente via API externa.

---

### História 2: Recomendação de Livros

```txt
Como usuário,  
Eu gostaria de receber recomendações de livros com base no meu perfil de leitura  
Para descobrir novas obras de meu interesse.
```

**Critérios de Aceitação**:

* O sistema deve gerar sugestões com base no histórico de leitura, gêneros e autores mais lidos.
* As recomendações devem vir de uma base de dados como Google Books ou OpenLibrary.
* Deve ser possível indicar que o usuário gostou ou não de uma recomendação para refinar o perfil.

---

### História 3: Anunciar Livro para Venda ou Empréstimo

```txt
Como usuário,  
Eu quero poder anunciar um livro físico para venda ou empréstimo  
Para que outros usuários interessados possam encontrá-lo.
```

**Critérios de Aceitação**:

* O usuário pode registrar um livro com título, estado de conservação, localização, e tipo (venda/empréstimo).
* O anúncio deve ser visível publicamente com opção de contato.
* O sistema deve permitir editar ou remover o anúncio.

---

### História 4: Buscar Trocas ou Compras de Livro

```txt
Como usuário,  
Eu quero buscar livros disponíveis para troca/compra por outros usuários  
Para comprar ou emprestar livros de meu interesse.
```

**Critérios de Aceitação**:

* O sistema deve permitir busca e filtro por título, autor, localização, tipo de anúncio.
* Deve ser possível enviar uma proposta diretamente ao dono do livro.
* O sistema deve notificar o usuário quando houver propostas recebidas.

---

### História 5: Avaliar Trocas/Empréstimos e Usuários

```txt
Como usuário,  
Eu quero avaliar a experiência com outro usuário após uma transação (troca/empréstimo) 
Para contribuir com a reputação da comunidade.
```

**Critérios de Aceitação**:

* Após concluir uma troca, venda ou empréstimo, ambos os usuários devem poder avaliar a experiência.
* A avaliação deve incluir nota (1 a 5) e comentário opcional.
* A média das avaliações deve ser exibida no perfil do usuário.

---

### História 6: Cadastro e Login com Perfil Pessoal

```txt
Como usuário,  
Eu quero criar uma conta com meu perfil de leitor  
Para gerenciar minhas leituras e interações.
```

**Critérios de Aceitação**:

* Deve haver opção de login com email/senha ou com contas sociais (Google).
* O perfil deve conter: nome, nome de usuário, foto, localização e bio.
* As preferências de leitura devem ser definidas no perfil (ex: gêneros favoritos).

---

### História 7: Comentar Livros

```txt
Como usuário,  
Eu quero comentar e avaliar os livros que li  
Para registrar minhas impressões e ajudar outros leitores.
```

**Critérios de Aceitação**:

* O sistema deve permitir adicionar uma avaliação com nota (1 a 5) e comentário.
* Os comentários devem ser visíveis na página do livro.
* Comentários devem aparecer em ordem cronológica e suportar até 3000 caracteres.



### História 8: Visualizar Opções de Compra Digitais

```txt
Como usuário,  
Eu quero visualizar opções de compra digital (e-book ou audiobook) dos livros recomendados  
Para que eu possa adquiri-los mesmo que não estejam disponíveis fisicamente na plataforma.
```
**Critérios de Aceitação:**

* Para cada livro recomendado ou buscado, o sistema deve exibir links de compra digital, quando disponíveis.
* Os links podem vir de APIs públicas como Google Books (Google Play), Amazon, Estante Virtual ou links configurados manualmente.
* Deve haver uma distinção clara entre os formatos disponíveis:  físico /  e-book /  audiobook.
* O clique no link de compra digital deve redirecionar o usuário para a loja externa em uma nova aba.

##  Requisitos Não Funcionais

---

### Interface Intuitiva e Responsiva

**Critérios de Aceitação**:

* Design responsivo, adaptável a desktop e dispositivos móveis.
* Interface clara com destaque para botões de ações importantes.
* Mensagens de erro devem ser amigáveis e informativas.

---

### Segurança

**Critérios de Aceitação**:

* Criptografia de senhas no cadastro e login.
* Ocultar senha durante digitação.
* Validação de senha forte (mínimo de 8 caracteres).
* Autenticação segura com APIs sociais (Google).

---

### Compatibilidade

**Critérios de Aceitação**:

* Compatível com os navegadores modernos: Chrome, Firefox, Safari e Edge.
* Funcionalidades principais devem estar disponíveis em qualquer dispositivo moderno.
