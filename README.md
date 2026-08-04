# Projektname: Productionplaner
**Team:** Leon Mayer (312056), Nicholas Plötz (307930), Florian Dunstheimer (307133)
**Repository:** https://github.com/LeReyam/Satiscalc
# Installation

## Voraussetzungen

Vor der Installation müssen folgende Programme installiert sein:

- Node.js (Version 20 oder neuer)
- npm
- Git

Überprüfen der Installation:

```bash
node -v
npm -v
git --version

```
| Programm | Erwartete Version |
|----------|-------------------|
| Node.js | **v22.18.0** oder neuer |
| npm | **10.9.3** oder neuer |
| Git | **2.50.** oder neuer |

---

## Repository klonen

```bash
git clone https://github.com/LeReyam/Satiscalc.git
cd SatisCalc
```

---

## Backend einrichten

In das Backend-Verzeichnis wechseln und die benötigten Abhängigkeiten installieren:

```bash
cd backend
npm install
```

Den Prisma Client generieren:

```bash
npx prisma generate
```

#### PowerShell (Windows)

```powershell
Test-Path .\prisma\dev.db
```

- Ausgabe `True` → Die Datenbank ist bereits vorhanden. Den Schritt `npx prisma migrate dev` überspringen.
- Ausgabe `False` → Die Datenbank muss erstellt werden.

#### Bash (Linux, macOS, Git Bash)

```bash
[ -f prisma/dev.db ] && echo "✓ Datenbank vorhanden." || echo "✗ Keine Datenbank gefunden."
```

- Ausgabe `✓ Datenbank vorhanden.` → Die Datenbank ist bereits vorhanden. Den Schritt `npx prisma migrate dev` überspringen.
- Ausgabe `✗ Keine Datenbank gefunden.` → Die Datenbank muss erstellt werden.

Falls keine Datenbank vorhanden ist:

```bash
npx prisma migrate dev
npm run db:seed
```

Zum Schluss das Backend starten:

```bash
npm run dev
```

Das Backend ist anschließend unter

```
http://localhost:3000
```

erreichbar.

---

## Frontend einrichten

### Hinweis zur Installation der Packages beim Frontend

- Die Anwendung wurde mit den zum Entwicklungszeitpunkt aktuellen Versionen aller verwendeten Bibliotheken entwickelt und getestet.
- `npm audit` meldet derzeit zwei Sicherheitswarnung eine für `react-router-dom` (Version 7.18.2). Die gemeldete Schwachstelle betrifft laut Hersteller ausschließlich den React Server Components (RSC)-Modus, welcher in dieser Anwendung nicht verwendet wird. Die andere ist für `react-router`, eine Löst die andere aus.
- Da zum Zeitpunkt der Abgabe kein neueres Release von `react-router-dom` über npm verfügbar war, konnte die Warnung nicht durch ein Update behoben werden. Die Funktionalität der Anwendung wird dadurch nicht beeinträchtigt.
Neues Terminal öffnen.

```bash
cd frontend
npm install
```

Frontend starten:

```bash
npm run dev
```

Die Anwendung ist anschließend erreichbar unter:

```
http://localhost:5173
```

---

## Anmeldung

Registriere zunächst einen neuen Benutzer über die Registrierungsseite.

Alternativ kann folgender Testnutzer verwendet werden:

Benutzername:
```
test
```

Passwort:
```
test123
```

(Anpassen, falls ihr keinen Testnutzer mitliefert.)

---

## Projekt beenden

Frontend und Backend können mit

```bash
CTRL + C
```

beendet werden.

## Projektidee
Ein Tool zur Generierung von einem Flowchart für Produktionsketten. Eigene Rezepte können hinzugefügt werden.
## Kriterien-Zuordnung M1
| Kriterium | Datei | Zeile / Hinweis |
|---|---|---|
| Semantische HTML-Struktur | index.html | Z. 9-54 |
| Formular mit Labels | intro-html.html | Z. 21–31 |
| Responsives Layout (Flexbox/Grid) | styles.css | Z. 22–61 |
| Media Query | styles.css | Z. 149 |
| URL-Struktur | index.html, about.html | Pfade: /, /about |

