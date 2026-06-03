import { About } from "./components/about.tsx";
import { Costum_recipe_editor } from "./components/costum-recipe-editor.tsx";
import { Costum_recipetable } from "./components/costum-recipetable.tsx";
import { Footer } from "./components/footer";
import { Recipe_selector } from "./components/recipeselector"
import "./App.css";
import { Header } from "./components/header"
import { Register } from "./components/register"

function App() {

  return (
    <>
		<Header/>
		<Register/>
		<About/>
		<Costum_recipe_editor/>
		<Costum_recipetable/>
		<Recipe_selector/>
		<Footer />
    </>
  );
}

export default App;
