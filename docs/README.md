# Me Corp — 个人公司化管理系统

> 将自己当作一家中型企业来管理，设立部门、追踪 KPI，覆盖财务、健康、社交、成长等生活全领域。

## 技术栈

| 层级 | 选型 |
|------|------|
| 架构 | Monorepo (npm workspaces) |
| 前端 | React 18 + Vite + Tailwind CSS + Zustand + Recharts |
| 后端 | Express 4.x + TypeScript + tsx |
| 数据库 | PostgreSQL 14+ (pg 驱动) |
| 共享 | TypeScript 类型定义 |

## 项目结构

```
d:\idea\manage\
├── docs/                     # 📖 项目文档中心（本目录）
├── packages/
│   ├── client/               # 前端 React 应用
│   ├── server/               # 后端 Express API
│   └── shared/               # 共享类型定义
└── package.json              # Monorepo 根配置
```

## 快速启动

```bash
cd d:\idea\manage
npm install --cache .npm-cache
npm run dev:client    # → http://localhost:5173
npm run dev:server    # → http://localhost:3001
```

## 文档索引

| 文档 | 说明 |
|------|------|
| [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) | 完整文件树 + 每个文件的职责说明 |
| [MODULES.md](./MODULES.md) | 九大部门模块的功能清单与数据模型 (科室已拆分) |
| [DB_SCHEMA.md](./DB_SCHEMA.md) | 数据库全景设计字典 (表结构/字段定义) |
| [API.md](./API.md) | 后端 API 路由文档 |
| [CONVENTIONS.md](./CONVENTIONS.md) | 代码规范与开发约定 |

## 当前状态

- ✅ Phase 1: 前端 UI 骨架（最初的 7 个部门页面 + Mock 数据）
- ✅ Phase 1.5: 门禁系统（JWT 鉴权、登录/注册页面、路由守卫）
- 🔄 Phase 2: 架构升级（全部门科室拆分蓝图完成，新增2大部门，前端嵌套路由架构已确立）
- 🔄 Phase 4: 部门开发
  - ✅ HR 部门 (5 大科室的前后端已实装并联调)
  - ✅ 行政部 (库存、资产、采购 AI 拦截已实装)
  - ✅ 财务部 (总账、预算、期权行权、订阅管理已实装)
  - ✅ 运营部 (执行看板 Kanban、SOP习惯打卡、战略 OKR 已实装)
  - ✅ 公关部 (核心人脉、客情维系与防失联雷达、礼品账单已实装)
- ⬜ 后续工作: 继续实现其余 4 个部门的开发与数据联动
