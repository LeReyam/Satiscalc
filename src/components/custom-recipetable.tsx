import "./custom-recipetable.css";
import type { Recipe } from "../types";
import { items } from "../data/items";
import { factories } from "../data/factories";

type CustomRecipetableProps = {
  recipes: Recipe[];
  onCreateRecipe: () => void;
  onEditRecipe: (className: string) => void;
  onDeleteRecipe: (className: string) => void;
};

export function Custom_recipetable({
  recipes,
  onCreateRecipe,
  onEditRecipe,
  onDeleteRecipe,
}: CustomRecipetableProps) {
  const customRecipes = recipes.filter((recipe) => recipe.customRecipe);

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
            <caption>Custom-Rezepte</caption>

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
              {customRecipes.length === 0 ? (
                <tr>
                  <td colSpan={5}>Noch keine eigenen Rezepte vorhanden.</td>
                </tr>
              ) : (
                customRecipes.map((recipe) => (
                  <tr key={recipe.className}>
                    <td>{recipe.name}</td>

                    <td>
                      {recipe.ingredients.map((ingredient) => (
                        <p key={ingredient.item}>
                          {ingredient.amount}x {getItemName(ingredient.item)}
                        </p>
                      ))}
                    </td>

                    <td>
                      {recipe.products.map((product) => (
                        <p key={product.item}>
                          {product.amount}x {getItemName(product.item)}
                        </p>
                      ))}
                    </td>

                    <td>
                      {recipe.producedIn.map((factoryId) =>
                        (<p key={factoryId}>{getFactoryName(factoryId)}</p>
                      ))}
                    </td>
                    <td>
                      <button type="button" onClick={() => onEditRecipe(recipe.className)}>Bearbeiten</button>
                      <button type="button" onClick={() => onDeleteRecipe(recipe.className)}>Löschen</button>
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