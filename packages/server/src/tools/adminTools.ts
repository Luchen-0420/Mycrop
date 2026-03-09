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

/**
 * CAO Tool: Checks if an item exists in the inventory.
 */
export async function checkInventory(userId: number, itemName: string): Promise<string> {
    if (!itemName) throw new Error('itemName is required for inventory check')

    const result = await query(
        `SELECT name, quantity, unit, location FROM inventory_items 
         WHERE user_id = $1 AND name ILIKE $2`,
        [userId, `%${itemName}%`]
    )

    if (result.rows.length === 0) {
        return `[Inventory Result] 数据库检索中未发现 "${itemName}"。行政部确认为【新采购需求】。`
    }

    const items = result.rows.map(r => `"${r.name}" (余量: ${r.quantity}${r.unit}, 存放于: ${r.location})`).join('; ')
    return `[Inventory Result] 警报！发现疑似同类库存：${items}。请总裁复核是否仍需采购。`
}
