import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./login.css"

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Login fehlgeschlagen");
      }

      login(data.token, data.user);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login fehlgeschlagen");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main id="planner">
      <section>
        <form id="selection" onSubmit={handleSubmit}>
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

          <label htmlFor="pwd">Passwort:</label>
          <p>
            <input
              type="password"
              id="pwd"
              placeholder="Passwort"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </p>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <Link to="/password-reset">Reset-Password</Link>

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Wird eingeloggt..." : "LOGIN"}
          </button>

          <Link to="/register">Sign-up</Link>
        </form>
      </section>
    </main>
  );
}