import "./productionplanner-graph.css";

import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  useReactFlow,
} from "@xyflow/react";

import { useEffect, useRef, useState } from "react";

import "@xyflow/react/dist/style.css";

import type { PlannerGraph } from "../planner-types";

type ProductionPlannerGraphProps = {
  graph: PlannerGraph;
};

function ProductionplannerGraphContent({
  graph,
}: ProductionPlannerGraphProps) {
  const [flowNodes, setFlowNodes, onNodesChange] = useNodesState(graph.nodes);
  const [flowEdges, setFlowEdges, onEdgesChange] = useEdgesState(graph.edges);

  const [isReady, setIsReady] = useState(false);

  const hasFittedView = useRef(false);

  const { fitView } = useReactFlow();

  useEffect(() => {
    setIsReady(false);
    hasFittedView.current = false;

    setFlowNodes(graph.nodes);
    setFlowEdges(graph.edges);

    requestAnimationFrame(() => {
      if (hasFittedView.current) return;

      fitView({
        padding: 0.2,
        duration: 0,
        minZoom: 0.05,
        maxZoom: 1,
      });

      // Nach dem Layoutwechsel nochmals neu berechnen
      setTimeout(() => {
        window.dispatchEvent(new Event("resize"));

        fitView({
          padding: 0.2,
          duration: 0,
          minZoom: 0.05,
          maxZoom: 1,
        });

        hasFittedView.current = true;
        setIsReady(true);
      }, 100);
    });
  }, [graph, fitView, setFlowNodes, setFlowEdges]);

  return (
    <ReactFlow
      nodes={flowNodes}
      edges={flowEdges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      minZoom={0.05}
      style={{
        opacity: isReady ? 1 : 0,
        transition: "opacity 150ms ease",
      }}
    >
      <Background />
      <Controls />
    </ReactFlow>
  );
}

export default function Productionplanner_graph({
  graph,
}: ProductionPlannerGraphProps) {
  return (
    <article className="production-graph">
      <ReactFlowProvider>
        <ProductionplannerGraphContent graph={graph} />
      </ReactFlowProvider>
    </article>
  );
}