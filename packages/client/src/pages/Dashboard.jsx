import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import {
    LayoutDashboard,
    Wallet,
    CheckCircle2,
    Dumbbell,
    Target,
    BookOpen,
    AlertTriangle,
    Clock,
    TrendingUp,
    Sparkles,
} from 'lucide-react'
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell,
} from 'recharts'
import StatCard from '../components/StatCard'
import PageHeader from '../components/PageHeader'
import DailyBriefing from '../components/DailyBriefing'
import ReviewBoard from '../components/ReviewBoard'
import VirtualFloor from '../components/VirtualFloor'

const netWorthData = [
    { month: '9月', value: 42000 },
    { month: '10月', value: 45500 },
    { month: '11月', value: 44800 },
    { month: '12月', value: 48200 },
    { month: '1月', value: 51000 },
    { month: '2月', value: 53600 },
]

const assetPie = [
    { name: '现金', value: 18000, color: '#4f6ef7' },
    { name: '基金', value: 22000, color: '#22c55e' },
    { name: '股票', value: 8600, color: '#f59e0b' },
    { name: '其他', value: 5000, color: '#8b5cf6' },
]

const todayTasks = [
    { id: 1, text: '完成季度 OKR 复盘报告', done: true },
    { id: 2, text: '整理冰箱食材清单', done: false },
    { id: 3, text: '阅读《原则》第4章', done: false },
    { id: 4, text: '健身 - 胸部训练日', done: false },
    { id: 5, text: '联系妈妈 (本周未通话)', done: false },
]

const alerts = [
    { type: 'warning', text: '洗面奶库存告急，剩余约 15%' },
    { type: 'info', text: '距离目标"高性能电脑"还差 2,340 积分' },
    { type: 'warning', text: '超过 14 天未联系：张三、李四' },
]

export default function Dashboard() {
    const today = format(new Date(), 'yyyy年M月d日 EEEE', { locale: zhCN })

    return (
        <div>
            <PageHeader icon={LayoutDashboard} title="总裁办" subtitle="CEO 模拟经营大盘 — 全局监控">
                <div className="text-sm text-corp-muted font-mono bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg backdrop-blur-md">{today}</div>
            </PageHeader>

            {/* Stanford Town Virtual Map UI */}
            <VirtualFloor />

            <DailyBriefing />

            {/* KPI Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
                <StatCard icon={Wallet} title="公司市值" value="¥53,600" trend="up" trendValue="+5.1%" color="blue" />
                <StatCard icon={Sparkles} title="可用积分" value="4,460" subtitle="期权余额" color="purple" />
                <StatCard icon={CheckCircle2} title="本月任务" value="68%" trend="up" trendValue="+12%" color="green" />
                <StatCard icon={Dumbbell} title="本周运动" value="3次" subtitle="目标: 4次" color="cyan" />
                <StatCard icon={Target} title="OKR 进度" value="42%" subtitle="Q1 进行中" color="yellow" />
                <StatCard icon={BookOpen} title="本月学习" value="18h" trend="up" trendValue="+3h" color="green" />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Net Worth Trend */}
                <div className="corp-card lg:col-span-2 group">
                    <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                        <TrendingUp size={16} className="text-corp-accent-light" />
                        公司市值趋势（近6月）
                    </h3>
                    <ResponsiveContainer width="100%" height={220}>
                        <AreaChart data={netWorthData}>
                            <defs>
                                <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 12, fontFamily: 'Outfit' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#94a3b8', fontSize: 12, fontFamily: 'Outfit' }} axisLine={false} tickLine={false} />
                            <Tooltip
                                contentStyle={{ background: 'rgba(20,20,25,0.85)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#f8fafc', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}
                                itemStyle={{ color: '#c084fc', fontWeight: 'bold' }}
                            />
                            <Area type="monotone" dataKey="value" stroke="#c084fc" fill="url(#colorVal)" strokeWidth={3} activeDot={{ r: 6, fill: '#c084fc', stroke: '#fff', strokeWidth: 2 }} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Asset Allocation Pie */}
                <div className="corp-card group">
                    <h3 className="text-sm font-semibold text-white mb-4">资产配置</h3>
                    <ResponsiveContainer width="100%" height={180}>
                        <PieChart>
                            <Pie data={assetPie} cx="50%" cy="50%" innerRadius={55} outerRadius={75} dataKey="value" paddingAngle={5} stroke="none">
                                {assetPie.map((entry) => (
                                    <Cell key={entry.name} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ background: 'rgba(20,20,25,0.85)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#f8fafc', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }} itemStyle={{ fontWeight: 'bold' }} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="flex flex-wrap justify-center gap-3 mt-4">
                        {assetPie.map((a) => (
                            <div key={a.name} className="flex items-center gap-1.5 text-xs text-corp-muted font-medium">
                                <span className="w-3 h-3 rounded-full" style={{ background: a.color, boxShadow: `0 0 10px ${a.color}80` }} />
                                {a.name}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <ReviewBoard />

                {/* Today Tasks */}
                <div className="corp-card">
                    <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                        <Clock size={16} className="text-corp-accent-light" />
                        今日待办
                    </h3>
                    <div className="space-y-2">
                        {todayTasks.map((t) => (
                            <div key={t.id} className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-white/[.05] transition cursor-pointer group">
                                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${t.done ? 'bg-gradient-to-br from-purple-500 to-indigo-500 border-transparent shadow-glow' : 'border-white/20 group-hover:border-purple-400'
                                    }`}>
                                    {t.done && <CheckCircle2 size={14} className="text-white" />}
                                </div>
                                <span className={`text-sm tracking-wide ${t.done ? 'text-corp-muted/50 line-through' : 'text-slate-200 group-hover:text-white transition-colors'}`}>{t.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Alerts */}
                <div className="corp-card relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-3xl rounded-full"></div>
                    <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2 relative z-10">
                        <AlertTriangle size={16} className="text-amber-400" />
                        经营预警
                    </h3>
                    <div className="space-y-3 relative z-10">
                        {alerts.map((a, i) => (
                            <div key={i} className={`flex items-start gap-3 p-3.5 rounded-xl backdrop-blur-md border ${a.type === 'warning' ? 'bg-amber-500/10 border-amber-500/20 shadow-[0_4px_20px_rgba(245,158,11,0.05)]' : 'bg-blue-500/10 border-blue-500/20 shadow-[0_4px_20px_rgba(59,130,246,0.05)]'
                                }`}>
                                <AlertTriangle size={16} className={a.type === 'warning' ? 'text-amber-400 mt-0.5' : 'text-blue-400 mt-0.5'} />
                                <p className="text-sm text-slate-200 tracking-wide leading-relaxed">{a.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
