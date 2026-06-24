import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "dev-secret-change-me";

export type AuthRequest = Request & {
  user?: {
    id: number;
    email: string;
  };
};

export function createToken(user: { id: number; email: string }) {
  return jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

export function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Nicht eingeloggt" });
  }

  try {
    const token = header.slice("Bearer ".length);
    const payload = jwt.verify(token, JWT_SECRET) as {
      id: number;
      email: string;
    };

    req.user = {
      id: payload.id,
      email: payload.email,
    };

    next();
  } catch {
    return res.status(401).json({ error: "Token ungültig" });
  }
}

export function optionalAuth(
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    return next();
  }

  try {
    const token = header.slice("Bearer ".length);
    const payload = jwt.verify(token, JWT_SECRET) as {
      id: number;
      email: string;
    };

    req.user = {
      id: payload.id,
      email: payload.email,
    };
  } catch {
    // ungültiger Token wird ignoriert
  }

  next();
}