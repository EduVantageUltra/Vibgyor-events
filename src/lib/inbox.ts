import "server-only";
import fs from "node:fs";
import path from "node:path";

const dir = path.join(process.cwd(), "src", "data");
const file = (n: string) => path.join(dir, n);

export type Submission = { id: string; name: string; phone: string; message: string; date: string };
export type Order = { id: string; name: string; phone: string; address: string; items: string; total: number; method: string; date: string };
export type Review = { id: string; productId: string; name: string; rating: number; text: string; date: string; approved: boolean };

function read<T>(n: string): T[] {
  try { return JSON.parse(fs.readFileSync(file(n), "utf-8")) as T[]; } catch { return []; }
}
function write<T>(n: string, data: T[]) {
  fs.writeFileSync(file(n), JSON.stringify(data, null, 2), "utf-8");
}

export const getSubmissions = () => read<Submission>("submissions.json");
export const addSubmission = (s: Omit<Submission, "id" | "date">) => {
  const all = getSubmissions(); const rec = { ...s, id: `sub-${Date.now().toString(36)}`, date: new Date().toISOString() };
  write("submissions.json", [rec, ...all].slice(0, 500)); return rec;
};

export const getOrders = () => read<Order>("orders.json");
export const addOrder = (o: Omit<Order, "id" | "date">) => {
  const all = getOrders(); const rec = { ...o, id: `ord-${Date.now().toString(36)}`, date: new Date().toISOString() };
  write("orders.json", [rec, ...all].slice(0, 1000)); return rec;
};

export const getReviews = (productId?: string) => {
  const all = read<Review>("reviews.json");
  return productId ? all.filter((r) => r.productId === productId && r.approved) : all;
};
export const addReview = (r: Omit<Review, "id" | "date" | "approved">) => {
  const all = read<Review>("reviews.json"); const rec = { ...r, id: `rev-${Date.now().toString(36)}`, date: new Date().toISOString(), approved: true };
  write("reviews.json", [rec, ...all].slice(0, 2000)); return rec;
};
export const setReviews = (data: Review[]) => write("reviews.json", data);
