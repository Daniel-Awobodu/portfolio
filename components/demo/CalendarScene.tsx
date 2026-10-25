import { easeOut, span } from "@/components/demo/anim";
import { Window } from "@/components/demo/AppScenes";
import type { CalendarEvent, Demo } from "@/lib/demos/types";

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[1.2em] w-[1.2em]" aria-hidden="true">
      <rect x="3" y="4" width="18" height="17" rx="2" fill="#4285f4" />
      <rect x="5" y="9" width="14" height="10" rx="1" fill="#fff" />
    </svg>
  );
}

const hourLabel = (h: number) =>
  `${h > 12 ? h - 12 : h} ${h >= 12 ? "PM" : "AM"}`;

/**
 * Google Calendar, one branch's week. "taken": someone at the clinic books a
 * slot. "booked": the agent's booking appears, then opens to show its details.
 */
export default function CalendarScene({
  demo,
  t,
  narrow,
  mode,
}: {
  demo: Demo;
  t: number;
  narrow: boolean;
  mode: "taken" | "booked";
}) {
  const cal = demo.calendar!;
  const [h0, h1] = cal.hours;
  const hours = Array.from({ length: h1 - h0 }, (_, i) => h0 + i);
  // On narrow screens, three days around the booking.
  const firstDay = narrow ? Math.max(0, cal.booked.day - 1) : 0;
  const dayCount = narrow ? 3 : cal.days.length;
  const days = cal.days.slice(firstDay, firstDay + dayCount);

  const takenIn = easeOut(span(t, 0.22, 0.36));
  const bookedIn = easeOut(span(t, 0.18, 0.32));
  const detail = mode === "booked" && t >= 0.42;

  const events: { event: CalendarEvent; appear: number; isNew: boolean }[] = [
    ...cal.events.map((event) => ({ event, appear: 1, isNew: false })),
    {
      event: cal.taken,
      appear: mode === "taken" ? takenIn : 1,
      isNew: mode === "taken",
    },
    ...(mode === "booked"
      ? [{ event: cal.booked, appear: bookedIn, isNew: true }]
      : []),
  ];

  return (
    <Window title={cal.title} icon={<CalendarIcon />}>
      <div className="flex h-full flex-col text-[#3c4043]">
        <div className="flex items-center gap-3 border-b border-[#e3e6e8] px-3 py-2 text-[clamp(11px,1.5cqw,14px)]">
          <span className="rounded-full border border-[#747775] px-3 py-1">
            Today
          </span>
          <span aria-hidden="true">‹ ›</span>
          <span className="text-[clamp(13px,1.9cqw,18px)] text-[#1f1f1f]">
            {cal.month}
          </span>
          <span className="ml-auto rounded-full border border-[#747775] px-3 py-1">
            Week
          </span>
        </div>

        <div className="flex min-h-0 flex-1">
          {!narrow ? (
            <div className="w-40 shrink-0 border-r border-[#e3e6e8] p-3 text-[13px]">
              <p className="mb-2 font-medium text-[#1f1f1f]">My calendars</p>
              {cal.calendars.map((c) => (
                <p key={c.name} className="flex items-center gap-2 py-1">
                  <span
                    className="flex h-3.5 w-3.5 items-center justify-center rounded-[3px] border-2 text-[9px] text-white"
                    style={{
                      borderColor: c.color,
                      background: c.on ? c.color : "transparent",
                    }}
                  >
                    {c.on ? "✓" : ""}
                  </span>
                  {c.name}
                </p>
              ))}
            </div>
          ) : null}

          <div className="relative flex min-w-0 flex-1 flex-col">
            {/* Day headers */}
            <div className="flex border-b border-[#e3e6e8] pl-12">
              {days.map(([dow, date], i) => {
                const today = firstDay + i === cal.booked.day;
                return (
                  <div key={dow} className="flex-1 py-1.5 text-center">
                    <p className="text-[clamp(9px,1.1cqw,11px)] font-medium tracking-wide">
                      {dow}
                    </p>
                    <p
                      className={`mx-auto mt-0.5 flex h-[clamp(22px,4cqh,32px)] w-[clamp(22px,4cqh,32px)] items-center justify-center rounded-full text-[clamp(13px,2cqw,20px)] ${today ? "bg-[#0b57d0] text-white" : "text-[#1f1f1f]"}`}
                    >
                      {date}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Hours */}
            <div className="relative min-h-0 flex-1">
              {hours.map((h, i) => (
                <div
                  key={h}
                  className="absolute inset-x-0 border-t border-[#e3e6e8]"
                  style={{ top: `${(i / hours.length) * 100}%` }}
                >
                  <span className="absolute -top-2 left-1 w-10 bg-white text-right text-[clamp(9px,1.1cqw,11px)] text-[#70757a]">
                    {hourLabel(h)}
                  </span>
                </div>
              ))}
              <div className="absolute inset-y-0 right-0 left-12 flex">
                {days.map(([dow], i) => (
                  <div
                    key={dow}
                    className="relative flex-1 border-l border-[#e3e6e8]"
                  >
                    {events
                      .filter(
                        ({ event, appear }) =>
                          event.day === firstDay + i && appear > 0,
                      )
                      .map(({ event, appear, isNew }) => (
                        <div
                          key={event.title}
                          className={`absolute inset-x-0.5 overflow-hidden rounded-md px-1.5 py-0.5 text-[clamp(9px,1.2cqw,12px)] leading-tight text-white ${isNew ? "z-10 shadow-[0_4px_12px_rgba(0,0,0,0.3)]" : ""}`}
                          style={{
                            top: `${((event.start - h0) / hours.length) * 100}%`,
                            height: `calc(${((event.end - event.start) / hours.length) * 100}% - 2px)`,
                            background: event.color,
                            opacity: appear,
                            transform: `scale(${0.9 + 0.1 * appear})`,
                          }}
                        >
                          <p className="truncate font-semibold">
                            {event.title}
                          </p>
                          <p className="truncate opacity-90">
                            {hourLabel(event.start)
                              .toLowerCase()
                              .replace(" ", "")}
                            {"-"}
                            {hourLabel(event.end)
                              .toLowerCase()
                              .replace(" ", "")}
                          </p>
                        </div>
                      ))}
                  </div>
                ))}
              </div>
            </div>

            {/* The booking, opened */}
            {detail ? (
              <div
                className={`demo-fade absolute z-20 rounded-2xl bg-[#f0f4f9] p-[clamp(12px,2cqw,20px)] text-[clamp(11px,1.5cqw,14px)] shadow-[0_12px_32px_rgba(0,0,0,0.25)] ${
                  narrow ? "inset-x-2 bottom-2" : "top-[12%] right-[4%] w-[52%]"
                }`}
              >
                <p className="flex items-start gap-2.5">
                  <span
                    className="mt-1.5 h-3 w-3 shrink-0 rounded-[3px]"
                    style={{ background: cal.booked.color }}
                  />
                  <span>
                    <span className="block text-[clamp(14px,2.2cqw,20px)] leading-snug text-[#1f1f1f]">
                      {cal.booked.title}
                    </span>
                    <span className="block">{cal.booked.when}</span>
                  </span>
                </p>
                <div className="mt-2.5 space-y-1 pl-[1.3rem]">
                  {cal.booked.details.map((line, i) => (
                    <p
                      key={line}
                      className="truncate transition-opacity duration-300"
                      style={{ opacity: t >= 0.48 + i * 0.05 ? 1 : 0 }}
                    >
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </Window>
  );
}
