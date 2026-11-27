import crypto from "crypto";
import bcrypt from "bcrypt";

export function generateVerificationCode() {
  const verificationCode = crypto.randomInt(100000, 999999);
  return verificationCode;
}

export function verifyPassword(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash);
}

export function generateRefreshToken() {
  return crypto.randomBytes(32).toString("base64url");
}

export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

const isProd = process.env.NODE_ENV === "production";
const base = {
  httpOnly: true,
  secure: isProd,
  sameSite: (isProd ? "none" : "lax") as "none" | "lax",
}

//Cookie Settings
export const ACCESS_TOKEN_OPTIONS = {
  ...base,
  path: "/",
  maxAge: 60 * 60 * 24 * 30, //How long the browser keeps the cookies. 
};

export const REFRESH_TOKEN_OPTIONS = {
  ...base,
  path: "/auth",
  maxAge: 60 * 60 * 24 * 30,
};

