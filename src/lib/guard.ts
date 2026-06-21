import { NextResponse } from "next/server";

/**
 * Blocks editor write operations on the deployed (production) site so the live
 * website can never be changed/broken from the web. The editor is local-only:
 * edit locally → preview → push. Set ENABLE_EDITOR=true to override.
 */
export function blockInProd(): NextResponse | null {
  if (process.env.NODE_ENV === "production" && process.env.ENABLE_EDITOR !== "true") {
    return NextResponse.json(
      { error: "editor_local_only", message: "The editor is local-only. Edit on your computer, then push to deploy." },
      { status: 403 }
    );
  }
  return null;
}
