import recipesData from "./recipes.json";
import type { Recipe } from "../types";

type RecipeFromJson = Omit<Recipe, "customRecipe">;
type RecipesJson = Record<string, RecipeFromJson[]>;

export const initialRecipes:
	Recipe[] = Object.values(recipesData as unknown as RecipesJson).flat().map((recipe) => ({...recipe,customRecipe: false,}));