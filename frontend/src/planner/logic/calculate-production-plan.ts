import type { Factory, Item, Recipe } from "../../types";
import type { ProductionPlan } from "../planner-types";

import { calculateProductionTree } from "./calculate-production-tree";
import {
  collectBaseResources,
  collectIntermediateResources,
} from "./collect-resources";
import { collectMachines } from "./collect-machines";

type CalculateProductionPlanParams = {
  recipe: Recipe;
  amountPerMinute: number;
  recipes: Recipe[];
  items: Item[];
  factories: Factory[];
};

function getItemName(itemId: string, items: Item[]) {
  return items.find((item) => item.id === itemId)?.name ?? itemId;
}

export function calculateProductionPlan({
  recipe,
  amountPerMinute,
  recipes,
  items,
  factories,
}: CalculateProductionPlanParams): ProductionPlan {
  const rootProduct = recipe.products[0];
  const rootProductId = rootProduct?.item ?? "";
  const rootProductName = getItemName(rootProductId, items);

  const tree = calculateProductionTree({
    productId: rootProductId,
    amountPerMinute,
    recipes,
    items,
    factories,
  });

  return {
    rootProductId,
    rootProductName,
    targetAmountPerMinute: amountPerMinute,
    baseResources: collectBaseResources(tree),
    intermediateResources: collectIntermediateResources(tree),
    machines: collectMachines(tree),
    tree,
  };
}