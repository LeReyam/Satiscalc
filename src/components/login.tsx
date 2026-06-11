
interface LoginProps {
  setPage: (page: string) => void;
}

export function Login({ setPage }: LoginProps) {
  return (
    <main id="planner">
      <section>
        <form id="selection">
          E-Mail:
          <p>
            <input type="text" placeholder="M.Mustermann@Muster.de" />
          </p>
          <label htmlFor="pwd">Passwort:</label>
          <p>
            <input type="password" id="pwd" placeholder="Passwort" />
          </p>
          <button type="button" onClick={()=> setPage("password-reset")}>
            Reset-Password
          </button>

          <button type="submit">LOGIN</button>

          <button type="button" onClick={() => setPage("register")}>
            Sign-up
          </button>
        </form>
      </section>
    </main>
  );
}