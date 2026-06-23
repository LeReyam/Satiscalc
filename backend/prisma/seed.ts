import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

import items from "../src/data/items.json" 
import factories from "../src/data/factories.json" 
import recipesRaw from "../src/data/recipes.json"

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.recipe.deleteMany();
  await prisma.item.deleteMany();
  await prisma.factory.deleteMany();

  await prisma.item.createMany({
    data: items,
  });

  await prisma.factory.createMany({
    data: factories,
  });

  const recipes = Object.values(recipesRaw).flat().map((recipe: any) => ({
    className: recipe.className,
    name: recipe.name,
    duration: recipe.duration,
    ingredients: recipe.ingredients,
    products: recipe.products,
    producedIn: recipe.producedIn,
    customRecipe: false,
    inBuildGun: recipe.inBuildGun,
    alternate: recipe.alternate ?? false,
  }));

  await prisma.recipe.createMany({
    data: recipes,
  });

  console.log("Seed erfolgreich abgeschlossen");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });