import express, { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jwt-simple' // Alternative to jsonwebtoken for simplicity if jsonwebtoken has types issues
import { query } from '../db/pool'

const router = express.Router()

// Secret should be in .env in production
const JWT_SECRET = process.env.JWT_SECRET || 'me_corp_super_secret_key'

// User shape from DB
interface UserRow {
    id: number
    username: string
    email: string
    password_hash: string
}

// Register
router.post('/register', async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, email, password } = req.body

        // Basic validation
        if (!username || !email || !password) {
            res.status(400).json({ error: 'Missing required fields' })
            return
        }

        // Check if user exists
        const existing = await query('SELECT id FROM users WHERE email = $1 OR username = $2', [email, username])
        if (existing.rows.length > 0) {
            res.status(409).json({ error: 'Username or Email already exists' })
            return
        }

        // Hash password
        const saltRounds = 10
        const passwordHash = await bcrypt.hash(password, saltRounds)

        // Insert user
        const result = await query(
            'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email',
            [username, email, passwordHash]
        )

        const newUser = result.rows[0]

        // Auto-login after register (generate token)
        const payload = { id: newUser.id, username: newUser.username }
        const token = jwt.encode(payload, JWT_SECRET)

        res.status(201).json({ message: 'Registration successful', token, user: newUser })
    } catch (error) {
        console.error('Registration error:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
})

// Login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            res.status(400).json({ error: 'Missing email or password' })
            return
        }

        // Find user
        const result = await query('SELECT * FROM users WHERE email = $1', [email])
        if (result.rows.length === 0) {
            res.status(401).json({ error: 'Invalid credentials' })
            return
        }

        const user: UserRow = result.rows[0]

        // Verify password
        const match = await bcrypt.compare(password, user.password_hash)
        if (!match) {
            res.status(401).json({ error: 'Invalid credentials' })
            return
        }

        // Generate token
        const payload = { id: user.id, username: user.username }
        const token = jwt.encode(payload, JWT_SECRET)

        res.json({
            message: 'Login successful',
            token,
            user: { id: user.id, username: user.username, email: user.email }
        })
    } catch (error) {
        console.error('Login error:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
})

// Forgot Password (Mock)
router.post('/forgot-password', async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body
    if (!email) {
        res.status(400).json({ error: 'Email is required' })
        return
    }

    // In a real app: check if email exists, generate reset token, insert to DB, send email.
    // For MVP: we just pretend to send it if valid format.
    console.log(`[Mock] Sending password reset email to: ${email}`)
    res.json({ message: 'If an account exists with that email, a password reset link has been sent.' })
})

export default router
