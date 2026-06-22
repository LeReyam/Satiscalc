import { useState } from "react";
import { Outlet, useNavigate, useOutletContext, useParams } from "react-router-dom";

import "./App.css";
import type { Recipe } from "./types";
import { initialRecipes } from "./data/recipes";

import Planner from "./components/planner";
import Header from "./components/header";
import Footer from "./components/footer";
import Custom_recipetable from "./components/custom-recipetable";
import Custom_recipe_editor from "./components/custom-recipe-editor";
import { BackendTest } from "./components/about";

type AppOutletContext = {
  recipes: Recipe[];
  selectedRecipeId: string;
  selectedRecipe: Recipe | undefined;
  amount: number;
  setSelectedRecipeId: (id: string) => void;
  setAmount: (amount: number) => void;
  handleCreateRecipe: () => void;
  handleSaveRecipe: (recipe: Recipe) => void;
  handleEditRecipe: (className: string) => void;
  handleDeleteRecipe: (className: string) => void;
};

function useAppData() {
  return useOutletContext<AppOutletContext>();
}

function App() {
  const navigate = useNavigate();

  const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes);
  const [selectedRecipeId, setSelectedRecipeId] = useState("");
  const [amount, setAmount] = useState(1);

  const selectedRecipe = recipes.find(
    (recipe) => recipe.className === selectedRecipeId
  );

  function handleSaveRecipe(recipe: Recipe) {
    setRecipes((currentRecipes) => {
      const recipeExists = currentRecipes.some(
        (currentRecipe) => currentRecipe.className === recipe.className
      );

      if (recipeExists) {
        return currentRecipes.map((currentRecipe) =>
          currentRecipe.className === recipe.className ? recipe : currentRecipe
        );
      }

      return [...currentRecipes, recipe];
    });

    navigate("/recipes");
  }

  function handleCreateRecipe() {
    navigate("/recipes/new");
  }

  function handleEditRecipe(className: string) {
    navigate(`/recipes/${className}`);
  }

  function handleDeleteRecipe(className: string) {
    setRecipes((currentRecipes) =>
      currentRecipes.filter((recipe) => recipe.className !== className)
    );
  }

  return (
    <>
      <Header />

      <Outlet
        context={{
          recipes,
          selectedRecipeId,
          selectedRecipe,
          amount,
          setSelectedRecipeId,
          setAmount,
          handleCreateRecipe,
          handleSaveRecipe,
          handleEditRecipe,
          handleDeleteRecipe,
        }}
      />

      <Footer />
    </>
  );
}
//<BackendTest />
export function PlannerPage() {
  const {
    recipes,
    selectedRecipeId,
    selectedRecipe,
    amount,
    setSelectedRecipeId,
    setAmount,
  } = useAppData();

  return (
    <Planner
      recipes={recipes}
      selectedRecipeId={selectedRecipeId}
      selectedRecipe={selectedRecipe}
      amount={amount}
      onRecipeChange={setSelectedRecipeId}
      onAmountChange={setAmount}
    />
  );
}

export function RecipesPage() {
  const {
    recipes,
    handleCreateRecipe,
    handleEditRecipe,
    handleDeleteRecipe,
  } = useAppData();

  return (
    <Custom_recipetable
      recipes={recipes}
      onCreateRecipe={handleCreateRecipe}
      onEditRecipe={handleEditRecipe}
      onDeleteRecipe={handleDeleteRecipe}
    />
  );
}

export function RecipeEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { recipes, handleSaveRecipe } = useAppData();

  const recipe = recipes.find((recipe) => recipe.className === id);

  return (
    <Custom_recipe_editor
      recipe={recipe}
      onSave={handleSaveRecipe}
      onCancel={() => navigate("/recipes")}
    />
  );
}

export function NotFoundPage() {
  return (
    <main>
      <h1>Seite nicht gefunden</h1>
      <p>Diese Route existiert nicht.</p>
    </main>
  );
}

export default App;