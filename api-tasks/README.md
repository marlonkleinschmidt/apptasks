# Tasks API

API REST para gerenciamento de tarefas com autenticação JWT e banco de dados SQLite.

## Instalação

1. Instale as dependências:
```bash
npm install
```

2. O arquivo `.env` já está configurado, mas você pode ajustar se necessário:
```
JWT_SECRET=your-secret-key-change-in-production
PORT=3000
```

3. Inicie o servidor:
```bash
npm start
```

Para desenvolvimento com auto-reload:
```bash
npm run dev
```

O servidor estará rodando em `http://localhost:3000`

## Usuário Fake

Um usuário fake é criado automaticamente quando o servidor inicia pela primeira vez:
- **Username:** `admin`
- **Password:** `admin123`

## Endpoints

### Autenticação

#### Registrar novo usuário
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "usuario",
  "password": "senha123"
}
```

**Resposta de sucesso (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": 2,
  "username": "usuario"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**Resposta de sucesso (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": 1,
  "username": "admin"
}
```

### Tarefas

Todos os endpoints de tarefas requerem autenticação. Inclua o token no header:
```
Authorization: Bearer <seu-token>
```

#### Listar tarefas
```http
GET /api/tasks
Authorization: Bearer <token>
```

**Resposta de sucesso (200):**
```json
[
  {
    "id": 1,
    "titulo": "Minha primeira tarefa",
    "done": false
  },
  {
    "id": 2,
    "titulo": "Tarefa concluída",
    "done": true
  }
]
```

#### Criar tarefa
```http
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "titulo": "Nova tarefa",
  "done": false
}
```

**Resposta de sucesso (201):**
```json
{
  "id": 3,
  "titulo": "Nova tarefa",
  "done": false
}
```

#### Editar tarefa
```http
PUT /api/tasks/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "titulo": "Tarefa atualizada",
  "done": true
}
```

Você pode atualizar apenas um campo:
```json
{
  "done": true
}
```

ou
```json
{
  "titulo": "Novo título"
}
```

**Resposta de sucesso (200):**
```json
{
  "id": 1,
  "titulo": "Tarefa atualizada",
  "done": true
}
```

## Exemplos de Uso

### cURL

#### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

#### Criar tarefa
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{"titulo":"Minha tarefa","done":false}'
```

#### Listar tarefas
```bash
curl -X GET http://localhost:3000/api/tasks \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

#### Editar tarefa
```bash
curl -X PUT http://localhost:3000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{"titulo":"Tarefa atualizada","done":true}'
```

### JavaScript (Fetch)

```javascript
const baseURL = 'http://localhost:3000';

async function login() {
  const response = await fetch(`${baseURL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: 'admin',
      password: 'admin123'
    })
  });
  
  const data = await response.json();
  localStorage.setItem('token', data.token);
  return data.token;
}

async function getTasks(token) {
  const response = await fetch(`${baseURL}/api/tasks`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return await response.json();
}

async function createTask(token, titulo, done = false) {
  const response = await fetch(`${baseURL}/api/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ titulo, done })
  });
  
  return await response.json();
}

async function updateTask(token, taskId, updates) {
  const response = await fetch(`${baseURL}/api/tasks/${taskId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(updates)
  });
  
  return await response.json();
}

async function exemplo() {
  const token = await login();
  console.log('Token:', token);
  
  const tasks = await getTasks(token);
  console.log('Tarefas:', tasks);
  
  const newTask = await createTask(token, 'Nova tarefa', false);
  console.log('Tarefa criada:', newTask);
  
  const updated = await updateTask(token, newTask.id, { done: true });
  console.log('Tarefa atualizada:', updated);
}
```

### Postman

1. **Login:**
   - Método: `POST`
   - URL: `http://localhost:3000/api/auth/login`
   - Body (raw JSON):
     ```json
     {
       "username": "admin",
       "password": "admin123"
     }
     ```
   - Copie o `token` da resposta

2. **Criar Tarefa:**
   - Método: `POST`
   - URL: `http://localhost:3000/api/tasks`
   - Headers:
     - `Authorization: Bearer <seu-token>`
     - `Content-Type: application/json`
   - Body (raw JSON):
     ```json
     {
       "titulo": "Minha tarefa",
       "done": false
     }
     ```

3. **Listar Tarefas:**
   - Método: `GET`
   - URL: `http://localhost:3000/api/tasks`
   - Headers:
     - `Authorization: Bearer <seu-token>`

4. **Editar Tarefa:**
   - Método: `PUT`
   - URL: `http://localhost:3000/api/tasks/1`
   - Headers:
     - `Authorization: Bearer <seu-token>`
     - `Content-Type: application/json`
   - Body (raw JSON):
     ```json
     {
       "titulo": "Tarefa atualizada",
       "done": true
     }
     ```

## Estrutura do Banco de Dados

### Tabela: users
- `id` (INTEGER PRIMARY KEY)
- `username` (TEXT UNIQUE)
- `password` (TEXT - hash bcrypt)
- `created_at` (DATETIME)

### Tabela: tasks
- `id` (INTEGER PRIMARY KEY)
- `user_id` (INTEGER - FOREIGN KEY)
- `titulo` (TEXT)
- `done` (INTEGER - 0 ou 1)
- `created_at` (DATETIME)

## Códigos de Status HTTP

- `200` - Sucesso
- `201` - Criado com sucesso
- `400` - Requisição inválida
- `401` - Não autenticado
- `403` - Token inválido/expirado
- `404` - Recurso não encontrado
- `409` - Conflito (usuário já existe)
- `500` - Erro interno do servidor

## Observações

- O token JWT expira em 24 horas
- Cada usuário só pode ver e editar suas próprias tarefas
- O campo `done` é armazenado como INTEGER (0 ou 1) no banco, mas retornado como boolean (true/false) na API
- O banco de dados SQLite é criado automaticamente como `tasks.db` na raiz do projeto

