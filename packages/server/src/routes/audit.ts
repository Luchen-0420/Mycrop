import { Router } from 'express'
import { query } from '../db/pool'
import { runDailyAudit, harvestDailyData } from '../services/auditService'

const router = Router()

// Default User ID for MVP
const DEFAULT_USER_ID = 1;

/**
 * 1. GET /api/audit/reports
 * Fetch the history of audit reports (lightweight for list view).
 */
router.get('/reports', async (_req, res) => {
    try {
        const result = await query(`
            SELECT 
                id, report_date, efficiency_score, procrastination_index, 
                tasks_created, tasks_completed, points_earned, 
                top_wins, top_failures, created_at
            FROM audit_reports 
            WHERE user_id = $1
            ORDER BY report_date DESC
            LIMIT 30
        `, [DEFAULT_USER_ID])
        res.json(result.rows)
    } catch (err) {
        console.error('Failed to fetch audit reports:', err)
        res.status(500).json({ error: 'Database error' })
    }
})

/**
 * 2. GET /api/audit/reports/:date
 * Fetch the full detailed report for a specific date (e.g., '2026-03-08').
 */
router.get('/reports/:date', async (req, res) => {
    const { date } = req.params;
    try {
        const result = await query(`
            SELECT * FROM audit_reports 
            WHERE user_id = $1 AND report_date = $2
        `, [DEFAULT_USER_ID, date])

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Audit report not found for this date.' })
        }
        res.json(result.rows[0])
    } catch (err) {
        console.error('Failed to fetch audit report details:', err)
        res.status(500).json({ error: 'Database error' })
    }
})

/**
 * 3. POST /api/audit/trigger
 * Manually force an audit for today (or a specified date).
 * Primarily used for development, testing, or "Force Audit" buttons.
 */
router.post('/trigger', async (req, res) => {
    try {
        // Use provided date or default to today (local YYYY-MM-DD string format)
        const targetDate = req.body.date || new Date().toISOString().split('T')[0];

        const result = await runDailyAudit(DEFAULT_USER_ID, targetDate)

        if (!result) {
            return res.status(400).json({ error: 'Audit already performed for ' + targetDate })
        }

        res.json({ message: 'Audit completed successfully', data: result.reportData })
    } catch (error) {
        console.error('Trigger Audit Error:', error)
        res.status(500).json({ error: 'Failed to run daily audit sequence.' })
    }
})

/**
 * 4. GET /api/audit/preview
 * Just harvest the data without incurring LLM cost. Useful for debugging Data Harvest.
 */
router.get('/preview', async (req, res) => {
    try {
        const targetDate = req.query.date as string || new Date().toISOString().split('T')[0];
        const metrics = await harvestDailyData(DEFAULT_USER_ID, targetDate)
        res.json(metrics)
    } catch (error) {
        console.error('Preview Audit Data Error:', error)
        res.status(500).json({ error: 'Failed to preview data.' })
    }
})

export default router
