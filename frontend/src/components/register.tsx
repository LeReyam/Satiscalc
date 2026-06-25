import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!username || !email || !password || !passwordRepeat) {
      setError("Bitte alle Felder ausfüllen.");
      return;
    }

    if (password.length < 8) {
      setError("Das Passwort muss mindestens 8 Zeichen lang sein.");
      return;
    }

    if (password !== passwordRepeat) {
      setError("Die Passwörter stimmen nicht überein.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Registrierung fehlgeschlagen");
      }

      login(data.token, data.user);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registrierung fehlgeschlagen");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main id="planner">
      <section>
        <form id="selection" onSubmit={handleSubmit}>
          <label>
            Username:
            <p>
              <input
                type="text"
                placeholder="M.Mustermann"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </p>
          </label>

          <label>
            E-Mail:
            <p>
              <input
                type="email"
                placeholder="M.Mustermann@Muster.de"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </p>
          </label>

          <label>
            Passwort:
            <p>
              <input
                type="password"
                placeholder="Passwort"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </p>
          </label>

          <label>
            Passwort wiederholen:
            <p>
              <input
                type="password"
                placeholder="Passwort wiederholen"
                value={passwordRepeat}
                onChange={(e) => setPasswordRepeat(e.target.value)}
              />
            </p>
          </label>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Wird registriert..." : "Registrieren"}
          </button>

          <p>
            Schon registriert? <Link to="/login">Zum Login</Link>
          </p>
        </form>
      </section>
    </main>
  );
}