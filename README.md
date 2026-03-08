<h1 align="center">🏢 Mycrop · 个人成长数字公司</h1>

<p align="center">
  <strong>我把自己的生活管理，改造成了一个有 14 位 AI 高管的虚拟公司。<br>用现代企业治理架构，对抗个人的拖延与混乱。</strong>
</p>

<p align="center">
  <sub>结合 Stanford Smallville（沉浸可视化） × CrewAI（多智能体编排） × Edict（分权治理机制）。<br>14 个 Agent 分设 3 个治理层（战略规划/审核委员会/运营调度）与 9 个业务执行部门。<br>买个 PS5 都得过 CFO 和健康总监的联审。</sub>
</p>

<p align="center">
  <a href="#-核心机制">⚙️ 核心机制</a> ·
  <a href="#-架构">🏛️ 架构</a> ·
  <a href="#-趣味与游戏化">🎮 趣味游戏化</a> ·
  <a href="#-快速体验">🚀 快速体验</a> ·
  <a href="docs/ME_CORP_2.0_BLUEPRINT.md">📚 完整蓝图</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Agent_Architecture-14_Agents-8B5CF6?style=flat-square" alt="Agents">
  <img src="https://img.shields.io/badge/Frontend-React_18_+_Vite-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React">
  <img src="https://img.shields.io/badge/Visuals-PixiJS_+_Framer_Motion-FF0055?style=flat-square" alt="Animation">
  <img src="https://img.shields.io/badge/Backend-Node.js_+_Express-339933?style=flat-square&logo=nodedotjs&logoColor=white" alt="Backend">
  <img src="https://img.shields.io/badge/Database-PostgreSQL-336791?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/License-MIT-22C55E?style=flat-square" alt="License">
</p>

---

<p align="center">
  <i>👉 在这里放置展示 2.5D 公司大楼动效与早会气泡的 GIF (1) 👈</i>
</p>
<p align="center">
  <i>👉 在这里放置在审批中心提交任务并被 AI 高管驳回的实机录屏 GIF (2) 👈</i>
</p>

---

## 🌟 核心特性速览 (Features)

- [x] 👾 **沉浸式虚拟办公楼**：抛弃枯燥的表格，在 2.5D 的等距视角大厦中直观感受你的资产运作。
- [x] 🧠 **14位 AI 高管系统**：细分财务、法务、行政权限，全方位接管你的生活决策。
- [x] 💬 **社交化早会简报**：每天早晨通过生动的对话气泡，向你做全盘的数据述职。
- [x] ⚖️ **强约束风控反演**：买大件物品？必须通过 CFO 和健康总监的联审，预算超标直接驳回。
- [x] 💾 **本地 RAG 长效记忆**：基于本地 Transformer 与 PostgreSQL `pgvector`，让高管拥有对你历史行为的深刻记忆。

## 🤔 为什么要做 Mycrop？

市面上的应用：
- **Notion / 飞书**：功能强大，但冷冰冰的没有“陪伴感”。
- **番茄钟 / Forest**：有趣，但只能管特定的小事。
- **多智能体框架 (Agent Frameworks)**：一群 AI 各自干活，干完就交，结果像开盲盒，容易失控（幻觉）。

**Mycrop 的思路完全不同** —— 我们把你的生活当成一家公司来运转，并且引入了**强制的风控制度**：

当你下达一条指令：*“下周三是我妈生日，预算 2000，帮我挑个礼物。”*

1. 📂 **战略规划办 (Strategy)** 会拆出子任务：CPO挑礼物、CFO批预算。
2. 🛑 **审核委员会 (Review)** 会强制拦截审查。如果这个月“购物预算”超标了，CFO Agent 会直接 **REJECT（驳回）** 任务。
3. 🛠️ **运营调度中心 (Ops)** 只有在审核通过后，才会把任务派发执行。

> 这不是玩笑，**每一笔开销、每一个决定，都需要经过 AI 组成的“高管董事会”审议。**

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

### 🔒 核心机制：权限不可僭越

| | Strategy | Review | Ops Hub | 九大业务部门 | 
|:---:|:---:|:---:|:---:|:---:|
| **Strategy** | — | ✅ | ❌ | ❌ |
| **Review** | ✅ 驳回 | — | ✅ 放行 | ❌ |
| **Ops Hub** | ❌ | ❌ | — | ✅ 派发 |
| **九部间** | ❌ | ❌ | ✅ 回报 | ⚠️ 需 Ops 中转 |

*注：规划者不审核，审核者不执行。执行部门决不允许绕过审核直接操作你的数据！*

---

## ✨ 核心亮点

### 🏢 1. 可视化公司大楼 (Virtual Office)
放弃了枯燥的纯表格 Dashboard。基于 PixiJS 渲染 **2.5D 等距视角办公楼**：
- 在 Working (敲键盘)、Waiting (喝咖啡)、Blocked (抓头叹气) 状态间切换的 Agent 像素小人。
- 部门间有连线亮起，直观展示正在发生的数据交换与通信。

