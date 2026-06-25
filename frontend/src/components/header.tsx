import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./header.css";

export default function Header() {
  const navigate = useNavigate();

  const { isLoggedIn, logout } = useAuth();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header id="start">
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

        {!isLoggedIn ? (
          <button onClick={() => navigate("/login")}>
            Login
          </button>
        ) : (
          <>

            <button onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </nav>
    </header>
  );
}