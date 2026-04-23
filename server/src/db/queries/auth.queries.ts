import { pool } from '../../config/db.js'

//Find User By Email
export async function findUserByEmail(email: string) {
    const result = await pool.query('SELECT id, password_hash, is_verified FROM users WHERE email = $1', [email])
    return result.rows[0] || null
}
//Insert User
export async function insertUser(email: string, passwordHash: string) {
    const result = await pool.query('INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id', [email, passwordHash])
    return result.rows[0]
}
//Insert Verification Code
export async function insertVerificationCode(userId: string, verification_code: string, expired_at: Date) {
    const result = await pool.query('INSERT INTO verification_codes (user_id, verification_code, expired_at) VALUES ($1, $2, $3) RETURNING id', [userId, verification_code, expired_at])
    return result.rows[0]
}

//Find Latest Verification Code
export async function findLatestVerificationCode(userId: string) {
    const result = await pool.query('SELECT created_at FROM verification_codes WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1', [userId])
    return result.rows[0] || null
}

//Find Verification Code in DB
export async function findVerificationCode(email: string, code: string) {
    const result = await pool.query('SELECT verification_codes.id, verification_code, expired_at, is_used, user_id FROM verification_codes JOIN users ON verification_codes.user_id = users.id WHERE users.email = $1 AND verification_codes.verification_code = $2 ORDER BY verification_codes.expired_at DESC LIMIT 1', [email, code])
    return result.rows[0] || null
}

// //Mark user as verified
// export async function userVerified(email: string) {
//     await pool.query('UPDATE users SET is_verified = true WHERE email = $1', [email])
// }

// //Mark code as used
// export async function markCodeUsed(codeId: string) {
//     await pool.query('UPDATE verification_codes SET is_used = true WHERE id = $1', [codeId])
// }

//Combining both UPDATEs into one transactional function

export async function completeVerification(email: string, codeId: string) {
    const client = await pool.connect()
    try {
        await client.query('BEGIN')
        await client.query('UPDATE users SET is_verified = true WHERE email = $1', [email])
        await client.query('UPDATE verification_codes SET is_used = true WHERE id = $1', [codeId])
        await client.query('COMMIT')
    }
    catch (error) {
        await client.query('ROLLBACK')
        throw error
    }
    finally {
        client.release()
    }
}

//Insert Refresh Token
export async function insertRefreshToken(userId: string, hashedToken: string, expiresAt: Date) {
    const result = await pool.query(`INSERT INTO refresh_tokens (user_id, refresh_token_hash, expires_at) VALUES ($1, $2, $3) RETURNING *`, [userId, hashedToken, expiresAt])
    return result.rows[0]
}

//Find Refresh Token
export async function findRefreshToken(hashedToken: string) {
    const result = await pool.query(`SELECT * FROM refresh_tokens WHERE refresh_token_hash = $1 AND revoked = false AND expires_at > NOW()`, [hashedToken])
    return result.rows[0] || null;
}

//Revoke old Refresh Token
export async function revokeRefreshToken(hashToken: string) {
    const result = await pool.query(`UPDATE refresh_tokens SET revoked = true WHERE refresh_token_hash = $1`, [hashToken])
    return result.rows[0] || null;
} 