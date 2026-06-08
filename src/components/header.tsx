type HeaderProps = {
  setPage: (page: string) => void;
};

export function Header({ setPage }: HeaderProps) {
  return (
    <header id="start">
      <h1>Productionplanner</h1>

      <nav>
        <button onClick={() => setPage("planner")}>Productionplanner</button>

        <button onClick={() => setPage("recipes")}>Custom-Rezepte</button>

        <button onClick={() => setPage("about")}>About</button>

        <button onClick={() => setPage("login")}>Login</button>
      </nav>
    </header>
  );
}
