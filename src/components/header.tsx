import "./header.css";
type HeaderProps = {
  setPage: (page: string) => void;
};

export function Header({ setPage }: HeaderProps) {
  return (
    <header id="start">
      <h1>Produktionsplanner</h1>
        <nav>
          <button onClick={() => setPage("planner")}>Produktionsplanner</button>

          <button onClick={() => setPage("recipes")}>Custom-Rezepte</button>

          <button onClick={() => setPage("about")}>About</button>

          <button onClick={() => setPage("login")}>Login</button>
        </nav>
    </header>
  );
}
