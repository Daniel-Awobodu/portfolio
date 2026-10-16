/**
 * Builds sometimes name the same tool two ways ("WhatsApp Cloud API" and
 * "WhatsApp (Green API)"). These collapse to one name wherever tools are
 * grouped or counted. Cards and build pages still show the full name.
 */
const TOOL_ALIASES: Record<string, string> = {
  "Groq (Llama 3.1)": "Groq",
  "WhatsApp (Green API)": "WhatsApp",
  "WhatsApp Cloud API": "WhatsApp",
  "n8n Data Table": "n8n",
};

export function toolName(tool: string): string {
  return TOOL_ALIASES[tool] ?? tool;
}

/**
 * Tools ranked by how many builds use them, most used first, with
 * variants merged. `exclude` drops names shown elsewhere.
 */
export function topTools(
  studies: { tools: string[] }[],
  limit: number,
  exclude: readonly string[] = [],
): string[] {
  const counts = new Map<string, number>();
  for (const study of studies) {
    for (const tool of new Set(study.tools.map(toolName))) {
      counts.set(tool, (counts.get(tool) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .filter(([tool]) => !exclude.includes(tool))
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([tool]) => tool);
}

/** How many different tools a set of builds uses between them. */
export function countTools(studies: { tools: string[] }[]): number {
  return new Set(studies.flatMap((study) => study.tools.map(toolName))).size;
}
