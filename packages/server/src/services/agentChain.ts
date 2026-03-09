import { generateJSONResponse } from './llmService';
import { buildAgentContext, AGENT_PROMPTS } from '../prompts';
import { executeTool } from './toolRegistry';

export interface ChainResult {
    steps: {
        agentId: string;
        thought: string;
        reply: string;
        toolCall?: any;
        metadata?: any; // To store decision, recommendation, riskLevel, etc.
    }[];
    finalReply: string;
}

export async function executeAgentChain(userId: number, initialMessage: string): Promise<ChainResult> {
    const chain: ChainResult = { steps: [], finalReply: '' };
    let currentAgent = 'triage';
    let currentMessage = initialMessage;
    let contextHistory = `CEO 指令: ${initialMessage}\n`;

    // Limit chain to 5 steps for v2.1 complex coordination
    for (let i = 0; i < 5; i++) {
        const messages = buildAgentContext(currentAgent, currentMessage);

        // Inject history into the system prompt for context
        if (i > 0) {
            messages[0].content += `\n\n此前由于部门间流转，已产生以下沟通记录（请参考并在此基础上做出回应）：\n${contextHistory}`;
        }

        const response = await generateJSONResponse<any>(messages);

        chain.steps.push({
            agentId: currentAgent,
            thought: response.thought,
            reply: response.reply,
            toolCall: response.toolCall,
            metadata: {
                decision: response.decision,
                recommendation: response.recommendation,
                riskLevel: response.riskLevel
            }
        });

        contextHistory += `[${currentAgent}] ${response.reply}\n`;

        // Handle Tool Calls (e.g., Ada checking balance)
        if (response.toolCall) {
            try {
                const toolResult = await executeTool(userId, response.toolCall.tool, response.toolCall.args);
                contextHistory += `[系统执行结果] ${toolResult}\n`;
            } catch (error) {
                contextHistory += `[系统错误] 工具执行失败: ${error}\n`;
            }
        }

        // Logic for next steps (v2.3 Decision Chain)
        if (currentAgent === 'triage') {
            if (response.routeTo) {
                currentAgent = response.routeTo;
            } else {
                break; // Handled by Triage (chitchat)
            }
        } else if (currentAgent === 'finance') {
            // After Finance, always go to CEO for approval with full financial/policy context
            currentAgent = 'ceo';
            currentMessage = `财务部已完成审计。风险等级: ${response.riskLevel || '未知'}。评估认为: ${response.recommendation}。
评估报告原文：${response.reply}
请 CEO 执行批示（资产购入或政策签署）。`;
        } else if (currentAgent === 'ceo') {
            if (response.decision === 'pending_tasks' || response.recommendation === 'financing_recommended') {
                currentAgent = 'operations';
                currentMessage = `CEO 批示：列为专项融资。批示原文：${response.reply}。
请 COO 立即生成专项任务并汇报。`;
            } else if (response.decision === 'policy_update') {
                currentAgent = 'operations';
                currentMessage = `CEO 批示：正式签署法令。批示原文：${response.reply}。
请 COO 立即备案合规检查项并汇报执行计划。`;
            } else if (response.decision === 'cooling_off') {
                break;
            } else {
                break; // Final decision (approve/reject) reached
            }
        } else if (currentAgent === 'operations') {
            // Always end after Operations completes its task/policy setup
            break;
        } else {
            break;
        }
    }

    chain.finalReply = chain.steps[chain.steps.length - 1].reply;
    return chain;
}
