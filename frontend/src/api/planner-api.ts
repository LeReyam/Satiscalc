import type { Factory, Item, Recipe } from "../types";

export async function fetchItems(): Promise<Item[]> {
  const response = await fetch("/api/items");

  if (!response.ok) {
    throw new Error("Items konnten nicht geladen werden.");
  }

  return response.json();
}

export async function fetchFactories(): Promise<Factory[]> {
  const response = await fetch("/api/factories");

  if (!response.ok) {
    throw new Error("Factories konnten nicht geladen werden.");
  }

  return response.json();
}

export async function fetchRecipes(token?: string | null): Promise<Recipe[]> {
  const response = await fetch("/api/recipes", {
    headers: token
      ? { Authorization: `Bearer ${token}` }
      : {},
  });

  if (!response.ok) {
    throw new Error("Rezepte konnten nicht geladen werden.");
  }

  return response.json();
}

export async function saveCustomRecipe(
  recipe: Recipe,
  token: string
): Promise<Recipe> {
  const response = await fetch("/api/recipes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(recipe),
  });

  if (!response.ok) {
    throw new Error("Custom-Rezept konnte nicht gespeichert werden.");
  }

  return response.json();
}