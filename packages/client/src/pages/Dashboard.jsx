import React, { useState } from 'react'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import {
    LayoutDashboard,
    Wallet,
    CheckCircle2,
    Dumbbell,
    Target,
    BookOpen,
    TrendingUp,
    Sparkles,
    TerminalSquare,
    Activity,
    ChevronDown,
    ChevronUp,
    ShieldAlert,
    Check,
    X,
    AlertTriangle,
    History
} from 'lucide-react'
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell,
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import StatCard from '../components/StatCard'
import PageHeader from '../components/PageHeader'
import DailyBriefing from '../components/DailyBriefing'

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
    const todayKey = `me-corp-briefing-archived-${format(new Date(), 'yyyy-MM-dd')}`
    const [missionPrompt, setMissionPrompt] = useState('')
    const [status, setStatus] = useState('idle') // idle, negotiating, completed, rejected, blocked, error
    const [missionResult, setMissionResult] = useState(null)
    const [rulesText, setRulesText] = useState('')
    const [isDefiningRules, setIsDefiningRules] = useState(false)
    const [showFullReport, setShowFullReport] = useState(false)
    const [isBriefingArchived, setIsBriefingArchived] = useState(() => {
        return localStorage.getItem(todayKey) === 'true'
    })

    const handleArchive = () => {
        localStorage.setItem(todayKey, 'true')
        setIsBriefingArchived(true)
    }

    const executeMission = async () => {
        if (!missionPrompt.trim()) return
        setStatus('negotiating')
        setMissionResult(null)
        setRulesText('')
        setIsDefiningRules(false)
        try {
            const res = await fetch('/api/missions/execute', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ missionPrompt })
            })
            const data = await res.json()
            if (res.ok) {
                setStatus(data.status || 'completed')
                setMissionResult(data)
            } else {
                setStatus('error')
            }
        } catch (err) {
            setStatus('error')
        }
    }

    const defineRules = async () => {
        if (!rulesText.trim()) return
        setIsDefiningRules(true)
        try {
            const res = await fetch('/api/missions/define-rules', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    taskId: missionResult?.taskId,
                    rulesText,
                    gap: missionResult?.pointsGap
                })
            })
            const data = await res.json()
            if (res.ok) {
                setStatus('completed')
                setMissionResult({ ...missionResult, ...data })
            }
        } catch (err) {
            console.error(err)
        } finally {
            setIsDefiningRules(false)
        }
    }

    return (
        <div className="max-w-7xl mx-auto">
            <PageHeader icon={LayoutDashboard} title="总裁办" subtitle="CEO 战略中枢 — 极简模式">
                <div className="text-sm text-corp-muted font-mono bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg backdrop-blur-md">{today}</div>
            </PageHeader>

            {/* Top Strategic Terminal */}
            <div className="mb-8 relative z-50">
                <div className="corp-card border-corp-accent/30 bg-gradient-to-r from-corp-accent/5 to-transparent p-1">
                    <div className="flex gap-3 p-2">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                value={missionPrompt}
                                onChange={e => setMissionPrompt(e.target.value)}
                                placeholder="输入 CEO 全局战略指令 (e.g. #预算, #资产购置)..."
                                className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-base text-white focus:outline-none focus:border-corp-accent/50 transition-all font-outfit"
                                onKeyDown={(e) => e.key === 'Enter' && executeMission()}
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3">
                                {isBriefingArchived && (
                                    <button
                                        onClick={() => setIsBriefingArchived(false)}
                                        className="text-corp-muted hover:text-corp-accent transition-colors"
                                        title="重看晨报"
                                    >
                                        <History size={16} />
                                    </button>
                                )}
                                {status === 'negotiating' && (
                                    <span className="flex items-center gap-1.5 text-[10px] text-corp-accent-light uppercase font-bold animate-pulse">
                                        <Activity size={10} /> 高管博弈中
                                    </span>
                                )}
                                <span className="text-[10px] text-corp-muted font-mono bg-white/5 px-1.5 py-0.5 rounded border border-white/5">CTRL+K</span>
                            </div>
                        </div>
                        <button
                            onClick={executeMission}
                            disabled={status === 'negotiating' || !missionPrompt.trim()}
                            className="px-8 bg-corp-accent hover:bg-corp-accent-light text-white font-bold rounded-xl transition-all shadow-glow flex items-center gap-2 group disabled:opacity-50"
                        >
                            <TerminalSquare size={18} />
                            <span>EXECUTE</span>
                        </button>
                    </div>
                </div>

                {/* Inline Mission Result */}
                <AnimatePresence>
                    {(missionResult || status === 'error') && (
                        <motion.div
                            key={`mission-res-${status}-${missionResult?.taskId || 'err'}`}
                            initial={{ height: 0, opacity: 0, marginTop: 0 }}
                            animate={{ height: 'auto', opacity: 1, marginTop: 16 }}
                            exit={{ height: 0, opacity: 0, marginTop: 0 }}
                            className="overflow-hidden"
                        >
                            <div className={`p-5 rounded-2xl border backdrop-blur-xl ${status === 'completed' ? 'bg-green-500/10 border-green-500/30' :
                                status === 'rejected' ? 'bg-red-500/10 border-red-500/30' :
                                    status === 'needs_ceo_input' ? 'bg-purple-500/10 border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.1)]' :
                                        status === 'error' ? 'bg-rose-500/10 border-rose-500/30' :
                                            'bg-yellow-500/10 border-yellow-500/30'
                                }`}>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        {status === 'completed' ? <Check size={18} className="text-green-400" /> :
                                            status === 'rejected' ? <X size={18} className="text-red-400" /> :
                                                status === 'needs_ceo_input' ? <Sparkles size={18} className="text-purple-400" /> :
                                                    status === 'error' ? <X size={18} className="text-rose-400" /> :
                                                        <AlertTriangle size={18} className="text-yellow-400" />}

                                        <span className={`text-sm font-black uppercase tracking-wider ${status === 'completed' ? 'text-green-400' :
                                            status === 'rejected' ? 'text-red-400' :
                                                status === 'needs_ceo_input' ? 'text-purple-400' :
                                                    status === 'error' ? 'text-rose-400' :
                                                        'text-yellow-400'
                                            }`}>
                                            {status === 'completed' ? '提案通过并同步执行' :
                                                status === 'rejected' ? '风控委员会驳回' :
                                                    status === 'needs_ceo_input' ? `积分缺口: ${missionResult?.pointsGap || 0} 分` :
                                                        status === 'error' ? '系统链路中断' :
                                                            '由于博弈阻塞，提案挂起'}
                                        </span>
                                    </div>
                                    <button onClick={() => { setMissionResult(null); setStatus('idle'); }} className="text-white/20 hover:text-white transition-colors">
                                        <X size={16} />
                                    </button>
                                </div>

                                {/* Main content: report, error, or rule definition */}
                                {status === 'error' ? (
                                    <div className="text-sm text-rose-300 bg-black/40 p-4 rounded-xl border border-rose-500/20 font-mono">
                                        远程决策服务器响应超时或端口连接失败。请检查后端服务 (Port: 3002) 是否已正常启动。
                                    </div>
                                ) : status === 'needs_ceo_input' ? (
                                    <div className="space-y-4">
                                        <p className="text-xs text-purple-200/70 border-l-2 border-purple-500/50 pl-3 italic">
                                            Boss，目前预算及积分不足以支持直接批复。请下达【专项积分获取指令】以弥补缺口。
                                        </p>
                                        <div className="relative">
                                            <textarea
                                                className="w-full bg-black/60 border border-purple-500/30 rounded-xl p-3 text-sm text-white focus:border-purple-500/60 outline-none min-h-[100px] font-outfit"
                                                placeholder="例如：每晚22:00前睡 +20，否则 -30。每周运动 >4h +70..."
                                                value={rulesText}
                                                onChange={e => setRulesText(e.target.value)}
                                            />
                                            <button
                                                onClick={defineRules}
                                                disabled={isDefiningRules || !rulesText.trim()}
                                                className="absolute bottom-3 right-3 px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-lg transition-all shadow-glow disabled:opacity-50"
                                            >
                                                {isDefiningRules ? '拆解中...' : '提交规则'}
                                            </button>
                                        </div>
                                    </div>
                                ) : missionResult && (
                                    <div className="space-y-4">
                                        <div className="text-sm text-slate-300 bg-black/40 p-4 rounded-xl border border-white/5 whitespace-pre-wrap leading-relaxed font-outfit shadow-inner">
                                            {missionResult.report || missionResult.reason || '指令已送达，正在下发至各执行部门。'}
                                        </div>

                                        {missionResult.tasks && (
                                            <div className="space-y-2 mt-4 animate-in fade-in slide-in-from-top-2">
                                                <div className="text-[10px] font-mono text-corp-muted flex items-center gap-2">
                                                    <div className="h-px flex-1 bg-white/5"></div>
                                                    专项积分任务清单
                                                    <div className="h-px flex-1 bg-white/5"></div>
                                                </div>
                                                {missionResult.tasks.map((task, idx) => (
                                                    <div key={idx} className="flex items-center gap-3 bg-white/5 p-3 rounded-lg border border-white/5 hover:border-white/10 transition-colors group">
                                                        <div className="w-5 h-5 rounded border border-corp-accent/40 flex items-center justify-center text-corp-accent cursor-pointer hover:bg-corp-accent/20">
                                                            <Check size={12} className="opacity-0 group-hover:opacity-50" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="text-sm font-bold text-slate-200">{task.title}</div>
                                                            <div className="text-[10px] text-corp-muted">{task.description}</div>
                                                        </div>
                                                        <div className="text-xs font-mono font-bold text-corp-accent-light bg-corp-accent/10 px-2 py-0.5 rounded">
                                                            +{task.points_reward}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {status !== 'completed' && status !== 'needs_ceo_input' && status !== 'idle' && status !== 'error' && (
                                    <div className="mt-4 pt-4 border-t border-white/5 flex gap-3">
                                        <button onClick={() => { setMissionResult(null); setStatus('idle'); }} className="flex-1 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-bold rounded-lg border border-red-500/20 transition-all">
                                            遵从建议 (Cancel)
                                        </button>
                                        <button className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-lg border border-white/10 transition-all">
                                            CEO 强制执行 (Override)
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>

            {/* Daily Briefing Area */}
            <AnimatePresence>
                {!isBriefingArchived && (
                    <motion.div
                        initial={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                        className="relative"
                    >
                        <DailyBriefing
                            onToggleFull={() => setShowFullReport(!showFullReport)}
                            isExpanded={showFullReport}
                            onArchive={handleArchive}
                        />

                        {/* Full Report Expansion inside Briefing Area to archive it together */}
                        <AnimatePresence>
                            {showFullReport && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                    className="space-y-6 mt-6 pb-20"
                                >
                                    {/* KPI Grid */}
                                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                                        <StatCard icon={Wallet} title="公司市值" value="¥53,600" trend="up" trendValue="+5.1%" color="blue" />
                                        <StatCard icon={Sparkles} title="可用积分" value="4,460" subtitle="期权余额" color="purple" />
                                        <StatCard icon={CheckCircle2} title="本月任务" value="68%" trend="up" trendValue="+12%" color="green" />
                                        <StatCard icon={Dumbbell} title="本周运动" value="3次" subtitle="目标: 4次" color="cyan" />
                                        <StatCard icon={Target} title="OKR 进度" value="42%" subtitle="Q1 进行中" color="yellow" />
                                        <StatCard icon={BookOpen} title="本月学习" value="18h" trend="up" trendValue="+3h" color="green" />
                                    </div>

                                    {/* Charts Row */}
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        <div className="corp-card lg:col-span-2 group">
                                            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                                                <TrendingUp size={16} className="text-corp-accent-light" />
                                                公司市值趋势（近6月）
                                            </h3>
                                            <div className="h-[220px]">
                                                <ResponsiveContainer width="100%" height="100%">
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
                                        </div>

                                        <div className="corp-card group">
                                            <h3 className="text-sm font-semibold text-white mb-4">资产配置</h3>
                                            <div className="h-[180px]">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <PieChart>
                                                        <Pie data={assetPie} cx="50%" cy="50%" innerRadius={55} outerRadius={75} dataKey="value" paddingAngle={5} stroke="none">
                                                            {assetPie.map((entry) => (
                                                                <Cell key={entry.name} fill={entry.color} />
                                                            ))}
                                                        </Pie>
                                                        <Tooltip contentStyle={{ background: 'rgba(20,20,25,0.85)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#f8fafc', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }} itemStyle={{ fontWeight: 'bold' }} />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            </div>
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
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
