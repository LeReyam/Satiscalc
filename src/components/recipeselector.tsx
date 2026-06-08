import type { Recipe } from "../types";


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
          {recipes.map((recipe) => (
            <option key={recipe.id} value={recipe.id}>
              {recipe.name}
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
          /s
        </p>
      </form>
    </section>
  );
}
