import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

import { ITEM_ICONS, FACTORY_ICONS } from "../icons.js";
import items from "../src/data/items.json" with { type: "json" };
import factories from "../src/data/factories.json" with { type: "json" };
import recipes from "../src/data/recipes.json" with { type: "json" };

const adapter = new PrismaBetterSqlite3({
  url: "file:./dev.db",
});

const prisma = new PrismaClient({ adapter });

type RecipeSeed = {
  className: string;
  name: string;
  duration: number;
  ingredients: { item: string; amount: number }[];
  products: { item: string; amount: number }[];
  producedIn: string[];
  inBuildGun: boolean;
  alternate?: boolean;
};

async function main() {
  await prisma.recipe.deleteMany();
  await prisma.item.deleteMany();
  await prisma.factory.deleteMany();

  await prisma.item.createMany({
    data: items.map((item) => ({
      id: item.id,
      name: item.name,
      iconPath: ITEM_ICONS[item.id]
        ? `/icons/items/${ITEM_ICONS[item.id]}`
        : null,
    })),
  });

  await prisma.factory.createMany({
    data: factories.map((factory) => ({
      id: factory.id,
      name: factory.name,
      iconPath: FACTORY_ICONS[factory.id]
        ? `/icons/factories/${FACTORY_ICONS[factory.id]}`
        : null,
      inputSlots: factory.inputSlots ?? null,
      outputSlots: factory.outputSlots ?? null,
      powerConsumption: factory.powerConsumption ?? null,
    })),
  });

  const recipeArray = (Object.values(recipes).flat() as RecipeSeed[]).filter(
  (recipe) =>
    recipe.name !== "N/A" &&
    recipe.ingredients.length > 0 &&
    recipe.products.length > 0 &&
    recipe.producedIn.length > 0
);

  await prisma.recipe.createMany({
    data: recipeArray.map((recipe) => ({
      className: recipe.className,
      name: recipe.name,
      duration: recipe.duration,
      ingredients: recipe.ingredients,
      products: recipe.products,
      producedIn: recipe.producedIn,
      customRecipe: false,
      inBuildGun: recipe.inBuildGun,
      alternate: recipe.alternate ?? false,
    })),
  });

  console.log("Seed fertig.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });