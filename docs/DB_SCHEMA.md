# 数据库核心字典 (DB Schema)

> 最后更新: 2026-03-02  
> 数据库类型: PostgreSQL 14+

本文档记录 Me Corp 系统中所有的实体关系模型与数据表结构定义。随着各部门开发进度推进，本字典会持续更新。

---

## 0. 🔐 门禁与统一身份认证 (Auth)

### `users` (员工表)
系统的核心用户账号实体，目前主要为超级管理员 "CEO" 账号。

| 字段名 | 类型 | 约束 | 备注 |
|---|---|---|---|
| `id` | SERIAL | PRIMARY KEY | 自增主键 |
| `username` | VARCHAR(50) | UNIQUE, NOT NULL | 员工姓名 / 别名 |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | 登录邮箱 |
| `password_hash` | VARCHAR(255) | NOT NULL | 加密口令 |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 入职/注册时间 |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 最后更新时间 |

---

## 2. 💰 财务部 (CFO Finance)

管理个人资金与收支，掌控预算，以及作为核心动力的“期权(积分)”行权所。

### `accounts` (资金账户)
存储现实世界中的各大资金池余额。

| 字段名 | 类型 | 约束 | 备注 |
|---|---|---|---|
| `id` | SERIAL | PRIMARY KEY | |
| `user_id` | INTEGER | REFERENCES users(id) ON DELETE CASCADE | |
| `name` | VARCHAR(100) | NOT NULL | 账户名 (如: "招行储蓄卡", "微信零钱") |
| `type` | VARCHAR(50) | NOT NULL | `cash`, `bank`, `credit`, `investment` |
| `balance` | DECIMAL(15, 2) | DEFAULT 0.00 | 当前账户净值 |

### `transactions` (收支总账)
记录每一笔金额流入与流出。

| 字段名 | 类型 | 约束 | 备注 |
|---|---|---|---|
| `id` | SERIAL | PRIMARY KEY | |
| `user_id` | INTEGER | REFERENCES users(id) ON DELETE CASCADE | |
| `account_id` | INTEGER | REFERENCES accounts(id) ON DELETE CASCADE | |
| `type` | VARCHAR(20) | NOT NULL | `income` (收入), `expense` (支出), `transfer` |
| `amount` | DECIMAL(15, 2)| NOT NULL | 交易绝对金额 |
| `category` | VARCHAR(50) | | "餐饮", "工资", "购物" 等分类维度 |
| `description` | TEXT | | 消费备注 |
| `transaction_date`| DATE | NOT NULL | 交易发生日 |

### `budgets` (分类预算)
拦截过度开支的红线。

| 字段名 | 类型 | 约束 | 备注 |
|---|---|---|---|
| `id` | SERIAL | PRIMARY KEY | |
| `user_id` | INTEGER | REFERENCES users(id) ON DELETE CASCADE | |
| `month` | VARCHAR(7) | NOT NULL | 预算周期 YYYY-MM |
| `category` | VARCHAR(50) | NOT NULL | 归属维度，如 "餐饮" 或 "全局" |
| `amount_limit` | DECIMAL(15, 2)| NOT NULL | 最大消费限额 |

*唯一键约束: 同月同分类只能有一条预算上限 `UNIQUE(user_id, month, category)`*

### `points_logs` (期权积分流水)
Me Corp 的企业股权/系统积分日志。**系统设定 1 积分 = 1 RMB。**

| 字段名 | 类型 | 约束 | 备注 |
|---|---|---|---|
| `id` | SERIAL | PRIMARY KEY | |
| `user_id` | INTEGER | REFERENCES users(id) ON DELETE CASCADE | |
| `amount` | INTEGER | NOT NULL | 增发(+) 或 行权消耗(-) |
| `source` | VARCHAR(50) | NOT NULL | 事由类型缩写 (如 `early_sleep`, `wishlist`) |
| `description` | TEXT | | 详细原因 |

*注：当前净可用积分通过 `SUM(amount)` 实时计算得出。*

### `wishlist_items` (行权赏品单)
用作努力目标的悬赏上架商品。

| 字段名 | 类型 | 约束 | 备注 |
|---|---|---|---|
| `id` | SERIAL | PRIMARY KEY | |
| `user_id` | INTEGER | REFERENCES users(id) ON DELETE CASCADE | |
| `name` | VARCHAR(255) | NOT NULL | 想兑换/购买的商品名 |
| `target_points` | INTEGER | NOT NULL | 目标标价（由于1:1汇率，此为实际价格） |
| `status` | VARCHAR(20) | DEFAULT 'active' | `active` (攒命中), `redeemed` (已行权) |

