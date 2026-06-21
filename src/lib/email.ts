/**
 * Sends a notification email via Resend if configured. No-op (returns false)
 * when keys aren't set — so the app works fine without email, and you can
 * enable it at go-live by setting RESEND_API_KEY + NOTIFY_EMAIL.
 */
export async function notify(subject: string, text: string): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_EMAIL;
  if (!key || !to) return false;
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: "Rajrishi <onboarding@resend.dev>", to, subject, text }),
    });
    return true;
  } catch {
    return false;
  }
}
