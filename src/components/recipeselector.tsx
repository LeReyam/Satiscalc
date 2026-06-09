import type { Recipe } from "../types";
import { items } from "../data/items";


type RecipeSelectorProps = {
  recipes: Recipe[];
  selectedRecipeId: string;
  amount: number;
  onRecipeChange: (id: string) => void;
  onAmountChange: (amount: number) => void;
};

export function Recipe_selector({
  recipes,
  selectedRecipeId,
  amount,
  onRecipeChange,
  onAmountChange,
}: RecipeSelectorProps) {

  function getRecipeDisplayName(recipe: Recipe) {
    const firstProduct = recipe.products[0];

    if (!firstProduct) {
      return recipe.name;
    }

    return (
      items.find((item) => item.id === firstProduct.item)?.name ?? recipe.name
    );
  }
  return (
    <section>
      <form>
        <label title="rezept">Wähle das Rezept:</label>

        <select
          name="rezept"
          id="rezept"
          value={selectedRecipeId}
          onChange={(event) => onRecipeChange(event.target.value)}
        >
          <option value="">Rezept auswählen</option>
          {recipes.map((recipe) => (
            <option key={recipe.className} value={recipe.className}>
              {getRecipeDisplayName(recipe)}
            </option>
          ))}
        </select>

        <label id="menge">Gebe die gewünschte Anzahl ein:</label>

        <p>
          <input
            type="number"
            value={amount}
            min="1"
            max="1000000"
            id="number"
            onChange={(event) => onAmountChange(Number(event.target.value))}
          />
          /min
        </p>
      </form>
    </section>
  );
}
