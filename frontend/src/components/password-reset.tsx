import { Link } from "react-router-dom";

export default function Password_reset() {
  return (
    <section>
      <form id="selection">
        <label title="mail">Bitte geben Sie ihre E-Mail an:</label>
        <p>
          <input type="text" placeholder="M.Mustermann@Muster.de" />
        </p>
        <button>Passwort zurücksetzen</button>
        <Link to="/login">Zurück zum Login</Link>
      </form>
    </section>
  );
}
