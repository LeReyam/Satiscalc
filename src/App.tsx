import { useState } from "react";
import { Footer } from "./components/footer";
import "./App.css";
import { Header } from "./components/header"
import { Register } from "./components/register"

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
		<Header/>
		<Register/>
		<Footer />
    </>
  );
}

export default App;
