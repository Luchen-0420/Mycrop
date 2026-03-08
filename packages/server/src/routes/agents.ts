import { Router } from 'express';
import { generateJSONResponse } from '../services/llmService';
import { buildAgentContext, AGENT_PROMPTS } from '../prompts';
import { executeTool } from '../services/toolRegistry';
import { executeAgentChain } from '../services/agentChain';

const router = Router();
const MOCK_USER_ID = 1;

// Agent Chat with Tool Execution Support
// POST /api/agents/chat
router.post('/chat', async (req, res) => {
    const { agentId, message } = req.body;

    if (!agentId || !message) {
        return res.status(400).json({ error: 'Missing agentId or message' });
    }

    if (!AGENT_PROMPTS[agentId]) {
        return res.status(400).json({ error: `Unknown agent ID: ${agentId}` });
    }

    try {
        const messages = buildAgentContext(agentId, message);

        // 1. Get structured response from LLM
        const agentResponse = await generateJSONResponse<{
            thought: string,
            toolCall?: { tool: string, args: any },
            reply: string
        }>(messages);

        console.log(`[Agent ${agentId}] Thought: ${agentResponse.thought}`);

        let toolResult = null;
        let finalReply = agentResponse.reply;

        // 2. Execute tool if requested
        if (agentResponse.toolCall && agentResponse.toolCall.tool) {
            try {
                toolResult = await executeTool(MOCK_USER_ID, agentResponse.toolCall.tool, agentResponse.toolCall.args);

                // Optional: If the reply is short or generic, we can append the tool result
                if (agentResponse.toolCall.tool.includes('check') || agentResponse.toolCall.tool.includes('get')) {
                    finalReply += `\n\n[系统执行结果]: ${toolResult}`;
                }
            } catch (toolError: any) {
                console.error(`[Tool Error] ${agentResponse.toolCall.tool}:`, toolError);
                finalReply += `\n\n(注意: 我的执行系统遇到了点麻烦: ${toolError.message})`;
            }
        }

        res.json({
            agentId,
            thought: agentResponse.thought,
            reply: finalReply,
            toolExecuted: agentResponse.toolCall?.tool || null,
            toolResult,
            timestamp: new Date().toISOString()
        });
    } catch (error: any) {
        console.error('Error in agent chat:', error);
        res.status(500).json({ error: 'Internal Agent Error', details: error.message });
    }
});

// New Global Command Center (Multi-Agent Flow)
// POST /api/agents/command
router.post('/command', async (req, res) => {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Missing message' });

    try {
        const result = await executeAgentChain(MOCK_USER_ID, message);
        res.json(result);
    } catch (error: any) {
        console.error('Error in agent command:', error);
        res.status(500).json({ error: 'Chain Execution Error', details: error.message });
    }
});

export default router;
