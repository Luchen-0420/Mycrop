import { useState, useEffect } from 'react'
import { Plus, Gift as GiftIcon, ArrowDownCircle, ArrowUpCircle, TrendingUp, Loader2 } from 'lucide-react'

export default function Gifts() {
    const [gifts, setGifts] = useState([])
    const [contacts, setContacts] = useState([])
    const [loading, setLoading] = useState(true)
    const [isAddMode, setIsAddMode] = useState(false)
    const [newGift, setNewGift] = useState({ contact_id: '', direction: 'given', item_name: '', value: '', date: new Date().toISOString().split('T')[0], notes: '' })

    // KPIs
    const [totalReceived, setTotalReceived] = useState(0)
    const [totalGiven, setTotalGiven] = useState(0)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const [gRes, cRes] = await Promise.all([
                fetch('/api/pr/gifts'),
                fetch('/api/pr/contacts')
            ])
            if (gRes.ok && cRes.ok) {
                const giftsData = await gRes.json()
                setGifts(giftsData)
                setContacts(await cRes.json())

                // Calc
                let given = 0; let received = 0;
                giftsData.forEach(g => {
                    const val = parseFloat(g.value) || 0;
                    if (g.direction === 'given') given += val;
                    if (g.direction === 'received') received += val;
                })
                setTotalGiven(given)
                setTotalReceived(received)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleAddGift = async (e) => {
        e.preventDefault()
        try {
            const res = await fetch('/api/pr/gifts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newGift)
            })
            if (res.ok) {
                setIsAddMode(false)
                setNewGift({ contact_id: '', direction: 'given', item_name: '', value: '', date: new Date().toISOString().split('T')[0], notes: '' })
                fetchData() // re-fetch to rebuild lists and KPIs
            }
        } catch (err) {
            console.error(err)
        }
    }

    if (loading) return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-corp-accent" /></div>

    const netWorth = totalReceived - totalGiven;

    return (
        <div className="space-y-6">

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-corp-surface rounded-xl p-5 border border-corp-border shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-medium text-corp-muted">历史送出估值额</span>
                        <ArrowUpCircle className="text-corp-danger opacity-80" size={18} />
                    </div>
                    <div className="text-2xl font-black font-mono text-white">¥ {totalGiven.toFixed(2)}</div>
                </div>
                <div className="bg-corp-surface rounded-xl p-5 border border-corp-border shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-medium text-corp-muted">历史收礼估值额</span>
                        <ArrowDownCircle className="text-corp-success opacity-80" size={18} />
                    </div>
                    <div className="text-2xl font-black font-mono text-white">¥ {totalReceived.toFixed(2)}</div>
                </div>
                <div className={`rounded-xl p-5 border shadow-sm ${netWorth >= 0 ? 'bg-corp-success/10 border-corp-success/30' : 'bg-corp-danger/10 border-corp-danger/30'}`}>
                    <div className="flex justify-between items-start mb-2">
                        <span className={`text-sm font-medium ${netWorth >= 0 ? 'text-corp-success' : 'text-corp-danger'}`}>人情净敞口 (收到 - 送出)</span>
                        <TrendingUp className={netWorth >= 0 ? 'text-corp-success' : 'text-corp-danger'} size={18} />
                    </div>
                    <div className={`text-2xl font-black font-mono ${netWorth >= 0 ? 'text-corp-success' : 'text-corp-danger'}`}>
                        {netWorth > 0 ? '+' : ''}¥ {netWorth.toFixed(2)}
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center border-b border-corp-border pb-4 pt-4">
                <h3 className="text-xl font-bold flex items-center text-white"><GiftIcon className="mr-2 text-corp-muted" size={20} /> 人情账本明细</h3>
                <button onClick={() => setIsAddMode(!isAddMode)} className="btn-primary flex items-center space-x-2">
                    <Plus size={16} /> <span>记一笔礼尚往来</span>
                </button>
            </div>

            {isAddMode && (
                <div className="bg-corp-surface rounded-xl p-5 border border-corp-accent/50 shadow-lg relative overflow-hidden mb-6">
                    <div className="absolute top-0 left-0 w-1 h-full bg-corp-accent"></div>
                    <form onSubmit={handleAddGift} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                        <div className="lg:col-span-1">
                            <label className="block text-xs text-corp-muted mb-1">流向</label>
                            <div className="flex p-0.5 bg-corp-bg border border-corp-border rounded-lg">
                                <button type="button" onClick={() => setNewGift({ ...newGift, direction: 'given' })} className={`flex-1 text-sm py-1.5 rounded-md transition ${newGift.direction === 'given' ? 'bg-corp-danger/20 text-corp-danger shadow-sm border border-corp-danger/30' : 'text-corp-muted hover:text-white'}`}>送出</button>
                                <button type="button" onClick={() => setNewGift({ ...newGift, direction: 'received' })} className={`flex-1 text-sm py-1.5 rounded-md transition ${newGift.direction === 'received' ? 'bg-corp-success/20 text-corp-success shadow-sm border border-corp-success/30' : 'text-corp-muted hover:text-white'}`}>收到</button>
                            </div>
                        </div>

                        <div className="lg:col-span-1">
                            <label className="block text-xs text-corp-muted mb-1">相关人脉</label>
                            <select required value={newGift.contact_id} onChange={e => setNewGift({ ...newGift, contact_id: e.target.value })} className="w-full bg-corp-bg border border-corp-border rounded-lg px-3 py-2.5 text-white outline-none focus:border-corp-accent text-sm">
                                <option value="" disabled>选择关系人...</option>
                                {contacts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>

                        <div className="lg:col-span-2">
                            <label className="block text-xs text-corp-muted mb-1">礼品规格名称</label>
                            <input type="text" required placeholder="例如: 飞天茅台一对 / 中秋美心月饼" value={newGift.item_name} onChange={e => setNewGift({ ...newGift, item_name: e.target.value })} className="w-full bg-corp-bg border border-corp-border rounded-lg px-3 py-2.5 text-white outline-none focus:border-corp-accent text-sm" />
                        </div>

                        <div className="lg:col-span-1">
                            <label className="block text-xs text-corp-muted mb-1">估算金额 (RMB)</label>
                            <input type="number" min="0" step="0.01" required placeholder="0.00" value={newGift.value} onChange={e => setNewGift({ ...newGift, value: parseFloat(e.target.value) })} className="w-full bg-corp-bg border border-corp-border rounded-lg px-3 py-2.5 text-white outline-none focus:border-corp-accent text-sm font-mono text-right" />
                        </div>

                        <div className="lg:col-span-1">
                            <label className="block text-xs text-corp-muted mb-1">发生日期</label>
                            <input type="date" required value={newGift.date} onChange={e => setNewGift({ ...newGift, date: e.target.value })} className="w-full bg-corp-bg border border-corp-border rounded-lg px-3 py-2.5 text-white outline-none focus:border-corp-accent text-sm font-mono" />
                        </div>

                        <div className="lg:col-span-2">
                            <label className="block text-xs text-corp-muted mb-1">附加备忘录</label>
                            <div className="flex gap-2">
                                <input type="text" placeholder="对方回礼还是首单？有什么讲究？" value={newGift.notes} onChange={e => setNewGift({ ...newGift, notes: e.target.value })} className="w-full bg-corp-bg border border-corp-border rounded-lg px-3 py-2.5 text-white outline-none focus:border-corp-accent text-sm" />
                                <button type="button" onClick={() => setIsAddMode(false)} className="px-3 py-2 hover:bg-corp-border rounded-lg text-sm transition text-corp-muted flex-shrink-0">取消</button>
                                <button type="submit" className="btn-primary py-2 px-6 shadow flex-shrink-0">入账</button>
                            </div>
                        </div>

                    </form>
                </div>
            )}

            {/* List */}
            <div className="bg-corp-bg/40 rounded-xl border border-corp-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-corp-surface text-corp-muted border-b border-corp-border">
                            <tr>
                                <th className="px-4 py-3 font-medium">方向</th>
                                <th className="px-4 py-3 font-medium">关系人</th>
                                <th className="px-4 py-3 font-medium">物品名称</th>
                                <th className="px-4 py-3 font-medium text-right">金额估值(元)</th>
                                <th className="px-4 py-3 font-medium">发生日期</th>
                                <th className="px-4 py-3 font-medium">备注</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-corp-border/50 text-white">
                            {gifts.map(gift => (
                                <tr key={gift.id} className="hover:bg-corp-surface/50 transition">
                                    <td className="px-4 py-3">
                                        {gift.direction === 'given' ? (
                                            <span className="inline-flex items-center text-xs font-bold px-2 py-0.5 rounded bg-corp-danger/10 text-corp-danger border border-corp-danger/20">
                                                <ArrowUpCircle size={12} className="mr-1" /> 送出 (Given)
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center text-xs font-bold px-2 py-0.5 rounded bg-corp-success/10 text-corp-success border border-corp-success/20">
                                                <ArrowDownCircle size={12} className="mr-1" /> 收到 (Received)
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 font-bold">{gift.contact_name}</td>
                                    <td className="px-4 py-3 text-white/90">{gift.item_name}</td>
                                    <td className={`px-4 py-3 text-right font-mono font-bold ${gift.direction === 'given' ? 'text-corp-danger' : 'text-corp-success'}`}>
                                        {gift.direction === 'given' ? '-' : '+'}{parseFloat(gift.value).toFixed(2)}
                                    </td>
                                    <td className="px-4 py-3 text-xs font-mono text-corp-muted">
                                        {new Date(gift.date).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-3 text-xs text-corp-muted max-w-xs truncate" title={gift.notes}>
                                        {gift.notes || '-'}
                                    </td>
                                </tr>
                            ))}
                            {gifts.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-4 py-12 text-center text-corp-muted">
                                        没有任何人情往来账目记录。
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    )
}
