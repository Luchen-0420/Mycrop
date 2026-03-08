import { useState, useEffect } from 'react'
import { Plus, Target, Focus, Loader2, ChevronDown, ChevronRight, CheckCircle2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import StatCard from '../../components/StatCard'

export default function OKRs() {
    const [okrs, setOkrs] = useState([])
    const [loading, setLoading] = useState(true)

    // UI states
    const [expanded, setExpanded] = useState({})
    const [isAddO, setIsAddO] = useState(false)
    const [isAddKrFor, setIsAddKrFor] = useState(null) // ID of the OKR

    // Form states
    const [newO, setNewO] = useState({ quarter: '2026 Q1', objective: '' })
    const [newKr, setNewKr] = useState({ title: '', target_value: '' })

    useEffect(() => {
        fetchOkrs()
    }, [])

    const fetchOkrs = async () => {
        try {
            const res = await fetch('/api/operations/okrs')
            if (res.ok) {
                const data = await res.json()
                setOkrs(data)
                // Expand all by default
                const exp = {}
                data.forEach(o => exp[o.id] = true)
                setExpanded(exp)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleAddO = async (e) => {
        e.preventDefault()
        try {
            const res = await fetch('/api/operations/okrs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newO)
            })
            if (res.ok) {
                setIsAddO(false)
                setNewO({ ...newO, objective: '' })
                fetchOkrs()
            }
        } catch (err) {
            console.error(err)
        }
    }

    const handleAddKr = async (e, okrId) => {
        e.preventDefault()
        try {
            const res = await fetch(`/api/operations/okrs/${okrId}/krs`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newKr)
            })
            if (res.ok) {
                setIsAddKrFor(null)
                setNewKr({ title: '', target_value: '' })
                fetchOkrs()
            }
        } catch (err) {
            console.error(err)
        }
    }

    const handleUpdateKrProgress = async (id, currentValue) => {
        const value = parseInt(currentValue)
        if (isNaN(value)) return;

        try {
            await fetch(`/api/operations/krs/${id}/progress`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ current_value: value })
            })
            fetchOkrs() // Refresh to get recalculated O progress
        } catch (err) {
            console.error(err)
        }
    }

    const toggleExpand = (id) => {
        setExpanded(prev => ({ ...prev, [id]: !prev[id] }))
    }

    const inProgressO = okrs.filter(o => o.progress < 100).length
    const doneO = okrs.filter(o => o.progress >= 100).length
    const avgProgress = okrs.length > 0 ? Math.round(okrs.reduce((sum, o) => sum + parseInt(o.progress), 0) / okrs.length) : 0

    if (loading) return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-corporate-accent" /></div>

    return (
        <div className="space-y-6">

            {/* CEO Stats Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                <div className="bg-black/30 backdrop-blur-xl border border-white/5 rounded-2xl p-5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700"></div>
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <p className="text-white/40 text-xs font-medium uppercase tracking-wider mb-1">正在强攻的战区</p>
                            <h3 className="text-3xl font-light text-white tracking-tight">{inProgressO} <span className="text-sm text-white/30">OBJECTIVES</span></h3>
                        </div>
                        <div className="p-2.5 bg-blue-500/10 rounded-xl border border-blue-500/20 text-blue-400">
                            <Target size={20} />
                        </div>
                    </div>
                </div>

                <div className="bg-black/30 backdrop-blur-xl border border-white/5 rounded-2xl p-5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700"></div>
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <p className="text-white/40 text-xs font-medium uppercase tracking-wider mb-1">已被征服的高地</p>
                            <h3 className="text-3xl font-light text-emerald-400 tracking-tight">{doneO} <span className="text-sm text-emerald-400/50">COMPLETED</span></h3>
                        </div>
                        <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400">
                            <CheckCircle2 size={20} />
                        </div>
                    </div>
                </div>

                <div className="bg-black/30 backdrop-blur-xl border border-white/5 rounded-2xl p-5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700"></div>
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <p className="text-white/40 text-xs font-medium uppercase tracking-wider mb-1">全局战略推进率</p>
                            <h3 className="text-3xl font-light text-purple-400 tracking-tight">{avgProgress} <span className="text-xl text-purple-400/30">%</span></h3>
                        </div>
                        <div className="p-2.5 bg-purple-500/10 rounded-xl border border-purple-500/20 text-purple-400">
                            <Focus size={20} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center px-1">
                <h3 className="text-lg font-medium text-white/80">战略指针盘 <span className="text-sm text-white/30 ml-2 font-normal">OKRs</span></h3>
                <button onClick={() => setIsAddO(!isAddO)} className="flex items-center space-x-2 text-sm px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white transition-all backdrop-blur-sm">
                    <Plus size={16} /> <span>{isAddO ? '关闭战略会' : '定增 O (Objective)'}</span>
                </button>
            </div>

            <AnimatePresence>
                {isAddO && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, scale: 0.95 }}
                        animate={{ opacity: 1, height: 'auto', scale: 1 }}
                        exit={{ opacity: 0, height: 0, scale: 0.95 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="bg-corporate-900/60 backdrop-blur-2xl rounded-2xl p-6 border border-white/10 shadow-2xl relative overflow-hidden shrink-0 origin-top"
                    >
                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-corporate-primary to-purple-500"></div>
                        <form onSubmit={handleAddO} className="flex flex-col md:flex-row gap-5 items-end">
                            <div className="w-full md:w-48">
                                <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">周期 (Quarter)</label>
                                <input type="text" required placeholder="如: 2026 Q1" value={newO.quarter} onChange={e => setNewO({ ...newO, quarter: e.target.value })} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white font-mono outline-none focus:border-corporate-primary transition-colors focus:bg-black/40" />
                            </div>
                            <div className="flex-1 w-full">
                                <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">宏观方向 (Objective)</label>
                                <input type="text" required placeholder="如: 打造极具生命力的个人知识大纲体系..." value={newO.objective} onChange={e => setNewO({ ...newO, objective: e.target.value })} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 outline-none focus:border-corporate-primary transition-colors focus:bg-black/40" />
                            </div>
                            <div className="flex space-x-3 w-full md:w-auto mt-4 md:mt-0">
                                <button type="button" onClick={() => setIsAddO(false)} className="px-5 py-3 rounded-xl text-sm text-white/50 hover:text-white hover:bg-white/5 transition-colors w-full md:w-auto">搁置</button>
                                <button type="submit" className="bg-gradient-to-r from-corporate-primary to-corporate-accent hover:opacity-90 text-white font-medium py-3 px-8 rounded-xl shadow-lg shadow-corporate-primary/20 transition-all active:scale-95 w-full md:w-auto whitespace-nowrap">立项</button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="space-y-6">
                <AnimatePresence>
                    {okrs.map(o => {
                        const progress = parseInt(o.progress);
                        const isSuccess = progress >= 100;
                        const isStagnant = progress < 30 && o.krs.length > 0; // Just an aesthetic logic jump UX

                        return (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={o.id}
                                className={`rounded-2xl border overflow-hidden transition-all duration-700 backdrop-blur-xl ${isSuccess ? 'bg-emerald-500/5 border-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.05)]' : 'bg-black/20 border-white/5'}`}
                            >

                                {/* O Header Strip */}
                                <div className={`p-5 flex items-center justify-between cursor-pointer select-none transition-colors border-b ${expanded[o.id] ? 'border-white/5' : 'border-transparent'} ${isSuccess ? 'hover:bg-emerald-500/10' : 'hover:bg-white/5'}`} onClick={() => toggleExpand(o.id)}>
                                    <div className="flex items-center space-x-4 overflow-hidden pr-6">
                                        <div className={`flex-shrink-0 transition-transform duration-300 ${expanded[o.id] ? 'rotate-90' : 'rotate-0'}`}>
                                            <ChevronRight size={20} className={isSuccess ? 'text-emerald-500' : 'text-white/40'} />
                                        </div>
                                        <div className={`flex-shrink-0 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-widest uppercase ${isSuccess ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 text-white/40 border border-white/10'}`}>
                                            {o.quarter}
                                        </div>
                                        <h4 className={`font-medium text-lg truncate ${isSuccess ? 'text-emerald-400 line-through decoration-emerald-500/30' : 'text-white/90'}`}>{o.objective}</h4>
                                    </div>

                                    <div className="flex items-center space-x-5 ml-4 flex-shrink-0">
                                        <div className="w-32 lg:w-48 hidden md:block">
                                            <div className="h-2.5 bg-black/40 rounded-full overflow-hidden border border-white/5 relative">
                                                {/* Glowing progress bar */}
                                                <div
                                                    className={`absolute top-0 left-0 h-full transition-all duration-1000 ease-out ${isSuccess ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]' : isStagnant ? 'bg-corporate-primary shadow-[0_0_10px_rgba(0,212,255,0.8)]' : 'bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.8)]'}`}
                                                    style={{ width: `${progress}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                        <div className={`font-mono text-xl w-14 text-right font-light tracking-tight ${isSuccess ? 'text-emerald-400' : 'text-white/80'}`}>
                                            {progress}<span className="text-sm opacity-50 ml-0.5">%</span>
                                        </div>
                                    </div>
                                </div>

                                {/* KRs List (Collapsible) */}
                                <AnimatePresence>
                                    {expanded[o.id] && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="p-5 space-y-4 bg-black/10">

                                                {o.krs.map((kr, idx) => {
                                                    const krProgress = Math.min((kr.current_value / kr.target_value) * 100, 100);
                                                    const isKrDone = krProgress >= 100;
                                                    return (
                                                        <motion.div
                                                            initial={{ opacity: 0, x: -20 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: idx * 0.1 }}
                                                            key={kr.id}
                                                            className={`flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl border transition group gap-4 relative overflow-hidden ${isKrDone
                                                                ? 'bg-emerald-500/5 border-emerald-500/20'
                                                                : 'bg-white/5 border-white/5 hover:border-white/10'
                                                                }`}
                                                        >
                                                            {/* Background progress indicator on entire KR bar */}
                                                            <div className={`absolute top-0 left-0 h-full bg-white/5 transition-all duration-1000 opacity-20 pointer-events-none`} style={{ width: `${krProgress}%` }}></div>

                                                            <div className="flex items-center space-x-4 w-full md:w-1/2 relative z-10">
                                                                <div className={`p-1.5 rounded-md flex-shrink-0 ${isKrDone ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-white/30'}`}>
                                                                    <Focus size={14} />
                                                                </div>
                                                                <span className={`text-sm ${isKrDone ? 'text-white/40 line-through decoration-white/10' : 'text-white/80'}`}>{kr.title}</span>
                                                            </div>

                                                            <div className="flex items-center w-full md:w-1/2 md:justify-end space-x-6 relative z-10">
                                                                {/* Mini progress line */}
                                                                <div className="flex-1 w-full max-w-[150px] h-1 bg-black/40 rounded-full overflow-hidden">
                                                                    <div className={`h-full transition-all duration-500 ${isKrDone ? 'bg-emerald-500' : 'bg-white/30'}`} style={{ width: `${krProgress}%` }}></div>
                                                                </div>

                                                                <div className="flex items-center bg-black/30 rounded-lg px-3 py-1.5 flex-shrink-0 border border-white/5 focus-within:border-corporate-primary focus-within:bg-black/50 transition">
                                                                    <input
                                                                        type="number"
                                                                        min="0"
                                                                        defaultValue={kr.current_value}
                                                                        onBlur={(e) => handleUpdateKrProgress(kr.id, e.target.value)}
                                                                        className={`w-14 bg-transparent text-right outline-none font-mono text-sm ${isKrDone ? 'text-emerald-400' : 'text-white'} transition-colors`}
                                                                    />
                                                                    <span className="text-white/20 text-sm mx-2">/</span>
                                                                    <span className="font-mono text-sm text-white/40 w-14">{kr.target_value}</span>
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    )
                                                })}

                                                {/* Add KR Form via Inline Mode */}
                                                <div className="pt-2">
                                                    {isAddKrFor === o.id ? (
                                                        <motion.form
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            onSubmit={(e) => handleAddKr(e, o.id)}
                                                            className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-4 p-3 bg-black/30 border border-dashed border-white/20 rounded-xl"
                                                        >
                                                            <div className="flex items-center flex-1 space-x-3">
                                                                <Focus size={16} className="text-white/30 ml-1" />
                                                                <input type="text" required placeholder="衡量目标达成的关键量化指标 (KR)..." value={newKr.title} onChange={e => setNewKr({ ...newKr, title: e.target.value })} className="flex-1 bg-transparent text-sm text-white outline-none placeholder-white/20" />
                                                            </div>
                                                            <div className="flex items-center space-x-3 justify-end md:justify-start">
                                                                <span className="text-white/30 text-xs font-mono uppercase tracking-wider">定额界限:</span>
                                                                <input type="number" min="1" required placeholder="10" value={newKr.target_value} onChange={e => setNewKr({ ...newKr, target_value: e.target.value })} className="w-20 bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white outline-none font-mono text-right focus:border-corporate-primary transition-colors" />
                                                            </div>
                                                            <div className="flex md:items-center justify-end space-x-2 pt-2 md:pt-0 border-t md:border-t-0 border-white/5">
                                                                <button type="button" onClick={() => setIsAddKrFor(null)} className="text-xs text-white/40 hover:text-white px-3 py-2 transition rounded-lg hover:bg-white/5">退回</button>
                                                                <button type="submit" className="bg-white/10 hover:bg-white/20 text-white text-xs px-4 py-2 rounded-lg transition border border-white/10 backdrop-blur-sm shadow-lg whitespace-nowrap">锁定量纲</button>
                                                            </div>
                                                        </motion.form>
                                                    ) : (
                                                        <button onClick={() => setIsAddKrFor(o.id)} className="text-xs font-medium text-white/40 hover:text-white transition-colors flex items-center py-2 px-3 hover:bg-white/5 rounded-lg border border-transparent hover:border-white/10">
                                                            <Plus size={14} className="mr-1.5" /> 制定精细化度量标准 (Add KR)
                                                        </button>
                                                    )}
                                                </div>

                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        )
                    })}
                </AnimatePresence>

                {okrs.length === 0 && !isAddO && (
                    <div className="py-24 text-center border border-dashed border-white/10 bg-black/20 rounded-2xl backdrop-blur-sm">
                        <Target size={48} className="mx-auto mb-5 text-white/10" />
                        <h4 className="text-lg font-medium text-white/50 mb-2">缺少航向指针</h4>
                        <p className="text-sm max-w-sm mx-auto text-white/30">
                            作为一家“企业”，你当前未设定任何可评估的大型战役目标 (O)。点击右上角立项。
                        </p>
                    </div>
                )}
            </div>

        </div>
    )
}
