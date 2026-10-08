import { describe, expect, it } from 'vitest';
import {
  ICON_KEYS,
  parseToolCall,
  toolSchemas,
  SETTINGS,
  defaults,
  validateSetting,
  crossCheck,
  getDef,
  monthlyBudgetUsd,
  netFor,
  smoothBudget,
  stageFor,
} from './index.ts';

describe('icons', () => {
  it('has 45 unique keys', () => expect(new Set(ICON_KEYS).size).toBe(45));
});

describe('tool calls', () => {
  it('accepts the water example from DATA-MODEL', () => {
    const r = parseToolCall({
      tool: 'log_progress',
      args: { routine: 'su', amount: 2, unit: 'bardak', at: 'now' },
    });
    expect(r.ok).toBe(true);
  });
  it('rejects unknown tools and unknown icons (prompt-injection guard)', () => {
    expect(parseToolCall({ tool: 'delete_all', args: {} }).ok).toBe(false);
    expect(parseToolCall({ tool: 'set_icon', args: { itemRef: 'x', iconKey: 'robot' } }).ok).toBe(
      false,
    );
  });
  it('rejects absurd amounts', () => {
    expect(
      parseToolCall({ tool: 'log_progress', args: { routine: 'su', amount: 1e9, unit: 'ml' } }).ok,
    ).toBe(false);
  });
  it('covers the 16 documented tools', () => expect(Object.keys(toolSchemas)).toHaveLength(16));
});

describe('settings registry', () => {
  it('has unique keys and every default validates (locked ones match their literal)', () => {
    expect(new Set(SETTINGS.map((s) => s.key)).size).toBe(SETTINGS.length);
    for (const s of SETTINGS) expect(s.schema.safeParse(s.default).success, s.key).toBe(true);
  });
  it('defaults satisfy cross-field rules', () => expect(crossCheck(defaults())).toEqual([]));
  it('cross-check catches inverted budget bounds', () => {
    expect(
      crossCheck({ ...defaults(), 'cost.budget.plus.max': 0.05, 'cost.budget.plus.min': 0.12 }),
    ).not.toEqual([]);
  });
  it('rejects out-of-range and locked changes', () => {
    expect(validateSetting('cost.budgetRatio', 0.9).ok).toBe(false);
    expect(validateSetting('age.minimum', 10).ok).toBe(false);
    expect(validateSetting('nope', 1).ok).toBe(false);
    expect(validateSetting('cost.budgetRatio', 0.25).ok).toBe(true);
  });
  it('risky money/privacy settings are level 2', () => {
    for (const k of ['cost.commissionRate', 'cost.killSwitch', 'reports.minGroupSize'])
      expect(getDef(k)?.level).toBe(2);
  });
});

describe('budget (D-033, COST-POLICY 4.1 examples)', () => {
  const e = { vatRate: 0.2, commission: 0.3, fxTryPerUsd: 55 };
  const plus = { ratio: 0.3, min: 0.12, max: 0.4 };
  it('Plus yearly TL: net ~ $0.53, budget $0.16', () => {
    const plan = { price: 599.99, period: 'year', currency: 'TRY' } as const;
    expect(netFor(plan, e)).toBeCloseTo(0.53, 2);
    expect(monthlyBudgetUsd(plan, e, plus)).toBe(0.16);
  });
  it('Small Business (15%) raises it to $0.19', () => {
    const plan = { price: 599.99, period: 'year', currency: 'TRY' } as const;
    expect(monthlyBudgetUsd(plan, { ...e, commission: 0.15 }, plus)).toBe(0.19);
  });
  it('US Plus monthly is capped at $0.40', () => {
    expect(monthlyBudgetUsd({ price: 3.99, period: 'month', currency: 'USD' }, e, plus)).toBe(0.4);
  });
  it('smoothing limits weekly change to 10%', () => {
    expect(smoothBudget(0.16, 0.4)).toBe(0.18);
    expect(smoothBudget(0.16, 0.01)).toBe(0.14);
  });
  it('degradation stages follow thresholds', () => {
    expect(stageFor(0.5, 1)).toBe('normal');
    expect(stageFor(0.75, 1)).toBe('haikuOnly');
    expect(stageFor(0.95, 1)).toBe('shortContext');
    expect(stageFor(1, 1)).toBe('localMode');
  });
});
