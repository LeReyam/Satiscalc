import { About } from "./components/about.tsx";
import { Costum_recipe_editor } from "./components/costum-recipe-editor.tsx";
import { Costum_recipetable } from "./components/costum-recipetable.tsx";
import { Footer } from "./components/footer";
import "./App.css";
import {Header} from "./components/header.tsx"

function App() {

  return (
    <>
		<Header/>
    <About/>
    <Costum_recipe_editor/>
    <Costum_recipetable/>
		<Footer />
    </>
  );
}

export default App;
