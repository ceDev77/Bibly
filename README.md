
# **CSI606-2025-01 - Remoto - Proposta de Trabalho Final**

## *Discente: Chrystian Elias Caldeira da Silva - 23.2.8061*

### Resumo

Este repositório contém o desenvolvimento de um **Sistema de Biblioteca Online** chamado **Bibly**, cujo objetivo é permitir o cadastro, consulta, empréstimo e devolução de livros, além do gerenciamento de usuários, incluindo leitores e administradores.  
O sistema foi desenvolvido para ser simples, eficiente e modular, oferecendo uma experiência próxima ao funcionamento de uma biblioteca real.

---
<!-- Apresentar o tema. -->
### 1. Tema

O trabalho final tem como tema um **Sistema de Biblioteca Online**, que se mostra importante porque automatiza e organiza processos essenciais de uma biblioteca, permitindo maior controle do acervo, redução de erros manuais e agilidade no atendimento aos usuários. Além disso, um sistema desse tipo facilita o acesso à informação, melhora a experiência dos leitores e oferece aos administradores ferramentas eficientes para gerenciar empréstimos, devoluções e cadastros.

---

<!-- Descrever e limitar o escopo da aplicação. -->
### 2. Escopo

### Gerenciamento de Usuários
- Cadastro de novos usuários  
- Tipos de perfil:
  - Leitor: consulta, leitura, empréstimo e devolução 
  - Administrador: gerencia livros, usuários e movimentações

### Gerenciamento de Livros
- Cadastro e edição de livros (administrador)
- Informações armazenadas:
  - Título, autor, ano, categoria, ISBN, disponibilidade, etc.
- Busca avançada por:
  - Título, autor, categoria ou disponibilidade

### Empréstimos e Devoluções
- Solicitação de empréstimo (por leitores)
- Controle e aprovação (administrador)
- Atualização automática da disponibilidade do livro
- Histórico de movimentações
- Valor da multa (caso exista)

---

<!-- Apresentar restrições de funcionalidades e de escopo. -->
### 3. Restrições

  Neste trabalho não serão considerados:
 - O sistema não incluirá funcionalidades de cobrança de multa por atraso, apenas sua sinalização
- Autenticação simples (sem OAuth ou autenticação em duas etapas)
- O sistema não terá notificação por e-mail ou push
- Empréstimos serão limitados a um número fixo por usuário
- Não será possível para os usuários sugerirem aquisição de novos exemplares

<!-- Construir alguns protótipos para a aplicação, disponibilizá-los no Github e descrever o que foi considerado. //-->
### 4. Protótipo
Páginas (Usuário comum):
- Página inicial (dashboard)
- Página de cadastro de usuário
- Página de login
- Página de listagem de livros
- Página de detalhes do livro
- Página de empréstimo
- Página de devolução

Páginas (Administrador):
- Página inicial (dashboard)
- Página de listagem de usuários
- Página de detalhes do usuário
- Página de cadastro de livros
- Página de listagem de livros
- Página de detalhes/ edição do livro
- Página de histórico de movimentações

O protótipo descrito (apenas o módulo de usuário) acima pode ser encontrado em: 
