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

export async function fetchRecipes(): Promise<Recipe[]> {
  const response = await fetch("/api/recipes");

  if (!response.ok) {
    throw new Error("Rezepte konnten nicht geladen werden.");
  }

  return response.json();
}