export interface ColourDefinition {
  name: string;
  slug: string;
  hex: string;
  family: 'black' | 'white' | 'blue' | 'green' | 'red' | 'brown' | 'purple' | 'grey' | 'yellow' | 'pattern';
}

export const COLOUR_PALETTE: Record<string, ColourDefinition> = {
  black: { name: 'Black', slug: 'black', hex: '#111111', family: 'black' },
  white: { name: 'White', slug: 'white', hex: '#FFFFFF', family: 'white' },
  'off-white': { name: 'Off-White', slug: 'off-white', hex: '#F4EFE6', family: 'white' },
  'pastel-green': { name: 'Pastel Green', slug: 'pastel-green', hex: '#9BD39B', family: 'green' },
  lavender: { name: 'Lavender', slug: 'lavender', hex: '#B9A5E8', family: 'purple' },
  'jalapeno-red': { name: 'Jalapeno Red', slug: 'jalapeno-red', hex: '#B3202A', family: 'red' },
  'leather-brown': { name: 'Leather Brown', slug: 'leather-brown', hex: '#9A5B2D', family: 'brown' },
  turquoise: { name: 'Turquoise', slug: 'turquoise', hex: '#1FB8A5', family: 'blue' },
  navy: { name: 'Navy', slug: 'navy', hex: '#1B2A4A', family: 'blue' },
  blue: { name: 'Blue', slug: 'blue', hex: '#4C79C6', family: 'blue' },
  'bottle-green': { name: 'Bottle Green', slug: 'bottle-green', hex: '#0E5A6B', family: 'green' },
  wine: { name: 'Wine', slug: 'wine', hex: '#5A1F2E', family: 'red' },
  rust: { name: 'Rust', slug: 'rust', hex: '#9C3B1E', family: 'red' },
  grey: { name: 'Grey', slug: 'grey', hex: '#6F6BA6', family: 'grey' },
  beige: { name: 'Beige', slug: 'beige', hex: '#D9C7A5', family: 'brown' },
  brown: { name: 'Brown', slug: 'brown', hex: '#4A2C1F', family: 'brown' },
  aqua: { name: 'Aqua', slug: 'aqua', hex: '#6FB5BE', family: 'blue' },
  'mint-green': { name: 'Mint Green', slug: 'mint-green', hex: '#8FD1B0', family: 'green' },
  charcoal: { name: 'Charcoal', slug: 'charcoal', hex: '#2F3338', family: 'grey' },
  lemon: { name: 'Lemon', slug: 'lemon', hex: '#D9A62A', family: 'yellow' },
  chocolate: { name: 'Chocolate', slug: 'chocolate', hex: '#8A5A3C', family: 'brown' },
  green: { name: 'Green', slug: 'green', hex: '#1F4D3A', family: 'green' },
  'r-gold': { name: 'R.Gold', slug: 'r-gold', hex: '#E3B88A', family: 'brown' },
  'd-grey': { name: 'D.Grey', slug: 'd-grey', hex: '#8D8D92', family: 'grey' },
  pista: { name: 'Pista', slug: 'pista', hex: '#A9D6C0', family: 'green' },
  choco: { name: 'Choco', slug: 'choco', hex: '#8C5A4A', family: 'brown' },
  'rose-pink': { name: 'Rose Pink', slug: 'rose-pink', hex: '#D890A8', family: 'red' },
  'sky-blue': { name: 'Sky Blue', slug: 'sky-blue', hex: '#7DB6E3', family: 'blue' },
  'lilac-grey': { name: 'Lilac Grey', slug: 'lilac-grey', hex: '#9A96B8', family: 'purple' },
  'sand-beige': { name: 'Sand Beige', slug: 'sand-beige', hex: '#D2B48C', family: 'brown' },
  'sage-green': { name: 'Sage Green', slug: 'sage-green', hex: '#A8C4A2', family: 'green' },
  // Pattern designs
  'design-01': { name: 'Design 01', slug: 'design-01', hex: '#1B2A4A', family: 'pattern' },
  'design-02': { name: 'Design 02', slug: 'design-02', hex: '#1F4D3A', family: 'pattern' },
  'design-03': { name: 'Design 03', slug: 'design-03', hex: '#4C79C6', family: 'pattern' },
  'design-04': { name: 'Design 04', slug: 'design-04', hex: '#8D8D92', family: 'pattern' },
  'design-05': { name: 'Design 05', slug: 'design-05', hex: '#D9A62A', family: 'pattern' },
  // Coming soon placeholder
  'coming-soon': { name: 'Colours TBD', slug: 'coming-soon', hex: '#D9C7A5', family: 'pattern' },
};

export interface VariantColourInput {
  hex?: string | null;
  colourName?: string | null;
  colourSlug?: string | null;
}

export const FALLBACK_HEX = "#888888";

