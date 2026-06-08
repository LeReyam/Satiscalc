
export interface User {
 id: number;
 name: string;
 email: string;
 role: "admin" | "user";
 active: boolean;
}

export interface Recipe {
  id: string;
  name: string;
  input: string;
  inputAmount: number;
  output: string;
  outputAmount: number;
  machine: string;
}

