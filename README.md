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

<<<<<<< HEAD
## Notas
- Si cambias el puerto del backend, actualiza `VITE_API_BASE_URL`.
=======
## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.



Debes de correr el fronted con:
-npm install
-npm run dev

Debes correr el backend con:
-composer install
-php artisan migrate
-php artisan serve

Especificaciones:
- Debes tener versiones iguales o superiores a php 8.4.0, tambien debes contar con un servidor para correr la base de datos en mi caso utilizo laragon con sus debidas especificaciones.

cambio con todo
