import type { Recipe } from "../types";
import { items } from "../data/items";
import { factories } from "../data/factories";

type ProductionplannerOutputProps = {
  recipe: Recipe;
  amount: number;
};

export default function Productionplanner_output({
  recipe,
  amount,
}: ProductionplannerOutputProps) {
  function getItemName(itemId: string) {
    return items.find((item) => item.id === itemId)?.name ?? itemId;
  }

  function getFactoryName(factoryId: string) {
    return factories.find((factory) => factory.id === factoryId)?.name ?? factoryId;
  }

  const mainProduct = recipe.products[0];
  const productPerMinute = mainProduct
    ? (mainProduct.amount / recipe.duration) * 60
    : 0;

  const multiplier = productPerMinute > 0 ? amount / productPerMinute : 0;

  return (
    <section id="reqi">
      <h2>Berechnung für {recipe.name}</h2>

      <p>
        Zielmenge: {amount} / min{" "}
        {mainProduct ? getItemName(mainProduct.item) : ""}
      </p>

      <h3>Benötigte Ressourcen</h3>
      <ul>
        {recipe.ingredients.map((ingredient) => (
          <li key={ingredient.item}>
            {(((ingredient.amount / recipe.duration) * 60) * multiplier).toFixed(2)} / min{" "}
            {getItemName(ingredient.item)}
          </li>
        ))}
      </ul>

      <h3>Ergebnis</h3>
      <ul>
        {recipe.products.map((product) => (
          <li key={product.item}>
            {(((product.amount / recipe.duration) * 60) * multiplier).toFixed(2)} / min{" "}
            {getItemName(product.item)}
          </li>
        ))}
      </ul>

      <h3>Fabriken</h3>
      <ul>
        {recipe.producedIn.length === 0 ? (
          <li>Keine Fabrik angegeben</li>
        ) : (
          recipe.producedIn.map((factoryId) => (
            <li key={factoryId}>{getFactoryName(factoryId)}</li>
          ))
        )}
      </ul>

      <p>Dauer pro Zyklus: {recipe.duration} Sekunden</p>
    </section>
  );
}