import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Activity, ShieldAlert, Crosshair, Award,
    Flame, AlertOctagon, BrainCircuit, RefreshCw,
    TrendingUp, Loader2, Play
} from 'lucide-react'

export default function AuditDashboard() {
    const [reports, setReports] = useState([])
    const [loading, setLoading] = useState(true)
    const [generating, setGenerating] = useState(false)
    const [selectedReport, setSelectedReport] = useState(null)

    useEffect(() => {
        fetchReports()
    }, [])

    const fetchReports = async () => {
        try {
            const res = await fetch('/api/audit/reports')
            if (res.ok) {
                const data = await res.json()
                setReports(data)
                if (data.length > 0) setSelectedReport(data[0])
            }
        } catch (err) {
            console.error('Failed to fetch audit reports', err)
        } finally {
            setLoading(false)
        }
    }

    const triggerAudit = async () => {
        setGenerating(true)
        try {
            const res = await fetch('/api/audit/trigger', { method: 'POST' })
            if (res.ok) {
                await fetchReports()
            } else {
                alert('Audit Generation Failed. Either it was already run today or an error occurred.')
            }
        } catch (err) {
            console.error(err)
        } finally {
            setGenerating(false)
        }
    }

    if (loading) {
        return <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin text-corporate-accent" /></div>
    }

    if (reports.length === 0 && !generating) {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh] text-center max-w-md mx-auto">
                <BrainCircuit size={64} className="text-white/10 mb-6" />
                <h2 className="text-2xl font-light text-white mb-3">审计库空白</h2>
                <p className="text-white/40 mb-8 border-l-2 border-white/10 pl-4 py-1 text-left">
                    "首席审计官 (CAO) 今天还没有对你的所作所为进行清算。主动触发？还是等到深夜？"
                </p>
                <button
                    onClick={triggerAudit}
                    className="flex items-center space-x-2 bg-gradient-to-r from-red-600 to-rose-600 text-white px-8 py-4 rounded-xl shadow-[0_0_30px_rgba(225,29,72,0.3)] hover:shadow-[0_0_50px_rgba(225,29,72,0.5)] transition-all active:scale-95"
                >
                    <Play size={18} />
                    <span className="font-semibold tracking-wide">立刻触发强制审计</span>
                </button>
            </div>
        )
    }

    const report = selectedReport || reports[0]

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-light text-white tracking-tight flex items-center gap-3">
                        <ShieldAlert className="text-rose-500" />
                        深夜审计简报
                    </h1>
                    <p className="text-white/40 mt-1 flex items-center gap-2">
                        <span>首席审计官 (CAO) 生成</span>
                        <span className="w-1 h-1 rounded-full bg-white/20"></span>
                        <span className="font-mono">{report?.report_date ? new Date(report.report_date).toLocaleDateString() : 'N/A'}</span>
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={triggerAudit}
                        disabled={generating}
                        className="flex items-center space-x-2 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-xl text-sm transition-all text-white disabled:opacity-50"
                    >
                        {generating ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                        <span>重新生成今日审计</span>
                    </button>
                </div>
            </div>

            {generating ? (
                <div className="h-96 flex flex-col items-center justify-center bg-black/30 backdrop-blur-xl border border-rose-500/20 rounded-3xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-transparent animate-pulse"></div>
                    <BrainCircuit size={48} className="text-rose-500/50 mb-4 animate-pulse" />
                    <p className="text-rose-400 font-mono tracking-widest text-sm animate-pulse">CAO IS ANALYZING YOUR DAY...</p>
                </div>
            ) : report ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                >
                    {/* Top KPI Dash */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Efficiency Score */}
                        <div className="bg-black/40 backdrop-blur-2xl border border-white/5 p-6 rounded-3xl relative overflow-hidden group">
                            <div className="absolute -right-10 -top-10 w-40 h-40 bg-corporate-primary/10 blur-3xl rounded-full"></div>
                            <div className="flex justify-between items-start relative z-10">
                                <div>
                                    <p className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-2 flex items-center gap-2"><Activity size={14} /> 综合执政效率</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className={`text-6xl font-light tracking-tighter ${report.efficiency_score >= 80 ? 'text-emerald-400' : report.efficiency_score >= 60 ? 'text-yellow-400' : 'text-rose-500'}`}>
                                            {report.efficiency_score}
                                        </span>
                                        <span className="text-white/30 text-xl">/100</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-white/50 text-sm mb-1">执行概况</p>
                                    <p className="text-white/80 font-mono text-sm">任务: {report.tasks_completed}/{report.tasks_created}</p>
                                    <p className="text-white/80 font-mono text-sm">纪律: {report.habits_completed}/{report.habits_total}</p>
                                </div>
                            </div>
                        </div>

                        {/* Procrastination Index */}
                        <div className="bg-black/40 backdrop-blur-2xl border border-white/5 p-6 rounded-3xl relative overflow-hidden">
                            <div className={`absolute -right-10 -top-10 w-40 h-40 blur-3xl rounded-full ${parseFloat(report.procrastination_index) > 0.5 ? 'bg-rose-500/10' : 'bg-emerald-500/10'}`}></div>
                            <div className="flex justify-between items-start relative z-10">
                                <div>
                                    <p className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-2 flex items-center gap-2"><TrendingUp size={14} /> 拖延/虚度指数</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className={`text-6xl font-light tracking-tighter ${parseFloat(report.procrastination_index) > 0.5 ? 'text-rose-500' : 'text-emerald-400'}`}>
                                            {parseFloat(report.procrastination_index).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right max-w-[150px]">
                                    <p className="text-white/40 text-xs leading-relaxed">
                                        {parseFloat(report.procrastination_index) > 0.5
                                            ? '指数偏高。你似乎沉迷于制定计划，但并不打算执行。'
                                            : '指数健康。雷厉风行，说了就算。'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Brutally Honest Feedback */}
                    <div className="bg-gradient-to-br from-black/80 to-rose-950/20 backdrop-blur-2xl border border-rose-500/20 p-8 rounded-3xl relative">
                        <AlertOctagon className="absolute top-8 right-8 text-rose-500/10" size={120} />
                        <div className="relative z-10">
                            <h3 className="text-rose-400 font-mono text-sm tracking-widest uppercase mb-4 opacity-80 flex items-center gap-2">
                                <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
                                CAO's Verdict
                            </h3>
                            <p className="text-white/90 text-xl leading-relaxed font-light font-serif italic">
                                "{report.honest_feedback}"
                            </p>
                        </div>
                    </div>

                    {/* Highlights & Lowlights */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-emerald-950/20 border border-emerald-500/20 p-6 rounded-3xl">
                            <h3 className="text-emerald-400 flex items-center gap-2 mb-4 font-medium"><Award size={18} /> 今日战果 (Wins)</h3>
                            <ul className="space-y-3">
                                {report.top_wins?.map((win, i) => (
                                    <li key={i} className="flex gap-3 text-white/70 text-sm bg-black/20 p-3 rounded-xl border border-white/5">
                                        <Crosshair size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                                        <span>{win}</span>
                                    </li>
                                ))}
                                {(!report.top_wins || report.top_wins.length === 0) && (
                                    <li className="text-white/30 text-sm italic py-2">乏善可陈。</li>
                                )}
                            </ul>
                        </div>

                        <div className="bg-rose-950/20 border border-rose-500/20 p-6 rounded-3xl">
                            <h3 className="text-rose-400 flex items-center gap-2 mb-4 font-medium"><Flame size={18} /> 今日滑铁卢 (Failures)</h3>
                            <ul className="space-y-3">
                                {report.top_failures?.map((fail, i) => (
                                    <li key={i} className="flex gap-3 text-white/70 text-sm bg-black/20 p-3 rounded-xl border border-white/5">
                                        <AlertOctagon size={16} className="text-rose-500 flex-shrink-0 mt-0.5" />
                                        <span>{fail}</span>
                                    </li>
                                ))}
                                {(!report.top_failures || report.top_failures.length === 0) && (
                                    <li className="text-white/30 text-sm italic py-2">没有明显的严重失误。</li>
                                )}
                            </ul>
                        </div>
                    </div>

                    {/* Recommendations */}
                    {report.recommendations && report.recommendations.length > 0 && (
                        <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
                            <h3 className="text-white/60 text-sm uppercase tracking-widest font-medium mb-4">行动纲领 (Recommendations)</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {report.recommendations.map((rec, i) => (
                                    <div key={i} className="bg-black/30 p-4 rounded-xl border border-white/5">
                                        <div className="text-corporate-primary font-mono text-xs mb-2">ACT_{i + 1}</div>
                                        <p className="text-white/80 text-sm">{rec}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </motion.div>
            ) : null}

            {/* History Strip */}
            {reports.length > 1 && (
                <div className="pt-8">
                    <h4 className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-4">历代纪要 (History)</h4>
                    <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                        {reports.map((r) => (
                            <button
                                key={r.id}
                                onClick={() => setSelectedReport(r)}
                                className={`flex-shrink-0 flex flex-col items-center justify-center w-24 h-24 rounded-2xl border transition-all ${selectedReport?.id === r.id ? 'bg-white/10 border-white/30' : 'bg-black/40 border-white/5 hover:border-white/20'}`}
                            >
                                <span className="text-white/50 text-xs mb-1 font-mono">{new Date(r.report_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                <span className={`text-2xl font-light ${r.efficiency_score >= 80 ? 'text-emerald-400' : r.efficiency_score >= 60 ? 'text-yellow-400' : 'text-rose-500'}`}>
                                    {r.efficiency_score}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
