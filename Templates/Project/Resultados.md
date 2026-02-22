# **CSI606-2024-02 - Remoto - Trabalho Final - Resultados**

## *Discente: Chrystian Elias Caldeira da Silva - 23.2.8061*

### Resumo

Este repositório contém o desenvolvimento de um Sistema de Biblioteca Online chamado Bibly, cujo objetivo é facilitar o gerenciamente de uma biblioteca real, funcionando como uma plataforma de registro de livros e controle de empréstimos e das devoluções; após um empréstimo ser solicitado o usuário deve ir a livraria para de fato obter o livro físico, e a devolução, é registrada por um funcionário no sistema quando o livro é retornado; o sistema ainda permite ao administrador ter controle do balanço financeiro total do mês ou do periodo requisitado.
O sistema foi desenvolvido para ser simples, eficiente e modular, oferecendo um gerenciamento facilitado e padronizado para uma biblioteca.

### 1. Funcionalidades implementadas

- Cadastro de usuários e login
- Dashboard inicial: prévia do acervo, prévias de atividade do sistema (número de usuários, empréstimos e livros.)
- Listagem de livros do sistema com barra de busca

- Visibilidade de usuários comuns:
  - Detalhes de livros
  - Pegar livros emprestados
  - Consultar empréstimos feitos
  - Edição de dados pessoais

- Visibilidade de administradores:
  - Editar detalhes de livros
  - Adicionar livros
  - Consultar lista de empréstimos realizados por usuários com barra de busca
  - Fechar empréstimos (confirmar devolução)
  - Consultar balanço financeiro com filtro temporal
  - Consulta de dados de usuários com barra de busca
  - Remoção de usuários

### 2. Funcionalidades previstas e não implementadas
- Módulo de devolução: não foi implementado pois não se adequou a regra de negócio do sistema, seria mais conveniente que apenas um admin (funcionário) confirmasse devoluções realizados, ao invés dos próprios usuários.

### 3. Outras funcionalidades implementadas
- Edição de dados pessoais: incialmente não era previsto que o usuário comum pudesse editar dados da sua conta, como telefone e endereço.

### 4. Principais desafios e dificuldades
- Lógica de empréstimos: a implementação do sistema de empréstimos exigiu uma lógica robusta para o cálculo de datas e multas. Foi desafiador criar funções que cruzassem a data de retirada com a quantidade de semanas solicitada de empréstimo e, ao mesmo tempo, verificasse o status de atraso em tempo real para aplicar as taxas corretas no balanço financeiro. 
- Disponibilidade: garantir que o estoque de livros fosse atualizado de forma atômica, decrementando na saída e incrementando na devolução, foi crucial para evitar inconsistências.
- Sincronização de horários e datas: o JavaScript muitas vezes convertia as strings de data do banco para o fuso horário local, o que resultava em exibições de registros com um dia de atraso em relação ao atraso real. Tive que refatorar a forma como as datas eram tratadas no Backend e enviadas para as views, optando por manipulação direta de strings.

### 5. Instruções para instalação e execução
Requisitos:
- Node.js (Versão 16 ou superior).
- NPM.
- SQLite3 (caso abra o banco manualmente).

Instalando:
- Baixe ou clone o projeto para uma pasta em seu computador.
- Execute npm install.
- Para iniciar o servidor, execute node src/server.js.
- Acesse no navegador http://localhost:3000
- Crie uma conta de usuário comum!
- O acesso da conta de administrador é:
  - e-mail: admin@bibly.com
  - senha: admin123
