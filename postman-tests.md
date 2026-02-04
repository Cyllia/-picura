# Tests API Epicuria - Postman

## Configuration
- Base URL: `http://localhost:3000`

## 1. Tester la création d'une recette

**POST** `/api/recipes`

Headers:
```
Content-Type: application/json
```

Body (JSON):
```json
{
  "user_id": 1,
  "title": "Ma recette Postman",
  "description": "Une délicieuse recette créée via Postman",
  "difficulty": 2,
  "prep_time": 15,
  "cook_time": 30,
  "servings": 4,
  "instructions": "Étape 1: Préparer\nÉtape 2: Cuire\nÉtape 3: Servir",
  "category_id": 1,
  "country_id": 1
}
```

✅ **Vérification** : La recette est créée et liée au user_id 1

---

## 2. Liker une recette (Ajouter aux favoris)

**POST** `/api/favorites`

Headers:
```
Content-Type: application/json
```

Body (JSON):
```json
{
  "user_id": 1,
  "recipe_id": 1
}
```

✅ **Vérification** : Un favori est créé dans la table `favorites`

---

## 3. Vérifier les favoris d'un utilisateur

**GET** `/api/favorites?userId=1`

✅ **Vérification** : Retourne toutes les recettes likées par l'utilisateur 1

---

## 4. Vérifier qu'une recette spécifique est likée

**GET** `/api/favorites?recipeId=1`

✅ **Vérification** : Retourne tous les users qui ont liké la recette 1

---

## 5. Supprimer un like (unlike)

**DELETE** `/api/favorites/[id]`

Exemple: **DELETE** `/api/favorites/1`

✅ **Vérification** : Le favori est supprimé de la BDD

---

## 6. Consulter une recette (incrémente les vues)

**GET** `/api/recipes/1`

✅ **Vérification** : 
- Retourne la recette complète
- Incrémente automatiquement le compteur `views` dans la BDD

---

## 7. Vérifier les recettes d'un utilisateur

**GET** `/api/recipes` puis filtrer par user_id côté client

OU créer une route dédiée:

**GET** `/api/users/1/recipes` (à implémenter si nécessaire)

---

## Relations à vérifier dans Prisma Studio

1. **users.recipes** - Un user a plusieurs recettes
2. **users.favorites** - Un user a plusieurs favoris
3. **recipes.favorites** - Une recette a plusieurs favoris
4. **recipes.users** - Une recette appartient à un user
5. **favorites.users** - Un favori appartient à un user
6. **favorites.recipes** - Un favori pointe vers une recette

---

## Tests SQL directs (phpMyAdmin)

```sql
-- Vérifier qu'une recette est bien liée à un user
SELECT r.id, r.title, u.username 
FROM recipes r 
JOIN users u ON r.user_id = u.id;

-- Compter les likes par recette
SELECT r.id, r.title, COUNT(f.id) as total_likes
FROM recipes r
LEFT JOIN favorites f ON r.recipe_id = f.recipe_id
GROUP BY r.id;

-- Vérifier les vues
SELECT id, title, views 
FROM recipes 
ORDER BY views DESC;
```
