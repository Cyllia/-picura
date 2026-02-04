# Diagrammes de la base de données Epicuria

Ce dossier contient les modèles de données de l'application Epicuria.

## Fichiers

- **mcd.md** : Modèle Conceptuel de Données
- **mld.md** : Modèle Logique de Données

## Visualiser les diagrammes dans VS Code

### Option 1 : Extension Markdown Preview Mermaid Support

1. Installez l'extension **Markdown Preview Mermaid Support**
2. Ouvrez `mcd.md` ou `mld.md`
3. Appuyez sur `Ctrl+Shift+V` pour prévisualiser

### Option 2 : Extension Mermaid Editor

1. Installez **Mermaid Editor**
2. Ouvrez le fichier
3. Clic droit → "Open in Mermaid Editor"

## Exporter en PNG

### Méthode 1 : Via l'extension (recommandé)

1. Installez **Markdown PDF** ou **Mermaid Export**
2. Ouvrez le fichier `.md`
3. Clic droit → "Export to PNG"

### Méthode 2 : En ligne

1. Copiez le contenu du bloc `mermaid`
2. Allez sur https://mermaid.live/
3. Collez le code
4. Cliquez sur "Download PNG"

### Méthode 3 : CLI (si Node.js installé)

```bash
npm install -g @mermaid-js/mermaid-cli
mmdc -i docs/diagrams/mcd.md -o docs/diagrams/mcd.png
mmdc -i docs/diagrams/mld.md -o docs/diagrams/mld.png
```

## Structure de la base de données

### Tables principales (10)

1. **users** - Utilisateurs de l'application
2. **countries** - Pays d'origine des recettes
3. **categories** - Catégories de plats
4. **diets** - Régimes alimentaires
5. **recipes** - Recettes principales
6. **ingredients** - Liste des ingrédients
7. **recipe_ingredients** - Relation recettes ↔ ingrédients
8. **recipe_diets** - Relation recettes ↔ régimes
9. **ratings** - Notes et avis utilisateurs
10. **favorites** - Favoris utilisateurs

### Relations clés

- Un utilisateur peut créer plusieurs recettes (1:N)
- Une recette contient plusieurs ingrédients (N:M)
- Une recette peut suivre plusieurs régimes (N:M)
- Un utilisateur peut noter et ajouter des recettes en favoris (1:N)
