import { useState, useEffect } from 'react'
import { Repeat, Plus, Loader2, CalendarClock } from 'lucide-react'

import StatCard from '../../components/StatCard'

export default function Subscriptions() {
    const [subscriptions, setSubscriptions] = useState([])
    const [loading, setLoading] = useState(true)
    const [isAddMode, setIsAddMode] = useState(false)
    const [newSub, setNewSub] = useState({ name: '', amount: '', billing_cycle: 'monthly', next_billing_date: new Date().toISOString().split('T')[0], category: '网络服务' })

    useEffect(() => {
        fetchSubscriptions()
    }, [])

    const fetchSubscriptions = async () => {
        try {
            const res = await fetch('/api/finance/subscriptions')
            if (res.ok) {
                const data = await res.json()
                setSubscriptions(data)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleAddSub = async (e) => {
        e.preventDefault()
        try {
            const res = await fetch('/api/finance/subscriptions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newSub)
            })
            if (res.ok) {
                setIsAddMode(false)
                setNewSub({ name: '', amount: '', billing_cycle: 'monthly', next_billing_date: new Date().toISOString().split('T')[0], category: '网络服务' })
                fetchSubscriptions()
            }
        } catch (err) {
            console.error(err)
        }
    }

    // Calculators
    const monthlyCost = subscriptions.reduce((sum, sub) => {
        const amt = parseFloat(sub.amount)
        return sum + (sub.billing_cycle === 'yearly' ? amt / 12 : amt)
    }, 0)

    const yearlyCost = subscriptions.reduce((sum, sub) => {
        const amt = parseFloat(sub.amount)
        return sum + (sub.billing_cycle === 'monthly' ? amt * 12 : amt)
    }, 0)

    if (loading) return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-corporate-accent" /></div>

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard icon={Repeat} title="订阅总数" value={subscriptions.length} color="blue" />
                <StatCard icon={CalendarClock} title="预估月费" value={`¥${monthlyCost.toFixed(2)}`} color="yellow" />
                <StatCard icon={CalendarClock} title="预估年费" value={`¥${yearlyCost.toFixed(2)}`} color="purple" />
            </div>

            <button onClick={() => setIsAddMode(!isAddMode)} className="btn-primary flex items-center space-x-2">
                <Plus size={16} />
                <span>新增周期性扣费单</span>
            </button>

            {isAddMode && (
                <div className="bg-corporate-800 rounded-xl p-5 border border-corporate-primary/50 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-corporate-primary"></div>
                    <form onSubmit={handleAddSub} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs text-corporate-text-secondary mb-1">服务/账单名称</label>
                            <input type="text" required placeholder="如: Netflix, 自如房租" value={newSub.name} onChange={e => setNewSub({ ...newSub, name: e.target.value })} className="w-full bg-corporate-900 border border-corporate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-corporate-primary" />
                        </div>
                        <div>
                            <label className="block text-xs text-corporate-text-secondary mb-1">单期扣费金额 (¥)</label>
                            <input type="number" step="0.01" min="0" required placeholder="0.00" value={newSub.amount} onChange={e => setNewSub({ ...newSub, amount: e.target.value })} className="w-full bg-corporate-900 border border-corporate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-corporate-primary font-mono" />
                        </div>
                        <div>
                            <label className="block text-xs text-corporate-text-secondary mb-1">计费周期</label>
                            <select value={newSub.billing_cycle} onChange={e => setNewSub({ ...newSub, billing_cycle: e.target.value })} className="w-full bg-corporate-900 border border-corporate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-corporate-primary">
                                <option value="monthly">每月一扣 (Monthly)</option>
                                <option value="yearly">每年一扣 (Yearly)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs text-corporate-text-secondary mb-1">服务分类</label>
                            <input type="text" placeholder="如: 网络服务, 居住服务" value={newSub.category} onChange={e => setNewSub({ ...newSub, category: e.target.value })} className="w-full bg-corporate-900 border border-corporate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-corporate-primary" />
                        </div>
                        <div>
                            <label className="block text-xs text-corporate-text-secondary mb-1">下次扣费日</label>
                            <input type="date" required value={newSub.next_billing_date} onChange={e => setNewSub({ ...newSub, next_billing_date: e.target.value })} className="w-full bg-corporate-900 border border-corporate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-corporate-primary" />
                        </div>
                        <div className="flex items-end space-x-3 mt-4 lg:mt-0 lg:justify-end">
                            <button type="button" onClick={() => setIsAddMode(false)} className="px-4 py-2 hover:bg-corporate-700 rounded-lg text-sm text-corporate-text-secondary transition w-full lg:w-auto">取消</button>
                            <button type="submit" className="btn-primary py-2 px-6 w-full lg:w-auto">确认上条</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Subscriptions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {subscriptions.map(sub => {
                    const isYearly = sub.billing_cycle === 'yearly'
                    const nextDate = new Date(sub.next_billing_date)
                    const isUpcoming = (nextDate - new Date()) / (1000 * 60 * 60 * 24) <= 7 // Within 7 days

                    return (
                        <div key={sub.id} className={`bg-corporate-800 rounded-xl p-5 border transition-all ${isUpcoming ? 'border-corporate-warning/50 bg-corporate-warning/5 shadow-[0_0_15px_rgba(255,160,0,0.1)]' : 'border-corporate-700 hover:border-corporate-primary/30 hover:bg-corporate-750'}`}>
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="text-xs text-corporate-text-secondary px-2 py-0.5 bg-corporate-900 rounded inline-block mb-1 border border-corporate-700">
                                        {sub.category || '未分类'}
                                    </div>
                                    <h4 className="font-bold text-lg text-white">{sub.name}</h4>
                                </div>
                                <div className="text-right">
                                    <div className="font-mono text-xl font-bold text-white">¥{parseFloat(sub.amount).toLocaleString('zh-CN')}</div>
                                    <div className="text-xs text-corporate-text-secondary uppercase">/ {isYearly ? 'YR' : 'MO'}</div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-corporate-700/50">
                                <div className={`text-xs flex items-center ${isUpcoming ? 'text-corporate-warning font-bold' : 'text-corporate-text-secondary'}`}>
                                    <CalendarClock size={14} className="mr-1.5" />
                                    即将扣费: {nextDate.toLocaleDateString('zh-CN')}
                                </div>
                                {isUpcoming && <div className="w-2 h-2 rounded-full bg-corporate-warning animate-ping"></div>}
                            </div>
                        </div>
                    )
                })}

                {subscriptions.length === 0 && !isAddMode && (
                    <div className="col-span-full py-12 text-center text-corporate-text-secondary border border-dashed border-corporate-700 bg-corporate-800/50 rounded-xl">
                        <Repeat size={32} className="mx-auto mb-3 opacity-30" />
                        <p>名下暂无任何订阅服务扣费账单记录</p>
                    </div>
                )}
            </div>

        </div>
    )
}
