import "./custom-recipe-editor.css"
import { useState } from "react";
import type { Recipe } from "../types";
import { items } from "../data/items";
import { factories } from "../data/factories";

type CustomRecipeEditorProps = {
  recipe?: Recipe;
  onSave: (recipe: Recipe) => void;
  onCancel: () => void;
};

export function Custom_recipe_editor({
  recipe,
  onSave,
  onCancel,
}: CustomRecipeEditorProps) {
  const [name, setName] = useState(recipe?.name ?? "");
  const [input, setInput] = useState(recipe?.ingredients[0]?.item ?? "");
  const [inputAmount, setInputAmount] = useState(
    recipe?.ingredients[0]?.amount ?? 1
  );
  const [output, setOutput] = useState(recipe?.products[0]?.item ?? "");
  const [outputAmount, setOutputAmount] = useState(
    recipe?.products[0]?.amount ?? 1
  );
  const [machine, setMachine] = useState(recipe?.producedIn[0] ?? "");
  const [duration, setDuration] = useState(recipe?.duration ?? 1);

  const [errors, setErrors] = useState({
    input: false,
    output: false,
    machine: false,
  });

  const [errorMessage, setErrorMessage] = useState("");

  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const newErrors = {
      input: input === "",
      output: output === "",
      machine: machine === "",
    };

    setErrors(newErrors);

    if (newErrors.input || newErrors.output || newErrors.machine) {
      setErrorMessage("Bitte alle Pflichtfelder ausfüllen.");
      return;
    }

    setErrorMessage("");

    const selectedOutputItem = items.find((item) => item.id === output);
    const recipeName =
      name.trim() || selectedOutputItem?.name || "Unbenanntes Rezept";

    const savedRecipe: Recipe = {
      className: recipe?.className ?? crypto.randomUUID(),
      name: recipeName,
      duration,
      ingredients: [
        {
          item: input,
          amount: inputAmount,
        },
      ],
      products: [
        {
          item: output,
          amount: outputAmount,
        },
      ],
      producedIn: [machine],
      customRecipe: true,
      inBuildGun:false
    };

    onSave(savedRecipe);
  }

  return (
    <main className="custom_recipe_editor">
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
          <select
            className={errors.input ? "error-field" : ""}
            value={input}
            onChange={(event) => setInput(event.target.value)}
          >
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
          <select
            className={errors.output ? "error-field" : ""}
            value={output}
            onChange={(event) => setOutput(event.target.value)}
          >
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
          <select
            className={errors.machine ? "error-field" : ""}
            value={machine}
            onChange={(event) => setMachine(event.target.value)}
          >
            <option value="">Fabrik wählen</option>
            {factories.map((factory) => (
              <option key={factory.id} value={factory.id}>
                {factory.name}
              </option>
            ))}
          </select>

          <label>Dauer in Sekunden:</label>
          <input
            type="number"
            min="1"
            value={duration}
            onChange={(event) => setDuration(Number(event.target.value))}
          />
          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <button type="submit">{recipe ? "Änderungen speichern" : "Rezept erstellen"}</button>
          <button type="button" onClick={onCancel}>Zurück</button>
        </form>
      </section>
    </main>
  );
}