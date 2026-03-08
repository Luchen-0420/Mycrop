# 项目文件结构说明

> 最后更新: 2026-02-26

## 根目录

```
d:\idea\manage\
├── package.json              # Monorepo 根配置 (npm workspaces)
├── docs/                     # 项目文档中心
└── packages/
    ├── client/               # 前端应用
    ├── server/               # 后端服务
    └── shared/               # 共享代码
```

---

## packages/client/ — 前端 React 应用

```
client/
├── index.html                # HTML 入口 (加载 Inter + JetBrains Mono 字体)
├── vite.config.js            # Vite 配置 (含 /api 代理到 :3001)
├── tailwind.config.js        # Tailwind 主题 (corp-* 自定义色)
├── postcss.config.js         # PostCSS (Tailwind 插件)
├── package.json              # 依赖: react, recharts, zustand, lucide-react 等
└── src/
    ├── main.jsx              # 应用入口 (ReactDOM + BrowserRouter)
    ├── App.jsx               # 路由定义 (7 条部门路由)
    ├── index.css             # 全局样式 (Tailwind + 自定义组件类)
    │
    ├── store/                # 状态管理
    │   └── authStore.ts      # 鉴权状态持久化 (Zustand)
    │
    ├── components/           # 可复用组件
    │   ├── Layout.jsx        # 主布局 (Sidebar + <Outlet/>)
    │   ├── ProtectedRoute.jsx# 路由守卫 (Auth 拦截)
    │   ├── Sidebar.jsx       # 侧边栏导航 (7个部门入口)
    │   ├── StatCard.jsx      # KPI 数据卡片 (支持6种颜色+趋势标)
    │   └── PageHeader.jsx    # 页面标题头 (图标+标题+操作按钮插槽)
    │
    └── pages/                # 页面
        ├── auth/             # 门禁系统页
        │   ├── Login.jsx     # 登录页
        │   ├── Register.jsx  # 注册页
        │   └── ForgotPassword.jsx
        ├── hr/               # 人力资源部 (带子路由)
        │   ├── HRLayout.jsx  # 布局壳 (Tab导航)
        │   ├── Profile.jsx   # 员工档案
        │   ├── Skills.jsx    # 技能中心
        │   ├── Training.jsx  # 培训学院
        │   ├── Wellness.jsx  # 员工关怀
        │   └── Review.jsx    # 绩效考核
        ├── admin/            # 行政部 (带子路由)
        │   ├── AdminLayout.jsx # 布局壳 (Tab导航)
        │   ├── Inventory.jsx   # 物资台账
        │   ├── Assets.jsx      # 固定资产
        │   ├── Procurement.jsx # AI采购审批
        │   └── Credentials.jsx # 证照账号 (占位)
        ├── Dashboard.jsx     # 总裁办  → 路由 /
        ├── Finance.jsx       # 财务部  → 路由 /finance
        ├── Operations.jsx    # 运营部  → 路由 /operations
        ├── PR.jsx            # 公共关系部 → 路由 /pr
        └──├── Health.jsx        # 健康中心 → 路由 /health
        ├── legal/            # 法务部 (带子路由)
        │   ├── LegalLayout.jsx # 布局壳 (Tab导航)
        │   ├── Contracts.jsx   # 合同档案
        │   ├── Insurances.jsx  # 保单管理
        │   ├── Disputes.jsx    # 维权纠纷
        │   └── Reminders.jsx   # 到期提醒
        ├── rd/               # 研发部 (带子路由)
        │   ├── RDLayout.jsx  # 布局壳 (Tab导航)
        │   ├── Workshops.jsx   # 项目工坊
        │   ├── Ideas.jsx       # 创意池
        │   ├── TechNotes.jsx   # 技术笔记
        │   └── Portfolio.jsx   # 作品集
        ├── commerce/         # 商务部 (带子路由)
        │   ├── CommerceLayout.jsx # 布局壳 (Tab导航)
        │   ├── Revenue.jsx      # 收入流
        │   ├── Partnerships.jsx # 商务合作
        │   ├── Career.jsx       # 职业发展
        │   └── Monetization.jsx # 变现分析
        └── travel/           # 差旅中心 (带子路由)
            ├── TravelLayout.jsx   # 布局壳 (Tab导航)
            ├── Itineraries.jsx    # 造梦出行
            ├── PackingLists.jsx   # 打包清单
            ├── TravelLogs.jsx     # 差旅日记
            └── TravelExpenses.jsx # 费用报销
```

### 关键文件说明

| 文件 | 职责 | 备注 |
|------|------|------|
| `index.css` | 定义 `.corp-card`, `.stat-value`, `.sidebar-link`, `.progress-bar` 等全局样式类 | 所有页面共用 |
| `tailwind.config.js` | 定义 `corp-bg`, `corp-surface`, `corp-accent` 等自定义颜色 | 修改主题色在这里 |
| `Sidebar.jsx` | 导航列表定义在 `departments` 数组中 | 新增部门在此添加 |
| `App.jsx` | 路由映射 | 新增页面需要同步添加路由 |

---

## packages/server/ — 后端 Express 服务

```
server/
├── .env                      # 环境变量 (本地开发设置，勿提交)
├── .env.example              # 环境变量示例
├── package.json              # 依赖: express, pg, cors, tsx 等
├── tsconfig.json             # TypeScript 配置
└── src/
    ├── index.ts              # 服务入口 (端口 3002)
    ├── db/                   # 数据库与迁移
    │   ├── pool.ts           # PostgreSQL 连接池
    │   └── init.ts           # 数据表初始化逻辑 (包含所有部门表)
    └── routes/               # API 路由
        ├── auth.ts           # 门禁路由 (login, register)
        ├── hr.ts             # 人力资源部路由
        ├── admin.ts          # 行政部路由 (inventory, assets, procurement)
        ├── finance.ts        # 财务部路由
        ├── operations.ts     # 运营部路由
        ├── pr.ts             # 公共关系部路由
        ├── legal.ts          # 法务部路由 (contracts, insurances, disputes)
        ├── rd.ts             # 研发部路由 (projects, ideas, tech-notes)
        ├── commerce.ts       # 商务部路由 (revenue, partnerships, career)
        └── travel.ts         # 差旅中心路由 (itineraries, expenses, packing-lists)
```

### 后续扩展方向

```
server/src/
├── index.ts                  # 入口
├── routes/                   # 按部门拆分路由
│   ├── finance.ts
│   ├── operations.ts
│   ├── inventory.ts
│   └── contacts.ts
├── services/                 # 业务逻辑
│   ├── pointsEngine.ts      # 积分结算引擎
│   └── aiAdvisor.ts         # AI 采购拦截
├── db/
│   ├── pool.ts               # PG 连接池
│   └── migrations/           # 数据库迁移脚本
└── types/                    # 服务端专用类型
```

---

## packages/shared/ — 共享类型

```
shared/
├── package.json
└── src/
    └── index.ts              # 导出所有共享 TS Interface
                              # User, Transaction, PointsLog,
                              # InventoryItem, Contact, Skill, BodyMetric
```
