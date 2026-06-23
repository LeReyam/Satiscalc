import express from "express";
import cors from "cors";
import helmet from "helmet";
import path from "node:path";
import { PrismaClient } from "./generated/prisma/client.js";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const app = express();

const adapter = new PrismaBetterSqlite3({
  url: "file:./dev.db",
});

const prisma = new PrismaClient({ adapter });

app.use(helmet());
app.use(express.json());
app.use(cors());

app.use("/icons", express.static(path.join(process.cwd(), "public", "icons")));
app.get("/api/recipes", async (_req, res) => {
  const recipes = await prisma.recipe.findMany();
  res.json(recipes);
});
app.get("/api/items", async (_req, res) => {
  const items = await prisma.item.findMany();
  res.json(items);
});
app.get("/api/factories", async (_req, res) => {
  const factories = await prisma.factory.findMany();
  res.json(factories);
});

app.listen(3000, () => {
  console.log("API läuft auf Port 3000");
});