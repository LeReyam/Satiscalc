import fs from "node:fs";

/*
 * ==========================================
 * 1. Rohdaten laden
 * ==========================================
 */

const raw = JSON.parse(
  fs.readFileSync("src/data/rawdata/de.json", "utf-8")
);

/*
 * ==========================================
 * 2. Helper: NativeClass finden
 * ==========================================
 */

function findNativeClass(namePart) {
  const entry = raw.find((entry) =>
    entry.NativeClass.includes(namePart)
  );

  return entry?.Classes ?? [];
}

/*
 * ==========================================
 * 3. Benötigte Klassen extrahieren
 * ==========================================
 */

const rawRecipes = findNativeClass("FGRecipe");
const rawItems = findNativeClass("FGItemDescriptor");
const rawFactories = findNativeClass("FGBuildableManufacturer");

console.log("Recipes:", rawRecipes.length);
console.log("Items:", rawItems.length);
console.log("Factories:", rawFactories.length);

/*
 * ==========================================
 * 4. Item-Namen aufbauen
 * ==========================================
 */

const itemsById = new Map();

for (const item of rawItems) {
  itemsById.set(item.ClassName, {
    id: item.ClassName,
    name: item.mDisplayName,
  });
}

/*
 * ==========================================
 * 5. Fabrik-Namen aufbauen
 * ==========================================
 */

const factoriesById = new Map();

for (const factory of rawFactories) {
  factoriesById.set(
    factory.ClassName,
    factory.mDisplayName
  );
}

/*
 * ==========================================
 * 6. Basisressourcen definieren
 * ==========================================
 */

const BASE_RESOURCE_IDS = new Set([
  "Desc_OreBauxite_C",
  "Desc_OreGold_C",       // Caterium Ore
  "Desc_Coal_C",
  "Desc_OreCopper_C",
  "Desc_OreIron_C",
  "Desc_Stone_C",         // Limestone
  "Desc_NitrogenGas_C",
  "Desc_RawQuartz_C",
  "Desc_Sulfur_C",
  "Desc_OreUranium_C",
]);

/*
 * ==========================================
 * 7. Ingredients / Products parsen
 * ==========================================
 */

function parseItemAmounts(value) {
  if (!value || value === "()") {
    return [];
  }

  const regex =
    /ItemClass="[^"]*?\.([^.'"]+)'"\s*,\s*Amount=([0-9.]+)/g;

  const result = [];

  let match;

  while ((match = regex.exec(value)) !== null) {
    const className = match[1];
    const amount = Number(match[2]);

    const item = itemsById.get(className);

    result.push({
      item: className,
      name: item?.name ?? className,
      amount,
    });
  }

  return result;
}

/*
 * ==========================================
 * 8. Producing Buildings parsen
 * ==========================================
 */

function parseProducedIn(value) {
  if (!value || value === "()") {
    return [];
  }

  const regex = /\/([^/.]+)\.[^/."']+/g;

  const result = [];

  let match;

  while ((match = regex.exec(value)) !== null) {
    result.push(match[1]);
  }

  return result;
}

/*
 * ==========================================
 * 9. Converter-Basisrezepte erkennen
 * ==========================================
 */

function producesBaseResourceWithConverter(
  recipe,
  products
) {
  const isConverterRecipe =
    recipe.FullName?.includes(
      "/Recipes/Converter/ResourceConversion/"
    ) ||

    recipe.mProducedIn?.includes(
      "Build_Converter"
    );

  const producesBaseResource =
    products.some((product) =>
      BASE_RESOURCE_IDS.has(product.item)
    );

  return (
    isConverterRecipe &&
    producesBaseResource
  );
}

function isPackagingRecipe(recipe) {
  const className = recipe.ClassName ?? "";
  const fullName = recipe.FullName ?? "";
  const displayName = recipe.mDisplayName ?? "";

  return (
    className.includes("Packaged") ||
    className.includes("Unpackage") ||
    className.includes("Unpack") ||
    fullName.includes("/Recipes/Packaged") ||
    fullName.includes("/Recipes/Unpackage") ||
    displayName.toLowerCase().includes("abgefüllt") ||
    displayName.toLowerCase().includes("entpack")
  );
}

/*
 * ==========================================
 * 10. Alternativrezepte erkennen
 * ==========================================
 */

function isAlternateRecipe(
  recipe,
  products
) {
  return (
    recipe.ClassName?.startsWith(
      "Recipe_Alternate_"
    ) ||

    recipe.FullName?.includes(
      "/Recipes/AlternateRecipes/"
    ) ||

    producesBaseResourceWithConverter(
      recipe,
      products
    ) ||

    isPackagingRecipe(recipe)
  );
}

/*
 * ==========================================
 * 11. Rezepte erzeugen
 * ==========================================
 */

const recipes = rawRecipes.map((recipe) => {
  const ingredients = parseItemAmounts(
    recipe.mIngredients
  );

  const products = parseItemAmounts(
    recipe.mProduct
  );

  const producedIn = parseProducedIn(
    recipe.mProducedIn
  );

  const factoryClass = producedIn[0];

  return {
    id: recipe.ClassName,

    name:
      recipe.mDisplayName ||
      recipe.ClassName,

    isAlternate: isAlternateRecipe(
      recipe,
      products
    ),

    duration: Number(
      recipe.mManufactoringDuration
    ),

    factory: {
      id: factoryClass,

      name:
        factoriesById.get(factoryClass) ??
        factoryClass ??
        "Unknown",
    },

    ingredients,

    products,
  };
});

/*
 * ==========================================
 * 12. Ungültige Rezepte entfernen
 * ==========================================
 */

const filteredRecipes = recipes.filter(
  (recipe) =>
    recipe.products.length > 0 &&
    recipe.ingredients.length > 0
);

/*
 * ==========================================
 * 13. Datei schreiben
 * ==========================================
 */

fs.writeFileSync(
  "src/data/generated-recipes.json",
  JSON.stringify(
    filteredRecipes,
    null,
    2
  ),
  "utf-8"
);

/*
 * ==========================================
 * 14. Statistik
 * ==========================================
 */

console.log(
  `Generated ${filteredRecipes.length} recipes`
);

console.log(
  "Standard recipes:",
  filteredRecipes.filter(
    (recipe) => !recipe.isAlternate
  ).length
);

console.log(
  "Alternate recipes:",
  filteredRecipes.filter(
    (recipe) => recipe.isAlternate
  ).length
);

console.log(
  "Converter base-resource recipes:",
  filteredRecipes.filter(
    (recipe) =>
      recipe.isAlternate &&
      recipe.factory.id ===
        "Build_Converter_C"
  ).length
);