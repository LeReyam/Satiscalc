import express from "express";
import cors from "cors";
import helmet from "helmet";
import path from "node:path";
import bcrypt from "bcrypt";
import { prisma } from "./lib/prisma.js";
import { authRouter } from "./routes/auth.js";

const app = express();

app.use(helmet());
app.use(express.json());
app.use(cors());

app.use("/icons", express.static(path.join(process.cwd(), "public", "icons")));

app.use("/api/auth", authRouter);

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