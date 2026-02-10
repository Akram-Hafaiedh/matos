import crypto from 'crypto';

/**
 * Tactical Encryption Layer
 * Uses AES-256-GCM for authenticated encryption.
 * The secret should be a 32-byte key stored in environment variables.
 */

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;
const KEY_LENGTH = 32;
const ITERATIONS = 100000;

// Fallback for development if secret is missing
const ENCRYPTION_KEY = process.env.CRYPTO_SECRET || 'matos-tactical-secret-key-32-chars-long';

/**
 * Encrypts a string into a base64 encoded bundle: iv:salt:authTag:encryptedContent
 */
export function encrypt(text: string): string {
    if (!text) return '';

    const iv = crypto.randomBytes(IV_LENGTH);
    const salt = crypto.randomBytes(SALT_LENGTH);

    // Derive a key from the secret using PBKDF2
    const key = crypto.pbkdf2Sync(ENCRYPTION_KEY, salt, ITERATIONS, KEY_LENGTH, 'sha512');

    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();

    return [
        iv.toString('base64'),
        salt.toString('base64'),
        tag.toString('base64'),
        encrypted.toString('base64')
    ].join(':');
}

/**
 * Decrypts an encrypted bundle back into original text
 */
export function decrypt(bundle: string): string {
    if (!bundle || !bundle.includes(':')) return bundle;

    try {
        const [ivBase64, saltBase64, tagBase64, encryptedBase64] = bundle.split(':');

        const iv = Buffer.from(ivBase64, 'base64');
        const salt = Buffer.from(saltBase64, 'base64');
        const tag = Buffer.from(tagBase64, 'base64');
        const encrypted = Buffer.from(encryptedBase64, 'base64');

        const key = crypto.pbkdf2Sync(ENCRYPTION_KEY, salt, ITERATIONS, KEY_LENGTH, 'sha512');

        const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
        decipher.setAuthTag(tag);

        const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);

        return decrypted.toString('utf8');
    } catch (error) {
        console.error('Decryption failed:', error);
        return bundle; // Return original if decryption fails (might be plain text during migration)
    }
}
