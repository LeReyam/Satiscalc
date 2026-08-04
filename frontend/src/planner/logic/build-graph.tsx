import { Position, type Edge, type Node } from "@xyflow/react";

import type { GraphNodeData, PlannerGraph, ProductionPlan, ProductionPlanNode } from "../planner-types";
import { getLayoutedNodes } from "./graph-layout";

export function buildGraph(plan: ProductionPlan): PlannerGraph {
  const nodes: Node<GraphNodeData>[] = [];
  const edges: Edge[] = [];

  function addNode(node: ProductionPlanNode) {
    nodes.push({
      id: node.id,
      position: { x: 0, y: 0 },
      targetPosition: Position.Left,
      sourcePosition: Position.Right,
      data: {
        label: (
          <figure>
            <strong>{node.itemName}</strong>
            <section>{node.amountPerMinute.toFixed(2)} / min</section>

            {node.recipeName && <aside>Rezept: {node.recipeName}</aside>}
            {node.factoryName && <aside>Fabrik: {node.factoryName}</aside>}

            {node.machines !== undefined && (
              <figcaption>Maschinen: {node.machines.toFixed(2)}</figcaption>
            )}

            {node.stopReason === "base-resource" && <figcaption>Basis-Ressource</figcaption>}
            {node.stopReason === "cycle" && <figcaption>Zyklus erkannt</figcaption>}
            {node.stopReason === "missing-recipe" && <figcaption>Kein Rezept gefunden</figcaption>}
          </figure>
        ),
      },
    });
  }

  function walk(node: ProductionPlanNode) {
    addNode(node);

    node.children.forEach((child) => {
      walk(child);

      edges.push({
        id: `edge-${child.id}-${node.id}`,
        source: child.id,
        target: node.id,
      });
    });
  }

  walk(plan.tree);

  return {
    nodes: getLayoutedNodes(nodes, edges),
    edges,
  };
}