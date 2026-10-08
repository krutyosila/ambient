import { crossCheck, defaults, getDef, validateSetting, type Level } from '@ambient/shared';

/**
 * Draft -> validate -> (approval) -> publish -> rollback (docs/ADMIN.md section 4).
 * Pure logic over an in-memory state so it is fully testable; the database repository is added in M2 wiring.
 */
export type Actor = {
  id: string;
  role: 'superadmin' | 'content' | 'dietitian' | 'analyst' | 'support';
};
export type VersionRow = {
  key: string;
  version: number;
  oldValue: unknown;
  newValue: unknown;
  by: string;
  reason: string;
  at: Date;
  changeId: string;
};
export type Change = {
  id: string;
  items: { key: string; value: unknown }[];
  level: 0 | 1 | 2;
  reason: string;
  requestedBy: string;
  status: 'draft' | 'pending' | 'published' | 'rolledBack' | 'rejected';
  cooldownUntil?: Date;
  approvedBy?: string;
};

export type PublishResult = { ok: true; versions: VersionRow[] } | { ok: false; error: string };

export class SettingsEngine {
  private values: Record<string, unknown> = defaults();
  private versions: VersionRow[] = [];
  private changes = new Map<string, Change>();
  private seq = 0;

  constructor(
    private readonly opts: {
      cooldownMinutes: number;
      adminCount: () => number;
      now?: () => Date;
    } = { cooldownMinutes: 15, adminCount: () => 1 },
  ) {}

  private now() {
    return this.opts.now?.() ?? new Date();
  }
  get(key: string): unknown {
    return this.values[key];
  }
  history(key?: string): VersionRow[] {
    return key ? this.versions.filter((v) => v.key === key) : [...this.versions];
  }

  /** Highest risk level among the items; locked keys are rejected outright. */
  private levelOf(keys: string[]): Level {
    return keys.reduce<Level>((m, k) => {
      const l = getDef(k)?.level ?? 2;
      return l === 'locked' || m === 'locked' ? 'locked' : (Math.max(m, l) as 0 | 1 | 2);
    }, 0);
  }

  createDraft(
    actor: Actor,
    items: { key: string; value: unknown }[],
    reason: string,
  ): { ok: true; change: Change } | { ok: false; error: string } {
    if (
      actor.role !== 'superadmin' &&
      !(actor.role === 'content' && items.every((i) => getDef(i.key)?.level === 0))
    )
      return { ok: false, error: 'forbidden' };
    const next = { ...this.values };
    for (const it of items) {
      const v = validateSetting(it.key, it.value);
      if (!v.ok) return { ok: false, error: v.error };
      next[it.key] = v.value;
    }
    const problems = crossCheck(next);
    if (problems.length) return { ok: false, error: problems.join('; ') };
    const level = this.levelOf(items.map((i) => i.key)) as 0 | 1 | 2;
    if (level >= 1 && reason.trim().length < 3) return { ok: false, error: 'reason required' };
    const change: Change = {
      id: `c${++this.seq}`,
      items,
      level,
      reason,
      requestedBy: actor.id,
      status: 'draft',
    };
    this.changes.set(change.id, change);
    return { ok: true, change };
  }

  /** Level 2: with one admin, a typed confirmation and a cooldown replace the second approver (Q29). */
  submit(
    actor: Actor,
    changeId: string,
    typedConfirmation?: string,
  ): { ok: true; change: Change } | { ok: false; error: string } {
    const c = this.changes.get(changeId);
    if (!c || c.status !== 'draft') return { ok: false, error: 'not a draft' };
    if (c.level === 2) {
      if (this.opts.adminCount() > 1) {
        c.status = 'pending';
        return { ok: true, change: c };
      }
      if (typedConfirmation !== 'ONAYLIYORUM')
        return { ok: false, error: 'typed confirmation required' };
      c.status = 'pending';
      c.cooldownUntil = new Date(this.now().getTime() + this.opts.cooldownMinutes * 60_000);
    }
    return { ok: true, change: c };
  }

  approve(actor: Actor, changeId: string): { ok: true } | { ok: false; error: string } {
    const c = this.changes.get(changeId);
    if (!c || c.status !== 'pending') return { ok: false, error: 'not pending' };
    if (actor.role !== 'superadmin') return { ok: false, error: 'forbidden' };
    if (actor.id === c.requestedBy && this.opts.adminCount() > 1)
      return { ok: false, error: 'second admin required' };
    c.approvedBy = actor.id;
    return { ok: true };
  }

  publish(actor: Actor, changeId: string): PublishResult {
    const c = this.changes.get(changeId);
    if (!c) return { ok: false, error: 'unknown change' };
    if (c.level === 2) {
      if (c.status !== 'pending' || (!c.approvedBy && this.opts.adminCount() > 1))
        return { ok: false, error: 'approval required' };
      if (c.cooldownUntil && this.now() < c.cooldownUntil)
        return { ok: false, error: 'cooldown active' };
    } else if (c.status !== 'draft') return { ok: false, error: 'not a draft' };
    const rows = c.items.map((it) => this.write(it.key, it.value, actor.id, c));
    c.status = 'published';
    return { ok: true, versions: rows };
  }

  /** Rollback writes new versions that restore previous values (history is append-only). */
  rollback(actor: Actor, changeId: string): PublishResult {
    const c = this.changes.get(changeId);
    if (!c || c.status !== 'published') return { ok: false, error: 'not published' };
    const rows = this.versions
      .filter((v) => v.changeId === changeId)
      .map((v) => this.write(v.key, v.oldValue, actor.id, c, `rollback of ${changeId}`));
    c.status = 'rolledBack';
    return { ok: true, versions: rows };
  }

  private write(key: string, value: unknown, by: string, c: Change, reason = c.reason): VersionRow {
    const row: VersionRow = {
      key,
      version: this.versions.filter((v) => v.key === key).length + 1,
      oldValue: this.values[key],
      newValue: value,
      by,
      reason,
      at: this.now(),
      changeId: c.id,
    };
    this.values[key] = value;
    this.versions.push(row);
    return row;
  }
}
