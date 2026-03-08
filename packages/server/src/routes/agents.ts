import { Router } from 'express';
import { generateChatResponse, generateJSONResponse } from '../services/llmService';
import { buildAgentContext, AGENT_PROMPTS } from '../prompts';

const router = Router();

// Simple unified chat endpoint
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
        const reply = await generateChatResponse(messages);

        res.json({
            agentId,
            reply,
            timestamp: new Date().toISOString()
        });
    } catch (error: any) {
        console.error('Error in agent chat:', error);
        res.status(500).json({ error: 'Internal LLM Error', details: error.message });
    }
});

export default router;
