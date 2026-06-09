import { useState, type FormEvent } from "react";

interface RegisterProps {
  setPage: (page: string) => void;
}

export function Register({ setPage }: RegisterProps) {
  const [username, setUsername]  = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function validateInput(): boolean {
    setError("");

    if (!username || !email || !password || !passwordRepeat) {
      setError("Alle Felder ausfüllen!!!");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Ungültige E-Mail-Adresse.");
      return false;
    }

    if (password.length < 8) {
      setError("Mindestlänge 8 Zeichen!");
      return false;
    }

    if (password !== passwordRepeat) {
      setError("Passwort und Wiederholung müssen übereinstimmen!");
      return false;
    }

    return true;
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const valid = validateInput();
    if (!valid) {
      setSuccess(false);
      return;
    }

    const accData = { username, email, password };
    localStorage.setItem("newUser", JSON.stringify(accData));

    setSuccess(true);
    setPage("login"); 
  }

  return (
    <div title="planner">
      <section>
        <form title="selection" onSubmit={handleSubmit}>
          <label title="username">Username:</label>
          <p>
            <input
              type="text"
              placeholder="M.Mustermann"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </p>

          <label title="E-Mail">E-Mail:</label>
          <p>
            <input
              type="email"
              placeholder="M.Mustermann@Muster.de"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </p>

          <label title="password">Passwort:</label>
          <p>
            <input
              type="password"
              placeholder="Passwort"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </p>

          <label title="password1">Passwort wiederholen:</label>
          <p>
            <input
              type="password"
              placeholder="Passwort"
              value={passwordRepeat}
              onChange={(e) => setPasswordRepeat(e.target.value)}
            />
          </p>

          {error && <p style={{ color: "red" }}>{error}</p>}
          {success && (
            <p style={{ color: "green" }}>
              Registrierung erfolgreich! Weiterleitung...
            </p>
          )}

          <button type="submit">
            Registrieren
          </button>

         
        </form>
      </section>
    </div>
  );
}