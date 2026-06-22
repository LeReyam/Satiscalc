
/*import { useState } from "react";

interface PasswordResetProps {
  setPage: (page: string) => void;
}
function isAccountMail(email: string) : boolean{

    const stored = localStorage.getItem("newUser");
    if(!stored) return false;

    const user = JSON.parse(stored) as { email: string };
  return user.email === email;
}

export function Password_reset({ setPage }: PasswordResetProps) {
    const [mail, setMail] = useState("");
    const [valid, setValid] = useState("");


  return (
    <section>
      <form id="selection">
        <label title="mail">Bitte geben Sie ihre E-Mail an:</label>
        <p>
          <input type="text" placeholder="M.Mustermann@Muster.de"
          value = {mail}/>
        </p>
        <button>Passwort zurücksetzen</button>
        <a href="login.html">Zurück zum Login</a>
      </form>
    </section>
  );
}*/
