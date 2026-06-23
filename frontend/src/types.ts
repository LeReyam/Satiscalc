
export interface User {
 id: number;
 name: string;
 email: string;
 role: "admin" | "user";
 active: boolean;
}

export interface Item {
  id: string;
  name: string;
  iconPath?: string | null;
}

export interface Factory {
  id: string;
  name: string;
  iconPath?: string | null;
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
