import express from "express";
import cors from "cors";
import type { Request, Response } from "express";

import  items  from "./data/items.json";
import  factories  from "./data/factories.json";
import  initialRecipes  from "./data/recipes.json";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.get("/api/items", (_req: Request, res: Response) => {
  res.json(items);
});

app.get("/api/factories", (_req: Request, res: Response) => {
  res.json(factories);
});

app.get("/api/recipes", (_req: Request, res: Response) => {
  const recipes = Object.values(initialRecipes).flat();
  res.json(recipes);
});

app.listen(PORT, () => {
  console.log(`Backend Server läuft auf http://localhost:${PORT}`);
});