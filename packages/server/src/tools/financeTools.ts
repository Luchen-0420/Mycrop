import { query } from '../db/pool'

/**
 * CFO Tool: Records a financial transaction.
 */
export async function recordTransaction(userId: number, amount: number, category: string, type: string, description: string): Promise<string> {
    // Basic validation
    if (!amount || amount <= 0) {
        throw new Error('Transaction amount must be a positive number')
    }

    // Since we don't have account selection implemented in the UI yet, we can default to a primary 'cash' account or insert one if missing
    let accountId = await ensurePrimaryAccountExists(userId)

    const result = await query(
        `INSERT INTO transactions (user_id, account_id, type, amount, category, description, transaction_date) 
         VALUES ($1, $2, $3, $4, $5, $6, CURRENT_DATE) RETURNING id`,
        [userId, accountId, type, amount, category, description]
    )

    return `Successfully recorded a ${type} of ${amount} for ${category}. Transaction ID: ${result.rows[0].id}`
}

/**
 * CFO Tool: Checks the budget for a specific category for the current month.
 */
export async function checkBudget(userId: number, category: string): Promise<string> {
    const currentMonth = new Date().toISOString().slice(0, 7) // 'YYYY-MM'

    // Look for a specific category budget
    const budgetRes = await query(
        `SELECT amount_limit FROM budgets WHERE user_id = $1 AND month = $2 AND category = $3`,
        [userId, currentMonth, category]
    )

    if (budgetRes.rows.length === 0) {
        return `No specific budget set for category '${category}' in ${currentMonth}.`
    }

    const limit = parseFloat(budgetRes.rows[0].amount_limit)

    // Calculate how much has been spent this month in this category
    const spentRes = await query(
        `SELECT SUM(amount) as total_spent FROM transactions 
         WHERE user_id = $1 AND type = 'expense' AND category = $2 
         AND TO_CHAR(transaction_date, 'YYYY-MM') = $3`,
        [userId, category, currentMonth]
    )

    const spent = parseFloat(spentRes.rows[0].total_spent || '0')
    const remaining = limit - spent

    return `Budget Status [${currentMonth} - ${category}]: Limit ${limit}, Spent ${spent}, Remaining ${remaining}.`
}

/**
 * CFO Tool: Creates a wishlist goal (心愿目标).
 * CEO wants to buy something expensive → CFO creates it as a goal to earn points towards.
 */
export async function createWishlistGoal(userId: number, name: string, targetPoints: number): Promise<string> {
    if (!name || !targetPoints || targetPoints <= 0) {
        throw new Error('Wishlist goal requires a name and a positive target_points value')
    }

    const result = await query(
        `INSERT INTO wishlist_items (user_id, name, target_points, status) 
         VALUES ($1, $2, $3, 'active') RETURNING id`,
        [userId, name, targetPoints]
    )

    return `🎯 心愿目标已创建！「${name}」需要积攒 ${targetPoints} 积分。心愿ID: ${result.rows[0].id}。开始努力吧 Boss！`
}

/**
 * CFO Tool: Checks current points balance.
 */
export async function checkPointsBalance(userId: number): Promise<string> {
    const res = await query(
        `SELECT COALESCE(SUM(amount), 0) as total_points FROM points_logs WHERE user_id = $1`,
        [userId]
    )

    const totalPoints = parseInt(res.rows[0].total_points)

    // Also fetch active wishlist goals for context
    const wishRes = await query(
        `SELECT name, target_points FROM wishlist_items WHERE user_id = $1 AND status = 'active'`,
        [userId]
    )

    let summary = `当前积分余额: ${totalPoints} 分。`
    if (wishRes.rows.length > 0) {
        summary += ` 进行中的心愿目标：`
        for (const w of wishRes.rows) {
            const progress = Math.min(100, Math.round((totalPoints / w.target_points) * 100))
            summary += ` 「${w.name}」(${totalPoints}/${w.target_points}, ${progress}%)`
        }
    } else {
        summary += ` 当前没有进行中的心愿目标。`
    }

    return summary
}

/**
 * CFO Tool: Redeems a wishlist goal when points are sufficient.
 */
export async function redeemWishlistGoal(userId: number, wishlistId: number): Promise<string> {
    // 1. Get the wishlist item
    const wishRes = await query(
        `SELECT id, name, target_points, status FROM wishlist_items WHERE id = $1 AND user_id = $2`,
        [wishlistId, userId]
    )

    if (wishRes.rows.length === 0) {
        throw new Error(`Wishlist item #${wishlistId} not found`)
    }

    const wish = wishRes.rows[0]
    if (wish.status === 'redeemed') {
        return `心愿「${wish.name}」已经兑换过了！`
    }

    // 2. Check points balance
    const pointsRes = await query(
        `SELECT COALESCE(SUM(amount), 0) as total FROM points_logs WHERE user_id = $1`,
        [userId]
    )
    const currentPoints = parseInt(pointsRes.rows[0].total)

    if (currentPoints < wish.target_points) {
        return `积分不足！当前 ${currentPoints}，需要 ${wish.target_points}，还差 ${wish.target_points - currentPoints} 分。继续努力！`
    }

    // 3. Deduct points
    await query(
        `INSERT INTO points_logs (user_id, amount, source, description) VALUES ($1, $2, 'wishlist_redeem', $3)`,
        [userId, -wish.target_points, `兑换心愿：${wish.name}`]
    )

    // 4. Mark wishlist as redeemed
    await query(
        `UPDATE wishlist_items SET status = 'redeemed', updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
        [wishlistId]
    )

    return `🎉 恭喜 Boss！心愿「${wish.name}」已成功兑换！扣除 ${wish.target_points} 积分，剩余 ${currentPoints - wish.target_points} 分。去买你的宝贝吧！`
}

// Helper
async function ensurePrimaryAccountExists(userId: number): Promise<number> {
    const res = await query(`SELECT id FROM accounts WHERE user_id = $1 LIMIT 1`, [userId])
    if (res.rows.length > 0) return res.rows[0].id

    // Create a default account if the user has none
    const newAccount = await query(
        `INSERT INTO accounts (user_id, name, type, balance) VALUES ($1, 'Main Wallet', 'cash', 0) RETURNING id`,
        [userId]
    )
    return newAccount.rows[0].id
}
