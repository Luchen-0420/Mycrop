export function getDepartmentToolsSchema(role: string): any[] {
    const normalizedRole = role.toLowerCase()

    if (normalizedRole === 'cfo' || normalizedRole === 'finance') {
        return [
            {
                name: 'record_transaction',
                description: '记录一笔真实的财务交易流水（支出或收入）。当 CEO 要求你买东西或记录开销时调用此工具。',
                parameters: {
                    type: 'object',
                    properties: {
                        amount: { type: 'number', description: '交易金额，必须为正数' },
                        category: { type: 'string', description: '类别，例如：餐饮、交通、购物、娱乐等' },
                        type: { type: 'string', enum: ['expense', 'income'], description: '收入还是支出' },
                        description: { type: 'string', description: '交易用途说明' }
                    },
                    required: ['amount', 'category', 'type', 'description']
                }
            },
            {
                name: 'check_budget',
                description: '查询当月某个消费类别的剩余预算余额。在需要做财务风控审批前，最好先查一查。',
                parameters: {
                    type: 'object',
                    properties: {
                        category: { type: 'string', description: '要查询的预算类别，传"全量"可查询整体预算' }
                    },
                    required: ['category']
                }
            },
            {
                name: 'create_wishlist_goal',
                description: '为 CEO 创建一个心愿目标（期权兑换目标）。CEO 想买某个贵重物品时，先创建心愿单，通过完成任务积累积分来兑换。',
                parameters: {
                    type: 'object',
                    properties: {
                        name: { type: 'string', description: '心愿物品名称' },
                        target_points: { type: 'number', description: '兑换所需积分（通常等于物品价格）' }
                    },
                    required: ['name', 'target_points']
                }
            },
            {
                name: 'check_points_balance',
                description: '查询 CEO 当前的期权积分余额，并显示进行中的心愿目标进度。',
                parameters: {
                    type: 'object',
                    properties: {},
                    required: []
                }
            },
            {
                name: 'redeem_wishlist_goal',
                description: '当积分余额达到心愿目标要求时，兑换该心愿。会自动扣除积分并将心愿标记为已兑换。',
                parameters: {
                    type: 'object',
                    properties: {
                        wishlist_id: { type: 'number', description: '要兑换的心愿目标ID' }
                    },
                    required: ['wishlist_id']
                }
            }
        ]
    }

    if (normalizedRole === 'coo' || normalizedRole === 'operations') {
        return [
            {
                name: 'create_task',
                description: '为 CEO 安排并创建一个具体的待办事项排期，可选绑定积分奖励和关联心愿目标。当需要为心愿目标拆分可执行任务时，务必填写 points_reward 和 linked_wishlist_id。',
                parameters: {
                    type: 'object',
                    properties: {
                        title: { type: 'string', description: '任务的核心名' },
                        priority: { type: 'string', enum: ['low', 'medium', 'high', 'urgent'], description: '优先级' },
                        description: { type: 'string', description: '任务具体细节安排与要求' },
                        points_reward: { type: 'number', description: '完成此任务可获得的积分奖励数量，默认0' },
                        linked_wishlist_id: { type: 'number', description: '关联的心愿目标ID，用于追踪进度' }
                    },
                    required: ['title', 'priority']
                }
            },
            {
                name: 'complete_task',
                description: '将某个任务标记为已完成。如果该任务绑定了积分奖励，则自动发放积分并更新心愿目标进度。',
                parameters: {
                    type: 'object',
                    properties: {
                        task_id: { type: 'number', description: '要标记为完成的任务ID' }
                    },
                    required: ['task_id']
                }
            }
        ]
    }

    if (normalizedRole === 'cao' || normalizedRole === 'admin') {
        return [
            {
                name: 'add_fixed_asset',
                description: '当年购买了大件、耐用物品（例如手机、电脑、家具、游戏机）时，将其登记为公司的固定资产以追踪其折旧价值。这不等于日常消费。',
                parameters: {
                    type: 'object',
                    properties: {
                        name: { type: 'string', description: '资产名称' },
                        category: { type: 'string', description: '资产属类：如"电子数码", "生活起居"' },
                        purchase_price: { type: 'number', description: '购买时的价格（必填金额）' }
                    },
                    required: ['name', 'category', 'purchase_price']
                }
            }
        ]
    }

    return []
}
