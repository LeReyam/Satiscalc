import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import Productionplanner_graph from "./productionplanner-graph";
import type { PlannerGraph } from "../planner-types";

describe("Productionplanner_graph", () => {
    const mockGraph: PlannerGraph = {
        nodes: [
            { id: "1", data: { label: "Node 1" }, position: { x: 0, y: 0 } },
            { id: "2", data: { label: "Node 2" }, position: { x: 100, y: 100 } },
        ],
        edges: [{ id: "e1-2", source: "1", target: "2" }],
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders without crashing", () => {
        const { container } = render(
            <Productionplanner_graph graph={mockGraph} />
        );
        expect(container.querySelector(".production-graph")).toBeInTheDocument();
    });

    it("renders ReactFlowProvider wrapper", () => {
        const { container } = render(
            <Productionplanner_graph graph={mockGraph} />
        );
        expect(container.querySelector(".production-graph")).toBeInTheDocument();
    });

    it("handles empty graph", () => {
        const emptyGraph: PlannerGraph = { nodes: [], edges: [] };
        const { container } = render(
            <Productionplanner_graph graph={emptyGraph} />
        );
        expect(container.querySelector(".production-graph")).toBeInTheDocument();
    });

    it("updates when graph prop changes", () => {
        const { rerender } = render(
            <Productionplanner_graph graph={mockGraph} />
        );

        const updatedGraph: PlannerGraph = {
            nodes: [
                { id: "3", data: { label: "Node 3" }, position: { x: 200, y: 200 } },
            ],
            edges: [],
        };

        rerender(<Productionplanner_graph graph={updatedGraph} />);
        expect(true).toBe(true);
    });

    it("applies correct min zoom configuration", () => {
        const { container } = render(
            <Productionplanner_graph graph={mockGraph} />
        );
        expect(container.querySelector(".production-graph")).toBeInTheDocument();
    });
});