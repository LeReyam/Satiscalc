import "./about.css"
import { useEffect, useState } from "react";

export default function About() {
  return (
    <main className="about" >

      <section>
        <h2>Unser Projekt</h2>
        <ul>
          <li> Ein Produktionsplaner für das Factory Building game Satisfactory</li>
            <p>
              Erstellt im Rahmen des Webappkurses an der{" "}
              <a href="https://www.htwg-konstanz.de"> HTWG-Konstanz</a>
              .
            </p>
            <p>

          Weitere Informationen finden Sie auf der offiziellen{" "}
          <a href="https://www.satisfactorygame.com">Satisfactory-Website</a>
          {" "}von Coffee Stain Studios.
        </p>
        </ul>
      </section>
    </main>
  );
}

type HealthResponse = {
 ok: boolean;
 message: string;
};
export function BackendTest() {
 const [status, setStatus] = useState<string>("Lade Backend...");
 useEffect(() => {
 // Dank Vite-Proxy brauchen wir hier kein http://localhost:3000!
 fetch("/api/health")
 .then((res) => res.json() as Promise<HealthResponse>)
 .then((data) => setStatus(data.message))
 .catch((err) => setStatus("Fehler: " + err.message));
 }, []);
 return (
 <div style={{ padding: "2rem", background: "#f0fdf4", borderRadius: "8px" }}>
 <h2>Backend Status</h2>
 <p><strong>{status}</strong></p>
 </div>
 );
}
