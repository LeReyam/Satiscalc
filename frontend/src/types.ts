
export interface User {
 id: number;
 name: string;
 email: string;
 role: "admin" | "user";
 active: boolean;
}

export interface Factory {
  id: string;
  name: string;
}

export interface Item {
  id: string;
  name: string;
}

export interface RecipeItem {
  item: string;
  amount: number;
}

export interface Recipe {
  className: string;
  name: string;
  duration: number;
  ingredients: RecipeItem[];
  products: RecipeItem[];
  producedIn: string[];
  customRecipe: boolean;
  inBuildGun: boolean;
  alternate?: boolean;
}
