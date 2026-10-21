import fs from "node:fs";
import path from "node:path";

/**
 * Width and height of a JPEG in /public, read from its header at build time.
 * MDX props can't carry numbers here, so components that need real image
 * sizes (to reserve space before the image loads) look them up instead.
 */
export function jpegSize(publicPath: string): {
  width: number;
  height: number;
} {
  const buf = fs.readFileSync(path.join(process.cwd(), "public", publicPath));
  let i = 2;
  while (i + 9 < buf.length) {
    const marker = buf[i + 1];
    // SOF0 to SOF15 carry the size, except DHT (C4), JPG (C8) and DAC (CC).
    if (
      marker >= 0xc0 &&
      marker <= 0xcf &&
      marker !== 0xc4 &&
      marker !== 0xc8 &&
      marker !== 0xcc
    ) {
      return {
        height: buf.readUInt16BE(i + 5),
        width: buf.readUInt16BE(i + 7),
      };
    }
    i += 2 + buf.readUInt16BE(i + 2);
  }
  throw new Error(`No JPEG size found in ${publicPath}`);
}
