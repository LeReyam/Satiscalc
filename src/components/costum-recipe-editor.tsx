import { useState } from "react";
import type { Recipe } from "../types";

type CostumRecipeEditorProps = {
  recipe?: Recipe;
  onSave: (recipe: Recipe) => void;
  onCancel:() => void;
}

export function Costum_recipe_editor({
  recipe,
  onSave,
  onCancel,
}: CostumRecipeEditorProps) {
  const [name, setName] = useState(recipe?.name ?? "")
  const [input, setInput] = useState(recipe?.input ?? "");
  const [inputAmount, setInputAmount] = useState(recipe?.inputAmount ?? 1);
  const [output, setOutput] = useState(recipe?.output ?? "");
  const [outputAmount, setOutputAmount] = useState(recipe?.outputAmount ?? 1);
  const [machine, setMachine] = useState(recipe?.machine ?? "");

  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  const savedRecipe: Recipe = {
    id: recipe?.id ?? crypto.randomUUID(),
    name,
    input,
    inputAmount,
    output,
    outputAmount,
    machine,
  }
  onSave(savedRecipe)

  return(
    <main className="costum_recipe_editor">
      <section>
        <h2>{recipe ? "Rezept bearbeiten" : "Neues Rezept erstellen"}</h2>

        <form id="selection" onSubmit={handleSubmit}>
          <label>Name:</label>
          <input
            type="text"
            placeholder="Mein Rezept"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />

          <label>Eingabe:</label>
          <input
            type="text"
            placeholder="z.B. Iron Ore"
            value={input}
            onChange={(event) => setInput(event.target.value)}
          />

          <input
            type="number"
            min="1"
            max="1000000"
            value={inputAmount}
            onChange={(event) => setInputAmount(Number(event.target.value))}
          />

           <label>Ausgabe:</label>
          <input
            type="text"
            placeholder="z.B. Iron Ingot"
            value={output}
            onChange={(event) => setOutput(event.target.value)}
          />

          <input
            type="number"
            min="1"
            max="1000000"
            value={outputAmount}
            onChange={(event) => setOutputAmount(Number(event.target.value))}
          />

          <label>Fabrik:</label>
          <input
            type="text"
            placeholder="z.B. Smelter"
            value={machine}
            onChange={(event) => setMachine(event.target.value)}
          />

          <button type="submit">{recipe ? "Änderungen speichern" : "Rezept erstellen"}</button>
          <button type="button" onClick={onCancel}>Zurück</button>

        </form>
      </section>
    </main>
  )
}
