import { useState } from "react";

import "./App.css";

import { Header } from "./components/header";
import { Footer } from "./components/footer";

import { Login } from "./components/login";
import { Register } from "./components/register";
import { About } from "./components/about";

import { Costum_recipetable } from "./components/costum-recipetable";
import { Costum_recipe_editor } from "./components/costum-recipe-editor";

import { Recipe_selector } from "./components/recipeselector";
import { Productionplanner_output } from "./components/productionplanner-output";
import { Productionplanner_graph } from "./components/productionplanner-graph";

function App() {
  const [page, setPage] = useState("planner");

  return (
    <>
      <Header setPage={setPage} />

      {page === "planner" && (
        <>
          <Recipe_selector />
          <Productionplanner_graph />
          <Productionplanner_output />
        </>
      )}

      {page === "login" && <Login />}

      {page === "register" && <Register />}

      {page === "about" && <About />}

      {page === "recipes" && <Costum_recipetable />}

      {page === "recipe-editor" && <Costum_recipe_editor />}

      <Footer />
    </>
  );
}

export default App;
