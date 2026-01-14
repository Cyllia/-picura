const express = require('express');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
app.use(express.json());

const DATA_FILE = './recipes.json';
const SECRET_KEY = 'votre_cle_secrete_super_secure';

// --- UTILITAIRES ---
const getRecipes = () => JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
const saveRecipes = (data) => fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

// Simulation d'une base de données utilisateurs
let users = []; 

// --- AUTHENTIFICATION ---

app.post('/api/auth/register', async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, email, password: hashedPassword });
    res.status(201).json({ message: "Utilisateur créé" });
});

app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);
    if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ email: user.email }, SECRET_KEY, { expiresIn: '1h' });
        return res.json({ token });
    }
    res.status(401).json({ message: "Identifiants incorrects" });
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

// 1. Recherche et filtrage (Optimisé)
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
        recipes = recipes.filter(r => r.type === type.toLowerCase());
    }
    if (ingredient) {
        recipes = recipes.filter(r => 
            r.ingredients.some(i => i.toLowerCase().includes(ingredient.toLowerCase()))
        );
    }
    if (diet) {
        // Vérifie si le régime demandé est présent dans le tableau diets de la recette
        recipes = recipes.filter(r => r.diets && r.diets.includes(diet));
    }

    res.json(recipes);
});

// 2. Créer une recette
app.post('/api/recipes', authenticate, (req, res) => {
    const recipes = getRecipes();
    const newRecipe = {
        id: Date.now(), // Génération d'ID simple
        ...req.body,
        createdAt: new Date().toISOString()
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