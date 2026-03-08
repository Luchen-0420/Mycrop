# M.E. Corp 核心模块功能说明 (v2.2)

> 最后更新: 2026-03-08 | 核心引擎: Multi-Agent Hierarchy v2.2

---

## 🏛️ 总裁战略中枢 (Penthouse - CEO Strategic Command)

**位置**: 虚拟大厦 5 层 | **文件**: `packages/client/src/components/VirtualFloor.jsx`, `packages/server/src/services/agentChain.ts`

**核心功能**:
- **全局战略终端 (Strategic Terminal)**: `Ctrl + K` 唤起。跨越菜单层级，直接下达高级语义指令（如：“买个 6800 的电脑”、“让研发部检查服务器”）。
- **多代理协同链 (Multi-Agent Chain)**: 指令自动触发 `Triage -> Finance -> CEO -> Operations` 的全自动流转。
- **沉浸式公文 Modal (Approval Slip)**: 仪式感十足的数字化签批单，包含 Ada 审计摘要、CEO 点评及电子签名。
- **穿透式决策详情**: 支持点击链条中的部门，实时查看代理的 **Thought (思维轨迹)** 和 **原始反馈**。
- **战略档案 (Archive)**: 基于 `localStorage` 持久化过去 10 条重大决策，支持公文一键回溯。

---

## � 财务部 (Floor 4 - CFO Finance / Ada)

**位置**: 虚拟大厦 4 层 | **代理**: Ada

**核心功能**:
- **理性 ROI 审计**: 不仅仅检查余额，还会对资产购置进行“流量分析”与“收益率质询”。
- **风险等级核定**: 输出 LOW/MEDIUM/HIGH 风险等级，直接驱动 CEO 的签批意见。
- **期权行权中心**: 心愿商品的积分进度管理及行权核销。
- **债务与流动性监测**: 监控花呗、信用卡分期等财务稳健性指标。

---

## ⚙️ 运营部 (Floor 2 - COO Operations / Max)

**位置**: 虚拟大厦 2 层 | **代理**: Max

**核心功能**:
- **专项融资项目**: 当 CEO 判定资产配置积分不足时，由 COO 自动生成多个“获取积分”的挑战任务。
- **KANBAN & OKR**: 核心任务流转与关键结果对齐。
- **SOP 习惯打卡**: 连接财务部，通过连击奖励派发系统期权。

---

## 📚 人力/行政/法务 (Floor 2/4 - Support Layers)

**核心功能**:
- **HR (Mia)**: 技能树、员工档案、职级晋升体系。
- **Admin (Ben)**: 数字资产台账、证照到期提醒、物资实物盘点。
- **Legal (Zane)**: 合同风控、保单管理、维权纠纷追踪。
- **AI 合同审计**: 上传 PDF/Word，AI 自动预警霸王条款。

---

## 💻 研发/商务/公共关系 (Floor 3/4 - Growth Layers)

**核心功能**:
- **R&D (Neo)**: 项目工坊、Side Project 生命周期管理、灵感池。
- **Commerce (Victor)**: 收入流追踪、商务合作记录、变现 ROI 评估。
- **PR (Lisa)**: 核心人脉客情预警、礼品收发管理。

---

## 🩺 健康/差旅/审计 (Floor 1/N - Well-being & Oversight)

**核心功能**:
- **Health (Dr.Chen)**: 膳食/体重/睡眠全方位监控。
- **Travel (Sky)**: 出行日程一键转化为待办任务，差旅费自动推送。
- **Audit (CAO)**: 每晚对全天表现进行“毒舌”清算，输出效率评级。

---

## 🎨 渲染引擎: 2.5D Virtual Office

系统采用了基于 CSS/React 的 **2.5D 侧透视图** 渲染大厦：
1. **5层垂直架构**: 从 Penthouse 到 Ground Floor 的逻辑分层。
2. **实时精灵状态**: 代理根据其任务状态（Walking/Typing/Idle）展示不同的动画。
3. **环境氛围系统**: 动态光影、毛玻璃遮罩以及基于时间的昼夜反馈。
