**World Recipes API & Interface**
Projet Yboost
API performante + Interface utilisateur moderne pour explorer, rechercher et gérer des recettes du monde, cinq entrées, cinq plats et cinq dessert.


**Présentation du projet**
Ce projet, nommé Épicuria, est une API optimisée faite pour gérer et fournir des recettes du monde, elle répond aux critère de performance, de fiabilité et d'efficacité. L'API traitera rapidement les requêtes et offre des résultats cohérents et pertinant.
En complément de l'API, Épicuria inclut une interface utilisateur intuitive et fonctionnelle, accessible via au moins une des plateformes suivantes : application web, mobile, ou desktop. L'interface permet aux utilisateurs de rechercher, visualiser, et interagir avec les recettes du monde de manière fluide.


__1. Une API optimisée__
Capable de gérer efficacement des recettes du monde :
- Requêtes rapides et stables
- Recherche performante (nom, ingrédients, pays, régimes…)
- Fonctionnalités CRUD complètes
- Authentification/autorisation
- Gestion des utilisateur
- Fiabilité et cohérence des données

__2. Une Interface Utilisateur intuitive__
Accessible sur web / mobile / desktop, permettant :
- Recherche fluide des recettes
- Visualisation détaillée
- Ajout aux favoris, notation
- Connexion, inscription, personnalisation


**Fonctionnalités principales**
__API__
- Authentification (JWT)
- CRUD complet des recettes
- Recherche par nom, ingrédients, pays
- Filtrage par type de plat (entrée/plat/dessert), régime alimentaire
- Gestion des utilisateurs (profil, favoris, notations)
- Optimisation via cache Redis
- Validation avancée des données
- Documentation automatique (OpenAPI)

__Interface utilisateur__
- Recherche instantanée
- Filtres dynamiques
- Affichage détaillé d’une recette
- Système de favoris
- Notation + commentaires
- Design responsive et moderne


**Architecture du projet**

```txt
project/
├── Backend/
│   ├── node.js
│   ├── openapi.yaml
│   ├── recipes.json
│   └── user.json
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   ├── assets/
│   └── App.jsx
│
├── ressources/
│   └── images des plats en .png
│
└── README.md
```


**Technologies utilisées**
__Backend__


__Frontend__


__DevOps__



**Modèle de données (concept)**
- Utilisateurs (user)
- Recettes (recipes)
- Ingrédients (ingrediants)
- Régimes (diets)
- Pays (country)
- Favoris
- Notations
- Commentaires


**Endpoints principaux (extrait)**
__Auth__
```txt
POST /auth/signup
POST /auth/login
POST /auth/refresh
GET  /users/me
```

__Recettes__
```txt
GET    /recipes
GET    /recipes/{id}
POST   /recipes
PUT    /recipes/{id}
DELETE /recipes/{id}
```

__Filtres & Recherche__
```txt
GET /recipes?name=Paëlla&ingredient=ail&type=plat&country=Espagne&diets=none
```

__Interactions__
```txt
POST /recipes/{id}/rating
POST /recipes/{id}/favorite
GET  /users/{id}/favorites
```

**Installation et lancement**
1. Cloner le projet
```txt
git clone https://github.com/Cyllia/-picura.git
```

2. Lancer l’API
Depuis backend/ :
Sans Docker
```txt

```

Avec Docker Compose
```txt

```

__API accessible sur :__
http://localhost:3000/api/recipes

Docs automatiques :
http://localhost:3000/docs
http://localhost:3000/redoc

3. Lancer le frontend
Depuis frontend/ :
```txt

```

__Accessible sur :__



**Tests**
```txt

```

Tests E2E frontend :
```txt

```

**Performance & optimisation**

Indexation avancée PostgreSQL

Full-text search

Mise en cache Redis

Compression GZIP

CDN pour les images

Pagination optimisée

Logs structurés


**Sécurité**

Mots de passe hashés (bcrypt)

JWT + Refresh Tokens

Protection CSRF pour l’UI

Validation stricte des entrées

Rate limiting via Redis
