import express from "express";
import cors from "cors";
import helmet from "helmet";
import path from "node:path";
import bcrypt from "bcrypt";
import { prisma } from "./lib/prisma.js";
import { authRouter } from "./routes/auth.js";
import { optionalAuth, requireAuth, type AuthRequest } from "./auth.js";

const app = express();

app.use(helmet());
app.use(express.json());
app.use(cors());

app.use("/icons", express.static(path.join(process.cwd(), "public", "icons")));

app.use("/api/auth", authRouter);

app.get("/api/recipes", optionalAuth, async (req: AuthRequest, res) => {
  const recipes = await prisma.recipe.findMany({
    where: {
      OR: [
        { customRecipe: false },
        req.user ? { userId: req.user.id } : {},
      ],
    },
  });

  res.json(recipes);
});
app.post("/api/recipes", requireAuth, async (req: AuthRequest, res) => {
  const {
    className,
    name,
    duration,
    ingredients,
    products,
    producedIn,
    inBuildGun,
    alternate,
  } = req.body;

  if (!className || !name || !duration || !ingredients || !products || !producedIn) {
    return res.status(400).json({ error: "Rezeptdaten unvollständig" });
  }

  const existingRecipe = await prisma.recipe.findUnique({
    where: { className },
  });

  if (existingRecipe && existingRecipe.userId !== req.user!.id) {
    return res.status(403).json({ error: "Dieses Rezept gehört dir nicht" });
  }

  const savedRecipe = await prisma.recipe.upsert({
    where: { className },
    create: {
      className,
      name,
      duration,
      ingredients,
      products,
      producedIn,
      customRecipe: true,
      inBuildGun: inBuildGun ?? false,
      alternate: alternate ?? false,
      userId: req.user!.id,
    },
    update: {
      name,
      duration,
      ingredients,
      products,
      producedIn,
      customRecipe: true,
      inBuildGun: inBuildGun ?? false,
      alternate: alternate ?? false,
    },
  });

  res.status(201).json(savedRecipe);
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