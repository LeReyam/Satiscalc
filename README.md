# Projektname: Productionplaner
**Team:** Leon Mayer (312056), Nicholas Plötz (307930), Florian Dunstheimer (307133)
**Repository:** https://github.com/LeReyam/Satiscalc
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
mail: test@test.de passwort: 123456 ( dieser user wurde "hart" in die datenbank eingetragen, über die console und bevor wir die beschränkung auf 8 zeichen beim passwort wieder eingebaut hatten.)



| Kriterium | Datei | Zeile / Hinweis |
|---|---|---|
| Semantische HTML-Struktur | index.html | Z. 9-54 |
| Formular mit Labels | intro-html.html | Z. 21–31 |
| Responsives Layout (Flexbox/Grid) | styles.css | Z. 22–61 |
| Media Query | styles.css | Z. 149 |
| URL-Struktur | index.html, about.html | Pfade: /, /about |

