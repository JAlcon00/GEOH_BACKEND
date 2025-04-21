import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_secreta';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
const PRIVATE_KEY = process.env.PRIVATE_KEY || 'clave_privada';
const PUBLIC_KEY = process.env.PUBLIC_KEY || 'clave_publica';

export const generateToken = (payload: object): string => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

/**
 * Verifies the given JWT token.
 *
 * @param token - The JWT token to verify.
 * @returns The decoded token if verification is successful.
 * @throws Will throw an error if the token is invalid.
 */
export const verifyToken = (token: string): any => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        throw new Error('Token inválido');
    }
};

/**
 * Decrypts the given encrypted password using the private key.
 *
 * @param encryptedPassword - The encrypted password to decrypt.
 * @returns The decrypted password.
 */
export const decryptPassword = (encryptedPassword: string): string => {
    const buffer = Buffer.from(encryptedPassword, 'base64');
    const decrypted = crypto.privateDecrypt(
        {
            key: PRIVATE_KEY,
            passphrase: '',
        },
        buffer
    );
    return decrypted.toString('utf8');
};