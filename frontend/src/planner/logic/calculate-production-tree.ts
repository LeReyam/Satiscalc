import type { Factory, Item, Recipe } from "../../types";
import type { ProductionPlanNode } from "../planner-types";

const BASE_RESOURCE_IDS = new Set([
  "Desc_OreIron_C",
  "Desc_OreCopper_C",
  "Desc_Stone_C",
  "Desc_Coal_C",
  "Desc_OreGold_C",
  "Desc_RawQuartz_C",
  "Desc_Sulfur_C",
  "Desc_OreBauxite_C",
  "Desc_OreUranium_C",
  "Desc_SAM_C",
  "Desc_LiquidOil_C",
  "Desc_Water_C", 
  "Desc_NitrogenGas_C", 
]);

type CalculateProductionTreeParams = {
  productId: string;
  amountPerMinute: number;
  recipes: Recipe[];
  items: Item[];
  factories: Factory[];
};

function getItemName(itemId: string, items: Item[]) {
  return items.find((item) => item.id === itemId)?.name ?? itemId;
}

function getFactoryName(factoryId: string, factories: Factory[]) {
  return factories.find((factory) => factory.id === factoryId)?.name ?? factoryId;
}

function findRecipeThatProduces(itemId: string, recipes: Recipe[]) {
  return recipes.find((recipe) => recipe.products[0]?.item === itemId);
}

function getProductAmount(recipe: Recipe, itemId: string) {
  return recipe.products.find((product) => product.item === itemId)?.amount ?? 0;
}

function getProductionPerMinute(recipe: Recipe, itemId: string) {
  const productAmount = getProductAmount(recipe, itemId);

  if (productAmount === 0 || recipe.duration === 0) {
    return 0;
  }

  return (productAmount / recipe.duration) * 60;
}

export function calculateProductionTree({
  productId,
  amountPerMinute,
  recipes,
  items,
  factories,
}: CalculateProductionTreeParams): ProductionPlanNode {
  function walkProduct(
    itemId: string,
    wantedAmountPerMinute: number,
    visiting: Set<string>
  ): ProductionPlanNode {
    const itemName = getItemName(itemId, items);

    if (visiting.has(itemId)) {
      return {
        id: `cycle-${itemId}`,
        itemId,
        itemName,
        amountPerMinute: wantedAmountPerMinute,
        children: [],
        stopReason: "cycle",
      };
    }

    if (BASE_RESOURCE_IDS.has(itemId)) {
      return {
        id: `base-${itemId}`,
        itemId,
        itemName,
        amountPerMinute: wantedAmountPerMinute,
        children: [],
        stopReason: "base-resource",
      };
    }

    const recipe = findRecipeThatProduces(itemId, recipes);

    if (!recipe) {
      return {
        id: `missing-${itemId}`,
        itemId,
        itemName,
        amountPerMinute: wantedAmountPerMinute,
        children: [],
        stopReason: "missing-recipe",
      };
    }

    visiting.add(itemId);

    const productAmountPerCycle = getProductAmount(recipe, itemId);
    const productionPerMinute = getProductionPerMinute(recipe, itemId);
    const recipeMultiplier =
      productAmountPerCycle > 0
        ? wantedAmountPerMinute / productAmountPerCycle
        : 0;

    const machines =
      productionPerMinute > 0 ? wantedAmountPerMinute / productionPerMinute : 0;

    const factoryId = recipe.producedIn[0] ?? "";
    const factoryName = factoryId
      ? getFactoryName(factoryId, factories)
      : "Keine Fabrik angegeben";

    const children = recipe.ingredients.map((ingredient) =>
      walkProduct(
        ingredient.item,
        ingredient.amount * recipeMultiplier,
        new Set(visiting)
      )
    );

    visiting.delete(itemId);

    return {
      id: `recipe-${recipe.className}-${itemId}`,
      itemId,
      itemName,
      amountPerMinute: wantedAmountPerMinute,

      recipeId: recipe.className,
      recipeName: recipe.name,
      factoryName,

      productAmountPerCycle,
      productionPerMinute,
      recipeMultiplier,
      machines,

      children,
    };
  }

  return walkProduct(productId, amountPerMinute, new Set());
}