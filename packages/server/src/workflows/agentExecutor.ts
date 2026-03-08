import { generateJSONResponse } from '../services/llmService'
import OpenAI from 'openai'
import { executeTool } from '../tools/index'
import { EXECUTION_AGENT_PROMPT } from '../prompts/execution'
import { getDepartmentToolsSchema } from '../tools/schema'

export interface AgentExecutionResponse {
    thinking_process: string
    tool_calls: Array<{
        tool_name: string
        parameters: any
    }>
    execution_summary: string
}

export class AgentExecutor {
    private userId: number

    constructor(userId: number) {
        this.userId = userId
    }

    /**
     * Executes a subtask by assigning it to the corresponding department agent.
     */
    async executeSubtask(role: string, actionInstruction: string, parameters: any): Promise<any> {
        console.log(`\n⚙️ [AgentExecutor] Booting up Department: ${role.toUpperCase()}`)
        console.log(`  -> Instruction: ${actionInstruction}`)

        // 1. Get the allowed tools schema for this specific department
        const toolsSchema = getDepartmentToolsSchema(role)

        if (!toolsSchema || toolsSchema.length === 0) {
            console.log(`  -> ⚠️ No tools configured for role '${role}'. Simulating default success.`)
            return {
                status: 'success',
                message: `Simulated execution for ${role}. Tool integration pending.`
            }
        }

        // 2. Prepare the prompt injected with available tools
        const systemPrompt = EXECUTION_AGENT_PROMPT.replace('{{TOOLS_SCHEMA}}', JSON.stringify(toolsSchema, null, 2))

        const contentStr = `
【执行要求】: ${actionInstruction}
【策略阶段传入参数】: ${JSON.stringify(parameters)}
【注意】: 请严格根据提供的工具库返回你要执行的 \`tool_calls\`。如果没有合适的工具，说明无法执行。
`
        const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: contentStr }
        ]

        try {
            // 3. Let the LLM decide which tools to use and what parameters to pass
            const response = await generateJSONResponse<AgentExecutionResponse>(messages)

            console.log(`  -> [${role.toUpperCase()} Thinking]: ${response.thinking_process}`)

            // 4. Actually execute the chosen tools against the Database
            const executionResults = []
            if (response.tool_calls && response.tool_calls.length > 0) {
                for (const call of response.tool_calls) {
                    console.log(`  -> 🛠️ Executing Tool: ${call.tool_name} with params:`, call.parameters)
                    try {
                        const result = await executeTool(this.userId, call.tool_name, call.parameters)
                        executionResults.push({ tool: call.tool_name, status: 'success', result })
                    } catch (toolErr: any) {
                        console.error(`  -> ❌ Tool Error (${call.tool_name}):`, toolErr.message)
                        executionResults.push({ tool: call.tool_name, status: 'error', error: toolErr.message })
                    }
                }
            } else {
                console.log(`  -> ℹ️ Agent decided no tools needed to be called.`)
            }

            return {
                status: 'completed',
                summary: response.execution_summary,
                tool_results: executionResults
            }

        } catch (err: any) {
            console.error(`  -> 🚨 Execution failed for role ${role}:`, err.message)
            return {
                status: 'failed',
                error: err.message
            }
        }
    }
}
