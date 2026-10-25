import type { Receipt as ReceiptData } from "@/lib/demos/types";

/**
 * A paper till receipt. Sized entirely in `em`, so the parent's font size
 * scales it: large on the counter, small inside a chat bubble.
 */
export default function Receipt({ receipt }: { receipt: ReceiptData }) {
  return (
    <div className="relative w-[16em] bg-[#fbfaf6] px-[1.1em] pt-[1.1em] pb-[1.6em] font-mono text-[1em] leading-[1.45] text-[#222] shadow-[0_0.4em_1.2em_rgba(0,0,0,0.35)]">
      <p className="text-center text-[0.95em] font-bold tracking-wide">
        {receipt.vendor}
      </p>
      <p className="text-center text-[0.75em] text-[#555]">{receipt.address}</p>
      <p className="mt-[0.6em] text-center text-[0.75em] text-[#555]">
        {receipt.date}
      </p>
      <div className="my-[0.6em] border-t border-dashed border-[#999]" />
      {receipt.lines.map(([left, right]) => (
        <p key={left} className="flex justify-between text-[0.8em]">
          <span>{left}</span>
          <span>{right}</span>
        </p>
      ))}
      <div className="my-[0.6em] border-t border-dashed border-[#999]" />
      <p className="flex justify-between text-[0.95em] font-bold">
        <span>TOTAL</span>
        <span>₦{receipt.total}</span>
      </p>
      <p className="mt-[0.7em] text-center text-[0.7em] text-[#666]">
        THANK YOU · DRIVE SAFE
      </p>
      {/* Torn bottom edge */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -bottom-[0.5em] h-[0.6em] bg-[#fbfaf6] [clip-path:polygon(0_0,4%_100%,8%_0,12%_100%,16%_0,20%_100%,24%_0,28%_100%,32%_0,36%_100%,40%_0,44%_100%,48%_0,52%_100%,56%_0,60%_100%,64%_0,68%_100%,72%_0,76%_100%,80%_0,84%_100%,88%_0,92%_100%,96%_0,100%_100%,100%_0)]"
      />
    </div>
  );
}
