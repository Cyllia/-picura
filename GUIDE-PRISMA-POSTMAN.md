# 🚀 Guide Complet : Prisma Studio & Postman

## 📊 PRISMA STUDIO - Interface visuelle pour votre BDD

### Qu'est-ce que c'est ?
Prisma Studio est une **interface graphique** pour visualiser et modifier vos données MySQL directement dans le navigateur. Comme phpMyAdmin mais plus moderne et intégré à votre projet.

### 🟢 Démarrer Prisma Studio

```bash
npx prisma studio --port 5556
```

Puis ouvrir : **http://localhost:5556**

### 🎯 Ce que vous pouvez faire

#### 1. **Visualiser les données**
- Cliquez sur une table (ex: `recipes`, `users`, `favorites`)
- Voyez toutes les lignes de la table
- Filtrez, triez, cherchez

#### 2. **Ajouter des données**
- Bouton **"Add record"** en haut à droite
- Remplissez les champs
- Cliquez **Save**

#### 3. **Modifier une ligne**
- Cliquez sur une ligne
- Modifiez les valeurs
- Ctrl+S pour sauvegarder

#### 4. **Supprimer**
- Sélectionnez une ligne
- Icône poubelle
- Confirmez

#### 5. **Voir les relations**
- Cliquez sur une flèche `→` à côté d'une clé étrangère
- Navigue automatiquement vers la ligne liée

### 💡 Exemples pratiques

**Vérifier qu'une recette est liée à un user :**
1. Table `recipes`
2. Regarder la colonne `user_id`
3. Cliquer sur la flèche → pour voir le profil user

**Vérifier les likes (favorites) :**
1. Table `favorites`
2. Voir les colonnes `user_id` et `recipe_id`
3. Cliquer sur les flèches pour naviguer

---

## 📮 POSTMAN - Tester votre API

### Installation

1. **Télécharger Postman**
   - Aller sur : https://www.postman.com/downloads/
   - Cliquer sur "Download" (Windows 64-bit)
   - Installer l'application

2. **Première ouverture**
   - Créer un compte (gratuit) OU
   - Cliquer "Skip and go to the app"

### 🎨 Interface Postman

```
┌─────────────────────────────────────────┐
│  Collections  │  Environment  │  History │
├─────────────────────────────────────────┤
│  [GET ▼]  [URL]              [Send]     │
├─────────────────────────────────────────┤
│  Params │ Auth │ Headers │ Body │       │
├─────────────────────────────────────────┤
│          RÉPONSE ICI                    │
└─────────────────────────────────────────┘
```

### 🟢 Test 1 : GET - Récupérer les recettes

1. **Méthode** : Sélectionnez `GET` dans le menu déroulant
2. **URL** : `http://localhost:3000/api/recipes`
3. **Cliquez sur** : `Send`
4. **Résultat** : Liste JSON de toutes les recettes

### 🟢 Test 2 : GET - Une recette spécifique

1. **Méthode** : `GET`
2. **URL** : `http://localhost:3000/api/recipes/1`
3. **Send**
4. **Résultat** : Détails de la recette 1 (+ vues incrémentées !)

### 🟢 Test 3 : POST - Créer une recette

1. **Méthode** : `POST`
2. **URL** : `http://localhost:3000/api/recipes`
3. **Onglet Headers** :
   - Cliquez sur l'onglet `Headers`
   - Ajoutez : 
     - Key: `Content-Type`
     - Value: `application/json`
4. **Onglet Body** :
   - Cliquez sur `Body`
   - Sélectionnez `raw`
   - Sélectionnez `JSON` dans le menu déroulant
   - Collez ce JSON :

```json
{
  "user_id": 1,
  "title": "Ma première recette Postman",
  "description": "Recette créée avec Postman",
  "difficulty": 2,
  "prep_time": 15,
  "cook_time": 30,
  "servings": 4,
  "instructions": "Étape 1: Préparer les ingrédients\nÉtape 2: Cuisiner\nÉtape 3: Servir chaud",
  "category_id": 1,
  "country_id": 1
}
```

5. **Cliquez sur** : `Send`
6. **Résultat** : La recette créée avec son ID

### 🟢 Test 4 : POST - Liker une recette (Favorites)

1. **Méthode** : `POST`
2. **URL** : `http://localhost:3000/api/favorites`
3. **Headers** : `Content-Type: application/json`
4. **Body** (raw JSON) :

