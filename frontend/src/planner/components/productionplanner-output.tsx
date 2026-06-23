import "./productionplanner-output.css";

import type { ProductionPlan } from "../planner-types";

type ProductionPlannerOutputProps = {
  plan: ProductionPlan;
};

export default function Productionplanner_output({
  plan,
}: ProductionPlannerOutputProps) {
  return (
    <section className="planner-output-content">
      <h2>Produktion</h2>

      <h3>Ziel</h3>

      <p>
        {plan.targetAmountPerMinute.toFixed(2)} / min
        {" "}
        {plan.rootProductName}
      </p>

      <hr />

      <h3>Basis-Ressourcen</h3>

      <table>
        <thead>
          <tr>
            <th>Ressource</th>
            <th>/ min</th>
          </tr>
        </thead>

        <tbody>
          {plan.baseResources.map((resource) => (
            <tr key={resource.itemId}>
              <td>{resource.itemName}</td>
              <td>{resource.amountPerMinute.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr />

      <h3>Zwischenprodukte</h3>

      <table>
        <thead>
          <tr>
            <th>Produkt</th>
            <th>/ min</th>
          </tr>
        </thead>

        <tbody>
          {plan.intermediateResources.map((resource) => (
            <tr key={resource.itemId}>
              <td>{resource.itemName}</td>
              <td>{resource.amountPerMinute.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr />

      <h3>Maschinen</h3>

      <table>
        <thead>
          <tr>
            <th>Rezept</th>
            <th>Fabrik</th>
            <th>Anzahl</th>
          </tr>
        </thead>

        <tbody>
          {plan.machines.map((machine) => (
            <tr
              key={`${machine.recipeId}-${machine.outputItemId}`}
            >
              <td>{machine.recipeName}</td>

              <td>{machine.factoryName}</td>

              <td>{machine.machines.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}