### `subscriptions` (定期订阅)
隐蔽的长期基础维系成本抽血记录。

| 字段名 | 类型 | 约束 | 备注 |
|---|---|---|---|
| `id` | SERIAL | PRIMARY KEY | |
| `user_id` | INTEGER | REFERENCES users(id) ON DELETE CASCADE | |
| `name` | VARCHAR(255) | NOT NULL | 订阅名 (如: Netflix, 房租) |
| `amount` | DECIMAL(15, 2)| NOT NULL | 周期单价扣费额 |
| `billing_cycle`| VARCHAR(20) | DEFAULT 'monthly'| `monthly` (按月), `yearly` (按年) |
| `next_billing_date`| DATE | NOT NULL | 下个账单日预告 |
| `category` | VARCHAR(50) | | "娱乐", "生活设施" 等 |

---

## 3. ⚙️ 运营部 (COO Operations)

作为执行引擎，包含了待办任务流转、中长期的核心 SOP（习惯）以及长期战略层面的 OKR 目标管控。

### `tasks` (任务看板表)
敏捷看板的任务载体。

| 字段名 | 类型 | 约束 | 备注 |
|---|---|---|---|
| `id` | SERIAL | PRIMARY KEY | |
| `user_id` | INTEGER | REFERENCES users(id) ON DELETE CASCADE | |
| `title` | VARCHAR(255) | NOT NULL | 任务标题 |
| `description` | TEXT | | 具体描述 |
| `status` | VARCHAR(20) | DEFAULT 'todo' | 泳道标识: `todo`, `in_progress`, `done` |
| `priority` | VARCHAR(20) | DEFAULT 'medium' | `low`, `medium`, `high`, `urgent` |
| `due_date` | DATE | | 交付/截止日 |
| `points_reward` | INTEGER | DEFAULT 0 | (Phase 5.5) 完成该任务奖励的系统积分 |
| `linked_wishlist_id`| INTEGER | REFERENCES wishlist_items | (Phase 5.5) 挂钩冲刺的心愿目标 |

### `habits` (习惯 SOP 定义表)
长期坚持并用以赚取系统期权的标准化工作模型。

| 字段名 | 类型 | 约束 | 备注 |
|---|---|---|---|
| `id` | SERIAL | PRIMARY KEY | |
| `user_id` | INTEGER | REFERENCES users(id) ON DELETE CASCADE | |
| `name` | VARCHAR(255) | NOT NULL | 如"早睡", "健身" |
| `frequency` | VARCHAR(20) | DEFAULT 'daily' | `daily`, `weekly` |
| `points_reward` | INTEGER | DEFAULT 30 | 执行一次给财务部发送的奖励期权数 |
| `current_streak` | INTEGER | DEFAULT 0 | 连续执行天数 |

### `habit_logs` (SOP 打卡流水)
限制一天只能打卡一次的实体签到表。

| 字段名 | 类型 | 约束 | 备注 |
|---|---|---|---|
| `id` | SERIAL | PRIMARY KEY | |
| `user_id` | INTEGER | REFERENCES users(id) | |
| `habit_id` | INTEGER | REFERENCES habits(id) | |
| `log_date` | DATE | NOT NULL | 打卡日期 (YYYY-MM-DD) |

*唯一约束防止一日多打: `UNIQUE(user_id, habit_id, log_date)`*

### `okrs` (宏观战略目标 Objective)
决定了个人发展的方向。

| 字段名 | 类型 | 约束 | 备注 |
|---|---|---|---|
| `id` | SERIAL | PRIMARY KEY | |
| `user_id` | INTEGER | REFERENCES users(id) ON DELETE CASCADE | |
| `quarter` | VARCHAR(20) | NOT NULL | 考核周期，如 "2026 Q1" |
| `objective` | VARCHAR(255) | NOT NULL | 主目标描述 |
| `progress` | INTEGER | DEFAULT 0 | 总进度 (0-100)，自动通过 KR 均值计算 |
| `status` | VARCHAR(20) | DEFAULT 'active' | |

### `key_results` (关键度量指标 KR)
定性目标拆解后的定量指标。

| 字段名 | 类型 | 约束 | 备注 |
|---|---|---|---|
| `id` | SERIAL | PRIMARY KEY | |
| `okr_id` | INTEGER | REFERENCES okrs(id) ON DELETE CASCADE | 隶属目标 |
| `title` | VARCHAR(255) | NOT NULL | 度量动作 |
| `current_value` | INTEGER | DEFAULT 0 | 当前达到/执行的情况 |
| `target_value` | INTEGER | NOT NULL | 满分定额目标 |

---

## 4. 📚 人力资源部 (HR & L&D)

