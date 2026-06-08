import type { Recipe } from "../types";

export const initialRecipes: Recipe[] = [
  {
    id: "alien-dna-capsule",
    name: "Alien DNA Capsule",
    input: "Alien Protein",
    inputAmount: 10,
    output: "Alien DNA Capsule",
    outputAmount: 1,
    machine: "Constructor",
  },
  {
    id: "aluminium-casing",
    name: "Aluminium Casing",
    input: "Aluminium Ingot",
    inputAmount: 3,
    output: "Aluminium Casing",
    outputAmount: 2,
    machine: "Constructor",
  },
];