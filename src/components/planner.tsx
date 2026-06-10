import "./planner.css";

import type { Recipe } from "../types";
import { Recipe_selector } from "./recipeselector";
import { Productionplanner_output } from "./productionplanner-output";
import { Productionplanner_graph } from "./productionplanner-graph";

type PlannerProps = {
  recipes: Recipe[];
  selectedRecipeId: string;
  amount: number;
  selectedRecipe: Recipe | undefined;
  onRecipeChange: (id: string) => void;
  onAmountChange: (amount: number) => void;
};

export function Planner({
  recipes,
  selectedRecipeId,
  amount,
  selectedRecipe,
  onRecipeChange,
  onAmountChange,
}: PlannerProps) {
  return (
    <main className="planner-layout">
      <section className="planner-selector planner-card">
        <Recipe_selector
          recipes={recipes}
          selectedRecipeId={selectedRecipeId}
          amount={amount}
          onRecipeChange={onRecipeChange}
          onAmountChange={onAmountChange}
        />
      </section>

      <section className="planner-output planner-card">
        {selectedRecipe ? (
          <Productionplanner_output
            recipe={selectedRecipe}
            amount={amount}
          />
        ) : (
          <p>Bitte wähle zuerst ein Rezept aus.</p>
        )}
      </section>

      <section className="planner-graph planner-card">
        <Productionplanner_graph />
      </section>
    </main>
  );
}