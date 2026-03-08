import { Router } from 'express'
import { query } from '../db/pool'

const router = Router()
const MOCK_USER_ID = 1;

// ==========================================
// 1. Contacts (人脉档案)
// ==========================================

router.get('/contacts', async (req, res) => {
    try {
        const result = await query(
            `    SELECT c.*, 
                 (CURRENT_DATE - c.last_contact_date) as days_since_last_contact 
                 FROM contacts c 
                 WHERE user_id = $1 
                 ORDER BY c.created_at DESC`,
            [MOCK_USER_ID]
        )
        res.json(result.rows)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to fetch contacts' })
    }
})

router.post('/contacts', async (req, res) => {
    const { name, relationship, tags, birthday, preferences, target_frequency } = req.body
    try {
        const result = await query(
            `INSERT INTO contacts (user_id, name, relationship, tags, birthday, preferences, target_frequency) 
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [MOCK_USER_ID, name, relationship || 'friend', tags, birthday || null, preferences, target_frequency || 30]
        )
        res.status(201).json(result.rows[0])
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to create contact' })
    }
})

router.put('/contacts/:id', async (req, res) => {
    const { id } = req.params;
    const { name, relationship, tags, birthday, preferences, target_frequency } = req.body;
    try {
        const result = await query(
            `UPDATE contacts 
             SET name = $1, relationship = $2, tags = $3, birthday = $4, preferences = $5, target_frequency = $6, updated_at = CURRENT_TIMESTAMP
             WHERE id = $7 AND user_id = $8 RETURNING *`,
            [name, relationship, tags, birthday || null, preferences, target_frequency, id, MOCK_USER_ID]
        )
        if (result.rows.length === 0) return res.status(404).json({ error: 'Contact not found' })
        res.json(result.rows[0])
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to update contact' })
    }
})

// ==========================================
// 2. Maintenance & Interactions (客情维系及互动记录)
// ==========================================

// Get overdue contacts (needs maintenance)
router.get('/maintenance/overdue', async (req, res) => {
    try {
        const result = await query(
            `SELECT c.*, (CURRENT_DATE - c.last_contact_date) as days_since_last_contact
             FROM contacts c 
             WHERE user_id = $1 
               AND (CURRENT_DATE - c.last_contact_date) > c.target_frequency
             ORDER BY days_since_last_contact DESC`,
            [MOCK_USER_ID]
        )
        res.json(result.rows)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to fetch overdue contacts' })
    }
})

// Get upcoming events (birthdays/anniversaries within 30 days)
router.get('/maintenance/upcoming', async (req, res) => {
    try {
        // A simple query to find upcoming birthdays in PG
        // Note: Full logic for wrapping around the year end is complex in SQL, this uses a simplified exact 30-day window check based on DOY
        const result = await query(
            `SELECT c.id, c.name, c.relationship, c.birthday,
                    EXTRACT(DOY FROM c.birthday) - EXTRACT(DOY FROM CURRENT_DATE) as days_until
             FROM contacts c
             WHERE user_id = $1 AND c.birthday IS NOT NULL
             AND (
                 (EXTRACT(DOY FROM c.birthday) - EXTRACT(DOY FROM CURRENT_DATE) BETWEEN 0 AND 30)
                 OR
                 (EXTRACT(DOY FROM c.birthday) - EXTRACT(DOY FROM CURRENT_DATE) < 0 AND (365 + EXTRACT(DOY FROM c.birthday) - EXTRACT(DOY FROM CURRENT_DATE)) <= 30)
             )
             ORDER BY days_until ASC`,
            [MOCK_USER_ID]
        )
        res.json(result.rows)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to fetch upcoming events' })
    }
})

router.get('/interactions', async (req, res) => {
    const contactId = req.query.contact_id;
    try {
        let sql = `SELECT i.*, c.name as contact_name FROM interactions i JOIN contacts c ON i.contact_id = c.id WHERE c.user_id = $1`;
        let params: any[] = [MOCK_USER_ID];

        if (contactId) {
            sql += ` AND i.contact_id = $2`;
            params.push(contactId);
        }

        sql += ` ORDER BY i.interaction_date DESC, i.created_at DESC`;

        const result = await query(sql, params)
        res.json(result.rows)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to fetch interactions' })
    }
})

router.post('/interactions', async (req, res) => {
    const { contact_id, type, notes, interaction_date } = req.body
    try {
        await query('BEGIN')

        const result = await query(
            `INSERT INTO interactions (contact_id, type, notes, interaction_date) 
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [contact_id, type || 'chat', notes, interaction_date]
        )

        // Update last_contact_date in contacts table
        await query(
            `UPDATE contacts SET last_contact_date = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND user_id = $3`,
            [interaction_date, contact_id, MOCK_USER_ID]
        )

        await query('COMMIT')

        // Fetch the updated contact to return it along with interaction
        const updatedContact = await query(`SELECT * FROM contacts WHERE id = $1`, [contact_id])

        res.status(201).json({
            interaction: result.rows[0],
            contact: updatedContact.rows[0]
        })
    } catch (err) {
        await query('ROLLBACK')
        console.error(err)
        res.status(500).json({ error: 'Failed to log interaction' })
    }
})


// ==========================================
// 3. Gifts (人情往来/礼品账单)
// ==========================================

router.get('/gifts', async (req, res) => {
    try {
        const result = await query(
            `SELECT g.*, c.name as contact_name 
             FROM gifts g
             JOIN contacts c ON g.contact_id = c.id
             WHERE c.user_id = $1
             ORDER BY g.date DESC`,
            [MOCK_USER_ID]
        )
        res.json(result.rows)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to fetch gifts' })
    }
})

router.post('/gifts', async (req, res) => {
    const { contact_id, direction, item_name, value, date, notes } = req.body
    try {
        const result = await query(
            `INSERT INTO gifts (contact_id, direction, item_name, value, date, notes) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [contact_id, direction, item_name, value || 0, date, notes]
        )
        const updatedGift = await query(
            `SELECT g.*, c.name as contact_name FROM gifts g JOIN contacts c ON g.contact_id = c.id WHERE g.id = $1`,
            [result.rows[0].id]
        )
        res.status(201).json(updatedGift.rows[0])
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to record gift' })
    }
})

export default router;
