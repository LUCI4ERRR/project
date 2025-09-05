/**
 * Simple AES-256-CBC encrypt/decrypt using Node crypto.
 * The key is derived from ENCRYPTION_SECRET in .env (sha256).
 * Stores iv + ciphertext as base64: iv:cipher
 *
 * NOTE: For production, consider using a dedicated KMS or libsodium.
 */

const crypto = require("crypto");

const secret = process.env.ENCRYPTION_SECRET || process.env.JWT_SECRET || "fallback_secret";
const key = crypto.createHash("sha256").update(String(secret)).digest(); // 32 bytes

function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  let encrypted = cipher.update(String(text), "utf8", "base64");
  encrypted += cipher.final("base64");
  const payload = iv.toString("base64") + ":" + encrypted;
  return payload;
}

function decrypt(payload) {
  if (!payload) return "";
  const parts = payload.split(":");
  if (parts.length !== 2) return "";
  const iv = Buffer.from(parts[0], "base64");
  const encrypted = parts[1];
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  let out = decipher.update(encrypted, "base64", "utf8");
  out += decipher.final("utf8");
  return out;
}

module.exports = { encrypt, decrypt };
