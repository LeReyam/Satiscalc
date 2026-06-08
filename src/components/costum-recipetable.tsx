import type { Recipe } from "../types";

type CostumRecipetableProps =  {
  recipes: Recipe[];
  onCreateRecipe: () => void;
  onEditRecipe: (id: string) => void;
  onDeleteRecipe: (id: string) => void
}

export function Costum_recipetable({
  recipes,
  onCreateRecipe,
  onEditRecipe,
  onDeleteRecipe,
}: CostumRecipetableProps) {
  return (
    <main title="planner">
      <section>
        <button type="button" onClick={onCreateRecipe}>
          Neues Rezept erstellen
        </button>

        <div className="table-wrapper">
          <table className="table-info">
            <caption>Costum-Rezepte</caption>

            <thead>
              <tr>
                <th>Name</th>
                <th>Eingabe</th>
                <th>Ausgabe</th>
                <th>Fabrik</th>
                <th>Aktionen</th>
              </tr>
            </thead>

            <tbody>
              {recipes.map((recipe) =>
                <tr key={recipe.id}>
                  <td>{recipe.name}</td>
                  <td>
                    {recipe.inputAmount}x {recipe.input}
                  </td>
                  <td>
                    {recipe.outputAmount}x {recipe.output}
                  </td>
                  <td>{recipe.machine}</td>
                  <td>
                    <button type="button" onClick={() => onEditRecipe(recipe.id)}>Bearbeiten</button>
                    <button type="button" onClick={() => onDeleteRecipe(recipe.id)}>Löschen</button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
