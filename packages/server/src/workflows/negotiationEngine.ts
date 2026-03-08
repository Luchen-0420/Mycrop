import { query } from '../db/pool'
import { generateJSONResponse } from '../services/llmService'
import { searchMemories, saveMemory } from '../services/memoryService'
import { STRATEGY_PROMPT, REVIEW_PROMPT, DISPATCH_PROMPT } from '../prompts/governance'
import OpenAI from 'openai'

// Interfaces for structured LLM outputs
interface StrategyResponse {
    thinking_process: string
    validation_passed: boolean
    rejection_reason?: string
    subtasks?: Array<{
        role: string
        action_instruction: string
        parameters: any
    }>
}

interface ReviewResponse {
    thinking_process: string
    decision: 'APPROVE' | 'REJECT'
    review_comment: string
    risk_level: 'LOW' | 'MEDIUM' | 'HIGH'
}

interface DispatchResponse {
    thinking_process: string
    final_report: string
}

const MAX_RETRIES = 3

/**
 * The core Negotiation Engine for the Strategy -> Review -> Dispatch pipeline.
 */
export class NegotiationEngine {
    private userId: number

    constructor(userId: number) {
        this.userId = userId
    }

    /**
     * Main entry point for processing a complex user mission.
     * @param missionPrompt The original user request (e.g., "Buy me a PS5")
     * @returns Job ID or final status
     */
    async processMission(missionPrompt: string) {
        // 1. Initialize Task in DB
        const missionId = `MC-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(Math.random() * 1000)}`

        console.log(`\n🚀 [Negotiation Engine] Starting Mission: ${missionId}`)
        console.log(`Prompt: "${missionPrompt}"`)

        const taskResult = await query(
            `INSERT INTO agent_tasks (user_id, mission_id, original_prompt, status) 
       VALUES ($1, $2, $3, 'planning') RETURNING id`,
            [this.userId, missionId, missionPrompt]
        )
        const taskId = taskResult.rows[0].id

        // Phase 4 RAG: Search for past contexts
        console.log(`[Memory Base] Searching for relevant past memories...`)
        const memories = await searchMemories(missionPrompt, 3)
        let memoryContextStr = ''
        if (memories.length > 0) {
            memoryContextStr = '\n\n【RAG 记忆库参考】: 以下是系统检索到的过去重大历史记录或经历感受，请务必将其作为你的决策关键依据：\n' + memories.map(m => `- ${m.content} (相似度: ${(m.similarity * 100).toFixed(1)}%)`).join('\n')
            console.log(`[Memory Base] Found ${memories.length} relevant memories.`)
        } else {
            console.log(`[Memory Base] No relevant memories found.`)
        }

        // Start Negotiation Loop
        let attempt = 1
        let executionFinalized = false
        let finalReport = ''
        let previousRejectionContext = ''

        while (attempt <= MAX_RETRIES && !executionFinalized) {
            console.log(`\n--- 🔄 Round ${attempt}/${MAX_RETRIES} ---`)
            try {
                // --- STEP 1: STRATEGY (Planning) ---
                console.log(`[Strategy] Analyzing and breaking down the mission...`)
                const strategyPlan = await this.invokeStrategy(taskId, missionPrompt, attempt, previousRejectionContext, memoryContextStr)

                if (!strategyPlan.validation_passed) {
                    console.log(`[Strategy] Mission rejected at planning phase: ${strategyPlan.rejection_reason}`)
                    await this.updateTaskStatus(taskId, 'rejected')
                    await saveMemory(`[Strategy Rejected] CEO requested: "${missionPrompt}". Reason: ${strategyPlan.rejection_reason}`, 'system')
                    return { status: 'rejected', reason: strategyPlan.rejection_reason }
                }

                // --- STEP 2: REVIEW BOARD (Risk Control) ---
                console.log(`[Review] Evaluating Strategy's proposed plan...`)
                const reviewDecision = await this.invokeReview(taskId, missionPrompt, strategyPlan, memoryContextStr)

                if (reviewDecision.decision === 'REJECT') {
                    console.log(`[Review] ❌ PLAN REJECTED. Reason: ${reviewDecision.review_comment}`)
                    previousRejectionContext = reviewDecision.review_comment
                    attempt++
                    continue
                }

                // --- STEP 3: DISPATCH HUB (Execution) ---
                console.log(`[Review] ✅ PLAN APPROVED. Passing to Dispatch Hub...`)
                await this.updateTaskStatus(taskId, 'dispatching')

                // Mocking execution of subtasks for now (Phase 3 MVP)
                console.log(`[Dispatch] Executing subtasks concurrently...`)
                const execResults = await this.mockExecuteSubtasks(taskId, strategyPlan.subtasks || [])

                // Summarize
                const dispatchSummary = await this.invokeDispatch(taskId, missionPrompt, execResults)
                finalReport = dispatchSummary.final_report
                executionFinalized = true

                // Phase 4 RAG: Save memory of finalized success
                await saveMemory(`[Mission Completed] CEO requested: "${missionPrompt}". Result: ${finalReport}`, 'system')

            } catch (err) {
                console.error(`Error during negotiation round ${attempt}:`, err)
                attempt++
            }
        }

        if (!executionFinalized) {
            console.log(`\n🚨 [Engine] Maximum negotiation rounds exceeded. Mission Blocked.`)
            await this.updateTaskStatus(taskId, 'blocked')
            await saveMemory(`[Mission Blocked] CEO requested: "${missionPrompt}". Result: Vetoed by Review Board. Last review comment: ${previousRejectionContext}`, 'system')
            return { status: 'blocked', report: 'The C-Suite agents could not reach an agreement or failed to execute after maximum retries. Please review the logs or Override.' }
        }

        console.log(`\n🏁 [Engine] Mission Completed successfully!`)
        await this.updateTaskStatus(taskId, 'completed')

        return { status: 'completed', report: finalReport }
    }


