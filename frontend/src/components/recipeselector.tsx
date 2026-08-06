import "./recipeselector.css";
//import IconSelect from "./icon-select";
import type { Item, Recipe } from "../types";

type RecipeSelectorProps = {
  recipes: Recipe[];
  items: Item[];
  selectedRecipeId: string;
  amount: number;
  onRecipeChange: (id: string) => void;
  onAmountChange: (amount: number) => void;
};

export default function Recipe_selector({
  recipes,
  items,
  selectedRecipeId,
  amount,
  onRecipeChange,
  onAmountChange,
}: RecipeSelectorProps) {
  function getRecipeDisplayName(recipe: Recipe) {
    if (recipe.customRecipe) {
      return recipe.name;
    }

    const firstProduct = recipe.products[0];

    if (!firstProduct) {
      return recipe.name;
    }

    return (
      items.find((item) => item.id === firstProduct.item)?.name ?? recipe.name
    );
  }

  return (
    <article className="recipe-selector">
      <form>
        <main className="form-row">
          <label htmlFor="rezept">Wähle das Rezept:</label>

          <select
            name="rezept"
            id="rezept"
            value={selectedRecipeId}
            onChange={(event) => onRecipeChange(event.target.value)}
          >
            <option value="">Rezept auswählen</option>

            {[...recipes]
              .filter((recipe) => recipe.name !== "N/A")
              .filter((recipe) => recipe.ingredients.length > 0)
              .filter((recipe) => recipe.products.length > 0)
              .filter((recipe) => recipe.producedIn.length > 0)
              .filter((recipe) => !recipe.inBuildGun)
              .filter((recipe) => !recipe.alternate)
              .sort((a, b) =>
                getRecipeDisplayName(a).localeCompare(
                  getRecipeDisplayName(b),
                  "de"
                )
              )
              .map((recipe) => (
                <option key={recipe.className} value={recipe.className}>
                  {getRecipeDisplayName(recipe)}
                </option>
              ))}
          </select>
        </main>

        <section className="form-row">
          <label htmlFor="number">Gebe die gewünschte Anzahl ein:</label>

          <p>
            <input
              type="number"
              value={amount}
              min="1"
              max="1000000"
              id="number"
              onChange={(event) =>
                onAmountChange(Number(event.target.value))
              }
            />
            /min
          </p>
        </section>
      </form>
    </article>
  );
}