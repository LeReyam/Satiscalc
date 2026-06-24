import express from "express";
import cors from "cors";
import helmet from "helmet";
import path from "node:path";
import bcrypt from "bcrypt";
import { PrismaClient } from "./generated/prisma/client.js";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { createToken, requireAuth, type AuthRequest } from "./auth.js";

const app = express();

const adapter = new PrismaBetterSqlite3({
  url: "file:./dev.db",
});

const prisma = new PrismaClient({ adapter });

app.use(helmet());
app.use(express.json());
app.use(cors());

app.use("/icons", express.static(path.join(process.cwd(), "public", "icons")));

app.post("/api/auth/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "Alle Felder sind erforderlich" });
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return res.status(409).json({ error: "E-Mail ist bereits registriert" });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      username,
      email,
      passwordHash,
    },
  });

  const token = createToken({ id: user.id, email: user.email });

  res.status(201).json({
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
    },
  });
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "E-Mail und Passwort sind erforderlich" });
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return res.status(401).json({ error: "Login fehlgeschlagen" });
  }

  const passwordOk = await bcrypt.compare(password, user.passwordHash);

  if (!passwordOk) {
    return res.status(401).json({ error: "Login fehlgeschlagen" });
  }

  const token = createToken({ id: user.id, email: user.email });

  res.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
    },
  });
});

app.get("/api/me", requireAuth, async (req: AuthRequest, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: {
      id: true,
      username: true,
      email: true,
    },
  });

  res.json(user);
});

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