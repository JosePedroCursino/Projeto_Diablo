# Projeto Diablo — Plataforma de Builds

Trabalho final de semestre desenvolvido para a disciplina de **Front-End** do curso de **Ciência da Computação** da **Faculdade Dom Helder**, sob orientação da professora **Flávia Cordeiro Martins**.

## 📌 Sobre o Projeto e Objetivo

O **Projeto Diablo** é uma aplicação web front-end temática inspirada no universo de *Diablo*, criada com o objetivo de consolidar e aplicar na prática todos os conceitos de desenvolvimento web aprendidos ao longo do semestre (estruturação semântica, estilização responsiva, manipulação dinâmica do DOM, gerenciamento de estado no cliente e persistência local).

A plataforma funciona como um **hub de montagem, consulta e compartilhamento de builds**, permitindo que jogadores explorem configurações criadas pela comunidade, bem como publiquem e editem suas próprias combinações de classes, habilidades e equipamentos.

## ✨ Funcionalidades

- **Autenticação Simulada (Client-Side):** Sistema de login sem back-end, utilizando credenciais predefinidas para acesso às áreas de criação e gerenciamento de builds:
  - **Usuário:** `login`
  - **Senha:** `password`
- **Consulta de Builds da Comunidade:** Visualização de builds publicadas por outros jogadores, exibindo classe, escolhas de habilidades, equipamentos e descrição estratégica.
- **Montagem e Publicação de Builds:** Interface interativa para criação de novas builds, permitindo:
  - Seleção de classe e distribuição de **skills na árvore de habilidades** correspondente;
  - Definição de **itens e equipamentos** da build;
  - Adição de título e **descrição detalhada** explicando o funcionamento e a sinergia da build.
- **Edição de Builds Próprias:** Possibilidade de alterar e atualizar builds já publicadas pelo usuário autenticado.

## 🛠️ Tecnologias Utilizadas

- **HTML5** (`index.html`) — Estruturação semântica das páginas, formulários e componentes da interface.
- **CSS3** (`style.css`) — Estilização temática, layout responsivo e identidade visual inspirada na franquia *Diablo*.
- **JavaScript** (`app.js`) — Lógica da aplicação, validação de login, controle das árvores de habilidades, manipulação dinâmica do DOM e gerenciamento dos dados das builds no navegador.

## 📁 Estrutura de Arquivos

```text
Projeto_Diablo-main/
├── index.html   # Estrutura principal da aplicação
├── style.css    # Estilos visuais, tema e responsividade
├── app.js       # Lógica de autenticação, árvores de skills, CRUD de builds e interatividade
└── README.md    # Documentação do projeto
