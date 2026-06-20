import { NextRequest, NextResponse } from "next/server";
import { extractToken, verifyToken, JwtPayload } from "./jwt";

export function requireAuth(
  req: NextRequest,
  requiredRole?: "admin"
): JwtPayload | NextResponse {
  const token = extractToken(req.headers.get("authorization"));
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = verifyToken(token);
    if (requiredRole && payload.role !== requiredRole) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return payload;
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}

export function isAuthError(value: unknown): value is NextResponse {
  return value instanceof NextResponse;
}
