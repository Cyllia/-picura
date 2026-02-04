# Epicuria (Picura)

International recipes platform built with Next.js, MySQL and Prisma.

## Stack

- Next.js (App Router)
- MySQL (Docker)
- Prisma ORM

## Project Structure

```
src/
	app/                # Next.js App Router
		layout.tsx
		page.tsx
		globals.css
	lib/
		prisma.ts         # Prisma singleton
prisma/
	schema.prisma       # Prisma schema
	migrations/
docker/
	mysql/
		init.sql          # DB init script
docs/
	diagrams/           # MCD/MLD diagrams
```

## Requirements

- Node.js 18+
- Docker Desktop

## Local Setup

1. Start MySQL + phpMyAdmin

```bash
docker compose up -d
```

phpMyAdmin: http://localhost:8080

2. Install dependencies

```bash
npm install
```

3. Run Prisma

```bash
npx prisma generate
npx prisma db push  # Sync schema with database
```

4. Seed database with sample data

```bash
npm run db:seed
```

This will import recipes from `Backend/recipes.json` into the database.

5. Start Next.js

```bash
npm run dev
```

Open http://localhost:3000

## API Routes

All API routes are available at `/api/*`:

### Authentication
- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - User login

### Recipes
- `GET /api/recipes` - List all recipes
- `GET /api/recipes/[id]` - Get recipe by ID
- `POST /api/recipes` - Create recipe
- `PUT /api/recipes/[id]` - Update recipe
- `DELETE /api/recipes/[id]` - Delete recipe

### Search & Filters
- `GET /api/search/recipes?q=...&category=...&country=...` - Search recipes
- `GET /api/filters/categories` - List categories
- `GET /api/filters/countries` - List countries
- `GET /api/filters/diets` - List diets
- `GET /api/filters/ingredients` - List ingredients

### Ratings
- `GET /api/ratings?recipe_id=...` - List ratings
- `POST /api/ratings` - Create rating
- `PUT /api/ratings/[id]` - Update rating
- `DELETE /api/ratings/[id]` - Delete rating

### Favorites
- `GET /api/favorites?user_id=...` - List favorites
- `POST /api/favorites` - Add favorite
- `DELETE /api/favorites/[id]` - Remove favorite

See `Backend/openapi.yaml` for complete API specification.

## Database

Connection string (local):

```
mysql://root:root@localhost:3306/epicuria
```

## Diagrams

See [docs/diagrams](docs/diagrams) for MCD/MLD.
