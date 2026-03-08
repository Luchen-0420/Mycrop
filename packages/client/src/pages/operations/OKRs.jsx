import { useState, useEffect } from 'react'
import { Plus, Target, Focus, Loader2, ChevronDown, ChevronRight } from 'lucide-react'

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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard icon={Target} title="进行中的 O" value={inProgressO} color="blue" />
                <StatCard icon={CheckCircle2} title="已达成的 O" value={doneO} color="green" />
                <StatCard icon={Focus} title="平均进度" value={`${avgProgress}%`} color="purple" />
            </div>

            <div className="flex justify-end">
                <button onClick={() => setIsAddO(!isAddO)} className="btn-primary flex items-center space-x-2">
                    <Plus size={16} /> <span>设立新 O (Objective)</span>
                </button>
            </div>

            {isAddO && (
                <div className="bg-corporate-800 rounded-xl p-5 border border-corporate-primary/50 shadow-lg relative overflow-hidden mb-6">
                    <div className="absolute top-0 left-0 w-1 h-full bg-corporate-primary"></div>
                    <form onSubmit={handleAddO} className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="w-full md:w-48">
                            <label className="block text-xs text-corporate-text-secondary mb-1">周期 (Quarter)</label>
                            <input type="text" required placeholder="如: 2026 Q1" value={newO.quarter} onChange={e => setNewO({ ...newO, quarter: e.target.value })} className="w-full bg-corporate-900 border border-corporate-700 rounded-lg px-3 py-2.5 text-white outline-none focus:border-corporate-primary font-mono" />
                        </div>
                        <div className="flex-1 w-full">
                            <label className="block text-xs text-corporate-text-secondary mb-1">鼓舞人心的目标 (Objective)</label>
                            <input type="text" required placeholder="如: 打造极具竞争力的个人技能护城河..." value={newO.objective} onChange={e => setNewO({ ...newO, objective: e.target.value })} className="w-full bg-corporate-900 border border-corporate-700 rounded-lg px-3 py-2.5 text-white outline-none focus:border-corporate-primary" />
                        </div>
                        <div className="flex space-x-3 w-full md:w-auto">
                            <button type="button" onClick={() => setIsAddO(false)} className="px-4 py-2.5 hover:bg-corporate-700 rounded-lg text-sm transition text-corporate-text-secondary w-full md:w-auto">取消</button>
                            <button type="submit" className="btn-primary py-2.5 px-6 w-full md:w-auto shadow">创立</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="space-y-6">
                {okrs.map(o => {
                    const progress = parseInt(o.progress);
                    const isSuccess = progress >= 100;

                    return (
                        <div key={o.id} className={`bg-corporate-800 rounded-xl border overflow-hidden transition-colors duration-500 ${isSuccess ? 'border-corporate-success/50' : 'border-corporate-700'}`}>

                            {/* O Header Strip */}
                            <div className={`p-4 flex items-center justify-between cursor-pointer select-none transition-colors ${isSuccess ? 'bg-corporate-success/10 hover:bg-corporate-success/20' : 'bg-corporate-900/50 hover:bg-corporate-900'}`} onClick={() => toggleExpand(o.id)}>
                                <div className="flex items-center space-x-3 overflow-hidden">
                                    <div className="text-corporate-text-secondary flex-shrink-0">
                                        {expanded[o.id] ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                                    </div>
                                    <div className="flex-shrink-0 bg-corporate-700 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase">{o.quarter}</div>
                                    <h4 className="font-bold text-lg text-white truncate">{o.objective}</h4>
                                </div>

                                <div className="flex items-center space-x-4 ml-4 flex-shrink-0">
                                    <div className="w-32 hidden md:block">
                                        <div className="h-2 bg-corporate-900 rounded-full overflow-hidden border border-corporate-700">
                                            <div
                                                className={`h-full transition-all duration-1000 ${isSuccess ? 'bg-corporate-success' : 'bg-corporate-primary'}`}
                                                style={{ width: `${progress}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                    <div className={`font-mono font-bold text-lg w-12 text-right ${isSuccess ? 'text-corporate-success' : 'text-corporate-accent'}`}>
                                        {progress}%
                                    </div>
                                </div>
                            </div>

                            {/* KRs List (Collapsible) */}
                            {expanded[o.id] && (
                                <div className="p-4 bg-corporate-800 space-y-4">

                                    {o.krs.map(kr => {
                                        const krProgress = Math.min((kr.current_value / kr.target_value) * 100, 100);
                                        const isKrDone = krProgress >= 100;
                                        return (
                                            <div key={kr.id} className="flex flex-col md:flex-row md:items-center justify-between p-3 rounded-lg bg-corporate-900 border border-corporate-700/50 hover:border-corporate-600 transition group gap-4">
                                                <div className="flex items-start space-x-3 w-full md:w-1/2">
                                                    <Focus size={16} className={`mt-0.5 flex-shrink-0 ${isKrDone ? 'text-corporate-success' : 'text-corporate-500'}`} />
                                                    <span className={`text-sm ${isKrDone ? 'text-corporate-text-secondary line-through' : 'text-white'}`}>{kr.title}</span>
                                                </div>

                                                <div className="flex items-center w-full md:w-1/2 md:justify-end space-x-4">

                                                    {/* Mini progress line */}
                                                    <div className="flex-1 w-full max-w-[200px] h-1.5 bg-corporate-800 rounded-full overflow-hidden">
                                                        <div className={`h-full transition-all duration-500 ${isKrDone ? 'bg-corporate-success' : 'bg-corporate-500'}`} style={{ width: `${krProgress}%` }}></div>
                                                    </div>

                                                    <div className="flex items-center bg-corporate-800 rounded px-2 py-1 flex-shrink-0 border border-corporate-700 focus-within:border-corporate-primary transition">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            defaultValue={kr.current_value}
                                                            onBlur={(e) => handleUpdateKrProgress(kr.id, e.target.value)}
                                                            className="w-16 bg-transparent text-right outline-none font-mono text-sm text-white"
                                                        />
                                                        <span className="text-corporate-text-secondary text-sm mx-1">/</span>
                                                        <span className="font-mono text-sm text-corporate-text-secondary w-16">{kr.target_value}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}

                                    {/* Add KR Form via Inline Mode */}
                                    {isAddKrFor === o.id ? (
                                        <form onSubmit={(e) => handleAddKr(e, o.id)} className="flex items-center space-x-3 p-2 bg-corporate-900 border border-dashed border-corporate-primary/50 rounded-lg">
                                            <Focus size={16} className="text-corporate-text-secondary" />
                                            <input type="text" required placeholder="衡量目标达成的关键量化指标..." value={newKr.title} onChange={e => setNewKr({ ...newKr, title: e.target.value })} className="flex-1 bg-transparent text-sm text-white outline-none" />
                                            <span className="text-corporate-text-secondary text-sm">目标定额:</span>
                                            <input type="number" min="1" required placeholder="10" value={newKr.target_value} onChange={e => setNewKr({ ...newKr, target_value: e.target.value })} className="w-20 bg-corporate-800 border border-corporate-700 rounded px-2 py-1 text-sm text-white outline-none font-mono text-right" />
                                            <button type="button" onClick={() => setIsAddKrFor(null)} className="text-xs text-corporate-text-secondary hover:text-white transition">取消</button>
                                            <button type="submit" className="bg-corporate-primary hover:bg-corporate-primary-hover text-white text-xs px-3 py-1.5 rounded transition">保 存</button>
                                        </form>
                                    ) : (
                                        <button onClick={() => setIsAddKrFor(o.id)} className="text-sm text-corporate-primary hover:text-white transition flex items-center py-2 px-1">
                                            <Plus size={14} className="mr-1" /> 为目标增设定量维度 (Add KR)
                                        </button>
                                    )}

                                </div>
                            )}
                        </div>
                    )
                })}

                {okrs.length === 0 && !isAddO && (
                    <div className="py-20 text-center text-corporate-text-secondary border border-dashed border-corporate-700 bg-corporate-800/50 rounded-xl">
                        <Target size={48} className="mx-auto mb-4 opacity-30 text-corporate-accent" />
                        <h4 className="text-lg font-bold text-white/80 mb-2">缺少航向指针</h4>
                        <p className="text-sm max-w-sm mx-auto">
                            作为一家“企业”，你当前未设定任何长远的具有挑战性的宏观目标 (O)。点击右上角建立季度目标。
                        </p>
                    </div>
                )}
            </div>

        </div>
    )
}
