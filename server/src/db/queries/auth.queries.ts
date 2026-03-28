import { pool } from '../../config/db.js'

//Find User By Email
export async function findUserByEmail(email: string) {
    const result = await pool.query('SELECT id, password_hash, is_verified FROM users WHERE email = $1', [email])
    return result.rows[0] || null
}
//Insert User
export async function insertUser(email: string, passwordHash: string) {
    const result = await pool.query('INSERT INTO users (email, passowrd_hash) VALUES ($1,$2) RETURNING id', [email, passwordHash])
    return result.rows[0]
}
//Insert Verification Code
export async function insertVerificationCode