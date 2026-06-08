
import type { Recipe } from "../types";

type ProductionplannerOutputProps = {
  recipe: Recipe;
  amount: number;
};

export function Productionplanner_output({
    recipe,
    amount,
  }: ProductionplannerOutputProps) {
    return (
      <section id="reqi">
        <h2>Berechnung für {recipe.name}</h2>

        Liste von Ressourcen:
        <ul>
          <li>
            {recipe.inputAmount * amount}x {recipe.input}
          </li>
        </ul>

        Liste von Fabriken:
        <ul>
          <li>{recipe.machine}</li>
        </ul>

        Ergebnis:
        <ul>
          <li>
            {recipe.outputAmount * amount}x {recipe.output}
          </li>
        </ul>
      </section>
    );
}