## Setup
```bash
npm install
npm run dev
```

|Kriterium| Datei | Zeile / Hinweis|
|---|---|---|
|npm + Vite| package.json, vite.config.ts| Projekt-Root|
|TypeScript aktiv genutzt| src/types.ts,src/components/costum-recipe-editor.tsx,| Z.1-35, Z. 7-10|
|Komponentenzerlegung| src/components/ |about,footer, header, login, password-reset,planner, productionplanner-graph, productionplanner-output, recipeselektor, register, passwordresetstage2, custom-recipe-editor, custom-recipetable|
|Props-Übergabe| src/App.tsx| Z. 66–74, Z. 88-92, Z. 97-100|
|useState | src/App.tsx|Z. 17 (recipes-State), Z. 18 (selectedRecipeId), Z.19(amount), Z.24 (planner//setPage)|
|useEffect | src/App.tsx | --- |
|Durchgängige Nutzeraktion | src/components/costum-recipetable, .../costum-recipe-editor, .../recipeselektor|Tabelle -> Formular -> Tabelle -> Liste|



## Backend & Datenbank
erstellen der Datenbank und übertragen der roh daten in die datenbank über das seed script
```bash
npx prisma generate
npm run db:seed
```

### Test-User
mail: test@test.de
passwort: 123456
( dieser user wurde "hart" in die datenbank eingetragen, über die console und bevor wir die beschränkung auf 8 zeichen beim passwort wieder eingebaut hatten.)



## Kriterien-Zuordnung M3

| Kriterium                                | Datei                                                             | Zeile / Hinweis                                  |
| ---------------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------ |
| React Router: 2–3 Routen                 | frontend/src/main.tsx                                             | Z. 20–71                                         |
| Navigation ohne `window.location`        | frontend/src/main.tsx, frontend/src/App.tsx                       | `RouterProvider`, `ProtectedRoute`, `navigate()` |
| REST-Datenfetching GET                   | frontend/src/api/planner-api.ts                                   | Z. 3–35                                          |
| REST schreibend POST / DELETE            | frontend/src/api/planner-api.ts                                   | Z. 37–70                                         |
| Ladezustand sichtbar                     | frontend/src/App.tsx                                              | Z. 62–64, Z. 159–168                             |
| Fehlerzustand sichtbar                   | frontend/src/App.tsx                                              | Z. 91–100, Z. 171–181                            |
| Geteilter State / Context                | frontend/src/context/AuthContext.tsx                              | Z. 17–60                                         |
| Backend mit Express                      | backend/src/server.ts                                             | Z. 10–19, Z. 20–130                              |
| Eigene API-Endpunkte                     | backend/src/server.ts                                             | `/api/recipes`, `/api/items`, `/api/factories`   |
| Datenbank / Prisma / SQLite              | backend/prisma/schema.prisma                                      | Z. 11–13, Z. 15–54                               |
| Authentifizierung: Login & Registrierung | backend/src/routes/auth.ts                                        | Z. 8–60                                          |
| JWT / geschützte Endpunkte               | backend/src/auth.ts, backend/src/server.ts                        | `requireAuth`, geschützte POST/DELETE-Routen     |
| Geschützte Frontend-Route                | frontend/src/components/ProtectedRoute.tsx, frontend/src/main.tsx | Z. 4–12, Z. 34–47                                |
| Architektur SPA + API-Backend            | README.md                                                         | Abschnitt „Architektur“ ergänzen                 |
| SSR/SSG-Begründung                       | README.md                                                         | Ein Satz unter Architektur ergänzen              |
| Tests                                    | about.test.tsx, planner.test.tsx                                  | Z.14-44, Z.70-126								  |


                  Browser
                     │
                     ▼
          React Single Page Application
      (Vite + React Router + Context API)
                     │
              HTTP (REST / JSON)
                     │
                     ▼
          Node.js + Express Backend
                     │
             Prisma ORM / REST API
                     │
                     ▼
              SQLite-Datenbank

Server Side Rendering (SSR) oder Static Site Generation (SSG) sind hier nicht notwendig, da es sich um eine interaktive, authentifizierte Single-Page-Application handelt, deren Inhalte dynamisch aus dem eigenen Backend geladen werden.