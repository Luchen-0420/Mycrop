import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth'
import hrRoutes from './routes/hr'
import adminRoutes from './routes/admin'
import financeRoutes from './routes/finance'
import operationsRoutes from './routes/operations'
import prRoutes from './routes/pr'
import legalRoutes from './routes/legal'
import rdRoutes from './routes/rd'
import commerceRoutes from './routes/commerce'
import travelRoutes from './routes/travel'
import { initDb } from './db/init'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3002

app.use(cors())
app.use(express.json())

// Health check
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'me-corp-server', timestamp: new Date().toISOString() })
})

// Authentication Routes
app.use('/api/auth', authRoutes)

// HR Routes
app.use('/api/hr', hrRoutes)

// Admin Routes (Logistics, Assets, Procurement)
app.use('/api/admin', adminRoutes)

// Finance Routes
app.use('/api/finance', financeRoutes)

// Operations Routes
app.use('/api/operations', operationsRoutes)

// PR Routes
app.use('/api/pr', prRoutes)

// Legal Routes
app.use('/api/legal', legalRoutes)

// R&D Routes
app.use('/api/rd', rdRoutes)

// Commerce Routes
app.use('/api/commerce', commerceRoutes)

// Travel Routes
app.use('/api/travel', travelRoutes)

// Placeholder routes for departments
app.get('/api/dashboard/stats', (_req, res) => {
    res.json({
        netWorth: 53600,
        points: 4460,
        taskCompletion: 0.68,
        weeklyWorkouts: 3,
        okrProgress: 0.42,
        monthlyStudyHours: 18,
    })
})

app.get('/api/contacts', (_req, res) => {
    res.json({ contacts: [], overdueCount: 0 })
})

app.listen(PORT, async () => {
    await initDb()
    console.log(`🏢 Me Corp Server running on http://localhost:${PORT}`)
})
