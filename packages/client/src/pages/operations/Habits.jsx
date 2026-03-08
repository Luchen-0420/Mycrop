import { useState, useEffect } from 'react'
import { Plus, CheckCircle, Flame, Target, Loader2, Sparkles, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Habits() {
    const [habits, setHabits] = useState([])
    const [loading, setLoading] = useState(true)
    const [isAddMode, setIsAddMode] = useState(false)
    const [newHabit, setNewHabit] = useState({ name: '', frequency: 'daily', points_reward: 30 })
    const [toast, setToast] = useState(null)

    useEffect(() => {
        fetchHabits()
    }, [])

    const fetchHabits = async () => {
        try {
            const res = await fetch('/api/operations/habits')
            if (res.ok) {
                const data = await res.json()
                setHabits(data)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const showToast = (message, points = null, isError = false) => {
        setToast({ message, points, isError })
        setTimeout(() => setToast(null), 4000)
    }

    const handleAddHabit = async (e) => {
        e.preventDefault()
        try {
            const res = await fetch('/api/operations/habits', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newHabit)
            })
            if (res.ok) {
                setIsAddMode(false)
                setNewHabit({ name: '', frequency: 'daily', points_reward: 30 })
                fetchHabits()
                showToast('规范动作已录入系统指令库')
            }
        } catch (err) {
            console.error(err)
        }
    }

    const handleCheckin = async (id, name, points) => {
        try {
            const res = await fetch(`/api/operations/habits/${id}/checkin`, { method: 'POST' })
            const data = await res.json()
            if (res.ok) {
                showToast(`[${name}] 交付成功`, data.points_earned)
                fetchHabits()
            } else {
                showToast(data.error || '执行认证失败', null, true)
            }
        } catch (err) {
            console.error(err)
            showToast('网络通信异常', null, true)
        }
    }

    if (loading) return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-corporate-accent" /></div>

    const longestStreak = Math.max(0, ...habits.map(h => h.current_streak))
    const doneToday = habits.filter(h => h.is_done_today).length
    const totalPotentialPoints = habits.reduce((sum, h) => sum + h.points_reward, 0)
    const pointsSecuredToday = habits.filter(h => h.is_done_today).reduce((sum, h) => sum + h.points_reward, 0)

    return (
        <div className="space-y-6 h-full flex flex-col relative">

            {/* Custom Toast Notification */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: -50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                        className={`fixed top-24 left-1/2 -translate-x-1/2 z-50 flex items-center p-4 rounded-xl shadow-2xl backdrop-blur-xl border ${toast.isError ? 'bg-red-500/20 border-red-500/30' : 'bg-emerald-500/20 border-emerald-500/30'}`}
                    >
                        {toast.isError ? <AlertCircle className="text-red-400 mr-3" size={24} /> : <CheckCircle className="text-emerald-400 mr-3" size={24} />}
                        <div>
                            <p className="text-white font-medium text-sm">{toast.message}</p>
                            {toast.points && (
                                <p className="text-emerald-300 text-xs font-mono mt-0.5 flex items-center">
                                    <Sparkles size={12} className="mr-1 inline" />
                                    资产注入: +{toast.points} PTS
                                </p>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* CEO Stats Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                <div className="bg-black/30 backdrop-blur-xl border border-white/5 rounded-2xl p-5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-corporate-primary/10 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700"></div>
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <p className="text-white/40 text-xs font-medium uppercase tracking-wider mb-1">系统运转连击巅峰</p>
                            <h3 className="text-3xl font-light text-white tracking-tight">{longestStreak} <span className="text-sm text-white/30">DAYS</span></h3>
                        </div>
                        <div className="p-2.5 bg-orange-500/10 rounded-xl border border-orange-500/20 text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.2)]">
                            <Flame size={20} />
                        </div>
                    </div>
                </div>

                <div className="bg-black/30 backdrop-blur-xl border border-white/5 rounded-2xl p-5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700"></div>
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <p className="text-white/40 text-xs font-medium uppercase tracking-wider mb-1">今日纪律执行率</p>
                            <h3 className="text-3xl font-light text-emerald-400 tracking-tight">
                                {habits.length > 0 ? Math.round((doneToday / habits.length) * 100) : 0}<span className="text-xl text-emerald-400/50">%</span>
                            </h3>
                        </div>
                        <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400">
                            <Target size={20} />
                        </div>
                    </div>
                </div>

                <div className="bg-black/30 backdrop-blur-xl border border-white/5 rounded-2xl p-5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700"></div>
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <p className="text-white/40 text-xs font-medium uppercase tracking-wider mb-1">常规收益捕获区</p>
                            <h3 className="text-3xl font-light text-purple-400 tracking-tight">{pointsSecuredToday} <span className="text-xl text-purple-400/30">/ {totalPotentialPoints}</span></h3>
                        </div>
                        <div className="p-2.5 bg-purple-500/10 rounded-xl border border-purple-500/20 text-purple-400">
                            <Sparkles size={20} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center px-1">
                <h3 className="text-lg font-medium text-white/80">规范化指令矩阵 <span className="text-sm text-white/30 ml-2 font-normal">SOP Elements</span></h3>
                <button onClick={() => setIsAddMode(!isAddMode)} className="flex items-center space-x-2 text-sm px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white transition-all backdrop-blur-sm">
                    <Plus size={16} /> <span>{isAddMode ? '关闭编排面板' : 'SOP 规则编排'}</span>
                </button>
            </div>

            <AnimatePresence>
                {isAddMode && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, scale: 0.95 }}
                        animate={{ opacity: 1, height: 'auto', scale: 1 }}
                        exit={{ opacity: 0, height: 0, scale: 0.95 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="bg-corporate-900/60 backdrop-blur-2xl rounded-2xl p-6 border border-white/10 shadow-2xl relative overflow-hidden shrink-0 origin-top"
                    >
                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-corporate-primary to-purple-500"></div>
                        <form onSubmit={handleAddHabit} className="flex flex-col md:flex-row gap-5 items-end">
                            <div className="flex-1 w-full">
                                <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">执行指令集名称</label>
                                <input type="text" required placeholder="如: 每日晨间系统自检 (早起喝水) / 夜间缓存清理 (睡前阅读)" value={newHabit.name} onChange={e => setNewHabit({ ...newHabit, name: e.target.value })} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 outline-none focus:border-corporate-primary transition-colors focus:bg-black/40" />
                            </div>
                            <div className="w-full md:w-56">
                                <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">周期产出净值 (PTS)</label>
                                <div className="relative">
                                    <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-500/50" size={16} />
                                    <input type="number" min="0" required placeholder="30" value={newHabit.points_reward} onChange={e => setNewHabit({ ...newHabit, points_reward: parseInt(e.target.value) || 0 })} className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-purple-400 font-mono outline-none focus:border-purple-500 transition-colors focus:bg-black/40" />
                                </div>
                            </div>
                            <div className="flex space-x-3 w-full md:w-auto mt-4 md:mt-0">
                                <button type="button" onClick={() => setIsAddMode(false)} className="px-5 py-3 rounded-xl text-sm text-white/50 hover:text-white hover:bg-white/5 transition-colors w-full md:w-auto">中止</button>
                                <button type="submit" className="bg-gradient-to-r from-corporate-primary to-corporate-accent hover:opacity-90 text-white font-medium py-3 px-8 rounded-xl shadow-lg shadow-corporate-primary/20 transition-all active:scale-95 w-full md:w-auto whitespace-nowrap">熔铸规则</button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <AnimatePresence>
                    {habits.map((habit, index) => {
                        const isDone = habit.is_done_today
                        return (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05, duration: 0.4 }}
                                key={habit.id}
                                className={`rounded-2xl p-6 border transition-all duration-500 relative overflow-hidden group backdrop-blur-xl ${isDone
                                        ? 'bg-emerald-500/5 border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.05)]'
                                        : 'bg-black/20 border-white/5 hover:border-white/20 hover:bg-white/5'
                                    }`}
                            >
                                {/* Background Deco */}
                                {isDone && (
                                    <motion.div
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 0.05 }}
                                        transition={{ duration: 0.6 }}
                                        className="absolute -bottom-10 -right-10 text-emerald-500 pointer-events-none"
                                    >
                                        <CheckCircle size={150} />
                                    </motion.div>
                                )}

                                <div className="flex justify-between items-start mb-6 relative z-10 w-full pr-8">
                                    <div>
                                        <h4 className={`font-semibold text-lg mb-2 leading-snug tracking-wide ${isDone ? 'text-emerald-400' : 'text-white/90'}`}>
                                            {habit.name}
                                        </h4>
                                        <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-mono">
                                            <Sparkles size={12} className="mr-1.5" />
                                            <span>收益预估: +{habit.points_reward} PTS</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mt-8 relative z-10">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-white/30 uppercase tracking-widest mb-1">连击热度</span>
                                        <div className="flex items-center space-x-1">
                                            <Flame size={20} className={habit.current_streak > 0 ? 'text-orange-500' : 'text-white/20'} />
                                            <span className={`font-mono text-xl tracking-tight font-light ${habit.current_streak > 0 ? 'text-orange-400' : 'text-white/30'}`}>
                                                {habit.current_streak} <span className="text-xs text-white/30 ml-0.5">d</span>
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleCheckin(habit.id, habit.name, habit.points_reward)}
                                        disabled={isDone}
                                        className={`px-5 py-2.5 rounded-xl font-medium flex items-center transition-all duration-300 shadow-lg ${isDone
                                                ? 'bg-emerald-500/10 text-emerald-500 cursor-not-allowed border border-emerald-500/20 shadow-none'
                                                : 'bg-white/10 border border-white/10 hover:border-white/30 hover:bg-white/20 text-white/90 active:scale-95 backdrop-blur-md'
                                            }`}
                                    >
                                        {isDone ? (
                                            <>
                                                <CheckCircle size={16} className="mr-2" />
                                                <span>已交收</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>人工强制核验</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        )
                    })}
                </AnimatePresence>

                {habits.length === 0 && !isAddMode && (
                    <div className="col-span-full py-20 text-center border border-dashed border-white/10 bg-black/20 rounded-2xl backdrop-blur-sm">
                        <Flame size={48} className="mx-auto mb-4 text-white/10" />
                        <p className="font-medium text-white/50 mb-2">底层系统尚未装载任何行为规范引擎</p>
                        <p className="text-sm text-white/30">立即编排您的第一条自动化收益规则，启动成长飞轮。</p>
                    </div>
                )}
            </div>
        </div>
    )
}
