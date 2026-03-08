import { Router } from 'express'
import { query } from '../db/pool'

const router = Router()

// Default Mock User ID for Phase 1/Phase 2
const MOCK_USER_ID = 1;

// ==========================================
// 1. Inventory (库存台账)
// ==========================================

// Get all inventory items
router.get('/inventory', async (req, res) => {
    try {
        const result = await query(
            'SELECT * FROM inventory_items WHERE user_id = $1 ORDER BY category, updated_at DESC',
            [MOCK_USER_ID]
        )
        res.json(result.rows)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to fetch inventory' })
    }
})

// Create new inventory item
router.post('/inventory', async (req, res) => {
    const { name, category, location, quantity, unit, min_alert_quantity, expiry_date } = req.body
    try {
        const result = await query(
            `INSERT INTO inventory_items 
            (user_id, name, category, location, quantity, unit, min_alert_quantity, expiry_date) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [MOCK_USER_ID, name, category, location, quantity || 0, unit || '个', min_alert_quantity || 1, expiry_date || null]
        )
        res.status(201).json(result.rows[0])
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to add inventory item' })
    }
})

// Update inventory quantity
router.put('/inventory/:id', async (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;
    try {
        const result = await query(
            'UPDATE inventory_items SET quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND user_id = $3 RETURNING *',
            [quantity, id, MOCK_USER_ID]
        )
        if (result.rows.length === 0) return res.status(404).json({ error: 'Item not found' })
        res.json(result.rows[0])
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to update inventory quantity' })
    }
})


// ==========================================
// 2. Fixed Assets (固定资产)
// ==========================================

// Get all assets
router.get('/assets', async (req, res) => {
    try {
        const result = await query(
            'SELECT * FROM fixed_assets WHERE user_id = $1 ORDER BY purchase_date DESC',
            [MOCK_USER_ID]
        )
        res.json(result.rows)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to fetch assets' })
    }
})

// Create asset
router.post('/assets', async (req, res) => {
    const { name, category, purchase_date, purchase_price, status, location } = req.body
    try {
        const result = await query(
            `INSERT INTO fixed_assets 
            (user_id, name, category, purchase_date, purchase_price, status, location) 
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [MOCK_USER_ID, name, category, purchase_date, purchase_price, status || '使用中', location]
        )
        res.status(201).json(result.rows[0])
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to record asset' })
    }
})


// ==========================================
// 3. Procurement & AI Review (采购与 AI 审批)
// ==========================================

// Get procurement history
router.get('/procurement', async (req, res) => {
    try {
        const result = await query(
            'SELECT * FROM procurement_requests WHERE user_id = $1 ORDER BY created_at DESC',
            [MOCK_USER_ID]
        )
        res.json(result.rows)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to fetch procurement history' })
    }
})

// Submit a new procurement request and trigger mock AI review
router.post('/procurement/request', async (req, res) => {
    const { item_name, estimated_price, reason, is_promotion_day } = req.body;

    // ------------------------------------------------------------------
    // Phase 1: Mock AI Review Logic (Pseudorandom + Rule based)
    // ------------------------------------------------------------------
    let ai_decision = 'pending';
    let ai_comment = '思考中...';

    const price = parseFloat(estimated_price);

    // Rule 1: Cheap items pass easily
    if (price < 50) {
        ai_decision = 'approved';
        ai_comment = '金额较小，属于合理日常开销，批准购买。注意别囤积过量哦！';
    }
    // Rule 2: Promotion day gives a huge boost
    else if (is_promotion_day && price < 2000) {
        // 80% pass rate on promotion days under 2000
        const roll = Math.random();
        if (roll > 0.2) {
            ai_decision = 'approved';
            ai_comment = `鉴于今天是电商大促节点，且申请理据充分，批准此次大宗采购！请享受你的战利品。`;
        } else {
            ai_decision = 'rejected';
            ai_comment = `虽然是大促，但这笔开销 ${price} 元仍超出了你的当月缓冲预算。大促常有，钱不好赚，建议冷静一晚再加购物车！`;
        }
    }
    // Rule 3: Expensive items are harshly judged
    else if (price >= 2000) {
        // 90% reject rate for expensive non-promotion items
        const roll = Math.random();
        if (roll > 0.9) {
            ai_decision = 'approved';
            ai_comment = `这笔巨款 (${price} 元) 看似冲动，但经过深度评估，它对你的长期价值高于成本。破例批准。`;
        } else {
            ai_decision = 'rejected';
            ai_comment = `作为你的私人 AI CFO，我必须打醒你。真的需要花 ${price} 元买这个吗？你的“${reason}”借口太牵强了。建议存到指数基金里。驳回申请！`;
        }
    }
    // Rule 4: Normal items (50 ~ 2000)
    else {
        // 50/50 chance
        const roll = Math.random();
        if (roll > 0.5) {
            ai_decision = 'approved';
            ai_comment = '理由合理，生活需要一点奖赏，批准购买。';
        } else {
            ai_decision = 'rejected';
            ai_comment = '非必需品！想想家里的剩余空间，以及积灰的同类物品。为了你的资产增值，还是省下这笔钱吧。';
        }
    }

    try {
        // First insert the pending request, then immediately update with AI mock decision
        const result = await query(
            `INSERT INTO procurement_requests 
            (user_id, item_name, estimated_price, reason, is_promotion_day, ai_decision, ai_comment, status) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [MOCK_USER_ID, item_name, estimated_price, reason, is_promotion_day || false, ai_decision, ai_comment, ai_decision === 'approved' ? '待购买' : '已放弃']
        )

        // Simulate a tiny delay for "AI thinking" feeling on client side
        setTimeout(() => {
            res.status(201).json(result.rows[0])
        }, 1500)

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to process procurement request' })
    }
})

// Update actual status manually (e.g., Bought it)
router.put('/procurement/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const result = await query(
            'UPDATE procurement_requests SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND user_id = $3 RETURNING *',
            [status, id, MOCK_USER_ID]
        )
        if (result.rows.length === 0) return res.status(404).json({ error: 'Request not found' })
        res.json(result.rows[0])
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to update status' })
    }
})

// ==========================================
// 4. Credentials & Physical Documents (证照档案)
// ==========================================

router.get('/credentials', async (req, res) => {
    try {
        const result = await query(
            `SELECT *, 
                EXTRACT(DAY FROM (expiry_date - CURRENT_DATE)) as days_until_expiry 
             FROM credentials 
             WHERE user_id = $1 
             ORDER BY expiry_date ASC NULLS LAST`,
            [MOCK_USER_ID]
        )
        res.json(result.rows)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to fetch credentials' })
    }
})

router.post('/credentials', async (req, res) => {
    const { type, name, identifier, issue_date, expiry_date, location, notes } = req.body
    try {
        const result = await query(
            `INSERT INTO credentials 
            (user_id, type, name, identifier, issue_date, expiry_date, location, notes) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [MOCK_USER_ID, type || 'id_card', name, identifier, issue_date || null, expiry_date || null, location, notes]
        )
        res.status(201).json(result.rows[0])
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to add credential' })
    }
})

