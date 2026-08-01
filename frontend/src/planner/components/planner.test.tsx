import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import Planner from "./planner";

// CSS side-effect import — no-op in tests
vi.mock("./planner.css", () => ({}));

// --- Mocks for child components ------------------------------------------
// We stub these out with simple markup that exposes the props they were
// given, so we can assert on Planner's wiring/composition logic in
// isolation from the children's own rendering behavior.

vi.mock("../../components/recipeselector", () => ({
  default: (props: any) => (
    <div data-testid="recipe-selector">
      <span data-testid="selected-recipe-id">{props.selectedRecipeId}</span>
      <span data-testid="amount">{props.amount}</span>
      <button onClick={() => props.onRecipeChange("recipe-2")}>
        change-recipe
      </button>
      <button onClick={() => props.onAmountChange(42)}>change-amount</button>
    </div>
  ),
}));

vi.mock("./productionplanner-output", () => ({
  default: (props: any) => (
    <div data-testid="planner-output">{JSON.stringify(props.plan)}</div>
  ),
}));

vi.mock("./productionplanner-graph", () => ({
  default: (props: any) => (
    <div data-testid="planner-graph">{JSON.stringify(props.graph)}</div>
  ),
}));

// --- Mocks for the pure logic functions ----------------------------------

const calculateProductionPlanMock = vi.fn();
const buildGraphMock = vi.fn();

vi.mock("../logic/calculate-production-plan", () => ({
  calculateProductionPlan: (...args: any[]) =>
    calculateProductionPlanMock(...args),
}));

vi.mock("../logic/build-graph", () => ({
  buildGraph: (...args: any[]) => buildGraphMock(...args),
}));

// --- Fixtures --------------------------------------------------------------

const recipe = { id: "recipe-1", name: "Recipe 1" } as any;
const items = [{ id: "item-1", name: "Item 1" }] as any;
const factories = [{ id: "factory-1", name: "Factory 1" }] as any;
const recipes = [recipe, { id: "recipe-2", name: "Recipe 2" }] as any;

const baseProps = {
  recipes,
  items,
  factories,
  selectedRecipeId: recipe.id,
  amount: 10,
  selectedRecipe: recipe,
  onRecipeChange: vi.fn(),
  onAmountChange: vi.fn(),
};

const fallbackText = "Bitte wähle zuerst ein Rezept aus.";

