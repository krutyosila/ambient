import { z } from 'zod';

/** The only environment variables the API reads (docs/ADMIN.md section 2, D-049). Everything else is a panel setting. */
export const bootEnvSchema = z.object({
  APP_ENV: z.enum(['local', 'staging', 'production']),
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url(),
  SETTINGS_MASTER_KEY: z
    .string()
    .refine((v) => Buffer.from(v, 'base64').length === 32, '32 bytes, base64'),
  ADMIN_BOOTSTRAP_EMAIL: z.string().email().optional().or(z.literal('')),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
});
export type BootEnv = z.infer<typeof bootEnvSchema>;

export function loadBootEnv(source: Record<string, string | undefined> = process.env): BootEnv {
  const r = bootEnvSchema.safeParse(source);
  if (!r.success) {
    const bad = r.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ');
    throw new Error(`Invalid boot environment: ${bad}`);
  }
  return r.data;
}
