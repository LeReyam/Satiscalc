import type {
  PlannerMachineRow,
  ProductionPlanNode,
} from "../planner-types";

export function collectMachines(
  tree: ProductionPlanNode
): PlannerMachineRow[] {
  const machinesByFactory = new Map<string, PlannerMachineRow>();

  function walk(node: ProductionPlanNode) {
    if (
      node.recipeId &&
      node.recipeName &&
      node.factoryName &&
      node.machines !== undefined
    ) {
      const existingMachine = machinesByFactory.get(node.factoryName);

      if (existingMachine) {
        existingMachine.machines += node.machines;
      } else {
        machinesByFactory.set(node.factoryName, {
          recipeId: node.recipeId,
          recipeName: node.factoryName,
          factoryName: node.factoryName,
          machines: node.machines,
          outputItemId: node.itemId,
          outputItemName: node.itemName,
          outputAmountPerMinute: node.amountPerMinute,
        });
      }
    }

    node.children.forEach(walk);
  }

  walk(tree);

  return Array.from(machinesByFactory.values());
}