import fs from "node:fs";
import path from "node:path";

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  cover: string;
  date: string;
  published: boolean;
  body: string;
};

const FILE = path.join(process.cwd(), "src", "data", "posts.json");

export function getPosts(): Post[] {
  try {
    return (JSON.parse(fs.readFileSync(FILE, "utf-8")) as Post[]).sort((a, b) => (a.date < b.date ? 1 : -1));
  } catch {
    return [];
  }
}
export function getPublishedPosts(): Post[] {
  return getPosts().filter((p) => p.published);
}
export function getPost(slug: string): Post | undefined {
  return getPosts().find((p) => p.slug === slug);
}
export function writePosts(posts: Post[]) {
  fs.writeFileSync(FILE, JSON.stringify(posts, null, 2), "utf-8");
}
