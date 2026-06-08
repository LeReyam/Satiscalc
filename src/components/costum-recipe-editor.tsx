export function Costum_recipe_editor() {
  return (
    <main title="costum_recipe_editor">
      <section>
        <form id="selection">
          <label>Name:</label>
          <input type="text" placeholder="Mein Rezept" />
          Eingabe:
          <p>
            <select name="Ressource" id="Ressource">
              <option value="Alien DNA Capsule">Alien DNA Capsule</option>
              <option value="Alumium Casing">Aluminium Casing</option>
            </select>
            <input type="number" value="1" min="1" max="1000000" id="number" />
            /s
          </p>
          <button>Eingabe hinzufügen</button>
          Ausgabe:
          <p>
            <select name="Fabrik" id="Fabrik">
              <option value="Alien DNA Capsule">Alien DNA Capsule</option>
              <option value="Alumium Casing">Aluminium Casing</option>
            </select>
            <input type="number" value="1" min="1" max="1000000" id="number" />
            /s
          </p>
          <button>Ausgabe hinzufügen</button>
          Fabrik:
          <p>
            <select name="Fabrik" id="Fabrik">
              <option value="Alien DNA Capsule">Alien DNA Capsule</option>
              <option value="Alumium Casing">Aluminium Casing</option>
            </select>
            <input type="number" value="1" min="1" max="1000000" id="number" />s
          </p>
          <button>Rezept erstellen/speichern</button>
        </form>
        <a href="custom-recipies.html">
          <button>Zurück</button>
        </a>
      </section>
    </main>
  );
}
