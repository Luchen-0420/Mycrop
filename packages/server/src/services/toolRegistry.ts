import * as financeTools from '../tools/financeTools'
import * as opsTools from '../tools/opsTools'
import { runDailyAudit } from './auditService'

export interface ToolCall {
    tool: string
    args: any
}

export const TOOL_MAP: Record<string, Function> = {
    // Finance Tools
    recordTransaction: financeTools.recordTransaction,
    checkBudget: financeTools.checkBudget,
    createWishlistGoal: financeTools.createWishlistGoal,
    checkPointsBalance: financeTools.checkPointsBalance,
    redeemWishlistGoal: financeTools.redeemWishlistGoal,

    // Operations Tools
    createTask: opsTools.createTask,
    completeTask: opsTools.completeTask,

    // Audit Tools
    triggerAudit: (userId: number) => runDailyAudit(userId, new Date().toISOString().split('T')[0])
}

/**
 * Execute a tool call from an AI agent.
 */
export async function executeTool(userId: number, toolName: string, args: any): Promise<any> {
    const tool = TOOL_MAP[toolName]
    if (!tool) {
        throw new Error(`Tool ${toolName} not found in registry.`)
    }

    console.log(`[Tool Execution] User ${userId} calling ${toolName} with args:`, args)

    // Inject userId as the first argument for all tools
    return await tool(userId, ...Object.values(args))
}
