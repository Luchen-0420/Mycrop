import { Router } from 'express'
import { query } from '../db/pool'

const router = Router()
const MOCK_USER_ID = 1;

// ==========================================
// 1. Kanban Tasks (看板任务)
// ==========================================

router.get('/tasks', async (req, res) => {
    try {
        const result = await query(
            'SELECT * FROM tasks WHERE user_id = $1 ORDER BY CASE WHEN priority = \'urgent\' THEN 1 WHEN priority = \'high\' THEN 2 WHEN priority = \'medium\' THEN 3 ELSE 4 END, created_at DESC',
            [MOCK_USER_ID]
        )
        res.json(result.rows)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to fetch tasks' })
    }
})

router.post('/tasks', async (req, res) => {
    const { title, description, priority, due_date } = req.body
    try {
        const result = await query(
            `INSERT INTO tasks (user_id, title, description, priority, due_date) 
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [MOCK_USER_ID, title, description, priority || 'medium', due_date || null]
        )
        res.status(201).json(result.rows[0])
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to create task' })
    }
})

router.post('/tasks/batch', async (req, res) => {
    const { tasks } = req.body // Expects an array of tasks

    if (!Array.isArray(tasks) || tasks.length === 0) {
        return res.status(400).json({ error: 'Invalid or empty tasks array' })
    }

    try {
        await query('BEGIN')
        
        const createdTasks = []
        for (const task of tasks) {
            const { title, description, priority, due_date } = task
            const result = await query(
                `INSERT INTO tasks (user_id, title, description, priority, due_date) 
                 VALUES ($1, $2, $3, $4, $5) RETURNING *`,
                [MOCK_USER_ID, title, description, priority || 'medium', due_date || null]
            )
            createdTasks.push(result.rows[0])
        }

        await query('COMMIT')
        res.status(201).json(createdTasks)
    } catch (err) {
        await query('ROLLBACK')
        console.error(err)
        res.status(500).json({ error: 'Failed to batch create tasks' })
    }
})

router.put('/tasks/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // 'todo', 'in_progress', 'done'
    try {
        const result = await query(
            `UPDATE tasks SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND user_id = $3 RETURNING *`,
            [status, id, MOCK_USER_ID]
        )
        if (result.rows.length === 0) return res.status(404).json({ error: 'Task not found' })
        res.json(result.rows[0])
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to update task status' })
    }
})

router.delete('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await query(`DELETE FROM tasks WHERE id = $1 AND user_id = $2`, [id, MOCK_USER_ID])
        res.status(204).send()
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to delete task' })
    }
})

// ==========================================
// 2. Habits & SOP (习惯打卡)
// ==========================================

router.get('/habits', async (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    try {
        // Fetch all habits and check if there's a log for TODAY
        const result = await query(`
            SELECT h.*, 
                   EXISTS(SELECT 1 FROM habit_logs hl WHERE hl.habit_id = h.id AND hl.log_date = $2) as is_done_today
            FROM habits h
            WHERE h.user_id = $1
            ORDER BY h.created_at ASC
        `, [MOCK_USER_ID, today])

        res.json(result.rows)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to fetch habits' })
    }
})

router.post('/habits', async (req, res) => {
    const { name, frequency, points_reward } = req.body
    try {
        const result = await query(
            `INSERT INTO habits (user_id, name, frequency, points_reward) 
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [MOCK_USER_ID, name, frequency || 'daily', points_reward || 30]
        )
        res.status(201).json(result.rows[0])
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to create habit' })
    }
})

