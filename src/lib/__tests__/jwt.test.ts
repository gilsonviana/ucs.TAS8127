import { describe, it, expect } from "vitest";
import { signToken, verifyToken, extractToken } from "../jwt";

describe("JWT utility", () => {
  const payload = { sub: 1, email: "test@example.com", role: "customer" as const };

  it("signs and verifies a token", () => {
    const token = signToken(payload);
    const decoded = verifyToken(token);
    expect(decoded.sub).toBe(payload.sub);
    expect(decoded.email).toBe(payload.email);
    expect(decoded.role).toBe(payload.role);
  });

  it("extracts a bearer token from header", () => {
    const token = signToken(payload);
    expect(extractToken(`Bearer ${token}`)).toBe(token);
  });

  it("returns null for missing or malformed auth header", () => {
    expect(extractToken(null)).toBeNull();
    expect(extractToken("Token abc")).toBeNull();
  });

  it("throws for an invalid token", () => {
    expect(() => verifyToken("bad.token.here")).toThrow();
  });
});
