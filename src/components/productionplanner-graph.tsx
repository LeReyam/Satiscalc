import "./productionplanner-graph.css";

import {
  ReactFlow,
  Background,
  Controls,
  Position,
  useNodesState,
  useEdgesState,

  type Node,
  type Edge,
} from "@xyflow/react";

import {
  useEffect,
  useMemo,
  type ReactNode,
} from "react";

import "@xyflow/react/dist/style.css";
import dagre from "dagre";

import generatedRecipes from "../data/generated-recipes.json";

const NODE_WIDTH = 220;
const NODE_HEIGHT = 100;

type ItemAmount = {
  item: string;
  name: string;
  amount: number;
};

type GeneratedRecipe = {
  id: string;
  name: string;
  isAlternate: boolean;
  duration: number;
  factory: {
    id: string;
    name: string;
  };
  ingredients: ItemAmount[];
  products: ItemAmount[];
};

type GraphNodeData = {
  label: ReactNode;
};

type ProductionplannerGraphProps = {
  productId: string;
  amountPerMinute: number;
};

const recipes = generatedRecipes as GeneratedRecipe[];

const defaultRecipes = recipes.filter((recipe) => !recipe.isAlternate);

function findRecipeThatProduces(
  itemId: string,
  recipes: GeneratedRecipe[]
) {
  return recipes.find((recipe) =>
    recipe.products.some((product) => product.item === itemId)
  );
}

function getItemDisplayName(
  itemId: string,
  recipes: GeneratedRecipe[]
) {
  for (const recipe of recipes) {
    const allItems = [...recipe.ingredients, ...recipe.products];
    const item = allItems.find((entry) => entry.item === itemId);

    if (item) {
      return item.name;
    }
  }

  return itemId;
}

function getProductAmount(
  recipe: GeneratedRecipe,
  itemId: string
) {
  return (
    recipe.products.find((product) => product.item === itemId)
      ?.amount ?? 0
  );
}

function getProductionPerMinute(
  recipe: GeneratedRecipe,
  itemId: string
) {
  const productAmount = getProductAmount(recipe, itemId);

  if (productAmount === 0 || recipe.duration === 0) {
    return 0;
  }

  return (productAmount / recipe.duration) * 60;
}

function getRequiredMachines(
  recipe: GeneratedRecipe,
  productId: string,
  wantedAmountPerMinute: number
) {
  const productionPerMinute = getProductionPerMinute(
    recipe,
    productId
  );

  if (productionPerMinute === 0) {
    return 0;
  }

  return wantedAmountPerMinute / productionPerMinute;
}

