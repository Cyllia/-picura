# Epicuria (Picura)

International recipes project built with Next.js, Prisma and MySQL.

## What runs where

- XAMPP is only useful for MySQL/phpMyAdmin.
- The app itself is a Node.js app, so it must be started with `npm run dev` or `npm run start`.
- Docker and XAMPP are alternatives for MySQL. Do not run both MySQL servers on port `3306` at the same time.

## Stack

- Next.js 16 (App Router)
- React 19
- Prisma ORM
- MySQL

## Quick start

1. Install dependencies

```bash
npm install
```

2. Copy `.env.example` to `.env`

Required values:

```bash
DATABASE_URL="mysql://root:@127.0.0.1:3306/epicuria"
JWT_SECRET="change-me-for-demo"
```

3. Start ONE database

Option A: XAMPP

- Start MySQL in XAMPP
- Create a database named `epicuria`
- Use the `DATABASE_URL` that matches your XAMPP MySQL user/password

Option B: Docker

```bash
docker compose up -d
```

4. Initialize Prisma

```bash
npm run db:generate
npm run db:push
npm run db:seed
```

5. Start Next.js

```bash
npm run dev
```

App URL: [http://localhost:3000](http://localhost:3000)

## API routes

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`

### Recipes

- `GET /api/recipes`
- `GET /api/recipes/[id]`
- `POST /api/recipes`
- `PUT /api/recipes/[id]`
- `DELETE /api/recipes/[id]`

Supported list filters on `GET /api/recipes`:

- `search`
- `categoryId`
- `countryId`
- `userId`

### Search

- `GET /api/search/recipes`

Supported filters:

- `q`
- `ingredient`
- `categoryId`
- `countryId`
- `dietId`

### Filters

- `GET /api/filters/categories`
- `GET /api/filters/countries`
- `GET /api/filters/diets`
- `GET /api/filters/ingredients`

### Ratings

- `GET /api/ratings?userId=...&recipeId=...`
- `POST /api/ratings`
- `PUT /api/ratings/[id]`
- `DELETE /api/ratings/[id]`

### Favorites

- `GET /api/favorites?userId=...&recipeId=...`
- `POST /api/favorites`
- `DELETE /api/favorites/[id]`

## Notes for the course project

- Authentication exists for login/register, but mutation routes are not yet protected by JWT middleware.
- The backend is good enough for a course prototype, but not production-ready.
- Recipe images are served from `/ressources/...` for the upcoming frontend integration.
