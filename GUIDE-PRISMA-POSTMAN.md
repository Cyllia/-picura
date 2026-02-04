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
