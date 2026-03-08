import { useState } from 'react'
import { HeartPulse, Plus, Utensils, Dumbbell, Moon, Activity, Scale, Ruler } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import PageHeader from '../components/PageHeader'
import StatCard from '../components/StatCard'

const weightData = [
    { date: '1/1', weight: 75.2 }, { date: '1/8', weight: 74.8 },
    { date: '1/15', weight: 74.5 }, { date: '1/22', weight: 74.1 },
    { date: '2/1', weight: 73.6 }, { date: '2/8', weight: 73.8 },
    { date: '2/15', weight: 73.2 }, { date: '2/22', weight: 72.9 },
]

const meals = [
    { meal: '早餐', items: '全麦面包 + 鸡蛋 + 牛奶', cal: 420, time: '07:30' },
    { meal: '午餐', items: '鸡胸肉 + 糙米 + 西蓝花', cal: 580, time: '12:00' },
    { meal: '晚餐', items: '三文鱼沙拉 + 杂粮粥', cal: 450, time: '18:30' },
]

const workouts = [
    { date: '2/24', type: '胸部训练', duration: '55min', cals: 320 },
    { date: '2/22', type: '跑步 5km', duration: '28min', cals: 380 },
    { date: '2/20', type: '背部训练', duration: '50min', cals: 290 },
    { date: '2/18', type: '腿部训练', duration: '60min', cals: 410 },
]

const checkups = [
    { date: '2025-12', item: '年度体检', result: '血脂偏高', status: 'warning' },
    { date: '2025-06', item: '口腔检查', result: '正常', status: 'ok' },
]

export default function Health() {
    const totalCal = meals.reduce((s, m) => s + m.cal, 0)

    return (
        <div>
            <PageHeader icon={HeartPulse} title="健康中心" subtitle="Medical & Diet — 身体监测与营养管理">
                <button className="flex items-center gap-2 px-4 py-2 bg-corp-accent hover:bg-corp-accent-light rounded-lg text-sm text-white transition">
                    <Plus size={16} /> 记录数据
                </button>
            </PageHeader>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard icon={Scale} title="当前体重" value="72.9kg" trend="down" trendValue="-2.3kg" color="green" />
                <StatCard icon={Ruler} title="BMI" value="22.1" subtitle="正常范围" color="blue" />
                <StatCard icon={Utensils} title="今日摄入" value={`${totalCal} kcal`} subtitle="目标 1800" color="yellow" />
                <StatCard icon={Moon} title="昨晚睡眠" value="7.5h" subtitle="23:10 入睡" color="purple" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="corp-card">
                    <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                        <Activity size={16} className="text-emerald-400" /> 体重趋势
                    </h3>
                    <ResponsiveContainer width="100%" height={220}>
                        <LineChart data={weightData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#2a2f4a" />
                            <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 12 }} />
                            <YAxis domain={['auto', 'auto']} tick={{ fill: '#64748b', fontSize: 12 }} />
                            <Tooltip contentStyle={{ background: '#1a1f36', border: '1px solid #2a2f4a', borderRadius: 8, color: '#e2e8f0' }} />
                            <Line type="monotone" dataKey="weight" stroke="#22c55e" strokeWidth={2} dot={{ r: 4, fill: '#22c55e' }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="corp-card">
                    <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                        <Utensils size={16} className="text-amber-400" /> 今日膳食
                    </h3>
                    <div className="space-y-3">
                        {meals.map((m) => (
                            <div key={m.meal} className="flex items-center justify-between p-3 rounded-lg bg-corp-bg/50 border border-corp-border">
                                <div>
                                    <span className="text-xs text-corp-muted">{m.time}</span>
                                    <p className="text-sm text-white font-medium">{m.meal}</p>
                                    <p className="text-xs text-corp-muted">{m.items}</p>
                                </div>
                                <span className="text-sm font-mono text-amber-400">{m.cal} kcal</span>
                            </div>
                        ))}
                        <div className="flex justify-between pt-2 border-t border-corp-border">
                            <span className="text-sm text-corp-muted">合计</span>
                            <span className="text-sm font-mono font-semibold text-amber-400">{totalCal} kcal</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="corp-card">
                    <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                        <Dumbbell size={16} className="text-blue-400" /> 近期运动记录
                    </h3>
                    <div className="space-y-2">
                        {workouts.map((w, i) => (
                            <div key={i} className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-white/[.03] transition">
                                <div className="flex items-center gap-3">
                                    <Dumbbell size={16} className="text-corp-muted" />
                                    <div>
                                        <p className="text-sm text-corp-text">{w.type}</p>
                                        <p className="text-xs text-corp-muted">{w.date} · {w.duration}</p>
                                    </div>
                                </div>
                                <span className="text-xs font-mono text-corp-muted">{w.cals} kcal</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="corp-card">
                    <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                        <HeartPulse size={16} className="text-red-400" /> 体检档案
                    </h3>
                    <div className="space-y-2">
                        {checkups.map((c, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-corp-bg/50 border border-corp-border">
                                <div>
                                    <p className="text-sm text-corp-text">{c.item}</p>
                                    <p className="text-xs text-corp-muted">{c.date}</p>
                                </div>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${c.status === 'ok' ? 'text-emerald-400 bg-emerald-400/10' : 'text-amber-400 bg-amber-400/10'
                                    }`}>{c.result}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
