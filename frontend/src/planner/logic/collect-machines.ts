import type {
  PlannerMachineRow,
  ProductionPlanNode,
} from "../planner-types";

export function collectMachines(
  tree: ProductionPlanNode
): PlannerMachineRow[] {
  const machines: PlannerMachineRow[] = [];

  function walk(node: ProductionPlanNode) {
    if (
      node.recipeId &&
      node.recipeName &&
      node.factoryName &&
      node.machines !== undefined
    ) {
      machines.push({
        recipeId: node.recipeId,
        recipeName: node.recipeName,
        factoryName: node.factoryName,
        machines: node.machines,
        outputItemId: node.itemId,
        outputItemName: node.itemName,
        outputAmountPerMinute: node.amountPerMinute,
      });
    }

    node.children.forEach(walk);
  }

  walk(tree);

  return machines;
}