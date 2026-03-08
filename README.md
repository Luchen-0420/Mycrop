<h1 align="center">🏢 Mycrop · 个人成长数字公司</h1>

<p align="center">
  <strong>我把自己的生活管理，改造成了一个有 14 位 AI 高管的虚拟公司。<br>用现代企业治理架构，对抗个人的拖延与混乱。</strong>
</p>

<p align="center">
  <sub>结合 Stanford Smallville（沉浸可视化） × CrewAI（多智能体编排） × Edict（分权治理机制）。<br>14 个 Agent 分设 3 个治理层（战略规划/审核委员会/运营调度）与 9 个业务执行部门。<br>买个 PS5 都得过 CFO 和健康总监的联审。</sub>
</p>

<p align="center">
  <a href="#-为什么要做-mycrop">🤔 为什么</a> ·
  <a href="#️-架构14-个智能体角色">🏛️ 架构</a> ·
  <a href="#-各部门详细运转流程与业务协同">💼 部门协同</a> ·
  <a href="#-核心亮点">✨ 亮点</a> ·
  <a href="#-快速体验">🚀 快速体验</a> ·
  <a href="docs/ME_CORP_2.0_BLUEPRINT.md">📚 完整蓝图</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Agent_Architecture-14_Agents-8B5CF6?style=flat-square" alt="Agents">
  <img src="https://img.shields.io/badge/Frontend-React_18_+_Vite-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React">
  <img src="https://img.shields.io/badge/Visuals-PixiJS_+_Framer_Motion-FF0055?style=flat-square" alt="Animation">
  <img src="https://img.shields.io/badge/Backend-Node.js_+_Express-339933?style=flat-square&logo=nodedotjs&logoColor=white" alt="Backend">
  <img src="https://img.shields.io/badge/Database-PostgreSQL_+_pgvector-336791?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/LLM-DeepSeek_/_OpenAI-FF6600?style=flat-square" alt="LLM">
  <img src="https://img.shields.io/badge/License-MIT-22C55E?style=flat-square" alt="License">
</p>

---

<!-- GIF 占位 -->
<p align="center">
  <i>👉 在这里放置展示 2.5D 公司大楼动效与早会气泡的 GIF (1) 👈</i>
</p>
<p align="center">
  <i>👉 在这里放置在审批中心提交任务并被 AI 高管驳回的实机录屏 GIF (2) 👈</i>
</p>

---

## 🌟 核心特性速览

- [x] 👾 **沉浸式虚拟办公楼** — 抛弃枯燥的表格，在 2.5D 等距视角大厦中直观感受你的资产运作。
- [x] 🧠 **14 位 AI 高管系统** — 细分财务、法务、行政权限，全方位接管你的生活决策。
- [x] 💬 **社交化早会简报** — 每天早晨通过生动的对话气泡，向你做全盘的数据述职。
- [x] ⚖️ **强约束风控审核** — 买大件物品？必须通过 CFO 和健康总监的联审，预算超标直接驳回。
- [x] 💾 **本地 RAG 长效记忆** — 基于本地 Transformer 与 PostgreSQL `pgvector`，让高管拥有对你历史行为的深刻记忆。
- [x] 🎯 **积分兑换心愿系统** — 想买贵重物品？先发起心愿目标，通过每日完成任务赚积分，积分达标才能兑换！
- [x] 🛠️ **真实数据库操作** — Agent 不再模拟执行，CFO/COO/CAO 直接通过 Tool Calling 操作 PostgreSQL。

---

## 🤔 为什么要做 Mycrop？

市面上的应用：
- **Notion / 飞书**：功能强大，但冷冰冰的没有"陪伴感"。
- **番茄钟 / Forest**：有趣，但只能管特定的小事。
- **多智能体框架 (Agent Frameworks)**：一群 AI 各自干活，干完就交，结果像开盲盒，容易失控（幻觉）。

**Mycrop 的思路完全不同** —— 我们把你的生活当成一家公司来运转，并且引入了**强制的风控制度**：

