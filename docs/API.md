# API 路由文档

> 最后更新: 2026-02-26 | 后端地址: `http://localhost:3001`

## 当前状态

所有 API 目前为 **占位路由 (Placeholder)**, 返回固定 Mock 数据。  
后续将逐步替换为 PostgreSQL 真实查询。

---

## 通用约定

- **基础路径**: `/api`
- **请求格式**: JSON (`Content-Type: application/json`)
- **响应格式**: JSON
- **时间格式**: ISO 8601

---

## 已实现路由

### GET /api/health
服务健康检查

**Response**:
```json
{
  "status": "ok",
  "service": "me-corp-server",
  "timestamp": "2026-02-26T06:00:00.000Z"
}
```

### GET /api/dashboard/stats
总裁办 Dashboard KPI 数据

### 财务部 (Finance)
| Method | Path | 说明 |
|--------|------|------|
| GET | `/api/finance/accounts` | 获取所有资金账户与余额汇总 |
| POST | `/api/finance/accounts` | 新增一个资金账户 |
| GET/POST | `/api/finance/transactions` | 获取/新增交易流水 (记账) |
| GET | `/api/finance/budgets/:month` | 获取特定月份的预算及当前进度对比 |
| POST | `/api/finance/budgets` | 设定或更新某个分类的月度限额 |
| GET | `/api/finance/points` | 获取期权(积分)余额及历史变动明细 |
| POST | `/api/finance/points/grant` | [内部/外部] 颁发系统期权 |
| GET/POST | `/api/finance/wishlist` | 查看看板上架的心愿商品 / 新增挂牌心愿 |
| POST | `/api/finance/wishlist/:id/redeem` | 消耗等量期权兑换提取商品 (行权) |
| GET/POST | `/api/finance/subscriptions` | 获取定投/订阅服务列表 / 添加新订阅 |

### 运营部 (Operations)
| Method | Path | 说明 |
|--------|------|------|
| GET/POST | `/api/operations/tasks` | 获取看板任务 / 新增任务 |
| PUT | `/api/operations/tasks/:id/status` | 更新任务的流转列状态 |
| DELETE | `/api/operations/tasks/:id` | 删除待办任务 |
| GET/POST | `/api/operations/habits` | 获取所有习惯及今日打卡状态 / 新增习惯 |
| POST | `/api/operations/habits/:id/checkin` | **习惯打卡签到** (自动给财务部派发系统期权) |
| GET/POST | `/api/operations/okrs` | 树状获取所有 OKR 与附属 KR / 设立新 O |
| POST | `/api/operations/okrs/:okr_id/krs` | 为特定 O 增设子指标 KR |
| PUT | `/api/operations/krs/:id/progress` | 更新子 KR 获取进度，系统将重新验算主 O 进度 |

### 公关部联系人列表

### POST /api/auth/register
注册新账号
- **Body**: `{ "username": "...", "email": "...", "password": "..." }`
- **Response**: `{ "message": "...", "token": "...", "user": {...} }`

### POST /api/auth/login
账号登录获取 Token
- **Body**: `{ "email": "...", "password": "..." }`
- **Response**: `{ "message": "...", "token": "...", "user": {...} }`

### POST /api/auth/forgot-password
忘记密码发送重置邮件 (Mock)
- **Body**: `{ "email": "..." }`
- **Response**: `{ "message": "..." }`

### 人力资源部 (HR)
| Method | Path | 说明 |
|--------|------|------|
| GET | `/api/hr/profile` | 获取员工档案及职级信息 (Mock) |
| GET/POST | `/api/hr/skills` | 获取技能树列表 / 新增个人技能 |
| PUT | `/api/hr/skills/:id/xp` | 为指定技能增加经验值 (自动触发 P1-P5 升级) |
| GET/POST | `/api/hr/training/projects` | 获取/新建长线培训项目计划 |
| GET | `/api/hr/training/projects/:id/resources` | 获取某项目下所有关联的学习资源 |
| POST | `/api/hr/training/parse` | 解析外部学习资源 URL 并提取课程表目录 (Mock) |
| POST | `/api/hr/training/resources` | 确认导入解析结果并关联排课到项目 |
| GET/POST | `/api/hr/wellness/logs` | 获取/提交每日的身心关怀日志 (压力/情绪/睡眠) |

### 行政部 (Admin)
| Method | Path | 说明 |
|--------|------|------|
| GET/POST | `/api/admin/inventory` | 获取所有物资库存 / 登记新物资 |
| PUT | `/api/admin/inventory/:id` | 更新特定物资的库存余量 |
| GET/POST | `/api/admin/assets` | 获取所有固定资产 / 登记新资产 |
| GET | `/api/admin/procurement` | 获取历史采购审批记录 |
| POST | `/api/admin/procurement/request` | 提交新采购申请并触发 AI 审批 (返回 decision/comment) |
| PUT | `/api/admin/procurement/:id/status` | 更新审批单实际状态 (如: 待购买 -> 已购买) |

---

## 待实现路由 (Phase 2)




### 公关部
| Method | Path | 说明 |
|--------|------|------|
| POST | `/api/contacts` | 新增联系人 |
| POST | `/api/contacts/:id/interact` | 记录互动 |
| GET | `/api/contacts/overdue` | 逾期联系列表 |

### 健康中心
| Method | Path | 说明 |
|--------|------|------|
| POST | `/api/health/metrics` | 记录身体数据 |
| POST | `/api/health/meals` | 记录膳食 |
| POST | `/api/health/workouts` | 记录运动 |
