import { describe, expect, it } from 'vitest';
import { contrast, darkPalettes, lightPalettes, getPalette, DEFAULT_PALETTE_INDEX } from './index';

describe('palettes', () => {
  it('has 7 palettes per mode and Buz Mavisi as default', () => {
    expect(darkPalettes).toHaveLength(7);
    expect(lightPalettes).toHaveLength(7);
    expect(getPalette(DEFAULT_PALETTE_INDEX).name).toBe('Buz Mavisi');
    expect(getPalette().accent).toBe('#8fbcff');
  });

  const all = [
    ...darkPalettes.map((p) => ['dark', p] as const),
    ...lightPalettes.map((p) => ['light', p] as const),
  ];

  it.each(all)('%s %s: body text and accent text reach 4.5:1 on page and surface', (_m, p) => {
    for (const bg of [p.bg, p.surface]) {
      expect(contrast(p.text, bg)).toBeGreaterThanOrEqual(4.5);
      expect(contrast(p.accent, bg)).toBeGreaterThanOrEqual(4.5);
    }
  });

  it.each(all)('%s %s: muted text (--d) reaches 4.5:1 on page', (_m, p) => {
    expect(contrast(p.muted, p.bg)).toBeGreaterThanOrEqual(4.5);
  });
});