### 🌅 2. 早会简报 (Morning Standup)
每日初次打开，自动触发 Morning Briefing。各路高管以**社交气泡**的形式（Framer Motion 动画）给你汇报昨晚盘点的数据：
> *“Boss，昨夜睡眠 5h 低于标准，建议今日推迟晨跑。” —— Dr.Chen (CWO)*<br>
> *“附议。并且如果连续断签，你的自律积分将被清零。” —— Max (COO)*

### 🧠 3. 思维链全景展示 (Agent Thinking Visualization)
拒绝黑盒！你可以点开任何一个任务，展开查看每一个参与的 Agent：
- 它们收到了什么数据？
- 执行了什么 SQL/工具调用？
- **最关键：它们内心是怎么想的 (Thinking Process)？** 为什么否决了你的请求？

### 🎮 4. Persona Studio 与 游戏化成长
一切皆可定制：
- **定制高管**：给 CFO 改名叫“铁面老王”，或者调整它的系统 Prompt 设定为“毒舌管家模式”。每个 Agent 可独立配置 LLM 模型 (Claude / GPT / DeepSeek 热切换)。
- **CEO 评级考绩**：执行力强、预算控制得当，你的系统职级讲从 `Intern (实习生)` 一路晋升至 `Legendary CEO`。
- **独裁有局限**：你作为 CEO 始终有 `Override（强制通过）` 的特权，但过度使用会扣除你的期权积分并在执政记录上留下污点。

---

## 🚀 快速体验 (开发中)

> 当前版本 (Phase 0) 已完成底层 PostgreSQL 九大表结构与 Node.js 基础 API。正在快速推进 Phase 1 的 UI 与动画集成。

### 本地开发运行：
```bash
# 1. 克隆代码
git clone https://github.com/Luchen-0420/Mycrop.git
cd Mycrop

# 2. 安装依赖 (Monorepo)
npm install

# 3. 环境变量配置 (关键) 🔑
# 复制 server 目录下的示例环境变量文件并填入你的 API Key
cp packages/server/.env.example packages/server/.env
# 使用你喜欢的编辑器打开 packages/server/.env，填入你的大模型 (如 DeepSeek/OpenAI) 的 API 密钥

# 4. 启动本地 Postgres (推荐 Docker) 并执行初始化
cd packages/server
npx tsx src/db/init.ts # 🚨 重要：灌入基础 DB Schema 与 pgvector 扩展

# 5. 前后端双开
npm run dev # 在应用根目录 (Mycrop) 下运行，自动并发拉起客户端 3000 与服务端 3001
```

---

## 🗺️ Roadmap (进化路线)

| 阶段 | 状态 | 目标 | 核心产出 |
|---|---|---|---|
| **Phase 0** | ✅ | **基石建设** | `users`, `finance`, `operations` 等九大表结构就绪；标准 CRUD 与 React UI 骨架贯通。 |
| **Phase 1** | ✅ | **趣味翻新** | 引入 `Framer Motion`，重构转场；增加早会对话气泡模拟体验；构建 Persona Studio；构建 11 部门横轴沉浸式大厦视角。 |
| **Phase 2** | ✅ | **AI 脑核装入** | 为 4 名核心首发角色注入 `System Prompt` 并接入 DeepSeek 云端 LLM API；跑通 Live 版 `Triage` 和 `Morning Brief` 气泡；支持楼层小人直接聊天指令交互。 |
| **Phase 3** | ✅ | **多轮博弈流** | 实现重头戏：`Strategy -> Review -> Dispatch` 强约束流水线；配置 4 层容错处理器（防环死）。 |
| **Phase 4** | ✅ | **沉浸与记忆** | 总裁主卧UI实装；运用 `@xenova/transformers` 构建纯本地 Local NLP 向量服务；引入 PostgreSQL `pgvector` 让高管们形成长效思维记忆。 |

完整的业务/技术演进推演，详见内部知识库中的：[📚 ME_CORP_2.0_BLUEPRINT.md](docs/ME_CORP_2.0_BLUEPRINT.md)

---

## 🤝 参与项目

如果你也受够了四分五裂的 To-Do、记账软件、习惯打卡 App，且认为 **“个人即企业”**，欢迎提交 PR 帮我一起完善这个属于自己的数字管理王国！

### 目前急需支援的方向：
- 🎨 **PixiJS 场景大楼开发**（急缺 2.5D 精灵图和游戏开发经验的大佬）
- 🤖 **Agent State Machine 编排引擎优化**（熟悉 LangGraph 在 TypeScript 生态替代方案的朋友）
- 💬 更有趣、更毒舌的高管人格设定 Prompt 调优

---

<p align="center">
  <strong>成为你自己生活的 CEO</strong><br>
  <sub>Becoming the CEO of your own life</sub>
</p>
