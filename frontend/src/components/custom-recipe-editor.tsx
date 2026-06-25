import "./custom-recipe-editor.css"
import IconSelect from "./icon-select";
import { useState } from "react";
import type { Recipe, Item, Factory } from "../types";

type CustomRecipeEditorProps = {
  recipe?: Recipe;

  items: Item[];
  factories: Factory[];

  onSave: (recipe: Recipe) => void;
  onCancel: () => void;
};

export default function Custom_recipe_editor({
  recipe,
  items,
  factories,
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
    const recipeName = name.trim() || selectedOutputItem?.name || "Unbenanntes Rezept";

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
          <IconSelect
            className={errors.input ? "error-field" : ""}
            value={input}
            placeholder="Eingabe wählen"
            onChange={setInput}
            options={items.map((item) => ({
              value: item.id,
              label: item.name,
              iconPath: item.iconPath,
            }))}
          />

          <input
            type="number"
            min="1"
            max="1000000"
            value={inputAmount}
            onChange={(event) => setInputAmount(Number(event.target.value))}
          />

          <label>Ausgabe:</label>
          <IconSelect
            className={errors.output ? "error-field" : ""}
            value={output}
            placeholder="Ausgabe wählen"
            onChange={setOutput}
            options={items.map((item) => ({
              value: item.id,
              label: item.name,
              iconPath: item.iconPath,
            }))}
          />

          <input
            type="number"
            min="1"
            max="1000000"
            value={outputAmount}
            onChange={(event) => setOutputAmount(Number(event.target.value))}
          />

          <label>Fabrik:</label>
          <IconSelect
            className={errors.machine ? "error-field" : ""}
            value={machine}
            placeholder="Fabrik wählen"
            onChange={setMachine}
            options={factories.map((factory) => ({
              value: factory.id,
              label: factory.name,
              iconPath: factory.iconPath,
            }))}
          />

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