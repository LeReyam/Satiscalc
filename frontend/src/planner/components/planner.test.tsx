import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

import Planner from "./planner";
import { calculateProductionPlan } from "../logic/calculate-production-plan";
import { buildGraph } from "../logic/build-graph";
import type { Factory, Item, Recipe } from "../../types";

// --- Mocks für Logik-Funktionen ---
vi.mock("../logic/calculate-production-plan", () => ({
  calculateProductionPlan: vi.fn(),
}));

vi.mock("../logic/build-graph", () => ({
  buildGraph: vi.fn(),
}));

// --- Mocks für Kind-Komponenten ---
vi.mock("../../components/recipeselector", () => ({
  default: (props: any) => (
    <div data-testid="recipe-selector">
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

const mockRecipe: Recipe = {
  className: "recipe1",
  name: "Iron Unsmelting",
  duration: 2,
  ingredients: [{ item: "iron_plate", amount: 1 }],
  products: [{ item: "iron_ore", amount: 1 }],
  producedIn: ["smelter"],
  customRecipe: true,
  inBuildGun: false,
};
const mockItems: Item[] = [];
const mockFactories: Factory[] = [];
const mockRecipes: Recipe[] = [mockRecipe];

const baseProps = {
  recipes: mockRecipes,
  items: mockItems,
  factories: mockFactories,
  selectedRecipeId: "recipe1",
  amount: 10,
  onRecipeChange: vi.fn(),
  onAmountChange: vi.fn(),
};

describe("<Planner />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("zeigt in Output- und Graph-Bereich den Platzhaltertext, solange kein Rezept ausgewählt ist", () => {
    render(<Planner {...baseProps} selectedRecipe={undefined} />);

    expect(calculateProductionPlan).not.toHaveBeenCalled();
    expect(buildGraph).not.toHaveBeenCalled();

    const placeholders = screen.getAllByText(
      "Bitte wähle zuerst ein Rezept aus."
    );
    expect(placeholders).toHaveLength(2);

    expect(screen.queryByTestId("planner-output")).not.toBeInTheDocument();
    expect(screen.queryByTestId("planner-graph")).not.toBeInTheDocument();
  });

  it("berechnet Produktionsplan und Graph, sobald ein Rezept ausgewählt ist", () => {
    const plan = {
      rootProductId: "item-1",
      targetAmountPerMinute: 10,
      steps: [],
    };
    const graph = { nodes: [], edges: [] };

    (calculateProductionPlan as any).mockReturnValue(plan);
    (buildGraph as any).mockReturnValue(graph);

    render(<Planner {...baseProps} selectedRecipe={mockRecipe} />);

    expect(calculateProductionPlan).toHaveBeenCalledWith({
      recipe: mockRecipe,
      amountPerMinute: 10,
      recipes: mockRecipes,
      items: mockItems,
      factories: mockFactories,
    });
    expect(buildGraph).toHaveBeenCalledWith(plan);

    expect(screen.getByTestId("planner-output")).toHaveTextContent(
      JSON.stringify(plan)
    );
    expect(screen.getByTestId("planner-graph")).toHaveTextContent(
      JSON.stringify(graph)
    );
  });

  it("zeigt weiterhin den Platzhalter im Graph-Bereich, wenn buildGraph undefined liefert, obwohl ein Plan existiert", () => {
    const plan = {
      rootProductId: "item-1",
      targetAmountPerMinute: 10,
      steps: [],
    };
    (calculateProductionPlan as any).mockReturnValue(plan);
    (buildGraph as any).mockReturnValue(undefined);

    render(<Planner {...baseProps} selectedRecipe={mockRecipe} />);

    expect(screen.getByTestId("planner-output")).toBeInTheDocument();
    expect(screen.queryByTestId("planner-graph")).not.toBeInTheDocument();
    expect(
      screen.getByText("Bitte wähle zuerst ein Rezept aus.")
    ).toBeInTheDocument();
  });

  it("leitet Nutzerinteraktionen aus dem Recipe_selector an die übergebenen Callbacks weiter", async () => {
    const user = userEvent.setup();
    const onRecipeChange = vi.fn();
    const onAmountChange = vi.fn();

    render(
      <Planner
        {...baseProps}
        selectedRecipe={undefined}
        onRecipeChange={onRecipeChange}
        onAmountChange={onAmountChange}
      />
    );

    await user.click(screen.getByText("change-recipe"));
    await user.click(screen.getByText("change-amount"));

    expect(onRecipeChange).toHaveBeenCalledWith("recipe-2");
    expect(onAmountChange).toHaveBeenCalledWith(42);
  });

  it("memoisiert calculateProductionPlan und berechnet nur bei relevanten Prop-Änderungen neu", () => {
    const plan = {
      rootProductId: "item-1",
      targetAmountPerMinute: 10,
      steps: [],
    };
    (calculateProductionPlan as any).mockReturnValue(plan);
    (buildGraph as any).mockReturnValue({ nodes: [], edges: [] });

    const { rerender } = render(
      <Planner {...baseProps} selectedRecipe={mockRecipe} />
    );
    expect(calculateProductionPlan).toHaveBeenCalledTimes(1);

    // Identische Props -> useMemo greift, kein erneuter Aufruf
    rerender(<Planner {...baseProps} selectedRecipe={mockRecipe} />);
    expect(calculateProductionPlan).toHaveBeenCalledTimes(1);

    // amount ändert sich -> Neuberechnung erwartet
    rerender(<Planner {...baseProps} selectedRecipe={mockRecipe} amount={20} />);
    expect(calculateProductionPlan).toHaveBeenCalledTimes(2);
  });

  it("setzt den React-key des Graphen aus rootProductId und targetAmountPerMinute zusammen (erzwingt Remount bei Änderung)", () => {
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
    (calculateProductionPlan as any)
      .mockReturnValueOnce(planA)
      .mockReturnValueOnce(planB);
    (buildGraph as any).mockReturnValue({ nodes: [], edges: [] });

    const { rerender } = render(
      <Planner {...baseProps} selectedRecipe={mockRecipe} />
    );
    expect(screen.getByTestId("planner-graph")).toBeInTheDocument();

    rerender(<Planner {...baseProps} selectedRecipe={mockRecipe} amount={20} />);
    expect(screen.getByTestId("planner-graph")).toBeInTheDocument();
  });
});