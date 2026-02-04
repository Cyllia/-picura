import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface RecipeJson {
  id: number;
  type: string;
  name: string;
  country: string;
  diets: string[];
  ingredients: string[];
  instructions: string[];
  prep_time?: number;
  cook_time?: number;
  difficulty?: number;
  servings?: number;
}

async function main() {
  console.log('🌱 Starting seed...');

  // Lire les données JSON
  const recipesPath = path.join(__dirname, '..', 'Backend', 'recipes.json');
  const recipesData: RecipeJson[] = JSON.parse(fs.readFileSync(recipesPath, 'utf-8'));

  // Créer les catégories
  const categories = Array.from(new Set(recipesData.map(r => r.type)));
  for (const categoryName of categories) {
    await prisma.categories.upsert({
      where: { name: categoryName },
      update: {},
      create: { name: categoryName, description: `Catégorie ${categoryName}` },
    });
  }
  console.log(`✅ Created ${categories.length} categories`);

  // Créer les pays
  const countries = Array.from(new Set(recipesData.map(r => r.country)));
  for (const countryName of countries) {
    // Générer un code pays basique (2 premières lettres en majuscules)
    const code = countryName.substring(0, 2).toUpperCase();
    await prisma.countries.upsert({
      where: { name: countryName },
      update: {},
      create: { name: countryName, code },
    });
  }
  console.log(`✅ Created ${countries.length} countries`);

  // Créer les régimes
  const allDiets = Array.from(new Set(recipesData.flatMap(r => r.diets || [])));
  for (const dietName of allDiets) {
    await prisma.diets.upsert({
      where: { name: dietName },
      update: {},
      create: { name: dietName, description: `Régime ${dietName}` },
    });
  }
  console.log(`✅ Created ${allDiets.length} diets`);

  // Créer les ingrédients
  const allIngredients = Array.from(new Set(recipesData.flatMap(r => r.ingredients || [])));
  for (const ingredientRaw of allIngredients) {
    // Extraire le nom de l'ingrédient (après la quantité)
    const ingredientName = ingredientRaw.replace(/^[\d\/\.,\s]+(g|kg|ml|l|cuillère|tasse|tranche|pincée)?s?\s+/i, '').trim();
    
    await prisma.ingredients.upsert({
      where: { name: ingredientName },
      update: {},
      create: { name: ingredientName, category: 'Général' },
    });
  }
  console.log(`✅ Created ${allIngredients.length} ingredients`);

  // Créer un utilisateur de test
  const testUser = await prisma.users.upsert({
    where: { email: 'test@epicuria.com' },
    update: {},
    create: {
      username: 'testuser',
      email: 'test@epicuria.com',
      password_hash: '$2a$10$dummyhashdummyhashdummyhashdummyhash', // Hash fictif
    },
  });
  console.log(`✅ Created test user`);

  // Créer les recettes
  for (const recipe of recipesData) {
    const category = await prisma.categories.findUnique({ where: { name: recipe.type } });
    const country = await prisma.countries.findUnique({ where: { name: recipe.country } });

    if (!category || !country) continue;

    const createdRecipe = await prisma.recipes.create({
      data: {
        title: recipe.name,
        description: `Délicieuse recette de ${recipe.name}`,
        difficulty: recipe.difficulty || 2,
        prep_time: recipe.prep_time || 20,
        cook_time: recipe.cook_time || 30,
        servings: recipe.servings || 4,
        instructions: recipe.instructions.join('\n'),
        image_url: `/ressources/${recipe.name.toLowerCase().replace(/ /g, '_')}.png`,
        category_id: category.id,
        country_id: country.id,
        user_id: testUser.id,
      },
    });

    // Lier les régimes
    for (const dietName of recipe.diets || []) {
      const diet = await prisma.diets.findUnique({ where: { name: dietName } });
      if (diet) {
        await prisma.recipe_diets.create({
          data: {
            recipe_id: createdRecipe.id,
            diet_id: diet.id,
          },
        });
      }
    }

    // Lier les ingrédients
    for (const ingredientRaw of recipe.ingredients || []) {
      // Parser la quantité et l'unité
      const match = ingredientRaw.match(/^([\d\/\.,]+)\s*(g|kg|ml|l|cuillère|tasse|tranche|pincée)?s?\s+(.+)/i);
      const quantity = match ? parseFloat(match[1].replace(',', '.')) : 1;
      const unit = match ? match[2] || 'unité' : 'unité';
      const ingredientName = match ? match[3].trim() : ingredientRaw.trim();

      const ingredient = await prisma.ingredients.findUnique({ where: { name: ingredientName } });
      if (ingredient) {
        await prisma.recipe_ingredients.create({
          data: {
            recipe_id: createdRecipe.id,
            ingredient_id: ingredient.id,
            quantity,
            unit,
          },
        });
      }
    }
  }

  console.log(`✅ Created ${recipesData.length} recipes`);
  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
