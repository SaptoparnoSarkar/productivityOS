import crypto from 'crypto'
import bcrypt from 'bcrypt'

export function generateVerificationCode() {
    const verificationCode = crypto.randomInt(100000, 999999)
    return verificationCode;
}

export function verifyPassword(password: string, passwordHash: string) {
    return bcrypt.compare(password, passwordHash)
}

export function generateRefreshToken() {
    return crypto.randomBytes(32).toString('base64url')
}

export function hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex')
}