当你下达一条指令：*"下周三是我妈生日，预算 2000，帮我挑个礼物。"*

1. 📂 **战略规划办 (Strategy)** 会拆出子任务：CPO挑礼物、CFO批预算。
2. 🛑 **审核委员会 (Review)** 会强制拦截审查。如果这个月"购物预算"超标了，CFO Agent 会直接 **REJECT（驳回）** 任务。
3. 🛠️ **运营调度中心 (Ops)** 只有在审核通过后，才会把任务派发执行。

> 这不是玩笑，**每一笔开销、每一个决定，都需要经过 AI 组成的"高管董事会"审议。**

---

## 🏛️ 架构：14 个智能体角色

采用现代 C-Suite 命名。这不是 metaphor，这是硬核的权限矩阵约束。

```
                     ┌───────────────────────────────────┐
                     │          👔 CEO（你）              │
                     └─────────────────┬─────────────────┘
                                       │ 输入指令
                     ┌─────────────────▼─────────────────┐
                     │       🤖 Triage Bot (前台接待)      │
                     │  分拣：闲聊直接陪聊 / 复杂指令建任务  │
                     └─────────────────┬─────────────────┘
                                       │ 正式任务
                     ┌─────────────────▼─────────────────┐
                     │       🧠 Strategy (战略规划办)      │
                     │        接旨 → 规划 → 拆解子任务       │
                     └─────────────────┬─────────────────┘
                                       │ 提交审核
                     ┌─────────────────▼─────────────────┐
                     │       ⚖️ Review Board (审核委员)   │
                     │    审议方案 → 若违背预算/健康则驳回🚫 │
                     └─────────────────┬─────────────────┘
                                       │ 审批通过 ✅
                     ┌─────────────────▼─────────────────┐
                     │        📮 Ops Hub (运营调度中心)     │
                     │    派发任务 → 协调九大部门 → 汇总结果  │
                     └───┬──────┬──────┬──────┬──────┬───┘
                         │      │      │      │      │
                         ▼      ▼      ▼      ▼      ▼
    ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
    │ 💰 CFO    │ │ ⚙️ COO    │ │ 📚 CHRO    │ │ 🤝 CPO    │ │ 🏠 CAO    │
    │ 财务底座   │ │ 任务/OKR  │ │ HR与成长   │ │ 公关/人脉  │ │ 行政/资产  │
    └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘
    ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
    │ 🩺 CWO    │ │ 💻 CTO    │ │ 💰 CSO    │ │ ⚖️ CLO    │
    │ 运动与健康 │ │ 研发与创意 │ │ 搞钱与商务 │ │ 法务与合同 │
    └──────────┘ └──────────┘ └──────────┘ └──────────┘
```

### 🔒 权限矩阵：不可僭越

| | Strategy | Review | Ops Hub | 九大业务部门 | 
|:---:|:---:|:---:|:---:|:---:|
| **Strategy** | — | ✅ | ❌ | ❌ |
| **Review** | ✅ 驳回 | — | ✅ 放行 | ❌ |
| **Ops Hub** | ❌ | ❌ | — | ✅ 派发 |
| **九部间** | ❌ | ❌ | ✅ 回报 | ⚠️ 需 Ops 中转 |

*注：规划者不审核，审核者不执行。执行部门决不允许绕过审核直接操作你的数据！*

---

## 💼 各部门详细运转流程与业务协同

在 Mycrop 中，不仅有单一部门的操作，更涉及高度拟真、逻辑缜密的**跨部门协同 (Cross-Department Collaboration)**，让每一条随性的指令都经过严密的业务闭环。

### 📌 部门独立运转工作流

| 部门 | 代号 | 核心工具 | 职责 |
|:---:|:---:|:---|:---|
| 💰 **CFO** | `finance` | `record_transaction` · `check_budget` · `create_wishlist_goal` · `check_points_balance` · `redeem_wishlist_goal` | 管钱：记账、预算风控、心愿积分管理 |
| ⚙️ **COO** | `operations` | `create_task` · `complete_task` | 管事：任务拆解、排期、积分奖励发放 |
| 🏠 **CAO** | `admin` | `add_fixed_asset` | 管物：大件资产登记与生命周期追踪 |

