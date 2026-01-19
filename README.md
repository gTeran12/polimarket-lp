# Polimarket LP

## Requisitos
- Node.js 18+ y npm
- PHP 8.2+
- Composer

## Backend (Laravel)
1. `cd backend`
2. Copia el archivo de entorno si no existe:
   - Windows: `copy .env.example .env`
   - macOS/Linux: `cp .env.example .env`
3. (Opcional) Ajusta `ADMIN_NAME`, `ADMIN_EMAIL` y `ADMIN_PASSWORD` en `backend/.env`.
4. Crea la base SQLite:
   - Windows: `type nul > database/database.sqlite`
   - macOS/Linux: `touch database/database.sqlite`
5. Instala dependencias:
   - `composer install` (o `php composer.phar install` si no tienes Composer global)
6. Genera la key:
   - `php artisan key:generate`
7. Ejecuta migraciones y seeders:
   - `php artisan migrate --seed`
8. Levanta el servidor:
   - `php artisan serve` (por defecto `http://127.0.0.1:8000`)

## Frontend (React + Vite)
1. Desde la raiz del repo: `npm install`
2. (Opcional) Crea un `.env` en la raiz con:
   - `VITE_API_BASE_URL=http://127.0.0.1:8000`
3. Levanta el front:
   - `npm run dev` (por defecto `http://localhost:5173`)

## Notas
- Si cambias el puerto del backend, actualiza `VITE_API_BASE_URL`.