    // --- Helper Methods ---

    private async invokeStrategy(taskId: number, prompt: string, attempt: number, previousFeedback: string, memoryContextStr: string): Promise<StrategyResponse> {
        let contentStr = `【CEO 指令】: ${prompt}\n【这是第 ${attempt} 次尝试拆解】`
        if (memoryContextStr) {
            contentStr += memoryContextStr
        }
        if (previousFeedback) {
            contentStr += `\n\n【Review Board 上一轮驳回理由】: ${previousFeedback}\n请务必根据驳回理由调整你的方案，比如降低预算难度，或者如果要求完全不合理，直接设置 validation_passed 为 false 强制打回。`
        }

        const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
            { role: 'system', content: STRATEGY_PROMPT },
            { role: 'user', content: contentStr }
        ]

        const response = await generateJSONResponse<StrategyResponse>(messages)

        await this.logThinking(taskId, 'strategy', 'thinking', response.thinking_process)

        return response
    }

    private async invokeReview(taskId: number, originalPrompt: string, strategyPlan: StrategyResponse, memoryContextStr: string): Promise<ReviewResponse> {
        let contentStr = `【CEO 原始指令】: ${originalPrompt}\n\n【Strategy 提交的方案】:\n${JSON.stringify(strategyPlan.subtasks, null, 2)}`
        if (memoryContextStr) {
            contentStr += memoryContextStr
        }

        const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
            { role: 'system', content: REVIEW_PROMPT },
            { role: 'user', content: contentStr }
        ]

        const response = await generateJSONResponse<ReviewResponse>(messages)

        await this.logThinking(taskId, 'review', 'thinking', response.thinking_process)

        return response
    }

    private async invokeDispatch(taskId: number, originalPrompt: string, execResults: any[]): Promise<DispatchResponse> {
        const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
            { role: 'system', content: DISPATCH_PROMPT },
            { role: 'user', content: `【CEO 原始指令】: ${originalPrompt}\n\n【各部门执行结果汇总】:\n${JSON.stringify(execResults, null, 2)}` }
        ]

        const response = await generateJSONResponse<DispatchResponse>(messages)

        await this.logThinking(taskId, 'dispatch', 'thinking', response.thinking_process)

        return response
    }

    // Mocks execution of the subtasks (writing to DB sequentially/concurrently)
    private async mockExecuteSubtasks(taskId: number, subtasks: any[]): Promise<any[]> {
        const results = []
        for (const sub of subtasks) {
            console.log(`  -> [Opsing] Role: ${sub.role} | Action: ${sub.action_instruction}`)
            // Log to DB
            const res = await query(
                `INSERT INTO agent_subtasks (task_id, agent_role, action_type, parameters, status, result_data) 
         VALUES ($1, $2, $3, $4, 'completed', $5) RETURNING id`,
                [taskId, sub.role, sub.action_instruction, sub.parameters, { success: true, fake_db_id: Math.random() }]
            )
            results.push({ role: sub.role, status: 'Success' })
        }
        return results
    }

    private async logThinking(taskId: number, role: string, type: string, content: string) {
        if (!content) return
        await query(
            `INSERT INTO thinking_logs (task_id, agent_role, log_type, content) VALUES ($1, $2, $3, $4)`,
            [taskId, role, type, content]
        )
    }

    private async updateTaskStatus(taskId: number, status: string) {
        await query(`UPDATE agent_tasks SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`, [status, taskId])
    }
}
