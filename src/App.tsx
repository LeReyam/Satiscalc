import { About } from "./components/about.tsx";
import { Costum_recipe_editor } from "./components/costum-recipe-editor.tsx";
import { Costum_recipetable } from "./components/costum-recipetable.tsx";
import { Productionplanner_output } from "./components/productionplanner-output.tsx";
import { Footer } from "./components/footer";
import { Recipe_selector } from "./components/recipeselector"
import "./App.css";
import { Header } from "./components/header"
import { Register } from "./components/register"
import {Login } from "./components/login"
import { Password_reset } from "./components/password-reset.tsx";

function App() {

  return (
    <>
		<Header/>
		<Login/>
		<Password_reset/>
		<Register/>
		<About/>
		<Costum_recipe_editor/>
		<Costum_recipetable/>
    	<Productionplanner_output/>
		<Recipe_selector/>
		<Footer/>
    </>
  );
}

export default App;