包含员工的技能认证、长线培训规划及健康状态追踪。目前实装于后端 `init.ts` 中。

### `skills` (技能表)
记录员工（自己）所掌握的核心技能及当前的 XP (经验值) 熟练度。

| 字段名 | 类型 | 约束 | 备注 |
|---|---|---|---|
| `id` | SERIAL | PRIMARY KEY | |
| `user_id` | INTEGER | REFERENCES users(id) ON DELETE CASCADE | 归属员工 |
| `name` | VARCHAR(100) | NOT NULL | 技能名称，例如 "Python 开发", "初级日语" |
| `category` | VARCHAR(50) | NOT NULL | 类别枚举: `hard` (硬技能), `soft` (软技能), `language` (语言), `life` (生活) |
| `level` | INTEGER | DEFAULT 1 | 职级/等级 (Lv.1 - Lv.5 或 P1 - P5) |
| `xp` | INTEGER | DEFAULT 0 | 当前级别的经验值积累 |
| `max_xp` | INTEGER | DEFAULT 100 | 升至下一级所需经验，升级后将重算阈值 |
| `created_at` | TIMESTAMP | | |
| `updated_at` | TIMESTAMP | | |

*唯一键约束: 同一用户不可有同名技能 `UNIQUE(user_id, name)`*

### `training_projects` (培训项目表)
立项的中长线学习计划，例如“考取 PMP 证书”或“三个月入门前端”。

| 字段名 | 类型 | 约束 | 备注 |
|---|---|---|---|
| `id` | SERIAL | PRIMARY KEY | |
| `user_id` | INTEGER | REFERENCES users(id) ON DELETE CASCADE | |
| `name` | VARCHAR(255) | NOT NULL | 项目与计划名称 |
| `goal` | TEXT | | 核心目标或要实现的结果描述 |
| `status` | VARCHAR(50) | DEFAULT 'in_progress' | 当前状态: `in_progress`, `completed`, `paused` |
| `start_date` | DATE | | 计划开始日期 |
| `end_date` | DATE | | 计划预计结束日期 |

### `training_resources` (学习资源库)
通过“培训学院”打卡与解析的具体物料，必须挂载在某个项目下。

| 字段名 | 类型 | 约束 | 备注 |
|---|---|---|---|
| `id` | SERIAL | PRIMARY KEY | |
| `project_id` | INTEGER | REFERENCES training_projects(id) ON DELETE CASCADE| 所属的培训计划 |
| `title` | VARCHAR(255) | NOT NULL | 资源名（例如某个 B站合集的标题） |
| `type` | VARCHAR(50) | NOT NULL | 本地化类型: `video`, `book`, `course`, `document` |
| `url` | TEXT | | 原资源的链接（支持在线跳转与再解析） |
| `total_items` | INTEGER | DEFAULT 1 | 资源总节数/页数 (例如视频总计200集) |
| `completed_items` | INTEGER | DEFAULT 0 | 进度：已看完的节数 |

### `wellness_logs` (身心关怀日志)
每日追踪的员工健康与情绪状态，打卡填写。每天仅允许有一条记录（采用 Upsert 机制更新）。

| 字段名 | 类型 | 约束 | 备注 |
|---|---|---|---|
| `id` | SERIAL | PRIMARY KEY | |
| `user_id` | INTEGER | REFERENCES users(id) ON DELETE CASCADE | |
| `record_date` | DATE | NOT NULL | 数据归属日期 (只记 YYYY-MM-DD) |
| `stress_level` | INTEGER | CHECK (1-10) | 基于主观感受的压力评估 |
| `mood` | VARCHAR(50) | | 今日主导情绪标识 (`happy`, `calm`, `tired`, `stressed` 等) |
| `sleep_quality` | INTEGER | CHECK (1-10) | 昨晚的睡眠质量打分 |
| `notes` | TEXT | | 对内（给自己）的随笔、吐槽或自我关怀寄语 |

*唯一键约束: 同一天不可重复创建 `UNIQUE(user_id, record_date)`*

---

## 6. 🏠 行政部 (CAO Logistics)

管理公司（个人）的后勤物资与非流动资产，并带有 AI 财务风控拦截系统。

### `inventory_items` (物资库存清单)
记录日常快消品与生活必需品的余量，支持安全库存预警。

