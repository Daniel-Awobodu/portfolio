/**
 * Lowercase, and treat punctuation as spaces so "follow-up" finds "follow up".
 * Shared by the server (building each study's search text) and the browser
 * (normalising what the visitor types), so both sides match the same way.
 */
export function normalise(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9.+#]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
