import type { Edge, Node } from "@xyflow/react";
import dagre from "dagre";

import type { GraphNodeData } from "../planner-types";

const NODE_WIDTH = 220;
const NODE_HEIGHT = 100;

export function getLayoutedNodes(
  nodes: Node<GraphNodeData>[],
  edges: Edge[]
): Node<GraphNodeData>[] {
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