router.post('/habits/:id/checkin', async (req, res) => {
    const { id } = req.params;
    const today = new Date().toISOString().split('T')[0];

    try {
        await query('BEGIN')

        // 1. Get the habit details
        const habitRes = await query(`SELECT * FROM habits WHERE id = $1 AND user_id = $2`, [id, MOCK_USER_ID])
        if (habitRes.rows.length === 0) {
            await query('ROLLBACK')
            return res.status(404).json({ error: 'Habit not found' })
        }
        const habit = habitRes.rows[0]

        // 2. Try to insert the log (will fail if already done today due to UNIQUE constraint)
        await query(
            `INSERT INTO habit_logs (user_id, habit_id, log_date) VALUES ($1, $2, $3)`,
            [MOCK_USER_ID, id, today]
        )

        // 3. Update streak
        await query(
            `UPDATE habits SET current_streak = current_streak + 1, updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
            [id]
        )

        // 4. Cross-module reward: Grant Points in Finance!
        await query(
            `INSERT INTO points_logs (user_id, amount, source, description) VALUES ($1, $2, $3, $4)`,
            [MOCK_USER_ID, habit.points_reward, 'habit_checkin', `SOP打卡奖励: ${habit.name}`]
        )

        await query('COMMIT')
        res.json({ message: 'Checked in successfully', points_earned: habit.points_reward })
    } catch (err: any) {
        await query('ROLLBACK')
        if (err.code === '23505') { // Unique violation
            return res.status(400).json({ error: 'Already checked in today' })
        }
        console.error(err)
        res.status(500).json({ error: 'Failed to check in' })
    }
})

// ==========================================
// 3. OKRs
// ==========================================

router.get('/okrs', async (req, res) => {
    try {
        const oResult = await query(
            'SELECT * FROM okrs WHERE user_id = $1 ORDER BY quarter DESC, created_at DESC',
            [MOCK_USER_ID]
        )

        const krResult = await query(
            `SELECT kr.* FROM key_results kr 
             JOIN okrs o ON kr.okr_id = o.id 
             WHERE o.user_id = $1 ORDER BY kr.created_at ASC`,
            [MOCK_USER_ID]
        )

        // Nest KRs inside Os
        const okrs = oResult.rows.map(o => ({
            ...o,
            krs: krResult.rows.filter(kr => kr.okr_id === o.id)
        }))

        res.json(okrs)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to fetch OKRs' })
    }
})

router.post('/okrs', async (req, res) => {
    const { quarter, objective } = req.body
    try {
        const result = await query(
            `INSERT INTO okrs (user_id, quarter, objective) VALUES ($1, $2, $3) RETURNING *`,
            [MOCK_USER_ID, quarter, objective]
        )
        res.status(201).json(result.rows[0])
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to create OKR' })
    }
})

router.post('/okrs/:okr_id/krs', async (req, res) => {
    const { okr_id } = req.params;
    const { title, target_value } = req.body
    try {
        const result = await query(
            `INSERT INTO key_results (okr_id, title, target_value) VALUES ($1, $2, $3) RETURNING *`,
            [okr_id, title, parseInt(target_value)]
        )
        res.status(201).json(result.rows[0])
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to add KR' })
    }
})

router.put('/krs/:id/progress', async (req, res) => {
    const { id } = req.params;
    const { current_value } = req.body;

    try {
        await query('BEGIN')

        // 1. Update KR
        const krRes = await query(
            `UPDATE key_results SET current_value = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
            [current_value, id]
        )
        if (krRes.rows.length === 0) {
            await query('ROLLBACK')
            return res.status(404).json({ error: 'KR not found' })
        }

        const okr_id = krRes.rows[0].okr_id;

        // 2. Recalculate O progress
        // Calculate average percentage of all KRs for this O
        const allKrsRes = await query(`SELECT current_value, target_value FROM key_results WHERE okr_id = $1`, [okr_id])
        let totalPercentage = 0;

        if (allKrsRes.rows.length > 0) {
            for (const kr of allKrsRes.rows) {
                const percent = Math.min((kr.current_value / kr.target_value) * 100, 100);
                totalPercentage += percent;
            }
            const averageProgress = Math.round(totalPercentage / allKrsRes.rows.length);

            await query(`UPDATE okrs SET progress = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`, [averageProgress, okr_id])
        }

        await query('COMMIT')
        res.json({ message: 'Progress updated' })
    } catch (err) {
        await query('ROLLBACK')
        console.error(err)
        res.status(500).json({ error: 'Failed to update progress' })
    }
})

export default router;
