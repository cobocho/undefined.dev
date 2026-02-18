import { StaticImageData } from "next/image";
import { inflateSync } from "zlib";

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export function getAverageColor(image: StaticImageData): RGB | null {
  const { blurDataURL } = image;
  if (!blurDataURL) return null;

  const base64 = blurDataURL.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(base64, "base64");

  const result = parsePNG(buffer) ?? parseBMP(buffer);
  if (!result || result.pixels.length === 0) return null;

  const { pixels, width, height } = result;
  const borderPixels: RGB[] = [];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (y === 0 || y === height - 1 || x === 0 || x === width - 1) {
        borderPixels.push(pixels[y * width + x]);
      }
    }
  }

  if (borderPixels.length === 0) return null;

  const total = borderPixels.reduce(
    (acc, pixel) => ({
      r: acc.r + pixel.r,
      g: acc.g + pixel.g,
      b: acc.b + pixel.b,
    }),
    { r: 0, g: 0, b: 0 },
  );

  return {
    r: Math.round(total.r / borderPixels.length),
    g: Math.round(total.g / borderPixels.length),
    b: Math.round(total.b / borderPixels.length),
  };
}

export function rgbToHex({ r, g, b }: RGB): string {
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

interface ParsedImage {
  pixels: RGB[];
  width: number;
  height: number;
}

function parsePNG(buffer: Buffer): ParsedImage | null {
  // PNG signature: 137 80 78 71 13 10 26 10
  if (
    buffer[0] !== 0x89 ||
    buffer[1] !== 0x50 ||
    buffer[2] !== 0x4e ||
    buffer[3] !== 0x47
  )
    return null;

  let offset = 8;
  let width = 0;
  let height = 0;
  let bitDepth = 0;
  let colorType = 0;
  const idatChunks: Buffer[] = [];

  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.toString("ascii", offset + 4, offset + 8);

    if (type === "IHDR") {
      width = buffer.readUInt32BE(offset + 8);
      height = buffer.readUInt32BE(offset + 12);
      bitDepth = buffer[offset + 16];
      colorType = buffer[offset + 17];
    } else if (type === "IDAT") {
      idatChunks.push(buffer.subarray(offset + 8, offset + 8 + length));
    } else if (type === "IEND") {
      break;
    }

    offset += 12 + length;
  }

  if (width === 0 || idatChunks.length === 0 || bitDepth !== 8) return null;

  // colorType: 0=grayscale, 2=RGB, 3=indexed, 4=grayscale+alpha, 6=RGBA
  const channels =
    colorType === 0
      ? 1
      : colorType === 2
        ? 3
        : colorType === 4
          ? 2
          : colorType === 6
            ? 4
            : 0;
  if (channels === 0) return null;

  const compressed = Buffer.concat(idatChunks);
  const raw = inflateSync(compressed);

  const bytesPerPixel = channels;
  const stride = width * bytesPerPixel;
  const pixels: RGB[] = [];

  // unfilter scanlines
  const unfiltered = Buffer.alloc(height * stride);
  for (let y = 0; y < height; y++) {
    const filterType = raw[y * (stride + 1)];
    const scanlineOffset = y * (stride + 1) + 1;
    const outOffset = y * stride;

    for (let x = 0; x < stride; x++) {
      const curr = raw[scanlineOffset + x];
      const a =
        x >= bytesPerPixel ? unfiltered[outOffset + x - bytesPerPixel] : 0;
      const b = y > 0 ? unfiltered[outOffset - stride + x] : 0;
      const c =
        x >= bytesPerPixel && y > 0
          ? unfiltered[outOffset - stride + x - bytesPerPixel]
          : 0;

      switch (filterType) {
        case 0:
          unfiltered[outOffset + x] = curr;
          break;
        case 1:
          unfiltered[outOffset + x] = (curr + a) & 0xff;
          break;
        case 2:
          unfiltered[outOffset + x] = (curr + b) & 0xff;
          break;
        case 3:
          unfiltered[outOffset + x] = (curr + ((a + b) >> 1)) & 0xff;
          break;
        case 4:
          unfiltered[outOffset + x] = (curr + paethPredictor(a, b, c)) & 0xff;
          break;
        default:
          unfiltered[outOffset + x] = curr;
      }
    }
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * stride + x * bytesPerPixel;
      if (channels === 1 || channels === 2) {
        const g = unfiltered[i];
        pixels.push({ r: g, g: g, b: g });
      } else {
        pixels.push({
          r: unfiltered[i],
          g: unfiltered[i + 1],
          b: unfiltered[i + 2],
        });
      }
    }
  }

  return { pixels, width, height };
}

function paethPredictor(a: number, b: number, c: number): number {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  if (pb <= pc) return b;
  return c;
}

function parseBMP(buffer: Buffer): ParsedImage | null {
  if (buffer[0] !== 0x42 || buffer[1] !== 0x4d) return null;

  const dataOffset = buffer.readUInt32LE(10);
  const width = buffer.readInt32LE(18);
  const height = Math.abs(buffer.readInt32LE(22));
  const bitsPerPixel = buffer.readUInt16LE(28);

  if (bitsPerPixel !== 24 && bitsPerPixel !== 32) return null;

  const bytesPerPixel = bitsPerPixel / 8;
  const rowSize = Math.ceil((bitsPerPixel * width) / 32) * 4;
  const pixels: RGB[] = [];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const offset = dataOffset + y * rowSize + x * bytesPerPixel;
      pixels.push({
        b: buffer[offset],
        g: buffer[offset + 1],
        r: buffer[offset + 2],
      });
    }
  }

  return { pixels, width, height };
}
