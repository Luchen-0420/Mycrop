import { useState, useEffect } from 'react'
import { Heart, Activity, Moon, Coffee, Sparkles, Plus, Loader2 } from 'lucide-react'

// Helper to generate last N days
const getLastNDays = (n) => {
    const dates = []
    for (let i = n - 1; i >= 0; i--) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        dates.push(d.toISOString().split('T')[0])
    }
    return dates
}

export default function Wellness() {
    const [logs, setLogs] = useState([])
    const [loading, setLoading] = useState(true)
    const [todayLog, setTodayLog] = useState({
        stress_level: 5,
        mood: 'calm',
        sleep_quality: 7,
        notes: ''
    })

    const todayStr = new Date().toISOString().split('T')[0]

    useEffect(() => {
        fetchLogs()
    }, [])

    const fetchLogs = async () => {
        try {
            const res = await fetch('/api/hr/wellness/logs')
            if (res.ok) {
                const data = await res.json()
                setLogs(data)

                // See if we already logged today
                const found = data.find(l => l.record_date.startsWith(todayStr))
                if (found) {
                    setTodayLog({
                        stress_level: found.stress_level,
                        mood: found.mood,
                        sleep_quality: found.sleep_quality,
                        notes: found.notes || ''
                    })
                }
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmitToday = async (e) => {
        e.preventDefault()
        try {
            const res = await fetch('/api/hr/wellness/logs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...todayLog, record_date: todayStr })
            })
            if (res.ok) {
                fetchLogs()
                alert('今日状态已记录')
            }
        } catch (err) {
            console.error(err)
        }
    }

    const moods = [
        { id: 'happy', icon: Sparkles, label: '充满活力', color: 'text-corporate-success' },
        { id: 'calm', icon: Coffee, label: '平静稳定', color: 'text-corporate-primary' },
        { id: 'tired', icon: Moon, label: '疲惫消耗', color: 'text-corporate-warning' },
        { id: 'stressed', icon: Activity, label: '焦虑高压', color: 'text-corporate-danger' },
    ]

    // Calendar Heatmap data points
    const last14Days = getLastNDays(14)

    if (loading) return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-corporate-accent" /></div>

    return (
        <div className="space-y-6">



            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Check-in Form */}
                <div className="lg:col-span-1 bg-corporate-800 rounded-xl p-6 border border-corporate-700">
                    <h4 className="font-bold mb-4">今日状态打卡</h4>
                    <form onSubmit={handleSubmitToday} className="space-y-6">

                        {/* Mood Selection */}
                        <div>
                            <label className="block text-sm font-medium text-corporate-text-secondary mb-3">当下的主导情绪</label>
                            <div className="grid grid-cols-2 gap-3">
                                {moods.map(m => {
                                    const Icon = m.icon
                                    const isActive = todayLog.mood === m.id
                                    return (
                                        <button
                                            key={m.id}
                                            type="button"
                                            onClick={() => setTodayLog({ ...todayLog, mood: m.id })}
                                            className={`flex flex-col items-center justify-center p-3 rounded-lg border transition ${isActive ? 'bg-corporate-900 border-corporate-primary' : 'bg-corporate-900 border-corporate-700 hover:border-corporate-600'}`}
                                        >
                                            <Icon size={24} className={`${isActive ? m.color : 'text-corporate-text-secondary'} mb-2`} />
                                            <span className="text-xs font-medium">{m.label}</span>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Stress Level */}
                        <div>
                            <div className="flex justify-between text-sm font-medium text-corporate-text-secondary mb-2">
                                <label>压力指数</label>
                                <span>{todayLog.stress_level} / 10</span>
                            </div>
                            <input
                                type="range" min="1" max="10"
                                value={todayLog.stress_level}
                                onChange={(e) => setTodayLog({ ...todayLog, stress_level: parseInt(e.target.value) })}
                                className="w-full accent-corporate-danger h-2 bg-corporate-900 rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="flex justify-between text-xs text-corporate-text-secondary mt-1">
                                <span>非常轻松</span>
                                <span>承受极限</span>
                            </div>
                        </div>

                        {/* Sleep Quality */}
                        <div>
                            <div className="flex justify-between text-sm font-medium text-corporate-text-secondary mb-2">
                                <label>昨晚睡眠质量</label>
                                <span>{todayLog.sleep_quality} / 10</span>
                            </div>
                            <input
                                type="range" min="1" max="10"
                                value={todayLog.sleep_quality}
                                onChange={(e) => setTodayLog({ ...todayLog, sleep_quality: parseInt(e.target.value) })}
                                className="w-full accent-corporate-primary h-2 bg-corporate-900 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>

                        {/* Notes */}
                        <div>
                            <label className="block text-sm font-medium text-corporate-text-secondary mb-2">想对"自己这位员工"说什么？</label>
                            <textarea
                                rows="3"
                                className="w-full bg-corporate-900 border border-corporate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-corporate-primary focus:outline-none"
                                placeholder="例如：连续加班三天了，今晚一定要休息……"
                                value={todayLog.notes}
                                onChange={(e) => setTodayLog({ ...todayLog, notes: e.target.value })}
                            ></textarea>
                        </div>

                        <button type="submit" className="w-full btn-primary">提交今日记录</button>
                    </form>
                </div>

                {/* History & Insights */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Insights Card */}
                    <div className="bg-corporate-800 rounded-xl p-6 border border-corporate-700">
                        <h4 className="font-bold mb-4">AI 关怀建议</h4>
                        <div className="p-4 bg-corporate-danger/10 border border-corporate-danger/20 rounded-lg">
                            <div className="flex items-start space-x-3">
                                <Activity className="text-corporate-danger shrink-0 mt-0.5" size={20} />
                                <div>
                                    <h5 className="font-bold text-corporate-danger">压力阈值预警</h5>
                                    <p className="text-sm mt-1 text-corporate-text-secondary">
                                        基于记录，你在过去 7 天中有 4 天压力指数超过 8。作为 CEO，我是不是把员工压榨得太狠了？建议给自己批半天假去吃顿好的。
                                    </p>
                                    <button className="mt-3 px-3 py-1.5 bg-corporate-danger/20 text-corporate-danger text-xs font-bold rounded hover:bg-corporate-danger/30 transition">
                                        去财务部申请"休假补助"
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Heatmap / Trends (Simplified for MVP) */}
                    <div className="bg-corporate-800 rounded-xl p-6 border border-corporate-700">
                        <h4 className="font-bold mb-4">近期压力热力图</h4>
                        <div className="flex space-x-2 overflow-x-auto pb-2">
                            {last14Days.map(dateStr => {
                                const log = logs.find(l => l.record_date.startsWith(dateStr))
                                const dayStr = dateStr.split('-').slice(1).join('/')

                                let bgColor = 'bg-corporate-900' // no data
                                if (log) {
                                    if (log.stress_level <= 3) bgColor = 'bg-corporate-success'
                                    else if (log.stress_level <= 6) bgColor = 'bg-corporate-primary'
                                    else if (log.stress_level <= 8) bgColor = 'bg-corporate-warning'
                                    else bgColor = 'bg-corporate-danger'
                                }

                                return (
                                    <div key={dateStr} className="flex flex-col items-center flex-shrink-0">
                                        <div
                                            className={`w-10 h-10 rounded-lg \${bgColor} border border-corporate-700 flex items-center justify-center text-xs font-bold text-white shadow-inner opacity-80`}
                                            title={`\${dateStr}: 压力 \${log?.stress_level || '无记录'}`}
                                        >
                                            {log?.stress_level || '-'}
                                        </div>
                                        <div className="text-[10px] text-corporate-text-secondary mt-1">{dayStr}</div>
                                    </div>
                                )
                            })}
                        </div>
                        <div className="flex justify-end items-center mt-4 space-x-3 text-xs text-corporate-text-secondary">
                            <span>低压</span>
                            <div className="flex space-x-1">
                                <div className="w-3 h-3 rounded-sm bg-corporate-success"></div>
                                <div className="w-3 h-3 rounded-sm bg-corporate-primary"></div>
                                <div className="w-3 h-3 rounded-sm bg-corporate-warning"></div>
                                <div className="w-3 h-3 rounded-sm bg-corporate-danger"></div>
                            </div>
                            <span>高压</span>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    )
}
