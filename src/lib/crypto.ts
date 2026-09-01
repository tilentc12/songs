import crypto from "crypto";

const SECRET = process.env.AUDIO_SECRET || "better-guessable-default-secret-key-2026-super-secure";

export interface AudioTokenPayload {
  trackId: string;
  sessionId: string;
  expiresAt: number;
}

export function generateAudioToken(trackId: string, sessionId: string): string {
  const payload: AudioTokenPayload = {
    trackId,
    sessionId,
    expiresAt: Date.now() + 4 * 60 * 60 * 1000, // 4 hours valid
  };

  const jsonStr = JSON.stringify(payload);
  const iv = crypto.randomBytes(12);
  const key = crypto.createHash("sha256").update(SECRET).digest();
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);

  let encrypted = cipher.update(jsonStr, "utf8");
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  const tag = cipher.getAuthTag();

  // Combine iv + tag + ciphertext
  const combined = Buffer.concat([iv, tag, encrypted]);
  return combined.toString("base64url");
}

export function verifyAndDecodeAudioToken(token: string): AudioTokenPayload | null {
  try {
    const combined = Buffer.from(token, "base64url");
    if (combined.length < 28) return null; // 12 iv + 16 tag + min 1 byte payload

    const iv = combined.subarray(0, 12);
    const tag = combined.subarray(12, 28);
    const ciphertext = combined.subarray(28);

    const key = crypto.createHash("sha256").update(SECRET).digest();
    const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAuthTag(tag);

    let decrypted = decipher.update(ciphertext);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    const payload: AudioTokenPayload = JSON.parse(decrypted.toString("utf8"));
    if (Date.now() > payload.expiresAt) {
      return null; // Expired
    }

    return payload;
  } catch {
    return null;
  }
}

export function encodeChallengeSeed(trackId: string): string {
  const payload = {
    trackId,
    created: Math.floor(Date.now() / 1000),
  };
  const str = JSON.stringify(payload);
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    crypto.createHash("sha256").update(SECRET).digest(),
    Buffer.alloc(16, 0)
  );
  let enc = cipher.update(str, "utf8", "base64url");
  enc += cipher.final("base64url");
  return enc;
}

export function decodeChallengeSeed(seed: string): string | null {
  try {
    const decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      crypto.createHash("sha256").update(SECRET).digest(),
      Buffer.alloc(16, 0)
    );
    let dec = decipher.update(seed, "base64url", "utf8");
    dec += decipher.final("utf8");
    const parsed = JSON.parse(dec);
    return parsed.trackId || null;
  } catch {
    return null;
  }
}
