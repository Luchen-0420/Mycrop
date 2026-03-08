import { Router } from 'express'
import { NegotiationEngine } from '../workflows/negotiationEngine'

const router = Router()

/**
 * POST /api/missions/execute
 * Entry point to start a complex multi-agent negotiation workflow.
 * Expected body: { missionPrompt: string }
 */
router.post('/execute', async (req, res) => {
    try {
        const { missionPrompt } = req.body
        const userId = 1 // Mocking the authenticated user ID for MVP

        if (!missionPrompt) {
            return res.status(400).json({ error: 'missionPrompt is required.' })
        }

        // Initialize the engine
        const engine = new NegotiationEngine(userId)

        // Process the mission synchronously.
        // In a production system, this should be async with a webhook/polling architecture, 
        // but for the MVP demonstration, we will block and wait for the C-Suite to finish arguing.
        const result = await engine.processMission(missionPrompt)

        res.json(result)
    } catch (error) {
        console.error('Error executing mission:', error)
        res.status(500).json({ error: 'Internal Server Error during mission execution.' })
    }
})

export default router
