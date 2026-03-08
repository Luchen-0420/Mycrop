import { query } from '../db/pool'
import { generateChatResponse } from './llmService'
import { AUDIT_SYSTEM_PROMPT } from '../prompts/auditPrompt'

interface DailyMetrics {
    tasks_created: number;
    tasks_completed: number;
    habits_completed: number;
    habits_total: number;
    points_earned: number;
    points_spent: number;
    okr_delta: any;
}

interface AuditReport {
    efficiency_score: number;
    procrastination_index: number;
    honest_feedback: string;
    top_wins: string[];
    top_failures: string[];
    recommendations: string[];
}

/**
 * Harvests all relevant operational data for the given date.
 */
export const harvestDailyData = async (userId: number, dateStr: string): Promise<DailyMetrics> => {
    console.log(`[Audit] Harvesting data for User ${userId} on ${dateStr}...`)

    // 1. Tasks Matrix
    const tasksRes = await query(`
        SELECT 
            COUNT(*) as total_created,
            SUM(CASE WHEN status = 'done' AND DATE(updated_at) = $2 THEN 1 ELSE 0 END) as total_completed
        FROM tasks 
        WHERE user_id = $1 AND DATE(created_at) = $2
    `, [userId, dateStr])
    const tasks_created = parseInt(tasksRes.rows[0].total_created) || 0;
    const tasks_completed = parseInt(tasksRes.rows[0].total_completed) || 0;

    // 2. Habits Matrix
    const habitsRes = await query(`SELECT COUNT(*) as total FROM habits WHERE user_id = $1`, [userId])
    const habits_total = parseInt(habitsRes.rows[0].total) || 0;

    const habitLogsRes = await query(`
        SELECT COUNT(*) as completed 
        FROM habit_logs 
        WHERE user_id = $1 AND log_date = $2
    `, [userId, dateStr])
    const habits_completed = parseInt(habitLogsRes.rows[0].completed) || 0;

    // 3. Points Matrix (from points_logs)
    const pointsRes = await query(`
        SELECT 
            SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END) as earned,
            SUM(CASE WHEN amount < 0 THEN ABS(amount) ELSE 0 END) as spent
        FROM points_logs 
        WHERE user_id = $1 AND DATE(created_at) = $2
    `, [userId, dateStr])
    const points_earned = parseInt(pointsRes.rows[0].earned) || 0;
    const points_spent = parseInt(pointsRes.rows[0].spent) || 0;

    // 4. OKR Delta (Approximation: KRs updated today)
    // For simplicity in Phase 7 MVP, we just check if any KRs were updated today.
    const okrRes = await query(`
        SELECT kr.id, kr.title, kr.current_value, kr.target_value 
        FROM key_results kr
        JOIN okrs o ON kr.okr_id = o.id
        WHERE o.user_id = $1 AND DATE(kr.updated_at) = $2
    `, [userId, dateStr])
    const okr_delta = okrRes.rows.length > 0 ? okrRes.rows : null;

    return {
        tasks_created,
        tasks_completed,
        habits_completed,
        habits_total,
        points_earned,
        points_spent,
        okr_delta
    }
}

/**
 * Executes the full audit flow: Harvest -> LLM -> Save
 */
export const runDailyAudit = async (userId: number, dateStr: string) => {
    try {
        // Prevent duplicate audits for the same day
        const existing = await query(`SELECT id FROM audit_reports WHERE user_id = $1 AND report_date = $2`, [userId, dateStr])
        if (existing.rows.length > 0) {
            console.log(`[Audit] Report for ${dateStr} already exists. Skipping.`)
            return null;
        }

        const metrics = await harvestDailyData(userId, dateStr)
        console.log(`[Audit] Harvested Metrics:`, metrics)

        const prompt = `Here are the CEO's operational metrics for today (${dateStr}):\n\n${JSON.stringify(metrics, null, 2)}\n\nGenerate the JSON audit report based on the system instructions.`

        console.log(`[Audit] Calling Chief Auditor Agent (LLM)...`)
        let responseJsonStr = ''

        try {
            const messages: any[] = [
                { role: 'system', content: AUDIT_SYSTEM_PROMPT },
                { role: 'user', content: prompt }
            ];
            const rawResponse = await generateChatResponse(messages, undefined, 0.3)
            // Extract JSON from potential markdown block
            const match = rawResponse.match(/```json\n([\s\S]*?)\n```/);
            responseJsonStr = match ? match[1] : rawResponse.trim();
        } catch (llmError) {
            console.error('[Audit] LLM Call Failed:', llmError)
            throw new Error('LLM Failed to generate audit report.')
        }

        let reportData: AuditReport;
        try {
            reportData = JSON.parse(responseJsonStr)
        } catch (jsonErr) {
            console.error('[Audit] Failed to parse LLM JSON:', responseJsonStr)
            throw new Error('LLM returned invalid JSON format.')
        }

        console.log(`[Audit] Parsed Report. Score: ${reportData.efficiency_score}, Feedback: ${reportData.honest_feedback.substring(0, 50)}...`)

        // Save to Database
        await query(`
            INSERT INTO audit_reports (
                user_id, report_date, efficiency_score, procrastination_index, 
                tasks_created, tasks_completed, habits_completed, habits_total, 
                points_earned, points_spent, okr_delta, 
                top_wins, top_failures, honest_feedback, recommendations, raw_llm_response
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
        `, [
            userId, dateStr, reportData.efficiency_score, reportData.procrastination_index,
            metrics.tasks_created, metrics.tasks_completed, metrics.habits_completed, metrics.habits_total,
            metrics.points_earned, metrics.points_spent, JSON.stringify(metrics.okr_delta),
            reportData.top_wins, reportData.top_failures, reportData.honest_feedback, reportData.recommendations, responseJsonStr
        ])

        console.log(`[Audit] Successfully saved audit report to DB.`)
        return { metrics, reportData }

    } catch (error) {
        console.error(`[Audit] Critical Error during runDailyAudit:`, error)
        throw error;
    }
}
