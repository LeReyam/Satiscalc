import express from "express";
import cors from "cors";
import helmet from "helmet";
import path from "node:path";
import { fileURLToPath } from "node:url";
import bcrypt from "bcrypt";
import { prisma } from "./lib/prisma.js";
import { authRouter } from "./routes/auth.js";
import { optionalAuth, requireAuth, type AuthRequest } from "./auth.js";

// __dirname gibt es in ESM-Modulen nicht automatisch -> selbst herleiten
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Pfad zum gebauten Frontend (frontend/dist), relativ zu backend/src bzw. backend/dist
const frontendDistPath = path.join(__dirname, "..", "..", "frontend", "dist");

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

app.delete("/api/recipes/:className", requireAuth, async (req: AuthRequest, res) => {
  const classNameParam = req.params.className;

  if (Array.isArray(classNameParam)) {
    return res.status(400).json({ error: "Ungültige Rezept-ID" });
  }

  const className = classNameParam;

  const recipe = await prisma.recipe.findUnique({
    where: { className },
  });

  if (!recipe) {
    return res.status(404).json({ error: "Rezept nicht gefunden" });
  }

  if (!recipe.customRecipe) {
    return res.status(403).json({ error: "Standard-Rezepte können nicht gelöscht werden" });
  }

  if (recipe.userId !== req.user!.id) {
    return res.status(403).json({ error: "Du darfst dieses Rezept nicht löschen" });
  }

  await prisma.recipe.delete({
    where: { className },
  });

  res.status(204).send();
});


app.get("/api/items", async (_req, res) => {
  const items = await prisma.item.findMany();
  res.json(items);
});

app.get("/api/factories", async (_req, res) => {
  const factories = await prisma.factory.findMany();
  res.json(factories);
});

app.use(express.static(frontendDistPath));

// --- NEU: Catch-all für React-Router (Client-Side-Routing) ---
// Muss NACH allen /api- und /icons-Routen stehen, damit z.B. /recipes/new
// beim direkten Aufruf im Browser trotzdem die index.html ausliefert
// und React Router client-seitig übernimmt.
app.get(/^\/(?!api|icons).*/, (_req, res) => {
  res.sendFile(path.join(frontendDistPath, "index.html"));
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log("");
  console.log(`  ➜  Server:  http://localhost:${PORT}`);
  console.log(`  ➜  API:     http://localhost:${PORT}/api`);
  console.log("");
});