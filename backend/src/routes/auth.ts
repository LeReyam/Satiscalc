import { Router } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma.js";
import { createToken, requireAuth, type AuthRequest } from "../auth.js";

export const authRouter = Router();

authRouter.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "Alle Felder sind erforderlich" });
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    return res.status(409).json({ error: "E-Mail ist bereits registriert" });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { username, email, passwordHash },
  });

  const token = createToken({ id: user.id, email: user.email });

  res.status(201).json({
    token,
    user: { id: user.id, username: user.username, email: user.email },
  });
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "E-Mail und Passwort sind erforderlich" });
  }

  const user = await prisma.user.findUnique({ where: { email } });

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
    user: { id: user.id, username: user.username, email: user.email },
  });
});

authRouter.get("/me", requireAuth, async (req: AuthRequest, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: { id: true, username: true, email: true },
  });

  res.json(user);
});