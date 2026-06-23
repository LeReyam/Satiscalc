import type { Edge, Node } from "@xyflow/react";
import type { ReactNode } from "react";

export type StopReason = "base-resource" | "cycle" | "missing-recipe";

export type PlannerResourceRow = {
  itemId: string;
  itemName: string;
  amountPerMinute: number;
};

export type PlannerMachineRow = {
  recipeId: string;
  recipeName: string;
  factoryName: string;
  machines: number;
  outputItemId: string;
  outputItemName: string;
  outputAmountPerMinute: number;
};

export type ProductionPlanNode = {
  id: string;
  itemId: string;
  itemName: string;
  amountPerMinute: number;

  recipeId?: string;
  recipeName?: string;
  factoryName?: string;

  productAmountPerCycle?: number;
  productionPerMinute?: number;
  recipeMultiplier?: number;
  machines?: number;

  stopReason?: StopReason;

  children: ProductionPlanNode[];
};

export type ProductionPlan = {
  rootProductId: string;
  rootProductName: string;
  targetAmountPerMinute: number;

  baseResources: PlannerResourceRow[];
  intermediateResources: PlannerResourceRow[];
  machines: PlannerMachineRow[];

  tree: ProductionPlanNode;
};

export type GraphNodeData = {
  label: ReactNode;
};

export type PlannerGraph = {
  nodes: Node<GraphNodeData>[];
  edges: Edge[];
};