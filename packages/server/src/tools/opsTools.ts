import { query } from '../db/pool'

/**
 * COO Tool: Creates a new actionable task, optionally with points reward.
 */
export async function createTask(userId: number, title: string, description: string, priority: string = 'medium', pointsReward: number = 0, linkedWishlistId?: number): Promise<string> {
    if (!title) {
        throw new Error('Task title is required')
    }

    const result = await query(
        `INSERT INTO tasks (user_id, title, description, priority, status, points_reward, linked_wishlist_id) 
         VALUES ($1, $2, $3, $4, 'todo', $5, $6) RETURNING id`,
        [userId, title, description, priority, pointsReward, linkedWishlistId || null]
    )

    let response = `✅ 任务创建成功：「${title}」[优先级: ${priority}]，任务ID: ${result.rows[0].id}`
    if (pointsReward > 0) {
        response += `。完成可获得 ${pointsReward} 积分奖励！`
    }
    return response
}

/**
 * COO Tool: Marks a task as completed and awards points if applicable.
 */
export async function completeTask(userId: number, taskId: number): Promise<string> {
    // 1. Find the task
    const taskRes = await query(
        `SELECT id, title, status, points_reward, linked_wishlist_id FROM tasks WHERE id = $1 AND user_id = $2`,
        [taskId, userId]
    )

    if (taskRes.rows.length === 0) {
        throw new Error(`Task #${taskId} not found`)
    }

    const task = taskRes.rows[0]
    if (task.status === 'done') {
        return `任务「${task.title}」已经完成过了，不能重复领取积分哦！`
    }

    // 2. Mark as done
    await query(
        `UPDATE tasks SET status = 'done', updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
        [taskId]
    )

    let response = `🎉 任务「${task.title}」已标记为完成！`

    // 3. Award points if task has a reward
    if (task.points_reward && task.points_reward > 0) {
        await query(
            `INSERT INTO points_logs (user_id, amount, source, description) VALUES ($1, $2, 'task_done', $3)`,
            [userId, task.points_reward, `完成任务：${task.title}`]
        )
        response += ` 获得 ${task.points_reward} 积分！💰`

        // 4. Check if linked wishlist goal is now redeemable
        if (task.linked_wishlist_id) {
            const pointsRes = await query(
                `SELECT COALESCE(SUM(amount), 0) as total FROM points_logs WHERE user_id = $1`,
                [userId]
            )
            const totalPoints = parseInt(pointsRes.rows[0].total)

            const wishRes = await query(
                `SELECT name, target_points FROM wishlist_items WHERE id = $1 AND status = 'active'`,
                [task.linked_wishlist_id]
            )

            if (wishRes.rows.length > 0) {
                const wish = wishRes.rows[0]
                const progress = Math.min(100, Math.round((totalPoints / wish.target_points) * 100))
                response += ` 心愿「${wish.name}」进度: ${totalPoints}/${wish.target_points} (${progress}%)`
                if (totalPoints >= wish.target_points) {
                    response += ` 🔥 积分已达标！可以兑换了！`
                }
            }
        }
    }

    return response
}
