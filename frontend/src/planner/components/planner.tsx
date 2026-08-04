import { useMemo } from "react";

import "./planner.css";

import type { Factory, Item, Recipe } from "../../types";
import Recipe_selector from "../../components/recipeselector";
import Productionplanner_output from "./productionplanner-output";
import Productionplanner_graph from "./productionplanner-graph";

import { calculateProductionPlan } from "../logic/calculate-production-plan";
import { buildGraph } from "../logic/build-graph";

type PlannerProps = {
  recipes: Recipe[];
  items: Item[];
  factories: Factory[];
  selectedRecipeId: string;
  amount: number;
  selectedRecipe: Recipe | undefined;
  onRecipeChange: (id: string) => void;
  onAmountChange: (amount: number) => void;
};

export default function Planner({
  recipes,
  items,
  factories,
  selectedRecipeId,
  amount,
  selectedRecipe,
  onRecipeChange,
  onAmountChange,
}: PlannerProps) {
  const productionPlan = useMemo(() => {
    if (!selectedRecipe) return undefined;

    return calculateProductionPlan({
      recipe: selectedRecipe,
      amountPerMinute: amount,
      recipes,
      items,
      factories,
    });
  }, [selectedRecipe, amount, recipes, items, factories]);

  const graph = useMemo(() => {
    if (!productionPlan) return undefined;

    return buildGraph(productionPlan);
  }, [productionPlan]);

  return (
    <main className="planner-layout">
      <section className="planner-selector planner-card">
        <Recipe_selector
          recipes={recipes}
          items={items}
          selectedRecipeId={selectedRecipeId}
          amount={amount}
          onRecipeChange={onRecipeChange}
          onAmountChange={onAmountChange}
        />
      </section>

      <article className="planner-output planner-card">
        {productionPlan ? (
          <Productionplanner_output plan={productionPlan} />
        ) : (
          <p>Bitte wähle zuerst ein Rezept aus.</p>
        )}
      </article>

      <section className="planner-graph planner-card">
        {productionPlan && graph ? (
          <Productionplanner_graph
            key={`${productionPlan.rootProductId}-${productionPlan.targetAmountPerMinute}`}
            graph={graph}
          />
        ) : (
          <p>Bitte wähle zuerst ein Rezept aus.</p>
        )}
      </section>
    </main>
  );
}