router.put('/credentials/:id', async (req, res) => {
    const { id } = req.params;
    const { type, name, identifier, issue_date, expiry_date, location, notes } = req.body;
    try {
        const result = await query(
            `UPDATE credentials 
             SET type = $1, name = $2, identifier = $3, issue_date = $4, expiry_date = $5, location = $6, notes = $7, updated_at = CURRENT_TIMESTAMP
             WHERE id = $8 AND user_id = $9 RETURNING *`,
            [type, name, identifier, issue_date || null, expiry_date || null, location, notes, id, MOCK_USER_ID]
        )
        if (result.rows.length === 0) return res.status(404).json({ error: 'Credential not found' })
        res.json(result.rows[0])
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to update credential' })
    }
})

router.delete('/credentials/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await query('DELETE FROM credentials WHERE id = $1 AND user_id = $2 RETURNING id', [id, MOCK_USER_ID])
        if (result.rows.length === 0) return res.status(404).json({ error: 'Credential not found' })
        res.json({ message: 'Deleted successfully' })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to delete credential' })
    }
})

// ==========================================
// 5. Digital Accounts (数字账号保险柜)
// ==========================================

router.get('/accounts', async (req, res) => {
    try {
        const result = await query(
            'SELECT * FROM digital_accounts WHERE user_id = $1 ORDER BY platform_name ASC',
            [MOCK_USER_ID]
        )
        res.json(result.rows)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to fetch accounts' })
    }
})

router.post('/accounts', async (req, res) => {
    const { platform_name, account_type, username, password_hint, bind_email, bind_phone, notes } = req.body
    try {
        const result = await query(
            `INSERT INTO digital_accounts 
            (user_id, platform_name, account_type, username, password_hint, bind_email, bind_phone, notes) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [MOCK_USER_ID, platform_name, account_type || 'social', username, password_hint, bind_email, bind_phone, notes]
        )
        res.status(201).json(result.rows[0])
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to add account' })
    }
})

router.put('/accounts/:id', async (req, res) => {
    const { id } = req.params;
    const { platform_name, account_type, username, password_hint, bind_email, bind_phone, notes } = req.body;
    try {
        const result = await query(
            `UPDATE digital_accounts 
             SET platform_name = $1, account_type = $2, username = $3, password_hint = $4, bind_email = $5, bind_phone = $6, notes = $7, updated_at = CURRENT_TIMESTAMP
             WHERE id = $8 AND user_id = $9 RETURNING *`,
            [platform_name, account_type, username, password_hint, bind_email, bind_phone, notes, id, MOCK_USER_ID]
        )
        if (result.rows.length === 0) return res.status(404).json({ error: 'Account not found' })
        res.json(result.rows[0])
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to update account' })
    }
})

router.delete('/accounts/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await query('DELETE FROM digital_accounts WHERE id = $1 AND user_id = $2 RETURNING id', [id, MOCK_USER_ID])
        if (result.rows.length === 0) return res.status(404).json({ error: 'Account not found' })
        res.json({ message: 'Deleted successfully' })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to delete account' })
    }
})

export default router;
