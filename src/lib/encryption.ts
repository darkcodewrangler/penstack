import "server-only";
import crypto from "crypto";

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || generateEncryptionKey();
const ALGORITHM = "aes-256-gcm";
console.log("ENCRYPTION_KEY", ENCRYPTION_KEY);

export function encryptKey(key: string): string {
  const iv = crypto.randomBytes(16);
  const keyBuffer = Buffer.from(ENCRYPTION_KEY, "hex");

  const cipher = crypto.createCipheriv(
    ALGORITHM,
    keyBuffer as crypto.CipherKey,
    iv as crypto.BinaryLike
  );

  const encrypted = cipher.update(key, "utf8", "hex") + cipher.final("hex");
  const authTag = cipher.getAuthTag();

  // Combine IV + encrypted data + auth tag
  return iv.toString("hex") + encrypted + authTag.toString("hex");
}

export function decryptKey(encryptedString: string): string {
  // Extract IV, encrypted data and auth tag
  const iv = Buffer.from(encryptedString.slice(0, 32), "hex");
  const authTag = Buffer.from(encryptedString.slice(-32), "hex");
  const encryptedData = encryptedString.slice(32, -32);

  const keyBuffer = Buffer.from(ENCRYPTION_KEY, "hex");

  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    keyBuffer as crypto.CipherKey,
    iv as crypto.BinaryLike
  );

  const authTagUint8Array = new Uint8Array(authTag);

  decipher.setAuthTag(authTagUint8Array);

  return decipher.update(encryptedData, "hex", "utf8") + decipher.final("utf8");
}
function generateEncryptionKey(): string {
  if (process.env.NODE_ENV === "production")
    throw new Error("ENCRYPTION_KEY is required in production");
  return crypto.randomBytes(32).toString("hex");
}
