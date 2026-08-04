import crypto from "crypto";

const ALGORITHM = "aes-256-cbc";
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "f19e4823c6f78f2441c9b3a31cd7838561129b85292c2b8c5a472c6cf1f7871b"; // Must be 32 bytes hex (64 chars)
const IV_LENGTH = 16; // For AES, this is always 16

const keyBuffer = Buffer.from(ENCRYPTION_KEY, "hex");
if (keyBuffer.length !== 32) {
  throw new Error("ENCRYPTION_KEY must be exactly 32 bytes (64 hex characters).");
}

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, keyBuffer, iv);
  
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  
  return iv.toString("hex") + ":" + encrypted;
}

export function decrypt(text: string): string {
  const textParts = text.split(":");
  const ivPart = textParts.shift();
  if (!ivPart) {
    throw new Error("Invalid encrypted text format.");
  }
  
  const iv = Buffer.from(ivPart, "hex");
  const encryptedText = Buffer.from(textParts.join(":"), "hex");
  const decipher = crypto.createDecipheriv(ALGORITHM, keyBuffer, iv);
  
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  
  return decrypted.toString("utf8");
}
