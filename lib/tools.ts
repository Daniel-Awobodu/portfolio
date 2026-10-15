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

/** How many different tools a set of builds uses between them. */
export function countTools(studies: { tools: string[] }[]): number {
  return new Set(studies.flatMap((study) => study.tools.map(toolName))).size;
}
