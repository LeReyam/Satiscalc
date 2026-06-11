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
|npm + Vite| package.json, vite.config.ts| Projekt-Root|
|TypeScript aktiv genutzt| src/types.ts,src/components/RecipeCard.tsx| Z. 1–15 (Interface), Z. 8 (Props)
|Komponentenzerlegung| src/components/ |RecipeList, RecipeCard, AddRecipeForm|
|Props-Übergabe| src/App.tsx| Z. 30–45|
|useState | src/App.tsx|Z. 12 (recipes-State), Z. 18 (filterState)|
|useEffect | src/App.tsx | Z. 22 (localStorage laden)|
|Durchgängige Nutzeraktion | src/components/AddRecipeForm.tsx Formular → Liste|