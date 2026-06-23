import { useEffect, useState } from "react";
import {
  Outlet,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router-dom";

import "./App.css";

import type { Factory, Item, Recipe } from "./types";

import {
  fetchFactories,
  fetchItems,
  fetchRecipes,
} from "./api/planner-api";

import Planner from "./planner/components/planner";
import Header from "./components/header";
import Footer from "./components/footer";
import Custom_recipetable from "./components/custom-recipetable";
import Custom_recipe_editor from "./components/custom-recipe-editor";

type AppOutletContext = {
  recipes: Recipe[];
  items: Item[];
  factories: Factory[];

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

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [factories, setFactories] = useState<Factory[]>([]);

  const [selectedRecipeId, setSelectedRecipeId] = useState("");
  const [amount, setAmount] = useState(1);


  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const selectedRecipe = recipes.find(
    (recipe) => recipe.className === selectedRecipeId
  );

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        setError(null);

        
        const [
          loadedItems,
          loadedFactories,
          loadedRecipes,
        ] = await Promise.all([
          fetchItems(),
          fetchFactories(),
          fetchRecipes(),
        ]);

        setItems(loadedItems);
        setFactories(loadedFactories);
        setRecipes(loadedRecipes);
      } catch (error) {
        console.error(error);

        setError(
          error instanceof Error
            ? error.message
            : "Fehler beim Laden der Daten."
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  function handleSaveRecipe(recipe: Recipe) {
    setRecipes((currentRecipes) => {
      const recipeExists = currentRecipes.some(
        (currentRecipe) => currentRecipe.className === recipe.className
      );

      if (recipeExists) {
        return currentRecipes.map((currentRecipe) =>
          currentRecipe.className === recipe.className
            ? recipe
            : currentRecipe
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
      currentRecipes.filter(
        (recipe) => recipe.className !== className
      )
    );
  }

  if (isLoading) {
    return (
      <>
        <Header />
        <main>
          <p>Daten werden geladen...</p>
        </main>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <main>
          <h2>Fehler</h2>
          <p>{error}</p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <Outlet
        context={{
          recipes,
          items,
          factories,

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

export function PlannerPage() {
  const {
    recipes,
    items,
    factories,
    selectedRecipeId,
    selectedRecipe,
    amount,
    setSelectedRecipeId,
    setAmount,
  } = useAppData();

  return (
    <Planner
      recipes={recipes}
      items={items}
      factories={factories}
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
    items,
    factories,
    handleCreateRecipe,
    handleEditRecipe,
    handleDeleteRecipe,
  } = useAppData();

  return (
    <Custom_recipetable
      recipes={recipes}
      items={items}
      factories={factories}
      onCreateRecipe={handleCreateRecipe}
      onEditRecipe={handleEditRecipe}
      onDeleteRecipe={handleDeleteRecipe}
    />
  );
}

export function RecipeEditorPage() {
  
  const { id } = useParams();
  const navigate = useNavigate();

  const { recipes, items, factories, handleSaveRecipe } = useAppData();

  const recipe = recipes.find(
    (recipe) => recipe.className === id
  );

  return (
    <Custom_recipe_editor
      recipe={recipe}
      items={items}
      factories={factories}
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