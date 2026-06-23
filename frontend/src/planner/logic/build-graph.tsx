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
          <div>
            <strong>{node.itemName}</strong>
            <div>{node.amountPerMinute.toFixed(2)} / min</div>

            {node.recipeName && <div>Rezept: {node.recipeName}</div>}
            {node.factoryName && <div>Fabrik: {node.factoryName}</div>}

            {node.machines !== undefined && (
              <div>Maschinen: {node.machines.toFixed(2)}</div>
            )}

            {node.stopReason === "base-resource" && <div>Basis-Ressource</div>}
            {node.stopReason === "cycle" && <div>Zyklus erkannt</div>}
            {node.stopReason === "missing-recipe" && <div>Kein Rezept gefunden</div>}
          </div>
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