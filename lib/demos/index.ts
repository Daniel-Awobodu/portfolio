import { appointmentReminders } from "@/lib/demos/appointment-reminders";
import { clientLifecycle } from "@/lib/demos/client-lifecycle";
import { crmFollowUps } from "@/lib/demos/crm-follow-ups";
import { dentalChatbot } from "@/lib/demos/dental-chatbot";
import { multichannelIntake } from "@/lib/demos/multichannel-intake";
import { narration } from "@/lib/demos/narration";
import { officeAssistant } from "@/lib/demos/office-assistant";
import { opportunityFeed } from "@/lib/demos/opportunity-feed";
import { orderAlerts } from "@/lib/demos/order-alerts";
import { orderExtraction } from "@/lib/demos/order-extraction";
import { quoteRequests } from "@/lib/demos/quote-requests";
import type { Demo } from "@/lib/demos/types";
import clips from "@/lib/demos/voice.json";
import { voiceReceptionist } from "@/lib/demos/voice-receptionist";
import { whatsappBakery } from "@/lib/demos/whatsapp-bakery";
import { whatsappReceipts } from "@/lib/demos/whatsapp-receipts";

/** A beat lasts at least this long after its narration ends. */
const VOICE_TAIL_MS = 400;

type Clip = { text: string; ms: number } | null;

/**
 * Adds a demo's narration, when its clips have been made: each beat is
 * stretched to fit its clip, and a clip is only used while it still matches
 * the caption it was read from.
 */
function withVoice(demo: Demo): Demo {
  const made = (clips as Record<string, Clip[]>)[demo.slug];
  if (!made) return demo;
  const voice = demo.beats.map((beat, i) =>
    made[i] && made[i].text === narration(beat) ? made[i].ms : null,
  );
  if (voice.every((ms) => ms === null)) return demo;
  return {
    ...demo,
    voice,
    silentBeats: demo.beats,
    beats: demo.beats.map((beat, i) => {
      const ms = voice[i];
      return ms
        ? { ...beat, duration: Math.max(beat.duration, ms + VOICE_TAIL_MS) }
        : beat;
    }),
  };
}

/** Builds with a "Watch it run" demo, by slug. Add one file per build. */
export const demos: Record<string, Demo> = Object.fromEntries(
  [
    orderAlerts,
    orderExtraction,
    voiceReceptionist,
    whatsappReceipts,
    whatsappBakery,
    dentalChatbot,
    appointmentReminders,
    crmFollowUps,
    quoteRequests,
    officeAssistant,
    multichannelIntake,
    clientLifecycle,
    opportunityFeed,
  ].map((demo) => [demo.slug, withVoice(demo)]),
);

/** Total running time of a demo, in milliseconds. */
export function demoDuration(demo: Demo): number {
  return demo.beats.reduce((sum, beat) => sum + beat.duration, 0);
}