const AUTHORITATIVE_COLOUR_MAP: Record<string, string> = {
  black: "#111111",
  white: "#FFFFFF",
  offwhite: "#F4EFE6",
  pastelgreen: "#9BD39B",
  lavender: "#B9A5E8",
  jalapenored: "#B3202A",
  leatherbrown: "#9A5B2D",
  turquoise: "#1FB8A5",
  navy: "#1B2A4A",
  blue: "#4C79C6",
  bottlegreen: "#0E5A6B",
  wine: "#5A1F2E",
  rust: "#9C3B1E",
  grey: "#6F6BA6",
  gray: "#6F6BA6",
  beige: "#D9C7A5",
  brown: "#4A2C1F",
  aqua: "#6FB5BE",
  mintgreen: "#8FD1B0",
  charcoal: "#2F3338",
  lemon: "#D9A62A",
  chocolate: "#8A5A3C",
  green: "#1F4D3A",
  rgold: "#E3B88A",
  rosegold: "#E3B88A",
  dgrey: "#8D8D92",
  darkgrey: "#8D8D92",
  dgray: "#8D8D92",
  darkgray: "#8D8D92",
  pista: "#A9D6C0",
  pistagreen: "#A9D6C0",
  choco: "#8C5A4A",
  rosepink: "#D890A8",
  skyblue: "#7DB6E3",
  lilacgrey: "#9A96B8",
  lilacgray: "#9A96B8",
  sandbeige: "#D2B48C",
  sagegreen: "#A8C4A2",
  // Pattern designs
  design01: "#1B2A4A",
  design1: "#1B2A4A",
  design02: "#1F4D3A",
  design2: "#1F4D3A",
  design03: "#4C79C6",
  design3: "#4C79C6",
  design04: "#8D8D92",
  design4: "#8D8D92",
  design05: "#D9A62A",
  design5: "#D9A62A",
  comingsoon: "#D9C7A5",
  colourstbd: "#D9C7A5",
  colorstbd: "#D9C7A5",
};

function normalizeColourKey(nameOrSlug?: string | null): string {
  if (!nameOrSlug || typeof nameOrSlug !== "string") return "";
  return nameOrSlug
    .toLowerCase()
    .trim()
    .replace(/[\s\-_.]+/g, "")
    .replace(/[^a-z0-9]/g, "");
}

export function isDarkHex(hex?: string | null): boolean {
  if (!hex || typeof hex !== "string") return false;
  const clean = hex.replace("#", "").trim();
  if (clean.length !== 6 && clean.length !== 3) return false;
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  const r = parseInt(full.substring(0, 2), 16);
  const g = parseInt(full.substring(2, 4), 16);
  const b = parseInt(full.substring(4, 6), 16);
  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return false;
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return luminance < 0.35;
}

export function getVariantHex(variant: VariantColourInput | string | null | undefined): string {
  if (!variant) {
    return handleFallback("unknown", undefined);
  }

  const v: VariantColourInput =
    typeof variant === "string"
      ? { colourSlug: variant, colourName: variant }
      : variant;

  const rawSlug = v.colourSlug?.trim() || "";
  const rawName = v.colourName?.trim() || "";
  const rawHex = typeof v.hex === "string" ? v.hex.trim() : "";

  const slugKey = normalizeColourKey(rawSlug);
  const nameKey = normalizeColourKey(rawName);

  // 1. Authoritative palette lookup by normalized slug or name
  if (slugKey && AUTHORITATIVE_COLOUR_MAP[slugKey]) {
    return AUTHORITATIVE_COLOUR_MAP[slugKey];
  }
  if (nameKey && AUTHORITATIVE_COLOUR_MAP[nameKey]) {
    return AUTHORITATIVE_COLOUR_MAP[nameKey];
  }

  // 2. Validate rawHex if provided
  if (rawHex && /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(rawHex)) {
    const isCorruptedBlack = /^#(111|000|111111|000000)$/i.test(rawHex);
    const isBlackNamed =
      (slugKey && (slugKey.includes("black") || slugKey.includes("charcoal"))) ||
      (nameKey && (nameKey.includes("black") || nameKey.includes("charcoal")));

    if (!isCorruptedBlack || isBlackNamed) {
      const clean = rawHex.replace("#", "");
      const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
      return `#${full.toUpperCase()}`;
    }
  }

  // 3. Fallback handling: throw in dev/test, neutral grey in production
  return handleFallback(rawName || rawSlug || "unknown", rawHex || undefined);
}

function handleFallback(identifier: string, invalidHex?: string): string {
  const isDevOrTest =
    (typeof process !== "undefined" && process.env?.NODE_ENV === "test") ||
    (typeof import.meta !== "undefined" && Boolean(import.meta.env?.DEV));

  if (isDevOrTest) {
    throw new Error(
      `[getVariantHex] Unknown colour "${identifier}" with invalid or missing hex "${invalidHex ?? "undefined"}". All variant colours must be defined in COLOUR_PALETTE.`
    );
  }

  return FALLBACK_HEX;
}
