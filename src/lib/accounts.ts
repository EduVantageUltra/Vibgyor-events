import "server-only";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

export type Customer = { id: string; name: string; email: string; phone: string; hash: string };

const FILE = path.join(process.cwd(), "src", "data", "customers.json");
const SECRET = process.env.SESSION_SECRET || "rajrishi-dev-secret-change-me";

function read(): Customer[] { try { return JSON.parse(fs.readFileSync(FILE, "utf-8")); } catch { return []; } }
function write(d: Customer[]) { fs.writeFileSync(FILE, JSON.stringify(d, null, 2), "utf-8"); }

function hashPw(pw: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const h = crypto.scryptSync(pw, salt, 32).toString("hex");
  return `${salt}:${h}`;
}
function verifyPw(pw: string, stored: string): boolean {
  const [salt, h] = stored.split(":");
  if (!salt || !h) return false;
  const test = crypto.scryptSync(pw, salt, 32).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(test), Buffer.from(h));
}

export function register(name: string, email: string, phone: string, pw: string): { ok: boolean; error?: string; id?: string } {
  const all = read();
  email = email.toLowerCase().trim();
  if (all.some((c) => c.email === email)) return { ok: false, error: "Email already registered" };
  const c: Customer = { id: `cust-${Date.now().toString(36)}`, name, email, phone, hash: hashPw(pw) };
  write([...all, c]);
  return { ok: true, id: c.id };
}
export function login(email: string, pw: string): { ok: boolean; error?: string; id?: string } {
  const c = read().find((x) => x.email === email.toLowerCase().trim());
  if (!c || !verifyPw(pw, c.hash)) return { ok: false, error: "Wrong email or password" };
  return { ok: true, id: c.id };
}
export function getCustomer(id: string): Customer | undefined {
  return read().find((c) => c.id === id);
}

// Signed session token (HMAC) — id.signature
export function signSession(id: string): string {
  const sig = crypto.createHmac("sha256", SECRET).update(id).digest("hex");
  return `${id}.${sig}`;
}
export function readSession(token?: string): string | null {
  if (!token) return null;
  const [id, sig] = token.split(".");
  if (!id || !sig) return null;
  const expected = crypto.createHmac("sha256", SECRET).update(id).digest("hex");
  try { return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected)) ? id : null; } catch { return null; }
}
