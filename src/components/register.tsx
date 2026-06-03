export function Register() {
  return (
    <div title="planner">
      <section>
        <form title="selection">
          <label title="username">Username:</label>
          <p>
            <input
              type="text"
              placeholder="M.Mustermann"
            />
          </p>

          <label title="E-Mail">E-Mail:</label>
          <p>
            <input
              type="email"
              placeholder="M.Mustermann@Muster.de"
            />
          </p>

          <label title="password">Passwort:</label>
          <p>
            <input
              type="password"
              placeholder="Passwort"
            />
          </p>

          <label title="password1">
            Passwort wiederholen:
          </label>
          <p>
            <input
              type="password"
              placeholder="Passwort"
            />
          </p>

          <a href="login.html">
            Already have an Account?
          </a>
        </form>
      </section>
    </div>
  );
}