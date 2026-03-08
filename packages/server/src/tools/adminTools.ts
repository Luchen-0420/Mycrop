import { query } from '../db/pool'

/**
 * CAO Tool: Registers a new fixed asset.
 */
export async function addFixedAsset(userId: number, name: string, category: string, purchase_price: number): Promise<string> {
    if (!name || purchase_price === undefined) {
        throw new Error('Asset name and purchase price are required')
    }

    const result = await query(
        `INSERT INTO fixed_assets (user_id, name, category, purchase_price, purchase_date, status) 
          VALUES ($1, $2, $3, $4, CURRENT_DATE, '使用中') RETURNING id`,
        [userId, name, category, purchase_price]
    )

    return `Successfully registered fixed asset: "${name}" [Category: ${category}, Price: ${purchase_price}]. Asset ID: ${result.rows[0].id}`
}