### 🤝 多部门协同实战：两大核心场景

<details>
<summary><b>场景一：直接消费 —— "我花了30块喝了一杯星巴克"</b></summary>

```
CEO: "我花了30块喝了杯星巴克咖啡"
  │
  ├─→ Strategy 拆解: 派给 CFO 记账
  ├─→ Review 审核: 30元餐饮消费，金额合理 ✅ APPROVE
  └─→ CFO 执行: record_transaction(amount=30, category="餐饮", type="expense")
       └─→ PostgreSQL transactions 表新增一行 ✅
```
</details>

<details>
<summary><b>场景二：心愿目标 —— "我想买一台6800的电脑"</b></summary>

```
CEO: "我想买一台6800元的电脑"
  │
  ├─→ Strategy 拆解:
  │     ├─ 派给 CFO: 创建心愿目标 (不是直接扣款！)
  │     └─ 派给 COO: 制定每日积分任务计划
  │
  ├─→ Review 审核: 心愿目标机制，不涉及直接支出 ✅ APPROVE
  │
  ├─→ CFO 执行: create_wishlist_goal(name="电脑", target_points=6800)
  │     └─→ wishlist_items 表新增目标 ✅
  │
  └─→ COO 执行: create_task(title="每日背50个单词", points_reward=100)
        └─→ tasks 表新增带积分的任务 ✅

... 每天完成任务 ...

CEO: "我今天背完单词了"
  └─→ COO: complete_task(task_id=X)
       ├─→ tasks 状态 → done
       ├─→ points_logs +100 积分
       └─→ 心愿进度: 100/6800 (1.5%)

... 积分达标后 ...

CEO: "积分够了，兑换电脑"
  └─→ CFO: redeem_wishlist_goal(wishlist_id=X)
       ├─→ points_logs -6800 积分
       └─→ wishlist_items 状态 → redeemed 🎉
```
</details>

---

## ✨ 核心亮点

### 🏢 1. 可视化公司大楼 (Virtual Office)
放弃了枯燥的纯表格 Dashboard。基于 PixiJS 渲染 **2.5D 等距视角办公楼**：
- 在 Working (敲键盘)、Waiting (喝咖啡)、Blocked (抓头叹气) 状态间切换的 Agent 像素小人。
- 部门间有连线亮起，直观展示正在发生的数据交换与通信。

### 🌅 2. 早会简报 (Morning Standup)
每日初次打开，自动触发 Morning Briefing。各路高管以**社交气泡**的形式（Framer Motion 动画）给你汇报昨晚盘点的数据：
> *"Boss，昨夜睡眠 5h 低于标准，建议今日推迟晨跑。" —— Dr.Chen (CWO)*<br>
> *"附议。并且如果连续断签，你的自律积分将被清零。" —— Max (COO)*

### 🧠 3. 思维链全景展示 (Agent Thinking Visualization)
拒绝黑盒！你可以点开任何一个任务，展开查看每一个参与的 Agent：
- 它们收到了什么数据？
- 执行了什么 SQL/工具调用？
- **最关键：它们内心是怎么想的 (Thinking Process)？** 为什么否决了你的请求？

### 🎮 4. 游戏化成长与积分体系
- **心愿兑换**：想买贵重物品？先设定心愿目标，通过完成每日任务赚取积分，攒够了才能兑换。延迟满足，真正的自律。
- **CEO 评级考绩**：执行力强、预算控制得当，你的系统职级将从 `Intern (实习生)` 一路晋升至 `Legendary CEO`。
- **独裁有代价**：你作为 CEO 始终有 `Override（强制通过）` 的特权，但过度使用会扣除你的期权积分并在执政记录上留下污点。

---

## 🚀 快速体验

### 方式一：🐳 Docker 一键部署（推荐）

> 零配置启动，自动拉起 PostgreSQL + pgvector + 后端 + 前端。