function createFactoryGraphFromProduct(
  productId: string,
  amountPerMinute: number,
  recipes: GeneratedRecipe[]
) {
  const nodes: Node<GraphNodeData>[] = [];
  const edges: Edge[] = [];

  const addedNodes = new Set<string>();
  const addedEdges = new Set<string>();

  const visiting = new Set<string>();

  function addNode(id: string, label: ReactNode) {
    if (addedNodes.has(id)) return;

    addedNodes.add(id);

    nodes.push({
      id,
      position: { x: 0, y: 0 },
      targetPosition: Position.Left,
      sourcePosition: Position.Right,
      data: { label },
    });
  }

  function addEdge(id: string, source: string, target: string) {
    if (addedEdges.has(id)) return;

    addedEdges.add(id);

    edges.push({
      id,
      source,
      target,
    });
  }

  function walkProduct(itemId: string, wantedAmount: number): string {
    if (visiting.has(itemId)) {
      const cycleNodeId = `cycle-${itemId}`;
      const itemDisplayName = getItemDisplayName(itemId, recipes);

      addNode(
        cycleNodeId,
        <div>
          <strong>Zyklus erkannt</strong>
          <div>{itemDisplayName}</div>
          <div>Pfad wurde gestoppt</div>
        </div>
      );

      return cycleNodeId;
    }

    visiting.add(itemId);

    const recipe = findRecipeThatProduces(itemId, recipes);
    const itemDisplayName = getItemDisplayName(itemId, recipes);

    if (!recipe) {
      const baseItemNodeId = `base-${itemId}`;

      addNode(
        baseItemNodeId,
        <div>
          <strong>{itemDisplayName}</strong>
          <div>{wantedAmount.toFixed(2)} / min</div>
        </div>
      );

      visiting.delete(itemId);
      return baseItemNodeId;
    }

    const recipeNodeId = `recipe-${recipe.id}`;

    const machines = getRequiredMachines(
      recipe,
      itemId,
      wantedAmount
    );

    addNode(
      recipeNodeId,
      <div>
        <strong>{recipe.name}</strong>
        <div>Factory: {recipe.factory.name}</div>
        <div>Machines: {machines.toFixed(2)}</div>
        <div>Output: {wantedAmount.toFixed(2)} / min</div>
      </div>
    );

    const productAmount = getProductAmount(recipe, itemId);

    if (productAmount === 0) {
      visiting.delete(itemId);
      return recipeNodeId;
    }

    const multiplier = wantedAmount / productAmount;

    recipe.ingredients.forEach((ingredient) => {
      const neededIngredientAmount =
        ingredient.amount * multiplier;

      const sourceNodeId = walkProduct(
        ingredient.item,
        neededIngredientAmount
      );

      addEdge(
        `edge-${sourceNodeId}-${recipeNodeId}`,
        sourceNodeId,
        recipeNodeId
      );
    });

    visiting.delete(itemId);

    return recipeNodeId;
  }

  const finalProducerNodeId = walkProduct(
    productId,
    amountPerMinute
  );

  const finalProductNodeId = `final-${productId}`;
  const finalProductName = getItemDisplayName(productId, recipes);

  addNode(
    finalProductNodeId,
    <div>
      <strong>{finalProductName}</strong>
      <div>{amountPerMinute.toFixed(2)} / min</div>
    </div>
  );

  addEdge(
    `edge-${finalProducerNodeId}-${finalProductNodeId}`,
    finalProducerNodeId,
    finalProductNodeId
  );

  return { nodes, edges };
}

function getLayoutedNodes(
  nodes: Node<GraphNodeData>[],
  edges: Edge[]
) {
  const dagreGraph = new dagre.graphlib.Graph();

  dagreGraph.setDefaultEdgeLabel(() => ({}));

  dagreGraph.setGraph({
    rankdir: "LR",
    nodesep: 80,
    ranksep: 120,
  });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, {
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
    });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  return nodes.map((node) => {
    const layoutedNode = dagreGraph.node(node.id);

    return {
      ...node,
      position: {
        x: layoutedNode.x - NODE_WIDTH / 2,
        y: layoutedNode.y - NODE_HEIGHT / 2,
      },
    };
  });
}

export function Productionplanner_graph({
  productId,
  amountPerMinute,
}: ProductionplannerGraphProps) {
  const graph = useMemo(() => {
    if (!productId || amountPerMinute <= 0) {
      return {
        nodes: [] as Node<GraphNodeData>[],
        edges: [] as Edge[],
      };
    }

    const { nodes, edges } = createFactoryGraphFromProduct(
      productId,
      amountPerMinute,
      defaultRecipes
    );

    return {
      nodes: getLayoutedNodes(nodes, edges),
      edges,
    };
  }, [productId, amountPerMinute]);


  const [flowNodes, setFlowNodes, onNodesChange] =
    useNodesState(graph.nodes);

  const [flowEdges, setFlowEdges, onEdgesChange] =
    useEdgesState(graph.edges);

 
  useEffect(() => {
    setFlowNodes(graph.nodes);
    setFlowEdges(graph.edges);
  }, [graph.nodes, graph.edges, setFlowNodes, setFlowEdges]);

  if (!productId || amountPerMinute <= 0) {
    return (
      <div className="production-graph">
        Bitte Produkt und Menge auswählen.
      </div>
    );
  }

  return (
    <div className="production-graph">
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        minZoom={0.05}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}