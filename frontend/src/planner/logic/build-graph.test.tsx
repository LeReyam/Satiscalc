import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import type { Edge, Node } from "@xyflow/react";

import { buildGraph } from "./build-graph";
import type { GraphNodeData, ProductionPlan, ProductionPlanNode } from "../planner-types";

// The layout algorithm (dagre/elk/etc.) is an implementation detail of
// getLayoutedNodes and is tested separately. Here we just want to verify
// that buildGraph hands it the right nodes/edges, so we stub it out as an
// identity function and assert on what it was called with.
vi.mock("./graph-layout", () => ({
  getLayoutedNodes: vi.fn((nodes: Node<GraphNodeData>[]) => nodes),
}));

import { getLayoutedNodes } from "./graph-layout";

function makeNode(overrides: Partial<ProductionPlanNode>): ProductionPlanNode {
  return {
    id: "node-id",
    itemName: "Iron Plate",
    amountPerMinute: 30,
    children: [],
    ...overrides,
  } as ProductionPlanNode;
}

function renderLabel(node: Node<GraphNodeData>): string {
  return renderToStaticMarkup(node.data.label as React.ReactElement);
}

describe("buildGraph", () => {
  beforeEach(() => {
    vi.mocked(getLayoutedNodes).mockClear();
    // mockClear alone would still leave a stale return value from a
    // previous mockReturnValueOnce; reset to the identity default here.
    vi.mocked(getLayoutedNodes).mockImplementation((nodes: Node<GraphNodeData>[]) => nodes);
  });

  it("creates a single node with no edges for a plan with no children", () => {
    const plan: ProductionPlan = {
      tree: makeNode({ id: "root", itemName: "Iron Plate", amountPerMinute: 30 }),
    } as ProductionPlan;

    const graph = buildGraph(plan);

    expect(graph.nodes).toHaveLength(1);
    expect(graph.nodes[0].id).toBe("root");
    expect(graph.edges).toHaveLength(0);
  });

  it("walks children depth-first and creates one node per tree node", () => {
    const plan: ProductionPlan = {
      tree: makeNode({
        id: "root",
        children: [
          makeNode({ id: "child-a", children: [makeNode({ id: "grandchild", children: [] })] }),
          makeNode({ id: "child-b", children: [] }),
        ],
      }),
    } as ProductionPlan;

    const graph = buildGraph(plan);

    const ids = graph.nodes.map((n) => n.id);
    expect(ids).toHaveLength(4);
    expect(ids).toEqual(expect.arrayContaining(["root", "child-a", "child-b", "grandchild"]));
  });

  it("creates edges pointing from each child to its parent", () => {
    const plan: ProductionPlan = {
      tree: makeNode({
        id: "root",
        children: [makeNode({ id: "child-a", children: [] })],
      }),
    } as ProductionPlan;

    const graph = buildGraph(plan);

    expect(graph.edges).toEqual<Edge[]>([
      { id: "edge-child-a-root", source: "child-a", target: "root" },
    ]);
  });

  it("produces one edge per parent-child relationship, matching node count - 1 for a tree", () => {
    const plan: ProductionPlan = {
      tree: makeNode({
        id: "root",
        children: [
          makeNode({ id: "child-a", children: [makeNode({ id: "grandchild", children: [] })] }),
          makeNode({ id: "child-b", children: [] }),
        ],
      }),
    } as ProductionPlan;

    const graph = buildGraph(plan);

    expect(graph.edges).toHaveLength(graph.nodes.length - 1);
  });

  it("sets targetPosition/sourcePosition for left-to-right layout", () => {
    const plan: ProductionPlan = { tree: makeNode({ id: "root" }) } as ProductionPlan;

    const graph = buildGraph(plan);

    expect(graph.nodes[0].targetPosition).toBe("left");
    expect(graph.nodes[0].sourcePosition).toBe("right");
  });

  it("renders item name and amount per minute in the label", () => {
    const plan: ProductionPlan = {
      tree: makeNode({ id: "root", itemName: "Screws", amountPerMinute: 12.345 }),
    } as ProductionPlan;

    const graph = buildGraph(plan);
    const html = renderLabel(graph.nodes[0]);

    expect(html).toContain("Screws");
    expect(html).toContain("12.35 / min"); // toFixed(2) rounding
  });

  it("only renders recipe/factory/machines info when present", () => {
    const plan: ProductionPlan = {
      tree: makeNode({
        id: "root",
        recipeName: "Iron Plate Recipe",
        factoryName: "Factory 1",
        machines: 2.5,
      }),
    } as ProductionPlan;

    const graph = buildGraph(plan);
    const html = renderLabel(graph.nodes[0]);

    expect(html).toContain("Rezept: Iron Plate Recipe");
    expect(html).toContain("Fabrik: Factory 1");
    expect(html).toContain("Maschinen: 2.50");
  });

  it("omits recipe/factory/machines info when absent", () => {
    const plan: ProductionPlan = { tree: makeNode({ id: "root" }) } as ProductionPlan;

    const graph = buildGraph(plan);
    const html = renderLabel(graph.nodes[0]);

    expect(html).not.toContain("Rezept:");
    expect(html).not.toContain("Fabrik:");
    expect(html).not.toContain("Maschinen:");
  });

  it.each([
    ["base-resource", "Basis-Ressource"],
    ["cycle", "Zyklus erkannt"],
    ["missing-recipe", "Kein Rezept gefunden"],
  ] as const)("renders the correct stop-reason label for %s", (stopReason, expectedText) => {
    const plan: ProductionPlan = {
      tree: makeNode({ id: "root", stopReason }),
    } as ProductionPlan;

    const graph = buildGraph(plan);
    const html = renderLabel(graph.nodes[0]);

    expect(html).toContain(expectedText);
  });

  it("passes the constructed nodes and edges to getLayoutedNodes", () => {
    const plan: ProductionPlan = {
      tree: makeNode({ id: "root", children: [makeNode({ id: "child-a", children: [] })] }),
    } as ProductionPlan;

    buildGraph(plan);

    expect(getLayoutedNodes).toHaveBeenCalledTimes(1);
    const [nodesArg, edgesArg] = vi.mocked(getLayoutedNodes).mock.calls[0];
    expect(nodesArg.map((n: Node<GraphNodeData>) => n.id)).toEqual(
      expect.arrayContaining(["root", "child-a"]),
    );
    expect(edgesArg).toEqual([{ id: "edge-child-a-root", source: "child-a", target: "root" }]);
  });

  it("uses the layouted nodes returned by getLayoutedNodes as the final node positions", () => {
    const layouted: Node<GraphNodeData>[] = [
      {
        id: "root",
        position: { x: 100, y: 200 },
        data: { label: <span /> },
      },
    ];
    vi.mocked(getLayoutedNodes).mockReturnValueOnce(layouted);

    const plan: ProductionPlan = { tree: makeNode({ id: "root" }) } as ProductionPlan;
    const graph = buildGraph(plan);

    expect(graph.nodes).toBe(layouted);
  });
});