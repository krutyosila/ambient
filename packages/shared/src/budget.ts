/** D-033: each paying subscriber's monthly AI budget = ratio x own monthly net revenue, clamped to tier floor/ceiling. */
export type Plan = { price: number; period: 'month' | 'year'; currency: 'TRY' | 'USD' };
export type Economics = { vatRate: number; commission: number; fxTryPerUsd: number };
export type Clamp = { ratio: number; min: number; max: number };

export function netMonthlyUsd(plan: Plan, e: Economics): number {
  const net = (plan.price / (1 + e.vatRate)) * (1 - e.commission);
  const monthly = plan.period === 'year' ? net / 12 : net;
  return plan.currency === 'TRY' ? monthly / e.fxTryPerUsd : monthly;
}

/** US prices carry no Turkish VAT in the model (docs/COST-POLICY.md 4.1 example). */
export function netFor(plan: Plan, e: Economics): number {
  return netMonthlyUsd(plan, plan.currency === 'USD' ? { ...e, vatRate: 0 } : e);
}

export function monthlyBudgetUsd(plan: Plan, e: Economics, c: Clamp): number {
  const raw = netFor(plan, e) * c.ratio;
  return Math.round(Math.min(c.max, Math.max(c.min, raw)) * 100) / 100;
}

/** Weekly smoothing: the auto-adjusted budget may move at most +-maxStep (default 10%) per week. */
export function smoothBudget(current: number, target: number, maxStep = 0.1): number {
  const hi = current * (1 + maxStep),
    lo = current * (1 - maxStep);
  return Math.round(Math.min(hi, Math.max(lo, target)) * 100) / 100;
}

/** Degradation stage from budget usage (docs/COST-POLICY.md 4.2). thresholds come from settings. */
export type Stage = 'normal' | 'haikuOnly' | 'shortContext' | 'localMode';
export function stageFor(
  used: number,
  budget: number,
  t = { sonnetOff: 0.7, shorten: 0.9, local: 1 },
): Stage {
  if (budget <= 0) return 'localMode';
  const r = used / budget;
  return r >= t.local
    ? 'localMode'
    : r >= t.shorten
      ? 'shortContext'
      : r >= t.sonnetOff
        ? 'haikuOnly'
        : 'normal';
}
