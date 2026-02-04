const express = require('express');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
app.use(express.json());

const DATA_FILE = './recipes.json';
const SECRET_KEY = '123456789';

// --- UTILITAIRES ---
const getRecipes = () => JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
const saveRecipes = (data) => fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

// Simulation d'une base de données utilisateurs
const USERS_FILE = './user.json';
const getUsers = () => JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
const saveUsers = (data) => fs.writeFileSync(USERS_FILE, JSON.stringify(data, null, 2));

// --- AUTHENTIFICATION ---
app.post('/api/auth/register', async (req, res) => {
    const { username, email, password } = req.body;
    const users = getUsers();
    if (users.find(u => u.email === email)) {
        return res.status(400).json({ message: "Email déjà utilisé" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    users.push({
        id: Date.now().toString(),
        username,
        email,
        password: hashedPassword
    });
    saveUsers(users);
    res.status(201).json({ message: "Utilisateur créé" });
});

app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    const users = getUsers();
    const user = users.find(u => u.email === email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: "Identifiants incorrects" });
    }

    const token = jwt.sign(
        { email: user.email, id: user.id },
        SECRET_KEY,
        { expiresIn: '1h' }
    );
    res.json({ token });
});

// Middleware pour protéger les routes CRUD
const authenticate = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(403).json({ message: "Token requis" });
    
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(401).json({ message: "Token invalide" });
        req.user = decoded;
        next();
    });
};

// --- ROUTES RECETTES (CRUD & FILTRES) ---

// 1. Route spécifique par ID
app.get('/api/recipes/:id', (req, res) => {
    const recipes = getRecipes();
    const recipe = recipes.find(r => r.id == req.params.id);

    if (recipe) {
        res.json(recipe);
    } else {
        res.status(404).json({ 
            message: `La recette avec l'id ${req.params.id} n'a pas été trouvée.` 
        });
    }
});

// 2. Recherche et filtrage
app.get('/api/recipes', (req, res) => {
    const { name, ingredient, country, type, diet } = req.query;
    let recipes = getRecipes();

    if (name) {
        recipes = recipes.filter(r => r.name.toLowerCase().includes(name.toLowerCase()));
    }
    if (country) {
        recipes = recipes.filter(r => r.country.toLowerCase() === country.toLowerCase());
    }
    if (type) {
        recipes = recipes.filter(r => normalize(r.type).includes(normalize(type)));
    }
    if (ingredient) {
        recipes = recipes.filter(r => 
            r.ingredients.some(i => normalize(i).includes(normalize(ingredient)))
        );
    }
    if (diet) {
        recipes = recipes.filter(r => r.diets && r.diets.some(d => d.toLowerCase() === diet.toLowerCase()));
    }
    const limit = parseInt(req.query.limit) || 20;
    const skip = parseInt(req.query.skip) || 0;

    res.json(recipes.slice(skip, skip + limit));
});

// 2. Créer une recette
app.post('/api/recipes', authenticate, (req, res) => {
    if (!req.body.name || !req.body.country || !req.body.type || !req.body.ingredients) {
        return res.status(400).json({ message: "Champs obligatoires manquants" });
    }
    const recipes = getRecipes();
    const newRecipe = {
        id: Date.now().toString(),
        name: req.body.name,
        country: req.body.country,
        type: req.body.type,
        ingredients: req.body.ingredients,
        diets: req.body.diets || [],
        instructions: req.body.instructions || "",
    };

    recipes.push(newRecipe);
    saveRecipes(recipes);
    res.status(201).json(newRecipe);
});

// 3. Modifier une recette
app.put('/api/recipes/:id', authenticate, (req, res) => {
    let recipes = getRecipes();
    const index = recipes.findIndex(r => r.id == req.params.id);
    
    if (index === -1) return res.status(404).json({ message: "Recette non trouvée" });
    
    recipes[index] = { ...recipes[index], ...req.body };
    saveRecipes(recipes);
    res.json(recipes[index]);
});

// 4. Supprimer une recette
app.delete('/api/recipes/:id', authenticate, (req, res) => {
    let recipes = getRecipes();
    const filtered = recipes.filter(r => r.id != req.params.id);
    
    if (recipes.length === filtered.length) return res.status(404).json({ message: "Recette non trouvée" });
    
    saveRecipes(filtered);
    res.status(204).send();
});

app.listen(3000, () => console.log('Serveur Epicuria tournant sur http://localhost:3000'));