# Docker — apptasks

Sobe o front (Vue + Nginx) e a API (Express + SQLite) juntos.

## Requisitos
- Docker Desktop rodando

## Subir tudo
```bash
docker compose up --build -d
```

- Front: http://localhost:8080
- API:   http://localhost:3000

Usuário de teste: `admin` / `admin123`

Se a porta 8080 (ou 3000) já estiver em uso, defina outra no `.env`
(`WEB_PORT` / `API_PORT`) ou inline:
```bash
WEB_PORT=8081 docker compose up -d
```

## Parar
```bash
docker compose down          # mantém o banco (volume api-data)
docker compose down -v       # remove também o banco
```

## Estrutura
| Serviço | Build            | Imagem base                    | Porta host |
|---------|------------------|--------------------------------|------------|
| `web`   | `./vue-tasks`    | node:22 (build) + nginx:1.27   | 8080 → 80  |
| `api`   | `./api-tasks`    | node:22-bookworm-slim          | 3000 → 3000 |

## Configuração
Copie `.env.example` para `.env` para ajustar `JWT_SECRET` e `VITE_API_URL`.

> `VITE_API_URL` é lida em **tempo de build** do front (o navegador chama a API
> diretamente). Se mudar, refaça o build: `docker compose build web`.

O banco SQLite persiste no volume `api-data` (`/app/data/tasks.db` no container).

## Notas
- O build do front usa `npx vite build` (e não o script `npm run build`, que
  roda `vue-tsc -b` e hoje falha por erros de tipagem pré-existentes no projeto:
  falta de shims para `*.vue`, alias `@` ausente no `tsconfig`, `noImplicitAny`
  em `src/utils/storage.ts`). Isso não afeta o bundle gerado.
