// Generates docs/SETTINGS.md from the registry so documentation cannot drift (docs/ADMIN.md section 11).
import { writeFileSync } from 'node:fs';
import { SETTINGS } from '../src/settings.ts';

const groups: Record<string, string> = {
  ai: 'Yapay zekâ',
  cost: 'Maliyet',
  product: 'Ürün kuralları',
  auth: 'Giriş ve e-posta',
  general: 'Genel',
  security: 'Güvenlik',
};
const lvl = (l: unknown) => (l === 'locked' ? 'Kilitli' : `Seviye ${l}`);
let out =
  '# Ayar kataloğu\n\n> Bu dosya `packages/shared/src/settings.ts` kayıt defterinden üretilir (`pnpm --filter @ambient/shared docs`). Elle düzenleme.\n';
for (const [g, title] of Object.entries(groups)) {
  out += `\n## ${title}\n\n| Anahtar | Ad | Varsayılan | Birim | Risk | Karar |\n|---|---|---|---|---|---|\n`;
  for (const s of SETTINGS.filter((x) => x.group === g)) {
    out += `| \`${s.key}\` | ${s.label} | \`${JSON.stringify(s.default)}\` | ${s.unit ?? ''} | ${lvl(s.level)} | ${s.decision ?? ''} |\n`;
  }
}
writeFileSync(new URL('../../../docs/SETTINGS.md', import.meta.url), out);
console.log('docs/SETTINGS.md written:', SETTINGS.length, 'settings');
