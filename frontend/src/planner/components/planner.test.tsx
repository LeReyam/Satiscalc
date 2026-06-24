// planner.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Planner from "./planner";

import type { Factory, Item, Recipe } from "../../types";

// ─── Fixtures ────────────────────────────────────────────────────────────────

const items: Item[] = [
  { id: "iron-plate", name: "Eisenplatte" },
  { id: "iron-ore",   name: "Eisenerz"   },
];

const recipes: Recipe[] = [
  {
    className: "recipe-iron-plate",
    name: "Eisenplatten herstellen",
    duration: 2,
    ingredients: [{ item: "iron-ore", amount: 30 }],
    products:    [{ item: "iron-plate", amount: 30 }],
    producedIn: ["smelter"],
    customRecipe: false,
    inBuildGun: false,
  },
];

const factories: Factory[] = [
  { id: "smelter", name: "Schmelzofen" },
];

// ─── Mocks ───────────────────────────────────────────────────────────────────

vi.mock("../../components/recipeselector", () => ({
  default: ({ selectedRecipeId, amount, onRecipeChange, onAmountChange }: {
    selectedRecipeId: string;
    amount: number;
    onRecipeChange: (id: string) => void;
    onAmountChange: (n: number) => void;
  }) => (
    <div>
      <select
        aria-label="Rezept"
        value={selectedRecipeId}
        onChange={(e) => onRecipeChange(e.target.value)}
      >
        <option value="">-- wähle --</option>
        <option value="recipe-iron-plate">Eisenplatten</option>
      </select>
      <input
        aria-label="Menge"
        type="number"
        value={amount}
        onChange={(e) => onAmountChange(Number(e.target.value))}
      />
    </div>
  ),
}));

vi.mock("./productionplanner-output", () => ({
  default: () => <div>Produktionsplan Ausgabe</div>,
}));

vi.mock("./productionplanner-graph", () => ({
  default: () => <div>Produktionsgraph</div>,
}));

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("Planner Komponente", () => {

  it("zeigt Platzhaltertext wenn kein Rezept ausgewaehlt ist", () => {
    render(                                                        // Arrange
      <Planner
        recipes={recipes}
        items={items}
        factories={factories}
        selectedRecipeId=""
        amount={0}
        selectedRecipe={undefined}
        onRecipeChange={vi.fn()}
        onAmountChange={vi.fn()}
      />
    );
    const platzhalter = screen.getAllByText("Bitte wähle zuerst ein Rezept aus.");
    expect(platzhalter).toHaveLength(2);                           // Assert
  });

  it("zeigt Ausgabe und Graph wenn ein Rezept ausgewaehlt ist", () => {
    render(                                                        // Arrange
      <Planner
        recipes={recipes}
        items={items}
        factories={factories}
        selectedRecipeId="recipe-iron-plate"
        amount={30}
        selectedRecipe={recipes[0]}
        onRecipeChange={vi.fn()}
        onAmountChange={vi.fn()}
      />
    );
    expect(screen.getByText("Produktionsplan Ausgabe")).toBeInTheDocument(); // Assert
    expect(screen.getByText("Produktionsgraph")).toBeInTheDocument();        // Assert
  });

  it("ruft onRecipeChange auf wenn der Nutzer ein Rezept auswaehlt", () => {
    const handleRecipeChange = vi.fn();                            // Arrange
    render(
      <Planner
        recipes={recipes}
        items={items}
        factories={factories}
        selectedRecipeId=""
        amount={0}
        selectedRecipe={undefined}
        onRecipeChange={handleRecipeChange}
        onAmountChange={vi.fn()}
      />
    );

    fireEvent.change(                                              // Act
      screen.getByRole("combobox", { name: "Rezept" }),
      { target: { value: "recipe-iron-plate" } }
    );

    expect(handleRecipeChange).toHaveBeenCalledWith("recipe-iron-plate"); // Assert
  });

});
