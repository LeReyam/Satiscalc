import { useState } from "react";
import type { Recipe } from "../types";
import { items } from "../data/items";
import { factories } from "../data/factories";

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
  const [errors, setErrors] = useState({
  input: false,
  output: false,
  machine: false,
  });

const [errorMessage,setErrorMessage] = useState("");

  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

  const newErrors = {
  input: input === "",
  output: output === "",
  machine: machine === "",
};

  setErrors(newErrors);

  if (
    newErrors.input ||
    newErrors.output ||
    newErrors.machine
  ) {
    setErrorMessage(
      "Bitte alle Pflichtfelder ausfüllen."
    );
    return;
  }

  setErrorMessage("");

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
  }
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
          <select className={errors.input ? "error-field" : ""} value={input} onChange={(e) => setInput(e.target.value)}>
            <option value="">Eingabe wählen</option>
            {items.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            min="1"
            max="1000000"
            value={inputAmount}
            onChange={(event) => setInputAmount(Number(event.target.value))}
          />

           <label>Ausgabe:</label>
          <select className={errors.output ? "error-field" : ""} value={output} onChange={(e) => setOutput(e.target.value)}>
            <option value="">Ausgabe wählen</option>
            {items.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            min="1"
            max="1000000"
            value={outputAmount}
            onChange={(event) => setOutputAmount(Number(event.target.value))}
          />

          <label>Fabrik:</label>
          <select className={errors.machine ? "error-field" : ""} value={machine} onChange={(e) => setMachine(e.target.value)}>
            <option value="">Fabrik wählen</option>
            {factories.map((factory) => (
              <option key={factory.id} value={factory.id}>
                {factory.name}
              </option>
            ))}
          </select>
          {errorMessage && (
            <p className="error-message">
              {errorMessage}
            </p>
          )}
          <button type="submit">{recipe ? "Änderungen speichern" : "Rezept erstellen"}</button>
          <button type="button" onClick={onCancel}>Zurück</button>

        </form>
      </section>
    </main>
  )
}