```json
{
  "user_id": 1,
  "recipe_id": 1
}
```

5. **Send**
6. **Résultat** : Le favori créé

### 🟢 Test 5 : GET - Favoris d'un user

1. **Méthode** : `GET`
2. **URL** : `http://localhost:3000/api/favorites?userId=1`
3. **Send**
4. **Résultat** : Toutes les recettes likées par l'utilisateur 1

### 🟢 Test 6 : DELETE - Supprimer un favori

1. **Méthode** : `DELETE`
2. **URL** : `http://localhost:3000/api/favorites/1` (remplacez 1 par l'ID du favori)
3. **Send**
4. **Résultat** : `{"success": true}`

---

## 🎯 LISTE COMPLÈTE DES REQUÊTES À TESTER

### 🔐 AUTHENTIFICATION

#### 📌 1. Inscription (Register)
- **Méthode** : `POST`
- **URL** : `http://localhost:3000/api/auth/register`
- **Headers** : `Content-Type: application/json`
- **Body** :
```json
{
  "email": "nouveau@epicuria.com",
  "password": "MotDePasse123!",
  "username": "NouveauChef",
  "first_name": "Jean",
  "last_name": "Dupont"
}
```

#### 📌 2. Connexion (Login)
- **Méthode** : `POST`
- **URL** : `http://localhost:3000/api/auth/login`
- **Headers** : `Content-Type: application/json`
- **Body** :
```json
{
  "email": "test@epicuria.com",
  "password": "password123"
}
```

---

### 🍳 RECETTES

#### 📌 3. Récupérer TOUTES les recettes
- **Méthode** : `GET`
- **URL** : `http://localhost:3000/api/recipes`
- **Résultat** : Liste complète des 15 recettes

#### 📌 4. Récupérer UNE recette par ID
- **Méthode** : `GET`
- **URL** : `http://localhost:3000/api/recipes/5`
- **Résultat** : Détails de la recette 5 (vues +1)

#### 📌 5. Créer une nouvelle recette
- **Méthode** : `POST`
- **URL** : `http://localhost:3000/api/recipes`
- **Headers** : `Content-Type: application/json`
- **Body** :
```json
{
  "user_id": 1,
  "title": "Salade César Maison",
  "description": "Une délicieuse salade César avec poulet grillé",
  "difficulty": 1,
  "prep_time": 10,
  "cook_time": 15,
  "servings": 2,
  "instructions": "1. Griller le poulet\n2. Préparer la sauce\n3. Mélanger la salade\n4. Ajouter les croûtons",
  "category_id": 1,
  "country_id": 1,
  "image_url": "/images/salade-cesar.jpg"
}
```

#### 📌 6. Modifier une recette existante
- **Méthode** : `PUT`
- **URL** : `http://localhost:3000/api/recipes/1`
- **Headers** : `Content-Type: application/json`
- **Body** :
```json
{
  "title": "Pho Vietnamien Revisité",
  "description": "Version améliorée du Pho classique",
  "difficulty": 3
}
```

#### 📌 7. Supprimer une recette
- **Méthode** : `DELETE`
- **URL** : `http://localhost:3000/api/recipes/16`
- **Résultat** : `{"success": true}`

---

### 🔍 RECHERCHE

#### 📌 8. Rechercher des recettes par titre
- **Méthode** : `GET`
- **URL** : `http://localhost:3000/api/search/recipes?query=poulet`
- **Résultat** : Toutes les recettes contenant "poulet"

#### 📌 9. Rechercher par catégorie
- **Méthode** : `GET`
- **URL** : `http://localhost:3000/api/search/recipes?categoryId=1`
- **Résultat** : Recettes de la catégorie 1 (Plat principal)

#### 📌 10. Rechercher par pays
- **Méthode** : `GET`
- **URL** : `http://localhost:3000/api/search/recipes?countryId=5`
- **Résultat** : Recettes vietnamiennes

#### 📌 11. Rechercher par difficulté
- **Méthode** : `GET`
- **URL** : `http://localhost:3000/api/search/recipes?difficulty=1`
- **Résultat** : Recettes faciles (difficulté 1)

#### 📌 12. Recherche combinée
- **Méthode** : `GET`
- **URL** : `http://localhost:3000/api/search/recipes?query=curry&categoryId=1&difficulty=2`
- **Résultat** : Plats principaux au curry de difficulté moyenne

---

### ❤️ FAVORIS (LIKES)

#### 📌 13. Liker une recette
- **Méthode** : `POST`
- **URL** : `http://localhost:3000/api/favorites`
- **Headers** : `Content-Type: application/json`
- **Body** :
```json
{
  "user_id": 1,
  "recipe_id": 3
}
```

#### 📌 14. Voir tous les favoris d'un utilisateur
- **Méthode** : `GET`
- **URL** : `http://localhost:3000/api/favorites?userId=1`
- **Résultat** : Toutes les recettes likées par l'utilisateur 1

#### 📌 15. Unlike une recette
- **Méthode** : `DELETE`
- **URL** : `http://localhost:3000/api/favorites/2`
- **Résultat** : Supprime le favori ID 2

---

### ⭐ NOTES (RATINGS)

#### 📌 16. Noter une recette
- **Méthode** : `POST`
- **URL** : `http://localhost:3000/api/ratings`
- **Headers** : `Content-Type: application/json`
- **Body** :
```json
{
  "user_id": 1,
  "recipe_id": 5,
  "rating": 5,
  "comment": "Absolument délicieux ! Meilleure recette que j'ai testée"
}
```

#### 📌 17. Voir les notes d'une recette
- **Méthode** : `GET`
- **URL** : `http://localhost:3000/api/ratings?recipeId=1`
- **Résultat** : Toutes les notes de la recette 1

#### 📌 18. Modifier une note
- **Méthode** : `PUT`
- **URL** : `http://localhost:3000/api/ratings/1`
- **Headers** : `Content-Type: application/json`
- **Body** :
```json
{
  "rating": 4,
  "comment": "Très bon, mais un peu épicé pour moi"
}
```

#### 📌 19. Supprimer une note
- **Méthode** : `DELETE`
- **URL** : `http://localhost:3000/api/ratings/1`

---

### 🏷️ FILTRES

#### 📌 20. Récupérer toutes les catégories
- **Méthode** : `GET`
- **URL** : `http://localhost:3000/api/filters/categories`
- **Résultat** : Liste des 3 catégories (Plat principal, Dessert, Entrée)

#### 📌 21. Récupérer tous les pays
- **Méthode** : `GET`
- **URL** : `http://localhost:3000/api/filters/countries`
- **Résultat** : Liste des 14 pays disponibles

#### 📌 22. Récupérer tous les régimes alimentaires
- **Méthode** : `GET`
- **URL** : `http://localhost:3000/api/filters/diets`
- **Résultat** : Liste des 9 régimes (Végétarien, Sans gluten, etc.)

#### 📌 23. Récupérer tous les ingrédients
- **Méthode** : `GET`
- **URL** : `http://localhost:3000/api/filters/ingredients`
- **Résultat** : Liste des 93 ingrédients

---

### 🧪 TESTS AVANCÉS

#### 📌 24. Créer plusieurs favoris d'affilée
Testez en créant 5 favoris différents pour voir la liste augmenter :
```json
{"user_id": 1, "recipe_id": 1}
{"user_id": 1, "recipe_id": 2}
{"user_id": 1, "recipe_id": 3}
{"user_id": 1, "recipe_id": 7}
{"user_id": 1, "recipe_id": 10}
```

#### 📌 25. Tester le compteur de vues
- Appeler `GET /api/recipes/1` plusieurs fois
- Vérifier dans Prisma Studio que `views` augmente à chaque fois

#### 📌 26. Recherche vide
- **URL** : `http://localhost:3000/api/search/recipes?query=zzzznonexistant`
- **Résultat** : Tableau vide `[]`

#### 📌 27. Tester les erreurs
- **URL** : `http://localhost:3000/api/recipes/9999` (ID inexistant)
- **Résultat** : Erreur 404 ou message d'erreur

---

### 📊 SCÉNARIOS COMPLETS

#### 🎬 Scénario 1 : Créer un compte et ajouter une recette
1. POST `/api/auth/register` → Créer compte
2. POST `/api/auth/login` → Se connecter
3. POST `/api/recipes` → Ajouter recette
4. GET `/api/recipes` → Vérifier qu'elle apparaît

#### 🎬 Scénario 2 : Explorer et liker des recettes
1. GET `/api/recipes` → Liste complète
2. GET `/api/recipes/3` → Voir détails
3. POST `/api/favorites` → Liker la recette 3
4. GET `/api/favorites?userId=1` → Vérifier le like
5. GET `/api/recipes/3` → Revoir (vues +1)

#### 🎬 Scénario 3 : Recherche et notation
1. GET `/api/filters/countries` → Voir les pays
2. GET `/api/search/recipes?countryId=5` → Recettes vietnamiennes
3. GET `/api/recipes/1` → Détails du Pho
4. POST `/api/ratings` → Noter 5/5
5. GET `/api/ratings?recipeId=1` → Voir la note ajoutée

#### 🎬 Scénario 4 : Gestion complète d'une recette
1. POST `/api/recipes` → Créer recette "Tarte aux pommes"
2. Noter l'ID retourné (ex: 16)
3. PUT `/api/recipes/16` → Modifier le titre
4. POST `/api/favorites` → Liker avec `recipe_id: 16`
5. POST `/api/ratings` → Noter la recette
6. GET `/api/recipes/16` → Vérifier tout
7. DELETE `/api/recipes/16` → Supprimer

---

## 📝 Créer une Collection Postman (Optionnel mais utile)

### Pourquoi ?
Sauvegarder tous vos tests pour les réutiliser facilement.

### Comment ?

1. **Cliquez sur** : `Collections` (panneau gauche)
2. **Cliquez sur** : `+` ou `New Collection`
3. **Nommez** : "Epicuria API Tests"
4. **Après chaque requête** :
   - Cliquez sur `Save` à côté de `Send`
   - Choisissez la collection "Epicuria API Tests"
   - Donnez un nom (ex: "GET All Recipes")

Maintenant vous pouvez relancer n'importe quel test en 1 clic !

---

## 🔧 Workflow complet de test

### 1. Démarrer les serveurs

```bash
# Terminal 1 : MySQL
docker compose up -d

# Terminal 2 : API Next.js
npm run dev

# Terminal 3 : Prisma Studio (optionnel)
npx prisma studio --port 5556
```

### 2. Tester avec Postman

1. **Créer une recette** (POST `/api/recipes`)
2. **Noter l'ID** de la recette créée (ex: 16)
3. **Consulter Prisma Studio** → Table `recipes` → Vérifier la nouvelle ligne
4. **Liker la recette** (POST `/api/favorites` avec recipe_id: 16)
5. **Vérifier dans Prisma** → Table `favorites` → Voir le nouveau like
6. **Récupérer les favoris** (GET `/api/favorites?userId=1`)
7. **Consulter la recette** (GET `/api/recipes/16`) → Vues incrémentées

### 3. Vérifier dans Prisma Studio

1. Table `recipes` :
   - Nouvelle recette visible
   - `user_id` = 1
   - `views` incrémenté après GET

2. Table `favorites` :
   - Ligne avec `user_id` = 1 et `recipe_id` = 16

3. Cliquer sur les flèches `→` pour naviguer entre relations

---

## ❓ Résolution de problèmes

### Postman : "Could not get any response"
✅ **Solution** : Vérifier que `npm run dev` tourne (API sur port 3000)

### Prisma Studio : "Cannot connect"
✅ **Solution** : 
```bash
docker compose up -d  # Démarrer MySQL
npx prisma db push    # Sync schema
npx prisma studio --port 5556
```

### Postman : "Invalid JSON"
✅ **Solution** : Vérifier que :
- Body est en mode `raw` + `JSON`
- Les guillemets sont bien `"` (pas `'`)
- Pas de virgule après le dernier champ

---

## 🎯 Exercice pratique

### Mission : Créer et liker une recette

1. **Postman** : Créer une recette de Pizza
2. **Prisma Studio** : Vérifier qu'elle apparaît dans `recipes`
3. **Postman** : Liker cette recette (POST favorites)
4. **Prisma Studio** : Vérifier dans table `favorites`
5. **Postman** : Récupérer les favoris du user 1
6. **Postman** : Consulter la recette 3 fois (GET)
7. **Prisma Studio** : Vérifier que `views` = 3

---

## 📚 Ressources

- **Postman Doc** : https://learning.postman.com/docs/getting-started/overview/
- **Prisma Studio** : https://www.prisma.io/docs/orm/tools/prisma-studio
- **Votre API** : Voir `postman-tests.md` pour tous les endpoints

---

## 💡 Raccourcis Postman

- `Ctrl + Enter` : Envoyer la requête
- `Ctrl + S` : Sauvegarder
- `Ctrl + N` : Nouvelle requête
- `Ctrl + /` : Rechercher
