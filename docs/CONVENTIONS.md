# 开发规范与约定

> 最后更新: 2026-02-26

---

## 目录规范

### 新增页面 (部门)
1. 在 `packages/client/src/pages/` 下创建 `XxxPage.jsx`
2. 在 `App.jsx` 中添加路由: `<Route path="xxx" element={<XxxPage />} />`
3. 在 `Sidebar.jsx` 的 `departments` 数组中添加导航项
4. 在 `docs/MODULES.md` 中补充功能说明
5. 在 `docs/PROJECT_STRUCTURE.md` 中更新文件树

### 新增 API
1. 在 `packages/server/src/routes/` 下按部门创建路由文件
2. 在 `index.ts` 中挂载路由
3. 更新 `docs/API.md`

### 新增共享类型
1. 在 `packages/shared/src/index.ts` 中添加 `export interface Xxx {}`

---

## 命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 组件文件 | PascalCase | `StatCard.jsx` |
| 页面文件 | PascalCase | `Dashboard.jsx` |
| 工具函数 | camelCase | `formatCurrency.ts` |
| CSS 类 | kebab-case | `.corp-card` |
| API 路由 | kebab-case | `/api/finance/transactions` |
| 数据库表 | snake_case | `points_logs` |

---

## 样式约定

- **主题色定义在** `tailwind.config.js` 的 `colors.corp` 中
- **全局类定义在** `index.css` 中 (如 `.corp-card`, `.stat-value`)
- 组件内样式使用 Tailwind 工具类
- 卡片统一使用 `.corp-card` 类
- 数值展示使用 `.stat-value` 类 (JetBrains Mono 渐变字)

---

## Git 提交规范 (建议)

```
feat: 新增xxx功能
fix: 修复xxx问题
docs: 更新文档
style: 样式调整
refactor: 重构xxx
```

---

## 文档维护规则

> ⚠️ **重要**: 每次新增文件或模块时，必须同步更新 `docs/` 下的相关文档。

这是为了确保:
1. 新对话能快速理解项目全貌
2. 开发者能通过文档定位任何文件
3. 保持项目可维护性
