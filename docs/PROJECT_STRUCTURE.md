# 项目文件结构说明 (v2.2)

> 最后更新: 2026-03-08

## 根目录

```
d:\idea\manage\
├── package.json              # Monorepo 根配置 (npm workspaces)
├── docs/                     # 项目文档中心 (v2.2 架构说明)
└── packages/
    ├── client/               # 前端 React 应用 (2.5D 虚空大厦)
    ├── server/               # 后端 Express 服务 (Agent Hierarchy)
    └── shared/               # 共享代码
```

---

## packages/client — 前端 React 应用

```
client/
├── index.html                # HTML 入口
├── vite.config.js            # Vite 配置 (代理 :3002)
└── src/
    ├── main.jsx              # 应用入口
    ├── App.jsx               # 基础路由
    ├── components/
    │   ├── VirtualFloor.jsx  # [核心] 2.5D 办公室渲染与 CEO 战略终端
    │   ├── Layout.jsx        # 基础侧边栏布局
    │   └── ...               # 其他部门通用组件
    └── pages/
        ├── Dashboard.jsx     # 总裁办入口 (重定向至 VirtualFloor)
        └── ...               # 各部门独立功能页
```

---

## packages/server — 后端 Express 服务

```
server/
├── tsconfig.json             # TS 配置
└── src/
    ├── index.ts              # 服务入口 (API 路由分发)
    ├── prompts/
    │   └── index.ts          # [核心] 各部门 Agent 的 Prompt 模板 (ROI, 决策权重等)
    ├── services/
    │   ├── agentChain.ts     # [核心] 多代理决策链条逻辑 (Triage -> Finance -> CEO)
    │   ├── agentDispatcher.ts# Agent 基础通信分发器
    │   └── ...               # 其他业务逻辑 (积分引擎等)
    ├── db/
    │   ├── pool.ts           # PG 连接池
    │   └── init.ts           # 数据库初始化 (11+ 部门表结构)
    └── routes/
        ├── agent.ts          # [核心] Agent 交互接口 (command, chat)
        └── ...               # 传统 REST 路由 (finance, hr, etc.)
```

---

## 关键技术栈同步 (v2.2)

| 领域 | 技术方案 | 作用 |
|------|----------|------|
| **前端渲染** | React + Framer Motion | 实现 2.5D 大厦平滑缩放与 Agent 动画 |
| **持久化** | PostgreSQL + LocalStorage | 后端存储业务数据，前端存储战略档案历史 |
| **AI 协同** | LLM Chain + Custom Prompts | 多代理接力式决策与审计 |
| **视觉规范** | Tailwind CSS + Inter Font | 全系统一致的高净值暗色系设计 |
