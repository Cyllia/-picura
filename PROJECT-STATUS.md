# ✅ État du Projet Epicuria

## Relations BDD (VÉRIFIÉES ✅)

### 1. User → Recipes (One-to-Many)
- **Schema** : `recipes.user_id` → `users.id`
- **Relation** : Un user peut créer plusieurs recettes
- **Cascade** : DELETE CASCADE (si user supprimé, ses recettes aussi)
- **Index** : ✅ idx_user sur recipes.user_id

### 2. User ↔ Recipes (Many-to-Many via Favorites)
- **Table intermédiaire** : `favorites`
- **Contrainte unique** : (user_id, recipe_id) - un user ne peut liker qu'une fois
- **Cascade** : DELETE CASCADE des deux côtés
- **Relations** :
  - `favorites.user_id` → `users.id`
  - `favorites.recipe_id` → `recipes.id`

### 3. Recipe → Category (Many-to-One)
- **Schema** : `recipes.category_id` → `categories.id`
- **NO ACTION** : La catégorie ne peut être supprimée si des recettes l'utilisent

### 4. Recipe → Country (Many-to-One)
- **Schema** : `recipes.country_id` → `countries.id`
- **NO ACTION** : Le pays ne peut être supprimé si des recettes l'utilisent

### 5. Recipe ↔ Ingredients (Many-to-Many)
- **Table intermédiaire** : `recipe_ingredients`
- **Champs supplémentaires** : quantity, unit
- **Cascade** : DELETE CASCADE côté recipe

### 6. Recipe ↔ Diets (Many-to-Many)
- **Table intermédiaire** : `recipe_diets`
- **Contrainte unique** : (recipe_id, diet_id)

## Fonctionnalités Testées

### ✅ CRUD Recipes
- **POST** `/api/recipes` - Créer avec user_id
- **GET** `/api/recipes/[id]` - Consulter + incrémente views
- **PUT** `/api/recipes/[id]` - Modifier
- **DELETE** `/api/recipes/[id]` - Supprimer

### ✅ Favorites (Likes)
- **POST** `/api/favorites` - Liker une recette
- **GET** `/api/favorites?userId=X` - Favoris d'un user
- **GET** `/api/favorites?recipeId=X` - Users qui ont liké
- **DELETE** `/api/favorites/[id]` - Unlike

### ✅ Ratings
- **POST** `/api/ratings` - Noter une recette
- **PUT** `/api/ratings/[id]` - Modifier sa note
- **DELETE** `/api/ratings/[id]` - Supprimer sa note

### ✅ Analytics
- **views** : Auto-incrémenté à chaque GET
- **avg_rating** : Moyenne des notes
- **total_ratings** : Nombre de notes

## Tests Postman à effectuer

### 1️⃣ Créer une recette
```
POST http://localhost:3000/api/recipes
{
  "user_id": 1,
  "title": "Test Postman",
  "description": "Recette test",
  "difficulty": 2,
  "prep_time": 15,
  "cook_time": 20,
  "servings": 4,
  "instructions": "Faire ceci et cela",
  "category_id": 1,
  "country_id": 1
}
```

### 2️⃣ Liker la recette
```
POST http://localhost:3000/api/favorites
{
  "user_id": 1,
  "recipe_id": 16
}
```

### 3️⃣ Vérifier dans Prisma Studio
- Ouvrir http://localhost:5556
- Table **favorites** : vérifier que le like apparaît
- Table **recipes** : vérifier que la recette a user_id = 1

### 4️⃣ Consulter la recette
```
GET http://localhost:3000/api/recipes/16
```
→ views devrait être incrémenté

### 5️⃣ Lister les favoris du user
```
GET http://localhost:3000/api/favorites?userId=1
```
→ Devrait retourner la recette 16

### 6️⃣ Unlike
```
DELETE http://localhost:3000/api/favorites/1
```

## Commandes Utiles

```bash
# Démarrer tout
docker compose up -d          # MySQL + phpMyAdmin
npm run dev                   # Next.js API
npx prisma studio --port 5556 # Prisma Studio

# URLs
http://localhost:3000         # API
http://localhost:5556         # Prisma Studio
http://localhost:8080         # phpMyAdmin

# Reset BDD
npx prisma db push --force-reset
npm run db:seed
```

## ✅ Build & TypeScript

- ✅ Aucune erreur TypeScript
- ✅ Build réussi
- ✅ Types installés (@types/jsonwebtoken, @types/bcryptjs)
- ✅ Tous les endpoints fonctionnels

## 🎯 Prochaines étapes

1. [ ] Tester avec Postman (voir postman-tests.md)
2. [ ] Ajouter JWT authentification
3. [ ] Créer interface front-end
4. [ ] Ajouter upload d'images
5. [ ] Pagination sur GET /api/recipes
