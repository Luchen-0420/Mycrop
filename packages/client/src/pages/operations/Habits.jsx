import { useState, useEffect } from 'react'
import { Plus, CheckCircle, Flame, Target, Loader2, Sparkles } from 'lucide-react'

import StatCard from '../../components/StatCard'

export default function Habits() {
    const [habits, setHabits] = useState([])
    const [loading, setLoading] = useState(true)
    const [isAddMode, setIsAddMode] = useState(false)
    const [newHabit, setNewHabit] = useState({ name: '', frequency: 'daily', points_reward: 30 })

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
                alert(`打卡成功！为财务部赚取了 💰 ${data.points_earned} 期权！`)
                fetchHabits()
            } else {
                alert(data.error || '打卡失败')
            }
        } catch (err) {
            console.error(err)
        }
    }

    if (loading) return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-corporate-accent" /></div>

    const longestStreak = Math.max(0, ...habits.map(h => h.current_streak))
    const doneToday = habits.filter(h => h.is_done_today).length

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard icon={Target} title="习惯总数" value={habits.length} color="blue" />
                <StatCard icon={Flame} title="最长连击" value={`${longestStreak} 天`} color="red" />
                <StatCard icon={CheckCircle} title="今日完成" value={`${doneToday} / ${habits.length}`} color="green" />
            </div>

            <div className="flex justify-end">
                <button onClick={() => setIsAddMode(!isAddMode)} className="btn-primary flex items-center space-x-2">
                    <Plus size={16} /> <span>定制新 SOP</span>
                </button>
            </div>

            {isAddMode && (
                <div className="bg-corporate-800 rounded-xl p-5 border border-corporate-primary/50 shadow-lg relative overflow-hidden mb-6">
                    <div className="absolute top-0 left-0 w-1 h-full bg-corporate-primary"></div>
                    <form onSubmit={handleAddHabit} className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex-1 w-full">
                            <label className="block text-xs text-corporate-text-secondary mb-1">规定动作名称</label>
                            <input type="text" required placeholder="如: 晚上23:30前睡觉 / 喝水2L" value={newHabit.name} onChange={e => setNewHabit({ ...newHabit, name: e.target.value })} className="w-full bg-corporate-900 border border-corporate-700 rounded-lg px-3 py-2.5 text-white outline-none focus:border-corporate-primary" />
                        </div>
                        <div className="w-full md:w-48">
                            <label className="block text-xs text-corporate-text-secondary mb-1">奖励期权 (系统工资)</label>
                            <input type="number" min="0" required placeholder="如: 30" value={newHabit.points_reward} onChange={e => setNewHabit({ ...newHabit, points_reward: parseInt(e.target.value) })} className="w-full bg-corporate-900 border border-corporate-700 rounded-lg px-3 py-2.5 text-white outline-none focus:border-corporate-primary font-mono" />
                        </div>
                        <div className="flex space-x-3 w-full md:w-auto">
                            <button type="button" onClick={() => setIsAddMode(false)} className="px-4 py-2.5 hover:bg-corporate-700 rounded-lg text-sm transition text-corporate-text-secondary w-full md:w-auto">取消</button>
                            <button type="submit" className="btn-primary py-2.5 px-6 w-full md:w-auto shadow">录入</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {habits.map(habit => {
                    const isDone = habit.is_done_today
                    return (
                        <div key={habit.id} className={`rounded-xl p-5 border transition-all duration-300 relative overflow-hidden group ${isDone
                                ? 'bg-corporate-success/5 border-corporate-success/30 shadow-[0_0_15px_rgba(16,185,129,0.05)]'
                                : 'bg-corporate-800 border-corporate-700 hover:border-corporate-500'
                            }`}>

                            {/* Background Deco */}
                            {isDone && (
                                <div className="absolute -bottom-8 -right-8 opacity-5">
                                    <CheckCircle size={120} />
                                </div>
                            )}

                            <div className="flex justify-between items-start mb-4 relative z-10">
                                <div>
                                    <h4 className={`font-bold text-lg mb-1 leading-snug pr-4 ${isDone ? 'text-corporate-success' : 'text-white'}`}>
                                        {habit.name}
                                    </h4>
                                    <div className="text-xs text-corporate-text-secondary flex items-center">
                                        <Sparkles size={12} className="mr-1 text-corporate-primary" />
                                        <span>打卡奖励: +{habit.points_reward} 期权</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mt-6 relative z-10">

                                <div className="flex items-center space-x-1">
                                    <Flame size={18} className={habit.current_streak > 0 ? 'text-corporate-danger' : 'text-corporate-700'} />
                                    <span className={`font-mono text-xl font-bold ${habit.current_streak > 0 ? 'text-white' : 'text-corporate-text-secondary'}`}>
                                        {habit.current_streak}
                                    </span>
                                    <span className="text-xs text-corporate-text-secondary ml-1">天连击</span>
                                </div>

                                <button
                                    onClick={() => handleCheckin(habit.id, habit.name, habit.points_reward)}
                                    disabled={isDone}
                                    className={`px-4 py-2 rounded-lg font-bold flex items-center transition-all ${isDone
                                            ? 'bg-corporate-success/20 text-corporate-success cursor-not-allowed border border-corporate-success/20'
                                            : 'bg-corporate-900 border border-corporate-700 hover:border-corporate-primary hover:bg-corporate-primary hover:text-white text-corporate-text-secondary shadow-sm'
                                        }`}
                                >
                                    {isDone ? (
                                        <>
                                            <CheckCircle size={16} className="mr-1.5" />
                                            <span>今日已达成</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>立即打卡 / Check in</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )
                })}

                {habits.length === 0 && !isAddMode && (
                    <div className="col-span-full py-16 text-center text-corporate-text-secondary border-2 border-dashed border-corporate-700 bg-corporate-800/50 rounded-xl">
                        <Flame size={40} className="mx-auto mb-3 opacity-30 text-corporate-accent" />
                        <p className="font-bold text-white/70 mb-1">没有任何必须执行的规范动作</p>
                        <p className="text-sm">真正的自由源于极度的自律！马上定制你的第一条习惯吧。</p>
                    </div>
                )}
            </div>

        </div>
    )
}
