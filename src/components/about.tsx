import "./about.css"
export function About() {
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
