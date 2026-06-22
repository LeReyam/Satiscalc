import { useNavigate } from "react-router-dom";
import "./header.css";

export default function Header() {
  const navigate = useNavigate();
  return (
  <header id="start">
    <h1>Satiscalc</h1>
    <nav>
       <button onClick={() => navigate("/")}>
                Planner
            </button>

            <button onClick={() => navigate("/recipes")}>
                Rezepte
            </button>

            <button onClick={() => navigate("/about")}>
                About
            </button>

            <button onClick={() => navigate("/login")}>
                Login
            </button>
    </nav>
  </header>
  );
}
