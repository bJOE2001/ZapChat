# ZapChat

Full-stack app: **Quasar (Vue 3)** frontend + **Laravel** backend, communicating via **REST API**.

## Structure

- **`backend/`** – Laravel 12 API (PHP)
- **`frontend/`** – Quasar 2 + Vue 3 SPA (Vite)

## Requirements

- **Backend:** PHP 8.2+, Composer
- **Frontend:** Node.js **22+** (required for Vite 7; Node 21.x will show `crypto.hash is not a function`), npm

## Quick start

### 1. Laravel API (backend)

```bash
cd backend
cp .env.example .env   # if .env doesn't exist
php artisan key:generate
php artisan serve     # serves at http://localhost:8000
```

API base URL: `http://localhost:8000/api`

- **Health:** `GET /api/health`
- **User (auth):** `GET /api/user` (requires Sanctum auth)

### 2. Quasar frontend

**Requires Node.js 22+.** Install from [nodejs.org](https://nodejs.org/) (LTS) or use `nvm use 22` if you have [nvm](https://github.com/nvm-sh/nvm) (see `.nvmrc` in `frontend/`).

```bash
cd frontend
npm install
npm run dev          # dev server at http://localhost:9000 (or next free port)
```

The frontend is configured to call the API at `http://localhost:8000/api` in development (see `frontend/quasar.config.js` → `build.env.API_URL`).

### 3. Chat app (optional)

After both servers are running:

1. **Seed test users** (if not already):  
   `cd backend && php artisan db:seed --force`  
   Creates **Alice** (`alice@example.com`) and **Bob** (`bob@example.com`) with password `password`.

2. Open the frontend (e.g. `http://localhost:9000`), **Register** a new user or **Login** as `alice@example.com` / `bob@example.com`.

3. Use **New chat** (➕) to start a 1-on-1 or group conversation. Messages and file attachments are supported; the conversation view polls for new messages every few seconds.

### 4. CORS

The Laravel backend allows the Quasar dev origin in `backend/config/cors.php` (e.g. `http://localhost:9000`). Adjust `allowed_origins` there if you use another port or domain.

## REST API usage (frontend)

Axios is set up in `frontend/src/boot/axios.js` with base URL and JSON headers. Use the `api` instance in components:

```js
import { api } from 'src/boot/axios'

// GET
const { data } = await api.get('/health')

// POST
await api.post('/some-resource', { name: 'Example' })
```

## Chat features

- **1-on-1 and group chats** – Start direct conversations or groups with a name.
- **Real-time messaging** – Polling for new messages; optional WebSockets (e.g. Laravel Reverb) can be added.
- **Inbox and notifications** – Conversation list with last message and unread count; opening a chat marks it read.
- **File sharing** – Attach files (e.g. images, documents) when sending a message; stored under `backend/storage/app/public/attachments/`.

## Build for production

- **Backend:** Use your normal Laravel deployment (e.g. Apache/Nginx, `php artisan`).
- **Frontend:**  
  ```bash
  cd frontend && npm run build
  ```
  Then set `API_URL` in `quasar.config.js` (or via env) to your production API base (e.g. `https://api.example.com/api`) and serve the `dist/spa` output from your web server or CDN.
