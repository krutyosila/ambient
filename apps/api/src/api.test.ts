import { describe, expect, it } from 'vitest';
import { randomBytes } from 'node:crypto';
import { loadBootEnv } from './env.ts';
import { EnvelopeSecretStore, maskSecret } from './settings/secret-store.ts';
import { SettingsEngine, type Actor } from './settings/change-engine.ts';
import { HealthController } from './health/health.controller.ts';

const key = randomBytes(32).toString('base64');
const admin: Actor = { id: 'a1', role: 'superadmin' };

describe('boot env', () => {
  const ok = {
    APP_ENV: 'local',
    DATABASE_URL: 'postgresql://a:b@localhost:5432/x',
    REDIS_URL: 'redis://localhost:6379',
    SETTINGS_MASTER_KEY: key,
  };
  it('accepts the 6-variable bootstrap set', () => expect(loadBootEnv(ok).PORT).toBe(3000));
  it('rejects a weak master key and missing vars', () => {
    expect(() => loadBootEnv({ ...ok, SETTINGS_MASTER_KEY: 'short' })).toThrow();
    expect(() => loadBootEnv({})).toThrow(/Invalid boot environment/);
  });
});

describe('secret store', () => {
  it('round-trips and never stores plaintext', () => {
    const s = new EnvelopeSecretStore(key);
    const sealed = s.seal('sk-ant-secret-3f9a');
    expect(JSON.stringify(sealed)).not.toContain('sk-ant');
    expect(s.open(sealed)).toBe('sk-ant-secret-3f9a');
    expect(maskSecret('sk-ant-secret-3f9a')).toBe('••••3f9a');
  });
  it('fails with a different master key', () => {
    const sealed = new EnvelopeSecretStore(key).seal('x');
    expect(() =>
      new EnvelopeSecretStore(randomBytes(32).toString('base64')).open(sealed),
    ).toThrow();
  });
});

describe('settings change engine', () => {
  it('level 1: needs a reason, publishes, versions and rolls back', () => {
    const e = new SettingsEngine();
    expect(e.createDraft(admin, [{ key: 'llm.primary.effort', value: 'medium' }], '').ok).toBe(
      false,
    );
    const d = e.createDraft(admin, [{ key: 'llm.primary.effort', value: 'medium' }], 'deneme');
    if (!d.ok) throw new Error(d.error);
    expect(e.get('llm.primary.effort')).toBe('low'); // not live before publish
    expect(e.publish(admin, d.change.id).ok).toBe(true);
    expect(e.get('llm.primary.effort')).toBe('medium');
    expect(e.rollback(admin, d.change.id).ok).toBe(true);
    expect(e.get('llm.primary.effort')).toBe('low');
    expect(e.history('llm.primary.effort')).toHaveLength(2);
  });
  it('rejects invalid values, cross-field violations and locked keys', () => {
    const e = new SettingsEngine();
    expect(e.createDraft(admin, [{ key: 'cost.budgetRatio', value: 5 }], 'x1x').ok).toBe(false);
    expect(e.createDraft(admin, [{ key: 'cost.budget.plus.max', value: 0.1 }], 'x1x').ok).toBe(
      false,
    ); // below min 0.12
    expect(e.createDraft(admin, [{ key: 'age.minimum', value: 10 }], 'x1x').ok).toBe(false);
  });
  it('level 2 with a single admin: typed confirmation + cooldown (Q29)', () => {
    let now = new Date('2026-10-08T10:00:00Z');
    const e = new SettingsEngine({ cooldownMinutes: 15, adminCount: () => 1, now: () => now });
    const d = e.createDraft(admin, [{ key: 'cost.budget.plus.max', value: 0.5 }], 'tavan artışı');
    if (!d.ok) throw new Error(d.error);
    expect(d.change.level).toBe(2);
    expect(e.submit(admin, d.change.id).ok).toBe(false);
    expect(e.submit(admin, d.change.id, 'ONAYLIYORUM').ok).toBe(true);
    expect(e.publish(admin, d.change.id)).toEqual({ ok: false, error: 'cooldown active' });
    now = new Date('2026-10-08T10:16:00Z');
    expect(e.publish(admin, d.change.id).ok).toBe(true);
    expect(e.get('cost.budget.plus.max')).toBe(0.5);
  });
  it('level 2 with two admins: requester cannot self-approve', () => {
    const e = new SettingsEngine({ cooldownMinutes: 0, adminCount: () => 2 });
    const d = e.createDraft(admin, [{ key: 'cost.commissionRate', value: 0.15 }], 'small business');
    if (!d.ok) throw new Error(d.error);
    e.submit(admin, d.change.id);
    expect(e.approve(admin, d.change.id)).toEqual({ ok: false, error: 'second admin required' });
    expect(e.approve({ id: 'a2', role: 'superadmin' }, d.change.id).ok).toBe(true);
    expect(e.publish(admin, d.change.id).ok).toBe(true);
  });
  it('dietitian cannot change settings', () => {
    const e = new SettingsEngine();
    expect(
      e.createDraft(
        { id: 'd1', role: 'dietitian' },
        [{ key: 'notify.defaultQuietStart', value: '22:00' }],
        'x1x',
      ),
    ).toEqual({ ok: false, error: 'forbidden' });
  });
});

describe('health', () => {
  it('returns ok', () => expect(new HealthController().check().status).toBe('ok'));
});
