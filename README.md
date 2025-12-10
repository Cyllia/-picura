**World Recipes API & Interface**
Projet Yboost
API performante + Interface utilisateur moderne pour explorer, rechercher et gérer des recettes du monde, cinq entrées, cinq plats et cinq dessert.


**Présentation du projet**
Ce projet a pour objectif de concevoir :

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
- Ajout aux favoris, notation, partage
- Connexion, inscription, personnalisation

Le tout en respectant les critères de performance, expérience utilisateur et scalabilité.


**Fonctionnalités principales**
__API__

- Authentification (JWT)
- CRUD complet des recettes
- Recherche par nom, ingrédients, pays
- Filtrage par type de plat (entrée/plat/dessert), régime alimentaire
- Gestion des utilisateurs (profil, favoris, notations)
- Optimisation via cache Redis
- Validation avancée des données
- Documentation automatique (OpenAPI / Swagger)

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
├── backend/
│   ├── app/
│   ├── routers/
│   ├── models/
│   ├── controllers/
│   ├── tests/
│   └── main.py
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   ├── assets/
│   └── App.jsx
│
└── README.md
```


**Technologies utilisées**
__Backend__
- FastAPI (Python)
- PostgreSQL
- SQLAlchemy
- Redis (cache + rate limiting)
- JWT authentication
- Docker / Docker Compose

__Frontend__
- React
- Vite
- TailwindCSS
- Axios

__DevOps__
- Docker
- GitHub Actions (CI/CD)
- Swagger (doc API)


**Modèle de données (concept)**
- Utilisateurs
- Recettes
- Ingrédients
- Régimes (tags)
- Pays
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
GET /recipes?q=nom&ingredient=pomme&type=plat&country=France&tags=Végétarien
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
git clone https://github.com/ton-repo/world-recipes.git
cd world-recipes
```

2. Lancer l’API
Depuis backend/ :
Sans Docker
```txt
pip install -r requirements.txt
uvicorn main:app --reload
```

Avec Docker Compose
```txt
docker compose up --build
```

__API accessible sur :__
http://localhost:8000

Docs automatiques :
http://localhost:8000/docs
http://localhost:8000/redoc

3. Lancer le frontend
Depuis frontend/ :
```txt
npm install
npm run dev
```

__Accessible sur :__
http://localhost:5173


**Tests**
```txt
pytest
```

Tests E2E frontend :
```txt
npm run test
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
