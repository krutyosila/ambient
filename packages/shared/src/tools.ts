import { z } from 'zod';
import { iconKeySchema } from './icons.ts';

/**
 * Tool calls the LLM may return (start.md section 5). The model never writes free text to the plan:
 * output is validated here and applied by the deterministic executor.
 */
const when = z.string().min(1).max(64); // ISO-8601 or a relative token ("now", "morning"); resolved by the executor
const unit = z.enum(['bardak', 'ml', 'l', 'fincan', 'adet', 'doz', 'dk', 'saat', 'km', 'sayfa']);

export const toolSchemas = {
  create_event: z.object({
    title: z.string().min(1).max(120),
    start: when,
    end: when.optional(),
    iconKey: iconKeySchema,
    person: z.string().max(60).optional(),
  }),
  create_routine: z.object({
    title: z.string().min(1).max(120),
    kind: z.enum(['check', 'timed', 'counter']),
    rule: z.string().max(120),
    target: z.number().positive().optional(),
    targetMode: z.enum(['atLeast', 'atMost', 'exactly']).optional(),
    unit: unit.optional(),
    iconKey: iconKeySchema,
  }),
  add_floating_item: z.object({ title: z.string().min(1).max(120), iconKey: iconKeySchema }),
  mark_done: z.object({ itemRef: z.string().min(1).max(64) }),
  reschedule: z.object({ itemRef: z.string().min(1).max(64), start: when, end: when.optional() }),
  add_reminder: z.object({
    itemRef: z.string().max(64).optional(),
    text: z.string().min(1).max(120),
    at: when,
  }),
  add_person_note: z.object({
    person: z.string().min(1).max(60),
    note: z.string().min(1).max(500),
  }),
  query_day: z.object({ date: when }),
  ask_clarification: z.object({ question: z.string().min(1).max(140) }),
  log_progress: z.object({
    routine: z.string().min(1).max(64),
    amount: z.number().positive().max(10000),
    unit,
    at: when.default('now'),
  }),
  update_item: z.object({
    itemRef: z.string().min(1).max(64),
    title: z.string().max(120).optional(),
    iconKey: iconKeySchema.optional(),
  }),
  cancel_item: z.object({ itemRef: z.string().min(1).max(64) }),
  set_preference: z.object({
    key: z.enum(['quietHoursStart', 'quietHoursEnd', 'intensity', 'wakeTime', 'sleepTime']),
    value: z.string().min(1).max(32),
  }),
  set_icon: z.object({ itemRef: z.string().min(1).max(64), iconKey: iconKeySchema }),
  undo_last: z.object({}),
  forget_pattern: z.object({ patternRef: z.string().min(1).max(64) }),
} as const;

export type ToolName = keyof typeof toolSchemas;
export const TOOL_NAMES = Object.keys(toolSchemas) as ToolName[];

export const toolCallSchema = z.discriminatedUnion(
  'tool',
  TOOL_NAMES.map((name) => z.object({ tool: z.literal(name), args: toolSchemas[name] })) as never,
);
export type ToolCall = {
  [N in ToolName]: { tool: N; args: z.infer<(typeof toolSchemas)[N]> };
}[ToolName];

/** Validates an untrusted model output. Unknown tools and bad args are rejected, never applied. */
export function parseToolCall(
  raw: unknown,
): { ok: true; call: ToolCall } | { ok: false; error: string } {
  const r = toolCallSchema.safeParse(raw);
  return r.success
    ? { ok: true, call: r.data as ToolCall }
    : { ok: false, error: r.error.issues[0]?.message ?? 'invalid' };
}
