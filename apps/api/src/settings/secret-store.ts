import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';

/**
 * Envelope encryption for secrets stored in the database (docs/ADMIN.md section 2, Q28).
 * A random data key encrypts the value (AES-256-GCM); the data key is wrapped by SETTINGS_MASTER_KEY.
 * `SecretStore` is the seam where an external secret manager could be plugged in later.
 */
export type SealedSecret = { ciphertext: string; wrappedKey: string; keyId: string };

export interface SecretStore {
  seal(plaintext: string): SealedSecret;
  open(sealed: SealedSecret): string;
}

const b64 = (b: Buffer) => b.toString('base64');
const enc = (key: Buffer, data: Buffer): string => {
  const iv = randomBytes(12);
  const c = createCipheriv('aes-256-gcm', key, iv);
  const body = Buffer.concat([c.update(data), c.final()]);
  return b64(Buffer.concat([iv, c.getAuthTag(), body]));
};
const dec = (key: Buffer, packed: string): Buffer => {
  const raw = Buffer.from(packed, 'base64');
  const d = createDecipheriv('aes-256-gcm', key, raw.subarray(0, 12));
  d.setAuthTag(raw.subarray(12, 28));
  return Buffer.concat([d.update(raw.subarray(28)), d.final()]);
};

export class EnvelopeSecretStore implements SecretStore {
  private readonly master: Buffer;
  constructor(
    masterKeyBase64: string,
    private readonly keyId = 'k1',
  ) {
    this.master = Buffer.from(masterKeyBase64, 'base64');
    if (this.master.length !== 32) throw new Error('master key must be 32 bytes');
  }
  seal(plaintext: string): SealedSecret {
    const dataKey = randomBytes(32);
    return {
      ciphertext: enc(dataKey, Buffer.from(plaintext, 'utf8')),
      wrappedKey: enc(this.master, dataKey),
      keyId: this.keyId,
    };
  }
  open(s: SealedSecret): string {
    return dec(dec(this.master, s.wrappedKey), s.ciphertext).toString('utf8');
  }
}

/** UI-safe display of a secret: never the value, only the tail. */
export const maskSecret = (plaintext: string): string =>
  plaintext.length <= 4 ? '••••' : `••••${plaintext.slice(-4)}`;
