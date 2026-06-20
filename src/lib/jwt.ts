import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET ?? "dev-secret-change-in-production";
const EXPIRES_IN = "7d";

export interface JwtPayload {
  sub: number;
  email: string;
  role: "customer" | "admin";
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, SECRET) as unknown as JwtPayload;
}

export function extractToken(authHeader: string | null): string | null {
  if (!authHeader?.startsWith("Bearer ")) return null;
  return authHeader.slice(7);
}
