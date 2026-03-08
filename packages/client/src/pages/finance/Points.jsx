import { useState, useEffect } from 'react'
import { Sparkles, Gift, Plus, Loader2, ArrowRight } from 'lucide-react'

import StatCard from '../../components/StatCard'

export default function Points() {
    const [pointsBalance, setPointsBalance] = useState(0)
    const [logs, setLogs] = useState([])
    const [wishlist, setWishlist] = useState([])
    const [loading, setLoading] = useState(true)

    const [isAddMode, setIsAddMode] = useState(false)
    const [newItem, setNewItem] = useState({ name: '', target_points: '' })

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const [pointsRes, wishlistRes] = await Promise.all([
                fetch('/api/finance/points'),
                fetch('/api/finance/wishlist')
            ])
            if (pointsRes.ok && wishlistRes.ok) {
                const pData = await pointsRes.json()
                const wData = await wishlistRes.json()
                setPointsBalance(pData.balance)
                setLogs(pData.logs)
                setWishlist(wData)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleAddItem = async (e) => {
        e.preventDefault()
        try {
            const res = await fetch('/api/finance/wishlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newItem)
            })
            if (res.ok) {
                setIsAddMode(false)
                setNewItem({ name: '', target_points: '' })
                fetchData()
            }
        } catch (err) {
            console.error(err)
        }
    }

    const handleRedeem = async (id, name, cost) => {
        if (!confirm(`确定要消耗 ${cost} 期权兑换【${name}】吗？兑换后期权将被扣除，请在现实中自费购买该物品。`)) return;

        try {
            const res = await fetch(`/api/finance/wishlist/${id}/redeem`, { method: 'POST' })
            if (res.ok) {
                fetchData() // Refresh points and wishlist
                alert('兑换成功！你的期权已扣除，快去现实中买下它吧！🎉')
            } else {
                const errData = await res.json()
                alert(errData.error || '兑换失败')
            }
        } catch (err) {
            console.error(err)
        }
    }

    if (loading) return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-corporate-accent" /></div>

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard icon={Sparkles} title="可用期权" value={pointsBalance.toLocaleString()} color="purple" />
                <StatCard icon={Gift} title="进行中心愿" value={wishlist.length} color="blue" />
                <StatCard icon={ArrowRight} title="最近变动" value={`${logs[0]?.amount > 0 ? '+' : ''}${logs[0]?.amount || 0}`} color="yellow" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Left: Wishlist (行权中心) */}
                <div className="bg-corporate-800 rounded-xl border border-corporate-700 overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-corporate-700 bg-corporate-900/50 flex justify-between items-center">
                        <h4 className="font-bold flex items-center"><Gift size={16} className="mr-2 text-corporate-accent" /> 心愿行权中心</h4>
                        <button onClick={() => setIsAddMode(!isAddMode)} className="text-xs flex items-center text-corporate-primary hover:text-white transition">
                            <Plus size={14} className="mr-1" /> 添加心愿
                        </button>
                    </div>

                    <div className="p-4 flex-1">
                        {isAddMode && (
                            <form onSubmit={handleAddItem} className="mb-4 bg-corporate-900 p-3 rounded-lg border border-corporate-700 flex flex-col gap-2">
                                <input type="text" required placeholder="想买什么东西？" value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} className="w-full bg-corporate-800 border border-corporate-700 rounded p-2 text-sm text-white outline-none focus:border-corporate-primary" />
                                <input type="number" required placeholder="它卖多少线？(目标期权数)" value={newItem.target_points} onChange={e => setNewItem({ ...newItem, target_points: e.target.value })} className="w-full bg-corporate-800 border border-corporate-700 rounded p-2 text-sm text-white outline-none focus:border-corporate-primary font-mono" />
                                <div className="flex justify-end space-x-2 mt-1">
                                    <button type="button" onClick={() => setIsAddMode(false)} className="px-3 py-1 hover:bg-corporate-700 rounded text-xs text-corporate-text-secondary">取消</button>
                                    <button type="submit" className="px-3 py-1 bg-corporate-primary hover:bg-corporate-primary-hover text-white rounded text-xs font-bold shadow">上架商品</button>
                                </div>
                            </form>
                        )}

                        <div className="space-y-4">
                            {wishlist.map(item => {
                                const target = parseInt(item.target_points)
                                const ratio = target > 0 ? pointsBalance / target : 1
                                const percent = Math.min(ratio * 100, 100)
                                const canRedeem = pointsBalance >= target

                                return (
                                    <div key={item.id} className="bg-corporate-900/50 rounded-lg p-4 border border-corporate-700 hover:border-corporate-primary/50 transition">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="font-bold text-sm text-white">{item.name}</div>
                                            <div className="font-mono text-sm text-corporate-text-secondary">
                                                <span className={canRedeem ? 'text-corporate-success font-bold' : ''}>{pointsBalance.toLocaleString()}</span>
                                                <span> / {target.toLocaleString()} 期权</span>
                                            </div>
                                        </div>

                                        <div className="w-full h-2 bg-corporate-800 rounded-full overflow-hidden mb-3">
                                            <div
                                                className={`h-full transition-all duration-1000 ${canRedeem ? 'bg-corporate-success' : 'bg-corporate-accent'}`}
                                                style={{ width: `${percent}%` }}
                                            ></div>
                                        </div>

                                        <div className="flex justify-between items-center text-xs">
                                            {canRedeem ? (
                                                <span className="text-corporate-success animate-pulse">已达到目标金额！</span>
                                            ) : (
                                                <span className="text-corporate-text-secondary">还差 {(target - pointsBalance).toLocaleString()} 期权</span>
                                            )}
                                            <button
                                                onClick={() => handleRedeem(item.id, item.name, target)}
                                                disabled={!canRedeem}
                                                className={`px-3 py-1.5 rounded flex items-center transition ${canRedeem
                                                        ? 'bg-corporate-success hover:bg-green-600 text-white font-bold cursor-pointer shadow-lg shadow-corporate-success/20'
                                                        : 'bg-corporate-800 text-corporate-text-secondary cursor-not-allowed border border-corporate-700'
                                                    }`}
                                            >
                                                {canRedeem ? '立即行权' : '金额不足'}
                                                {canRedeem && <ArrowRight size={14} className="ml-1" />}
                                            </button>
                                        </div>
                                    </div>
                                )
                            })}

                            {wishlist.length === 0 && !isAddMode && (
                                <div className="text-center py-10 text-corporate-text-secondary border border-dashed border-corporate-700 rounded-lg">
                                    <p className="text-sm">暂无心愿商品挂牌</p>
                                    <p className="text-xs mt-1">点击右上角添加你想要的东西作为努力的目标</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right: Points Logs (期权流水) */}
                <div className="bg-corporate-800 rounded-xl border border-corporate-700 overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-corporate-700 bg-corporate-900/50">
                        <h4 className="font-bold flex items-center text-corporate-text-secondary">期权获取日志库</h4>
                    </div>
                    <div className="divide-y divide-corporate-700 flex-1 overflow-y-auto max-h-[500px]">
                        {logs.map(log => {
                            const isEarned = log.amount > 0;
                            return (
                                <div key={log.id} className="p-3 flex items-center justify-between hover:bg-corporate-750 transition-colors">
                                    <div>
                                        <div className="text-sm text-white mb-0.5">{log.description || log.source}</div>
                                        <div className="text-xs text-corporate-text-secondary">{new Date(log.created_at).toLocaleString('zh-CN')}</div>
                                    </div>
                                    <div className={`font-mono font-bold ${isEarned ? 'text-corporate-accent' : 'text-corporate-danger'}`}>
                                        {isEarned ? '+' : ''}{log.amount}
                                    </div>
                                </div>
                            )
                        })}
                        {logs.length === 0 && (
                            <div className="p-8 text-center text-corporate-text-secondary text-sm">暂无期权变动记录</div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    )
}
