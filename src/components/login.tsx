
import { Link } from "react-router-dom";

export function Login() {
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
          <Link to="/password-reset">Reset-Password</Link>
          <button type="submit">LOGIN</button>
          <Link to="/register">Sign-up</Link>
        </form>
      </section>
    </main>
  );
}