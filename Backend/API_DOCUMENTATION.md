# Documentação da API - Interface Panda Video

## Visão Geral

Esta documentação detalha os endpoints disponíveis na API de backend do projeto. A API atua como um intermediário seguro e otimizado entre o frontend e a API da Panda Video, gerenciando autenticação de usuários e cache de dados com Redis.

**URL Base da API:** `http://localhost:3000/`

---

## Autenticação

Todas as rotas, com exceção de `POST /login` e `POST /users`, são protegidas e requerem um token de autenticação JWT.

O token deve ser incluído no cabeçalho `Authorization` de cada requisição no seguinte formato:

`Authorization: Bearer <seu_jwt_token_aqui>`

---

## Endpoints da API

### 👤 Autenticação e Usuários

#### `POST /login`
Autentica um usuário e retorna um token JWT para ser usado em requisições subsequentes.

* **Request Body:**
    ```json
    {
      "email": "usuario@exemplo.com",
      "password": "sua_senha"
    }
    ```
* **Success Response (200 OK):**
    ```json
    {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": 1,
        "username": "nome_do_usuario"
      }
    }
    ```
* **Error Response (401 Unauthorized):**
    ```json
    {
      "error": "Credenciais inválidas"
    }
    ```

#### `POST /users`
Cria um novo usuário no banco de dados.

* **Request Body:**
    ```json
    {
      "username": "novo_usuario",
      "email": "novo@exemplo.com",
      "password": "senha_com_min_6_chars"
    }
    ```
* **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "message": "Conta criada com sucesso! Faça login."
    }
    ```
* **Error Response (400 Bad Request):**
    ```json
    {
      "type": "ValidationError",
      "errors": [
        "O email deve ter um formato válido"
      ]
    }
    ```

---

### 📁 Pastas (Folders)

#### `GET /folders/root`
Retorna uma lista de todas as pastas que estão na raiz (cujo `parent_folder_id` é `null`).

* **Query Parameters:** N/A
* **Success Response (200 OK):**
    ```json
    [
      {
        "todos os videos que tem parent_folder_id": null
      }
    ]
    ```

#### `GET /folders`
Retorna uma lista de todas as pastas da conta, podendo ser filtrada. Usado para buscas e para listar o conteúdo de subpastas.

* **Query Parameters (Opcionais):**
    * `name` (string): Filtra pastas pelo nome (para busca).
    * `parent_folder_id` (string): Retorna apenas as pastas filhas de uma pasta específica.
* **Success Response (200 OK):**
    ```json
    [
      { "id": "...", "name": "...", "parent_folder_id": "..." }
    ]
    ```

#### `GET /folders/:id`
Retorna os detalhes de uma pasta específica pelo seu ID.

* **URL Parameters:**
    * `id` (string, obrigatório): O UUID da pasta.
* **Success Response (200 OK):**
    ```json
    {
        "id": "235c5734-160d-4517-b615-64469d184e77",
        "name": "Mobile",
        "user_id": "ed1c9ece-f427-4592-9b9f-be5ffe3a77fc",
        "parent_folder_id": null,
        "status": true,
        "created_at": "2025-06-10T18:27:08.000Z",
        "updated_at": "2025-06-10T18:27:08.000Z",
        "videos": [{"..."}]
    }
    ```

---

### 📹 Vídeos (Videos)

#### `GET /videos`
Retorna uma lista paginada de todos os vídeos da conta, podendo ser filtrada.

* **Query Parameters (Opcionais):**
    * `page` (number), `limit` (number).
    * `title` (string): Filtra vídeos pelo título (para busca).
    * `folder_id` (string): Retorna apenas os vídeos de uma pasta específica.
* **Success Response (200 OK):**
    ```json
    {
      "videos": [
        { "id": "...", "title": "...", "folder_id": "..." }
      ],
      "pages": 5,
      "total": 40
    }
    ```

#### `GET /videos/:id`
Retorna os detalhes de um vídeo específico pelo seu ID.

* **URL Parameters:**
    * `id` (string, obrigatório): O UUID do vídeo.
* **Success Response (200 OK):**
    ```json
    {
      "id": "f0cff87e-...",
      "title": "60_30fps.mp4",
      "description": null,
      "status": "CONVERTED",
      "video_player": "[https://player-vz-d9b....tv.pandavideo.com.br/embed/?v=](https://player-vz-d9b....tv.pandavideo.com.br/embed/?v=)...",
      "...": "..."
    }
    ```

#### `PUT /videos/:id`
Atualiza o título e/ou a descrição de um vídeo específico.

* **URL Parameters:**
    * `id` (string, obrigatório): O UUID do vídeo.
* **Request Body:**
    ```json
    {
      "title": "Novo Título para o Vídeo",
      "description": "Esta é a nova descrição atualizada."
    }
    ```
* **Success Response (200 OK):** Retorna o objeto do vídeo completo com os dados atualizados.

---

## 🔐 Validação e Segurança

A API utiliza validação de schema em todas as requisições que recebem dados para garantir a integridade e segurança. Usei a biblioteca **Yup** para definir e aplicar essas regras.

* **Criação de Usuário e Login:** As rotas `POST /users` e `POST /login` são validadas usando os schemas `userCreationSchema` e `loginSchema`, respectivamente.
* **Atualização de Vídeo:** A rota `PUT /videos/:id` é validada usando o `videoUpdateSchema`.
* **Segurança:** Todas as rotas (exceto login/cadastro) requerem autenticação JWT, e as senhas dos usuários são sempre armazenadas com hash usando `bcrypt`.


## ⚠️ Tratamento de Erros

A API utiliza códigos de status HTTP padrão para indicar o sucesso ou falha de uma requisição:

* **`200 OK`**: Requisição bem-sucedida.
* **`201 Created`**: Recurso criado com sucesso.
* **`400 Bad Request`**: A requisição foi malformada. Geralmente ocorre por falha na validação (ex: email inválido, senha muito curta). O corpo da resposta conterá os detalhes do erro.
* **`401 Unauthorized`**: Falha na autenticação. O token JWT não foi fornecido, é inválido ou expirou.
* **`404 Not Found`**: O recurso solicitado (ex: um vídeo com um ID específico) não foi encontrado.
* **`500 Internal Server Error`**: Um erro inesperado ocorreu no servidor.
