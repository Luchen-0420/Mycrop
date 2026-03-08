import express, { Request, Response } from 'express'
import { query } from '../db/pool'

const router = express.Router()

// Middleware to mock or extract user_id from auth (Assuming phase 1.5 added some form of auth middleware, 
// for MVP we might just extract user_id if we added a mock auth, but since we have JWT, we should ideally use it.
// To avoid blocking, we will just use a hardcoded user_id=1 for now if no auth middleware is strictly enforced, 
// OR we expect the frontend to send the token. Let's assume standard REST for now, and we'll add the auth middleware later if needed.
// For now, we will read user_id from req.user if present, else fallback to 1 for testing.)

// Helper to get user_id
const getUserId = (req: any) => {
    // In a real app, this comes from token verification middleware
    return req.user?.userId || 1
}

// ==========================================
// 1. Profile / Employee File (员工档案)
// ==========================================
router.get('/profile', async (req, res) => {
    const userId = getUserId(req)
    try {
        const result = await query('SELECT id, username, email, created_at FROM users WHERE id = $1', [userId])
        if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' })

        const user = result.rows[0]
        // Calculate days since joining
        const joinDate = new Date(user.created_at)
        const today = new Date()
        const diffTime = Math.abs(today.getTime() - joinDate.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        // Mock profile data for MVP
        res.json({
            user: { username: user.username, email: user.email },
            joinDays: diffDays,
            level: 'P3',
            title: 'Senior Manager',
            tags: ['Bilingual', 'Fullstack', 'Night Owl']
        })
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch profile' })
    }
})

// ==========================================
// 2. Skills Center (技能中心)
// ==========================================
router.get('/skills', async (req, res) => {
    const userId = getUserId(req)
    try {
        const result = await query('SELECT * FROM skills WHERE user_id = $1 ORDER BY level DESC, xp DESC', [userId])
        res.json(result.rows)
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch skills' })
    }
})

router.post('/skills', async (req, res) => {
    const userId = getUserId(req)
    const { name, category } = req.body
    if (!name || !category) return res.status(400).json({ error: 'Name and category are required' })

    try {
        const result = await query(
            'INSERT INTO skills (user_id, name, category, level, xp, max_xp) VALUES ($1, $2, $3, 1, 0, 100) RETURNING *',
            [userId, name, category]
        )
        res.status(201).json(result.rows[0])
    } catch (err: any) {
        if (err.code === '23505') return res.status(409).json({ error: 'Skill already exists' })
        res.status(500).json({ error: 'Failed to add skill' })
    }
})

router.put('/skills/:id/xp', async (req, res) => {
    const userId = getUserId(req)
    const skillId = req.params.id
    const { add_xp } = req.body

    if (!add_xp || typeof add_xp !== 'number') return res.status(400).json({ error: 'Invalid add_xp value' })

    try {
        // 1. Get current skill
        const skillRes = await query('SELECT * FROM skills WHERE id = $1 AND user_id = $2', [skillId, userId])
        if (skillRes.rows.length === 0) return res.status(404).json({ error: 'Skill not found' })

        let skill = skillRes.rows[0]
        let newXp = skill.xp + add_xp
        let newLevel = skill.level
        let newMaxXp = skill.max_xp

        // Level up logic
        while (newXp >= newMaxXp) {
            newLevel += 1
            newXp -= newMaxXp
            newMaxXp = Math.floor(newMaxXp * 1.5) // Increase max_xp requirement by 50%
        }

        // 2. Update skill
        const updateRes = await query(
            'UPDATE skills SET xp = $1, level = $2, max_xp = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
            [newXp, newLevel, newMaxXp, skillId]
        )

        res.json({ message: 'XP added successfully', skill: updateRes.rows[0], leveledUp: newLevel > skill.level })
    } catch (err) {
        res.status(500).json({ error: 'Failed to update XP' })
    }
})


// ==========================================
// 3. Training Academy (培训项目 & 资源)
// ==========================================
router.get('/training/projects', async (req, res) => {
    const userId = getUserId(req)
    try {
        const result = await query('SELECT * FROM training_projects WHERE user_id = $1 ORDER BY created_at DESC', [userId])
        res.json(result.rows)
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch projects' })
    }
})

router.post('/training/projects', async (req, res) => {
    const userId = getUserId(req)
    const { name, goal, limit_days } = req.body // limit_days is a conceptual frontend field, we might store end_date
    if (!name) return res.status(400).json({ error: 'Project name is required' })

    try {
        // Simple end_date calculation if limit_days provided
        let end_date = null
        if (limit_days) {
            const date = new Date()
            date.setDate(date.getDate() + limit_days)
            end_date = date.toISOString().split('T')[0]
        }

        const result = await query(
            'INSERT INTO training_projects (user_id, name, goal, start_date, end_date) VALUES ($1, $2, $3, CURRENT_DATE, $4) RETURNING *',
            [userId, name, goal || '', end_date]
        )
        res.status(201).json(result.rows[0])
    } catch (err) {
        res.status(500).json({ error: 'Failed to create project' })
    }
})

router.get('/training/projects/:projectId/resources', async (req, res) => {
    const projectId = req.params.projectId
    try {
        const result = await query('SELECT * FROM training_resources WHERE project_id = $1 ORDER BY created_at ASC', [projectId])
        res.json(result.rows)
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch resources' })
    }
})

// MOCK: Resource Parsing API
router.post('/training/parse', async (req, res) => {
    const { url } = req.body
    if (!url) return res.status(400).json({ error: 'URL is required' })

    // Fake delay
    await new Promise(resolve => setTimeout(resolve, 800))

    // Mock response
    res.json({
        title: url.includes('b23.tv') ? 'Mock Video Series from Bilibili' : 'Parsed External Resource',
        type: url.includes('b23.tv') ? 'video' : 'document',
        total_items: Math.floor(Math.random() * 20) + 5, // Random 5 to 25 items
        url: url,
        mock_chapters: [
            { id: 1, title: 'Introduction', duration: '12:00' },
            { id: 2, title: 'Core Concepts Part 1', duration: '25:30' },
            { id: 3, title: 'Core Concepts Part 2', duration: '18:45' }
        ]
    })
})

router.post('/training/resources', async (req, res) => {
    const { project_id, title, type, url, total_items } = req.body
    if (!project_id || !title || !type) return res.status(400).json({ error: 'project_id, title, type required' })

    try {
        const result = await query(
            'INSERT INTO training_resources (project_id, title, type, url, total_items) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [project_id, title, type, url, total_items || 1]
        )
        res.status(201).json(result.rows[0])
    } catch (err) {
        res.status(500).json({ error: 'Failed to add resource' })
    }
})

// ==========================================
// 4. Wellness (身心关怀)
// ==========================================
router.get('/wellness/logs', async (req, res) => {
    const userId = getUserId(req)
    try {
        const result = await query('SELECT * FROM wellness_logs WHERE user_id = $1 ORDER BY record_date DESC LIMIT 30', [userId])
        res.json(result.rows)
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch wellness logs' })
    }
})

router.post('/wellness/logs', async (req, res) => {
    const userId = getUserId(req)
    const { record_date, stress_level, mood, sleep_quality, notes } = req.body
    // Default to today if not provided
    const dateToUse = record_date || new Date().toISOString().split('T')[0]

    try {
        const result = await query(
            `INSERT INTO wellness_logs (user_id, record_date, stress_level, mood, sleep_quality, notes) 
             VALUES ($1, $2, $3, $4, $5, $6) 
             ON CONFLICT (user_id, record_date) 
             DO UPDATE SET stress_level = EXCLUDED.stress_level, mood = EXCLUDED.mood, sleep_quality = EXCLUDED.sleep_quality, notes = EXCLUDED.notes, updated_at = CURRENT_TIMESTAMP
             RETURNING *`,
            [userId, dateToUse, stress_level, mood, sleep_quality, notes]
        )
        res.status(201).json(result.rows[0])
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to save wellness log' })
    }
})

export default router
