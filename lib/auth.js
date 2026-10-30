
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET
);

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is missing from .env.local");
}

// Sign JWT token
export async function signToken(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

// Verify JWT token
export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}

// Get current session
export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("cybetron_token")?.value;

  if (!token) return null;

  return await verifyToken(token);
}

// Role-based access control
export function hasRole(session, ...roles) {
  if (!session) return false;

  return roles.includes(session.role);
}
