# API 路由文档 (v2.2)

> 最后更新: 2026-03-08 | 后端地址: `http://localhost:3002`

---

## 🏛️ Multi-Agent 核心接口 (Strategic)

### POST /api/agents/command
**说明**: CEO 战略终端专用。触发跨部门多代理决策链。

**Request Body**:
```json
{ "message": "我想买一个 6800 的电脑" }
```

**Response (ChainResult)**:
```json
{
  "steps": [
    {
      "agentId": "triage",
      "thought": "用户意图为资产购置，需要财务审计。",
      "reply": "已立案，转交财务部 Ada。",
      "metadata": { "category": "asset_purchase" }
    },
    {
      "agentId": "finance",
      "thought": "检查预算与 ROI...",
      "reply": "ADA 审计建议：风险等级 MEDIUM。",
      "metadata": { "riskLevel": "MEDIUM", "recommendation": "approve" }
    },
    {
      "agentId": "ceo",
      "thought": "基于近期表现与财务风险决策...",
      "reply": "战略批示：批准购置，务必用于提升产出。",
      "metadata": { "decision": "approve" }
    }
  ],
  "finalReply": "最终战略指令..."
}
```

### POST /api/agents/chat
**说明**: 与特定部门代理进行直接对话。

**Request Body**:
```json
{ "agentId": "finance", "message": "查下我上个月的账单" }
```

---

## 💰 财务部 (Finance)
| Method | Path | 说明 |
|--------|------|------|
| GET | `/api/finance/accounts` | 获取所有资金账户与余额汇总 |
| POST | `/api/finance/transactions` | 新增收支流水 |
| GET | `/api/finance/points` | 获取期权(积分)余额 |

---

## ⚙️ 运营部 (Operations)
| Method | Path | 说明 |
|--------|------|------|
| GET/POST | `/api/operations/tasks` | 获取/新增看板任务 |
| POST | `/api/operations/habits/:id/checkin` | **习惯打卡签到** (触发积分派发) |

---

## 🏠 行政与法务 (Admin & Legal)
| Method | Path | 说明 |
|--------|------|------|
| GET/POST | `/api/admin/inventory` | 物资库存管理 |
| POST | `/api/admin/procurement/request` | (Legacy) 采购申请，现建议使用 `/agents/command` |
| POST | `/api/legal/analyze-contract` | AI 合同风险审计 |

---

## 🔐 鉴权 (Auth)
| Method | Path | 说明 |
|--------|------|------|
| POST | `/api/auth/login` | 登录 |
| POST | `/api/auth/register` | 注册 |
