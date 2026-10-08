import { darkPalettes, lightPalettes, type Palette } from './generated';

export { darkPalettes, lightPalettes };
export type { Palette };

/** Default: Buz Mavisi, dark (palette index 4). */
export const DEFAULT_PALETTE_INDEX = 4;
export type Mode = 'dark' | 'light';

export function getPalette(index = DEFAULT_PALETTE_INDEX, mode: Mode = 'dark'): Palette {
  const p = (mode === 'dark' ? darkPalettes : lightPalettes)[index];
  if (!p) throw new Error(`unknown palette index ${index}`);
  return p;
}

/** v2 surface ladder (docs/DESIGN.md 2.2): alpha of white (dark) or ink (light) over the page. */
export const surfaceAlpha = { s1: 0.055, s2: 0.085, s3: 0.12 } as const;

/** v2 mid text tier, between --t and --d. */
export const MID_TEXT_DARK = '#9ba5b0';

export const space = { gutter: 16 } as const;
export const radius = { button: 12, row: 15, card: 20, hero: 26, phone: 40 } as const;
export const MIN_TOUCH_TARGET = 44;
export const fontWeights = { light: 300, regular: 400, medium: 500 } as const;

function lin(c: number): number {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}
export function luminance(hex: string): number {
  const n = parseInt(hex.slice(1), 16);
  return 0.2126 * lin((n >> 16) & 255) + 0.7152 * lin((n >> 8) & 255) + 0.0722 * lin(n & 255);
}
export function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}
