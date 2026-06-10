import { useState } from "react";
import "./App.css";
import type { Recipe } from "./types";
import { initialRecipes } from "./data/recipes";
import { Planner } from "./components/planner"

import { Header } from "./components/header";
import { Footer } from "./components/footer";
import { Login } from "./components/login";
import { Register } from "./components/register";
import { About } from "./components/about";
import { Custom_recipetable } from "./components/custom-recipetable";
import { Custom_recipe_editor } from "./components/custom-recipe-editor";
import { Password_reset } from "./components/password-reset";

function App() {
  const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes);
  const [selectedRecipeId, setSelectedRecipeId] = useState("");
  const [amount, setAmount] = useState(1);

  const selectedRecipe = recipes.find( (recipe) => recipe.className === selectedRecipeId);
  const [page, setPage] = useState("planner");

  const [editingRecipeId, setEditingRecipeId] = useState<string | null>(null);


  function handleSaveRecipe(recipe: Recipe){
    setRecipes(
      (currentRecipes) => {
        const recipeExists = currentRecipes.some(
          (currentRecipe) => currentRecipe.className === recipe.className
        )

        if (recipeExists) {
          return currentRecipes.map((currentRecipe) =>
            currentRecipe.className === recipe.className ? recipe : currentRecipe
          )
        }
        return [...currentRecipes, recipe]
      }
    );
    setEditingRecipeId(null);
    setPage("recipes")
  }

  function handleCreateRecipe(){
    setEditingRecipeId(null);
    setPage("recipe-editor")
  }

  function handleEditRecipe(className: string){
    setEditingRecipeId(className);
    setPage("recipe-editor");
  }

  function handleDeleteRecipe(className: string){
    setRecipes((currentRecipes) =>
      currentRecipes.filter((recipe) => recipe.className !== className)
    )
  }

  return (
  <>
    <Header setPage={setPage} />

    {page === "planner" && (
          <Planner
            recipes={recipes}
            selectedRecipeId={selectedRecipeId}
            selectedRecipe={selectedRecipe}
            amount={amount}
            onRecipeChange={setSelectedRecipeId}
            onAmountChange={setAmount}
          />


    )}

      {page === "login" && <Login setPage={setPage} />}

      {page === "password-reset" && <Password_reset setPage={setPage} />}

      {page === "register" && <Register setPage={setPage} />}

      {page === "about" && <About />}

      {page === "recipes" && (
        <Custom_recipetable
          recipes={recipes}
          onCreateRecipe={handleCreateRecipe}
          onEditRecipe={handleEditRecipe}
          onDeleteRecipe={handleDeleteRecipe}
        />
      )}

      {page === "recipe-editor" && (
        <Custom_recipe_editor
          recipe={recipes.find((recipe) => recipe.className === editingRecipeId)}
          onSave={handleSaveRecipe}
          onCancel={() => setPage("recipes")}
        />
      )}

      <Footer />
    </>
  );
}

export default App;
