import "./productionplanner-graph.css";

import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";

import { useEffect } from "react";

import "@xyflow/react/dist/style.css";

import type { PlannerGraph } from "../planner-types";

type ProductionPlannerGraphProps = {
  graph: PlannerGraph;
};

export default function Productionplanner_graph({
  graph,
}: ProductionPlannerGraphProps) {
  const [flowNodes, setFlowNodes, onNodesChange] = useNodesState(graph.nodes);
  const [flowEdges, setFlowEdges, onEdgesChange] = useEdgesState(graph.edges);

  useEffect(() => {
    setFlowNodes(graph.nodes);
    setFlowEdges(graph.edges);
  }, [graph.nodes, graph.edges, setFlowNodes, setFlowEdges]);

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