```bash
# 1. 克隆代码
git clone https://github.com/Luchen-0420/Mycrop.git
cd Mycrop

# 2. 配置环境变量
cp packages/server/.env.example .env
# 编辑 .env，填入你的 LLM API Key:
#   LLM_API_KEY=sk-xxxxxxxx

# 3. 一键启动 🚀
docker compose up -d

# 访问:
#   🖥️ 前端 → http://localhost
#   🔌 API → http://localhost:3002
```

```bash
# 常用操作
docker compose logs -f server   # 查看后端日志（含 Agent 思考过程）
docker compose down              # 停止所有服务
docker compose down -v           # 停止并清除数据
```

### 方式二：本地开发运行

<details>
<summary>展开查看本地开发指南</summary>

**前置要求**：Node.js ≥ 18 · PostgreSQL ≥ 14（需启用 pgvector） · LLM API Key

```bash
# 1. 克隆 & 安装
git clone https://github.com/Luchen-0420/Mycrop.git
cd Mycrop && npm install

# 2. 环境变量
cp packages/server/.env.example packages/server/.env
# 编辑 .env 填入 LLM_API_KEY、数据库连接等

# 3. 前后端双开
npm run dev
# Frontend → http://localhost:5173
# Backend  → http://localhost:3002
```
</details>

### 测试 Agent 执行

```bash
# 记一笔消费
curl -X POST http://localhost:3002/api/missions/execute \
  -H "Content-Type: application/json" \
  -d '{"missionPrompt": "我刚花了30块喝了一杯星巴克"}'

# 创建心愿目标
curl -X POST http://localhost:3002/api/missions/execute \
  -H "Content-Type: application/json" \
  -d '{"missionPrompt": "我想买一台6800元的电脑，帮我制定积分计划"}'
```

---

## 🗺️ Roadmap

| 阶段 | 状态 | 目标 | 核心产出 |
|:---:|:---:|:---|:---|
| **Phase 0** | ✅ | **基石建设** | 九大表结构就绪；标准 CRUD 与 React UI 骨架贯通 |
| **Phase 1** | ✅ | **趣味翻新** | Framer Motion 转场；早会对话气泡；Persona Studio；11 部门大厦视角 |
| **Phase 2** | ✅ | **AI 脑核装入** | 4 名核心角色注入 System Prompt；接入 DeepSeek LLM API；Triage 与 Morning Brief |
| **Phase 3** | ✅ | **多轮博弈流** | `Strategy → Review → Dispatch` 强约束流水线；4 层容错处理器 |
| **Phase 4** | ✅ | **沉浸与记忆** | 本地 `@xenova/transformers` 向量服务；PostgreSQL `pgvector` 长效记忆 |
| **Phase 5** | ✅ | **部门执行器** | Agent Executor 引擎；CFO/COO/CAO 真实 Tool Calling 操作数据库 |
| **Phase 5.5** | ✅ | **积分兑换目标** | 心愿目标创建、积分追踪、任务奖励绑定、达标兑换全链路 |
| **Phase 6** | 🔜 | **前端执行面板** | 可视化 Agent 思考过程、工具调用、积分进度仪表盘 |

完整的业务/技术演进推演：[📚 ME_CORP_2.0_BLUEPRINT.md](docs/ME_CORP_2.0_BLUEPRINT.md)

---

## 🤝 参与项目

如果你也受够了四分五裂的 To-Do、记账软件、习惯打卡 App，且认为 **"个人即企业"**，欢迎提交 PR 帮我一起完善这个属于自己的数字管理王国！

### 目前急需支援的方向：
- 🎨 **PixiJS 场景大楼开发**（急缺 2.5D 精灵图和游戏开发经验的大佬）
- 🤖 **Agent State Machine 编排引擎优化**（熟悉 LangGraph 在 TypeScript 生态替代方案的朋友）
- 💬 更有趣、更毒舌的高管人格设定 Prompt 调优
- 📊 前端积分进度与心愿追踪仪表盘

---

<p align="center">
  <strong>成为你自己生活的 CEO</strong><br>
  <sub>Becoming the CEO of your own life</sub>
</p>
