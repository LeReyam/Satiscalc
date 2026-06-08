import type { Recipe } from "../types";
import { items } from "../data/items";
import { factories } from "../data/factories";

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

  function getItemName(itemId: string) {
    return items.find((item) => item.id === itemId)?.name ?? itemId;
  }

  function getFactoryName(factoryId: string) {
    return factories.find((factory) => factory.id === factoryId)?.name ?? factoryId;
  }

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
                <th>Rezeptname</th>
                <th>Eingabe</th>
                <th>Ausgabe</th>
                <th>Fabrik</th>
                <th>Aktionen</th>
              </tr>
            </thead>

           <tbody>
            {recipes.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  Noch keine eigenen Rezepte vorhanden.
                </td>
              </tr>
            ) : (
              recipes.map((recipe) => (
                <tr key={recipe.id}>
                  <td>{recipe.name}</td>
                  <td>
                    <p>{recipe.inputAmount}x {getItemName(recipe.input)}</p>
                  </td>
                  <td>
                    <p>{recipe.outputAmount}x {getItemName(recipe.output)}</p>
                  </td>
                  <td>{getFactoryName(recipe.machine)}</td>
                  <td>
                    <button type="button" onClick={() => onEditRecipe(recipe.id)}>Bearbeiten</button>
                    <button type="button" onClick={() => onDeleteRecipe(recipe.id)}>Löschen</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