| 字段名 | 类型 | 约束 | 备注 |
|---|---|---|---|
| `id` | SERIAL | PRIMARY KEY | |
| `user_id` | INTEGER | REFERENCES users(id) ON DELETE CASCADE | |
| `name` | VARCHAR(255) | NOT NULL | 物品名 (如: "抽纸", "咖啡豆") |
| `category` | VARCHAR(50) | NOT NULL | `食品`, `日用品`, `文具`, `电器耗材` 等 |
| `location` | VARCHAR(100) | | 存放位置 (如: "储藏室第二层") |
| `quantity` | INTEGER | DEFAULT 0 | 当前剩余数量 |
| `unit` | VARCHAR(20) | DEFAULT '个' | 物理单位 (包/瓶/盒) |
| `min_alert_quantity` | INTEGER | DEFAULT 1 | 触发低库存警告的红线 |
| `expiry_date` | DATE | | 物品保质期 (可选) |

### `fixed_assets` (固定资产台账)
记录高净值、具有较长使用寿命的固定资产设备与折旧情况。

| 字段名 | 类型 | 约束 | 备注 |
|---|---|---|---|
| `id` | SERIAL | PRIMARY KEY | |
| `user_id` | INTEGER | REFERENCES users(id) ON DELETE CASCADE | |
| `name` | VARCHAR(255) | NOT NULL | 资产名 (如: "外星人台式机", "赫曼米勒椅子") |
| `category` | VARCHAR(50) | | `电子设备`, `家居家具`, `交通工具`, `房产` |
| `purchase_date` | DATE | | 购入时间 |
| `purchase_price` | DECIMAL(10, 2) | | 购入时价值 |
| `status` | VARCHAR(50) | DEFAULT '使用中' | 状态枚举: `使用中`, `已闲置`, `已出二手` |
| `location` | VARCHAR(100) | | 布控位置 (如: "书房") |

### `procurement_requests` (采购风控审批单)
任何大额预算外开销必须提交申请，经由系统 AI 决策引擎裁判。

| 字段名 | 类型 | 约束 | 备注 |
|---|---|---|---|
| `id` | SERIAL | PRIMARY KEY | |
| `user_id` | INTEGER | REFERENCES users(id) ON DELETE CASCADE | |
| `item_name` | VARCHAR(255) | NOT NULL | 意向购入商品名 |
| `estimated_price` | DECIMAL(10, 2) | | 预计开销金额 |
| `reason` | TEXT | | 申请理由（评判输入特征之一） |
| `is_promotion_day` | BOOLEAN | DEFAULT FALSE | 是否处于双11/618等大促节点（输入特征之二）|
| `ai_decision` | VARCHAR(50) | DEFAULT 'pending' | 引擎裁判结果：`approved`, `rejected` |
| `ai_comment` | TEXT | | (Mock) 毒舌/客观评价意见记录 |
| `status` | VARCHAR(50) | DEFAULT '待审批' | 流转状态: `待审批`, `待购买`, `已购买`, `已放弃` |

---

> **开发注记**: 
> - 其他模块的数据库表，将在进入 `Phase n` 相关节点时，进行字段级详情设计并落实至本字典。
> - 建表统一在后端的 `server/src/db/init.ts` 中通过直连脚本生成。

---

## 12. 🛡️ 审计部 (Chief Audit Officer)

负责全系统数据流的末端监督。

### `audit_reports` (夜间审计报告)
每晚由大语言模型（CAO）阅读你一天的行为数据后，生成的极具压迫感与偏见考核的结案陈词。

| 字段名 | 类型 | 约束 | 备注 |
|---|---|---|---|
| `id` | SERIAL | PRIMARY KEY | |
| `user_id` | INTEGER | REFERENCES users(id) ON DELETE CASCADE | |
| `report_date` | DATE | UNIQUE NOT NULL | 审计归属日期 |
| `efficiency_score`| INTEGER | CHECK (0-100) | 绝对效率得分 |
| `procrastination_index`| DECIMAL(3,2)| | 0.00 - 1.00 拖延判定指数 |
| `tasks_created` | INTEGER | DEFAULT 0 | 计划的待办数量 |
| `tasks_completed`| INTEGER | DEFAULT 0 | 实际完成的数量 |
| `habits_completed`| INTEGER | DEFAULT 0 | 达标的纪律数量 |
| `habits_total` | INTEGER | DEFAULT 0 | 总共挂载的纪律数量 |
| `points_earned` | INTEGER | DEFAULT 0 | 今日赚取的财富 |
| `points_spent` | INTEGER | DEFAULT 0 | 今日肆意霍霍的财富 |
| `top_wins` | TEXT[] | | (LLM 提取) 今日战果 |
| `top_failures` | TEXT[] | | (LLM 提取) 今日滑铁卢 |
| `honest_feedback`| TEXT | | (LLM 生成) 极其毒舌的结案陈词 |
| `recommendations`| TEXT[] | | (LLM 建议) 明日行动纲领 |
| `raw_llm_response`| JSONB | | 留存大模型原音 |
