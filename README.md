# Projeto de Interface para Panda Video API

## 📖 Sobre o Projeto

Esta é uma aplicação full-stack que serve como uma interface de usuário para a API da [Panda Video](https://pandavideo.com/). A aplicação permite autenticação de usuários, listagem, visualização e busca de vídeos e pastas hospedados na plataforma Panda, utilizando um backend próprio como intermediário para otimizar e controlar o acesso.

O projeto foi totalmente "containerizado" com Docker, garantindo um ambiente de desenvolvimento e produção consistente e fácil de configurar.

---

## ✨ Funcionalidades

* **Autenticação de Usuários:** Sistema de Cadastro e Login com JWT (JSON Web Tokens).
* **Dashboard Interativa:** Visualize todos os seus vídeos e pastas.
* **Navegação por Pastas:** Entre e saia de pastas para organizar seus arquivos.
* **Busca Rápida:** Encontre vídeos e pastas por nome em toda a sua conta.
* **Visualização de Vídeos:** Player de vídeo integrado para assistir ao conteúdo.
* **Edição de Metadados:** Altere o título e a descrição dos seus vídeos.
* **Backend Otimizado:** Utiliza **Redis** para um cache inteligente, reduzindo a carga na API da Panda e acelerando as respostas.
* **Ambiente Isolado:** Toda a aplicação (Frontend, Backend, Banco de Dados e Cache) roda em contêineres Docker.

---

## 🛠️ Tecnologias Utilizadas

* **Frontend:** Vue.js (v2), Vuetify (v2), Vue Router, Axios
* **Backend:** Node.js, Express.js
* **Banco de Dados:** MySQL (para usuários)
* **Cache:** Redis
* **Autenticação:** JWT (JSON Web Tokens), bcrypt.js
* **ORM:** Sequelize
* **Containerização:** Docker, Docker Compose

---

## 🚀 Como Executar o Projeto

Siga os passos abaixo para ter a aplicação rodando em sua máquina local.

### Pré-requisitos

Antes de começar, certifique-se de ter os seguintes softwares instalados em seu sistema:
* [Docker](https://www.docker.com/products/docker-desktop/)
* [Docker Compose](https://docs.docker.com/compose/install/) (geralmente já vem com o Docker Desktop)

### Passos para Instalação

1.  **Clone o Repositório**
    ```bash
    git clone <url-do-seu-repositorio>
    cd <nome-do-seu-repositorio>
    ```

2.  **Configure as Variáveis de Ambiente**

    O backend precisa de um arquivo `.env` para armazenar as chaves de API e senhas. Nós fornecemos um arquivo de exemplo para facilitar.

    * Navegue até a pasta do backend:
        ```bash
        cd backend
        ```
    * Copie o arquivo de exemplo:
        ```bash
        # No Windows (PowerShell):
        copy .env.example .env

        # No Linux ou macOS:
        cp .env.example .env
        ```
    * Abra o arquivo `.env` recém-criado com seu editor de código preferido e preencha as variáveis, especialmente a `PANDA_API_KEY` e o `JWT_SECRET`.
        ```env
        # ... outras variáveis ...
        PANDA_API_KEY=SUA_CHAVE_DA_API_DA_PANDA_AQUI
        JWT_SECRET=SEU_SEGREDO_SUPER_SECRETO_PARA_JWT_AQUI
        # ... outras variáveis ...
        ```

3.  **Suba os Contêineres**

    * Volte para a pasta **raiz** do projeto:
        ```bash
        cd ..
        ```
    * Execute o Docker Compose. O comando `--build` é importante na primeira vez para construir as imagens do seu frontend e backend.
        ```bash
        docker-compose up --build
        ```
    * O Docker irá baixar as imagens necessárias (MySQL, Redis, Node), construir seus contêineres e iniciá-los. Este processo pode levar alguns minutos na primeira vez.

### Acessando a Aplicação

Depois que todos os contêineres estiverem rodando, a aplicação estará disponível nos seguintes endereços:

* **Frontend (Aplicação Web):** [http://localhost:8080](http://localhost:8080)
* **Backend (API):** [http://localhost:3000](http://localhost:3000)