describe("Planner", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the recipe selector with the current selection and amount", () => {
    render(<Planner {...baseProps} selectedRecipe={undefined} />);

    expect(screen.getByTestId("recipe-selector")).toBeInTheDocument();
    expect(screen.getByTestId("selected-recipe-id")).toHaveTextContent(
      recipe.id,
    );
    expect(screen.getByTestId("amount")).toHaveTextContent("10");
  });

  it("shows fallback copy in both output and graph sections when no recipe is selected", () => {
    render(<Planner {...baseProps} selectedRecipe={undefined} />);

    expect(calculateProductionPlanMock).not.toHaveBeenCalled();
    expect(buildGraphMock).not.toHaveBeenCalled();
    expect(screen.queryByTestId("planner-output")).not.toBeInTheDocument();
    expect(screen.queryByTestId("planner-graph")).not.toBeInTheDocument();
    expect(screen.getAllByText(fallbackText)).toHaveLength(2);
  });

  it("computes the production plan and graph when a recipe is selected", () => {
    const plan = {
      rootProductId: "item-1",
      targetAmountPerMinute: 10,
      steps: [],
    };
    const graph = { nodes: [], edges: [] };
    calculateProductionPlanMock.mockReturnValue(plan);
    buildGraphMock.mockReturnValue(graph);

    render(<Planner {...baseProps} />);

    expect(calculateProductionPlanMock).toHaveBeenCalledWith({
      recipe,
      amountPerMinute: baseProps.amount,
      recipes,
      items,
      factories,
    });
    expect(buildGraphMock).toHaveBeenCalledWith(plan);

    expect(screen.getByTestId("planner-output")).toHaveTextContent(
      JSON.stringify(plan),
    );
    expect(screen.getByTestId("planner-graph")).toHaveTextContent(
      JSON.stringify(graph),
    );
    expect(screen.queryByText(fallbackText)).not.toBeInTheDocument();
  });

  it("shows the output but falls back on the graph if buildGraph returns nothing", () => {
    const plan = {
      rootProductId: "item-1",
      targetAmountPerMinute: 10,
      steps: [],
    };
    calculateProductionPlanMock.mockReturnValue(plan);
    buildGraphMock.mockReturnValue(undefined);

    render(<Planner {...baseProps} />);

    expect(screen.getByTestId("planner-output")).toBeInTheDocument();
    expect(screen.queryByTestId("planner-graph")).not.toBeInTheDocument();
    expect(screen.getByText(fallbackText)).toBeInTheDocument();
  });

  it("does not build a graph when calculateProductionPlan returns undefined", () => {
    calculateProductionPlanMock.mockReturnValue(undefined);

    render(<Planner {...baseProps} />);

    expect(calculateProductionPlanMock).toHaveBeenCalledTimes(1);
    expect(buildGraphMock).not.toHaveBeenCalled();
    expect(screen.queryByTestId("planner-output")).not.toBeInTheDocument();
    expect(screen.queryByTestId("planner-graph")).not.toBeInTheDocument();
    expect(screen.getAllByText(fallbackText)).toHaveLength(2);
  });

  it("forwards onRecipeChange and onAmountChange to the recipe selector", () => {
    const onRecipeChange = vi.fn();
    const onAmountChange = vi.fn();
    calculateProductionPlanMock.mockReturnValue(undefined);

    render(
      <Planner
        {...baseProps}
        selectedRecipe={undefined}
        onRecipeChange={onRecipeChange}
        onAmountChange={onAmountChange}
      />,
    );

    screen.getByText("change-recipe").click();
    screen.getByText("change-amount").click();

    expect(onRecipeChange).toHaveBeenCalledWith("recipe-2");
    expect(onAmountChange).toHaveBeenCalledWith(42);
  });

  it("memoizes the production plan and does not recompute on an unrelated rerender", () => {
    const plan = {
      rootProductId: "item-1",
      targetAmountPerMinute: 10,
      steps: [],
    };
    const graph = { nodes: [], edges: [] };
    calculateProductionPlanMock.mockReturnValue(plan);
    buildGraphMock.mockReturnValue(graph);

    const { rerender } = render(<Planner {...baseProps} />);
    expect(calculateProductionPlanMock).toHaveBeenCalledTimes(1);
    expect(buildGraphMock).toHaveBeenCalledTimes(1);

    // Re-render with the exact same prop values/references — useMemo
    // should skip recomputation since none of its dependencies changed.
    rerender(<Planner {...baseProps} />);

    expect(calculateProductionPlanMock).toHaveBeenCalledTimes(1);
    expect(buildGraphMock).toHaveBeenCalledTimes(1);
  });

  it("recomputes the production plan and graph when the amount changes", () => {
    // Return a *new* object each call — calculateProductionPlan is a pure
    // function in practice, so each recomputation yields a fresh reference.
    // Reusing the same object here would make useMemo's dependency check
    // for `graph` (which depends on `[productionPlan]`) see no change.
    calculateProductionPlanMock.mockImplementation(({ amountPerMinute }) => ({
      rootProductId: "item-1",
      targetAmountPerMinute: amountPerMinute,
      steps: [],
    }));
    buildGraphMock.mockReturnValue({ nodes: [], edges: [] });

    const { rerender } = render(<Planner {...baseProps} />);
    expect(calculateProductionPlanMock).toHaveBeenCalledTimes(1);

    rerender(<Planner {...baseProps} amount={20} />);

    expect(calculateProductionPlanMock).toHaveBeenCalledTimes(2);
    expect(calculateProductionPlanMock).toHaveBeenLastCalledWith(
      expect.objectContaining({ amountPerMinute: 20 }),
    );
    // productionPlan changed identity (new mock call), so the graph
    // should be rebuilt too.
    expect(buildGraphMock).toHaveBeenCalledTimes(2);
  });

  it("renders distinct graph output for distinct production plans", () => {
    const planA = {
      rootProductId: "item-1",
      targetAmountPerMinute: 10,
      steps: [],
    };
    const planB = {
      rootProductId: "item-2",
      targetAmountPerMinute: 20,
      steps: [],
    };
    calculateProductionPlanMock
      .mockReturnValueOnce(planA)
      .mockReturnValueOnce(planB);
    buildGraphMock
      .mockReturnValueOnce({ nodes: ["a"], edges: [] })
      .mockReturnValueOnce({ nodes: ["b"], edges: [] });

    const { rerender } = render(<Planner {...baseProps} />);
    expect(screen.getByTestId("planner-graph")).toHaveTextContent(
      JSON.stringify({ nodes: ["a"], edges: [] }),
    );

    rerender(
      <Planner
        {...baseProps}
        selectedRecipe={{ ...recipe, id: "recipe-2" }}
      />,
    );
    expect(screen.getByTestId("planner-graph")).toHaveTextContent(
      JSON.stringify({ nodes: ["b"], edges: [] }),
    );
  });
});