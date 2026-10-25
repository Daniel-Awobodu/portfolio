import { DriveScene, EndScene, SheetScene } from "@/components/demo/AppScenes";
import CalendarScene from "@/components/demo/CalendarScene";
import CallScene from "@/components/demo/CallScene";
import CanvasScene, { flowOf } from "@/components/demo/CanvasScene";
import FormScene from "@/components/demo/FormScene";
import InboxScene from "@/components/demo/InboxScene";
import PhoneScene from "@/components/demo/PhoneScene";
import ZapScene from "@/components/demo/ZapScene";
import type { Beat, Demo } from "@/lib/demos/types";

/** The scene tag for a beat ("Driver’s phone"). */
export function sceneLabel(demo: Demo, beat: Beat): string {
  if (beat.label) return beat.label;
  if (beat.scene === "canvas") {
    return flowOf(demo, beat).label ?? demo.sceneLabels.canvas ?? "";
  }
  return demo.sceneLabels[beat.scene] ?? "";
}

/** Scenes that should cross-fade when they change, rather than cut. */
function sceneKey(beat: Beat): string {
  if (beat.scene === "canvas") return `canvas-${beat.flow ?? ""}`;
  if (beat.scene === "chat") return `chat-${beat.thread ?? ""}`;
  if (beat.scene === "call") return `call-${beat.mode === "live"}`;
  return beat.scene;
}

/**
 * One frame of a demo: the scene for the beat on screen, drawn at progress `t`
 * through it. Shared by the full player and the card preview.
 */
export default function DemoScenes({
  demo,
  beatIndex,
  t,
  width,
  height,
  narrow,
  reduced,
  onReplay,
}: {
  demo: Demo;
  beatIndex: number;
  t: number;
  width: number;
  height: number;
  narrow: boolean;
  reduced: boolean;
  onReplay: () => void;
}) {
  const beat = demo.beats[beatIndex];

  if (beat.scene === "end") {
    return <EndScene demo={demo} onReplay={onReplay} />;
  }

  return (
    <div
      key={sceneKey(beat)}
      className="demo-fade absolute inset-0"
      aria-hidden="true"
    >
      {beat.scene === "object" ||
      beat.scene === "camera" ||
      beat.scene === "chat" ? (
        <PhoneScene
          demo={demo}
          scene={beat.scene}
          messages={beat.scene === "chat" ? beat.messages : []}
          thread={beat.scene === "chat" ? beat.thread : undefined}
          t={t}
        />
      ) : null}
      {beat.scene === "canvas" ? (
        <CanvasScene
          demo={demo}
          beatIndex={beatIndex}
          t={t}
          width={width}
          height={height}
          narrow={narrow}
          reduced={reduced}
        />
      ) : null}
      {beat.scene === "drive" ? (
        <DriveScene demo={demo} t={t} narrow={narrow} />
      ) : null}
      {beat.scene === "sheet" ? (
        <SheetScene demo={demo} t={t} narrow={narrow} mode={beat.mode} />
      ) : null}
      {beat.scene === "form" ? (
        <FormScene demo={demo} t={t} mode={beat.mode} />
      ) : null}
      {beat.scene === "inbox" ? (
        <InboxScene demo={demo} t={t} narrow={narrow} mode={beat.mode} />
      ) : null}
      {beat.scene === "zap" ? (
        <ZapScene
          demo={demo}
          step={beat.step}
          output={beat.output}
          t={t}
          narrow={narrow}
        />
      ) : null}
      {beat.scene === "call" ? (
        <CallScene
          demo={demo}
          mode={beat.mode}
          lines={beat.lines}
          clock={beat.clock}
          t={t}
          duration={beat.duration}
          narrow={narrow}
        />
      ) : null}
      {beat.scene === "calendar" ? (
        <CalendarScene demo={demo} t={t} narrow={narrow} mode={beat.mode} />
      ) : null}
    </div>
  );
}
