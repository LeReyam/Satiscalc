import type {
  PlannerResourceRow,
  ProductionPlanNode,
} from "../planner-types";

function addResource(
  resources: Map<string, PlannerResourceRow>,
  itemId: string,
  itemName: string,
  amountPerMinute: number
) {
  const existingResource = resources.get(itemId);

  if (existingResource) {
    existingResource.amountPerMinute += amountPerMinute;
    return;
  }

  resources.set(itemId, {
    itemId,
    itemName,
    amountPerMinute,
  });
}

export function collectBaseResources(
  tree: ProductionPlanNode
): PlannerResourceRow[] {
  const resources = new Map<string, PlannerResourceRow>();

  function walk(node: ProductionPlanNode) {
    if (
      node.stopReason === "base-resource" ||
      node.stopReason === "missing-recipe"
    ) {
      addResource(
        resources,
        node.itemId,
        node.itemName,
        node.amountPerMinute
      );
    }

    node.children.forEach(walk);
  }

  walk(tree);

  return Array.from(resources.values());
}

export function collectIntermediateResources(
  tree: ProductionPlanNode
): PlannerResourceRow[] {
  const resources = new Map<string, PlannerResourceRow>();

  function walk(node: ProductionPlanNode, isRoot = false) {
    node.children.forEach((child) => walk(child));

    if (!isRoot && !node.stopReason) {
      addResource(
        resources,
        node.itemId,
        node.itemName,
        node.amountPerMinute
      );
    }
  }

  walk(tree, true);

  return Array.from(resources.values());
}