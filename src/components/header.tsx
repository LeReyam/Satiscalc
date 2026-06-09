import "./header.css";
type HeaderProps = {
  setPage: (page: string) => void;
};

export function Header({ setPage }: HeaderProps) {
  return (
    <header id="start">
<<<<<<< Updated upstream
      <h1>Produktionsplaner</h1>

      <nav>
        <button onClick={() => setPage("planner")}>Produktionsplaner</button>
=======
      <h1>Productionplanner</h1>
        <nav>
          <button onClick={() => setPage("planner")}>Productionplanner</button>

          <button onClick={() => setPage("recipes")}>Custom-Rezepte</button>
>>>>>>> Stashed changes

          <button onClick={() => setPage("about")}>About</button>

          <button onClick={() => setPage("login")}>Login</button>
        </nav>
    </header>
  );
}
