import type { Demo } from "@/lib/demos/types";
import { whatsappReceipts } from "@/lib/demos/whatsapp-receipts";

/** Builds with a "Watch it run" demo, by slug. Add one file per build. */
export const demos: Record<string, Demo> = {
  [whatsappReceipts.slug]: whatsappReceipts,
};

/** Total running time of a demo, in milliseconds. */
export function demoDuration(demo: Demo): number {
  return demo.beats.reduce((sum, beat) => sum + beat.duration, 0);
}
