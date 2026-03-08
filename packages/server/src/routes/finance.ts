import { Router } from 'express'
import { query } from '../db/pool'

const router = Router()
const MOCK_USER_ID = 1;

// ==========================================
// 1. Accounts & Ledger (总账与账户)
// ==========================================

// Get all accounts
router.get('/accounts', async (req, res) => {
    try {
        const result = await query(
            'SELECT * FROM accounts WHERE user_id = $1 ORDER BY type, name',
            [MOCK_USER_ID]
        )
        res.json(result.rows)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to fetch accounts' })
    }
})

// Create an account
router.post('/accounts', async (req, res) => {
    const { name, type, initial_balance } = req.body
    try {
        const result = await query(
            `INSERT INTO accounts (user_id, name, type, balance) 
            VALUES ($1, $2, $3, $4) RETURNING *`,
            [MOCK_USER_ID, name, type, initial_balance || 0]
        )
        res.status(201).json(result.rows[0])
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to create account' })
    }
})

// Get recent transactions
router.get('/transactions', async (req, res) => {
    const limit = parseInt(req.query.limit as string) || 50;
    try {
        const result = await query(
            `SELECT t.*, a.name as account_name 
             FROM transactions t
             JOIN accounts a ON t.account_id = a.id
             WHERE t.user_id = $1 
             ORDER BY t.transaction_date DESC, t.created_at DESC
             LIMIT $2`,
            [MOCK_USER_ID, limit]
        )
        res.json(result.rows)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to fetch transactions' })
    }
})

