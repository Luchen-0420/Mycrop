import { recordTransaction, checkBudget, createWishlistGoal, checkPointsBalance, redeemWishlistGoal } from './financeTools'
import { createTask, completeTask } from './opsTools'
import { addFixedAsset } from './adminTools'

/**
 * Main dispatcher to route tool executions triggered by the LLM
 */
export async function executeTool(userId: number, toolName: string, parameters: any): Promise<any> {
    switch (toolName) {
        // --- CFO Tools ---
        case 'record_transaction':
            return await recordTransaction(userId, parameters.amount, parameters.category, parameters.type, parameters.description)
        case 'check_budget':
            return await checkBudget(userId, parameters.category)
        case 'create_wishlist_goal':
            return await createWishlistGoal(userId, parameters.name, parameters.target_points)
        case 'check_points_balance':
            return await checkPointsBalance(userId)
        case 'redeem_wishlist_goal':
            return await redeemWishlistGoal(userId, parameters.wishlist_id)

        // --- COO Tools ---
        case 'create_task':
            return await createTask(userId, parameters.title, parameters.description, parameters.priority, parameters.points_reward, parameters.linked_wishlist_id)
        case 'complete_task':
            return await completeTask(userId, parameters.task_id)

        // --- CAO Tools ---
        case 'add_fixed_asset':
            return await addFixedAsset(userId, parameters.name, parameters.category, parameters.purchase_price)

        default:
            throw new Error(`Tool implementation for '${toolName}' not found or registered.`)
    }
}
