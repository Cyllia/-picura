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
```

4. Start Next.js

```bash
npm run dev
```

Open http://localhost:3000

## Database

Connection string (local):

```
mysql://root:root@localhost:3306/epicuria
```

## Diagrams

See [docs/diagrams](docs/diagrams) for MCD/MLD.