// Add a transaction (记一笔)
router.post('/transactions', async (req, res) => {
    const { account_id, type, amount, category, description, transaction_date } = req.body

    // Convert amount to positive Decimal
    const absAmount = Math.abs(parseFloat(amount));

    try {
        await query('BEGIN')

        // 1. Record the transaction
        const tResult = await query(
            `INSERT INTO transactions (user_id, account_id, type, amount, category, description, transaction_date)
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [MOCK_USER_ID, account_id, type, absAmount, category, description, transaction_date || new Date().toISOString().split('T')[0]]
        )

        // 2. Update account balance
        // If income, add. If expense, subtract.
        const balanceChange = type === 'income' ? absAmount : -absAmount;

        await query(
            `UPDATE accounts SET balance = balance + $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND user_id = $3`,
            [balanceChange, account_id, MOCK_USER_ID]
        )

        await query('COMMIT')
        res.status(201).json(tResult.rows[0])
    } catch (err) {
        await query('ROLLBACK')
        console.error(err)
        res.status(500).json({ error: 'Failed to add transaction' })
    }
})

router.post('/transactions/batch', async (req, res) => {
    const { transactions } = req.body; // Expects an array of transaction-like objects

    if (!Array.isArray(transactions) || transactions.length === 0) {
        return res.status(400).json({ error: 'Invalid or empty transactions array' });
    }

    // This is a simplified version. A real app would need to map these expenses
    // to a specific account, likely a reimbursement or travel expense account.
    // For now, we'll assume a default cash/main account (e.g., account_id = 1)
    const DEFAULT_EXPENSE_ACCOUNT_ID = 1;

    try {
        await query('BEGIN');

        const createdTransactions = [];
        let totalAmount = 0;

        for (const trans of transactions) {
            const { amount, category, item, date } = trans;
            const tResult = await query(
                `INSERT INTO transactions (user_id, account_id, type, amount, category, description, transaction_date)
                 VALUES ($1, $2, 'expense', $3, $4, $5, $6) RETURNING *`,
                [MOCK_USER_ID, DEFAULT_EXPENSE_ACCOUNT_ID, amount, category, `[差旅报销] ${item}`, date]
            );
            createdTransactions.push(tResult.rows[0]);
            totalAmount += parseFloat(amount);
        }

        // Update the account balance in one go
        await query(
            `UPDATE accounts SET balance = balance - $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND user_id = $3`,
            [totalAmount, DEFAULT_EXPENSE_ACCOUNT_ID, MOCK_USER_ID]
        );

        await query('COMMIT');
        res.status(201).json(createdTransactions);
    } catch (err) {
        await query('ROLLBACK');
        console.error(err);
        res.status(500).json({ error: 'Failed to batch add transactions' });
    }
});

// ==========================================
// 2. Budgets (预算)
// ==========================================

// Get budgets for a specific month
router.get('/budgets/:month', async (req, res) => {
    const { month } = req.params; // YYYY-MM
    try {
        const result = await query(
            'SELECT * FROM budgets WHERE user_id = $1 AND month = $2',
            [MOCK_USER_ID, month]
        )

        // Let's also fetch actual expenses for this month to compare
        const expenses = await query(
            `SELECT category, SUM(amount) as spent 
             FROM transactions 
             WHERE user_id = $1 AND type = 'expense' AND TO_CHAR(transaction_date, 'YYYY-MM') = $2
             GROUP BY category`,
            [MOCK_USER_ID, month]
        )

        res.json({ budgets: result.rows, expenses: expenses.rows })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to fetch budgets' })
    }
})

// Set/update a budget limit
router.post('/budgets', async (req, res) => {
    const { month, category, amount_limit } = req.body
    try {
        // Upsert budget
        const result = await query(
            `INSERT INTO budgets (user_id, month, category, amount_limit)
             VALUES ($1, $2, $3, $4)
             ON CONFLICT (user_id, month, category) 
             DO UPDATE SET amount_limit = $4, updated_at = CURRENT_TIMESTAMP
             RETURNING *`,
            [MOCK_USER_ID, month, category, amount_limit]
        )
        res.status(201).json(result.rows[0])
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to set budget' })
    }
})

// ==========================================
// 3. Points & Wishlist (期权行权中心)
// ==========================================

// Get current points balance and history
router.get('/points', async (req, res) => {
    try {
        // Calculate balance directly from logs
        const balanceResult = await query(
            'SELECT SUM(amount) as balance FROM points_logs WHERE user_id = $1',
            [MOCK_USER_ID]
        )
        const balance = balanceResult.rows[0].balance || 0;

        const logsResult = await query(
            'SELECT * FROM points_logs WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50',
            [MOCK_USER_ID]
        )

        res.json({ balance: parseInt(balance), logs: logsResult.rows })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to fetch points' })
    }
})

// Grant or Deduct points
router.post('/points/grant', async (req, res) => {
    const { amount, source, description } = req.body
    try {
        const result = await query(
            `INSERT INTO points_logs (user_id, amount, source, description) VALUES ($1, $2, $3, $4) RETURNING *`,
            [MOCK_USER_ID, parseInt(amount), source, description]
        )
        res.status(201).json(result.rows[0])
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to grant points' })
    }
})

// Get active wishlist items
router.get('/wishlist', async (req, res) => {
    try {
        const result = await query(
            `SELECT * FROM wishlist_items WHERE user_id = $1 AND status = 'active' ORDER BY created_at DESC`,
            [MOCK_USER_ID]
        )
        res.json(result.rows)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to fetch wishlist' })
    }
})

// Add to wishlist
router.post('/wishlist', async (req, res) => {
    const { name, target_points } = req.body
    try {
        const result = await query(
            `INSERT INTO wishlist_items (user_id, name, target_points) VALUES ($1, $2, $3) RETURNING *`,
            [MOCK_USER_ID, name, parseInt(target_points)]
        )
        res.status(201).json(result.rows[0])
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to add wishlist item' })
    }
})

// Redeem a wishlist item (行权)
router.post('/wishlist/:id/redeem', async (req, res) => {
    const { id } = req.params;

    try {
        await query('BEGIN')

        // Get the item price
        const itemRes = await query(`SELECT * FROM wishlist_items WHERE id = $1 AND user_id = $2 AND status = 'active'`, [id, MOCK_USER_ID])
        if (itemRes.rows.length === 0) {
            await query('ROLLBACK')
            return res.status(404).json({ error: 'Item not found or already redeemed' })
        }

        const item = itemRes.rows[0];

        // Deduct points
        await query(
            `INSERT INTO points_logs (user_id, amount, source, description) VALUES ($1, $2, $3, $4)`,
            [MOCK_USER_ID, -item.target_points, 'wishlist_redeem', `兑换心愿商品: ${item.name}`]
        )

        // Mark as redeemed
        await query(`UPDATE wishlist_items SET status = 'redeemed', updated_at = CURRENT_TIMESTAMP WHERE id = $1`, [id])

        await query('COMMIT')
        res.json({ message: 'Redeemed successfully' })
    } catch (err) {
        await query('ROLLBACK')
        console.error(err)
        res.status(500).json({ error: 'Failed to redeem item' })
    }
})

// ==========================================
// 4. Subscriptions (订阅追踪)
// ==========================================

router.get('/subscriptions', async (req, res) => {
    try {
        const result = await query(
            `SELECT * FROM subscriptions WHERE user_id = $1 AND status = 'active' ORDER BY next_billing_date ASC`,
            [MOCK_USER_ID]
        )
        res.json(result.rows)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to fetch subscriptions' })
    }
})

router.post('/subscriptions', async (req, res) => {
    const { name, amount, billing_cycle, next_billing_date, category } = req.body
    try {
        const result = await query(
            `INSERT INTO subscriptions (user_id, name, amount, billing_cycle, next_billing_date, category) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [MOCK_USER_ID, name, amount, billing_cycle || 'monthly', next_billing_date, category]
        )
        res.status(201).json(result.rows[0])
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to add subscription' })
    }
})

export default router;
