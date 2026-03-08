import { useState, useEffect } from 'react'
import { Wallet, ArrowUpRight, ArrowDownRight, Plus, Loader2, CreditCard, Landmark, PiggyBank, TrendingUp } from 'lucide-react'

import StatCard from '../../components/StatCard'

export default function Ledger() {
    const [accounts, setAccounts] = useState([])
    const [transactions, setTransactions] = useState([])
    const [loading, setLoading] = useState(true)
    const [isAddMode, setIsAddMode] = useState(false)
    const [newTx, setNewTx] = useState({ account_id: '', type: 'expense', amount: '', category: '餐饮', description: '', transaction_date: new Date().toISOString().split('T')[0] })

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const [accRes, txRes] = await Promise.all([
                fetch('/api/finance/accounts'),
                fetch('/api/finance/transactions?limit=20')
            ])
            if (accRes.ok && txRes.ok) {
                const accData = await accRes.json()
                const txData = await txRes.json()
                setAccounts(accData)
                setTransactions(txData)
                if (accData.length > 0) {
                    setNewTx(prev => ({ ...prev, account_id: accData[0].id }))
                }
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleAddTx = async (e) => {
        e.preventDefault()
        try {
            const res = await fetch('/api/finance/transactions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTx)
            })
            if (res.ok) {
                setIsAddMode(false)
                setNewTx({ ...newTx, amount: '', description: '' }) // keep date, account, type unchanged for rapid entry
                fetchData()
            }
        } catch (err) {
            console.error(err)
        }
    }

    const totalAssets = accounts.reduce((sum, acc) => sum + parseFloat(acc.balance), 0)
    const monthlyIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + parseFloat(t.amount), 0)
    const monthlyExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + parseFloat(t.amount), 0)

    const accountIconMap = {
        'cash': <Wallet size={18} />,
        'bank': <Landmark size={18} />,
        'credit': <CreditCard size={18} />,
        'investment': <TrendingUp size={18} />
    }

    if (loading) return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-corporate-accent" /></div>

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard icon={Wallet} title="净资产" value={`¥${totalAssets.toLocaleString()}`} color="blue" />
                <StatCard icon={ArrowUpRight} title="本月收入" value={`¥${monthlyIncome.toLocaleString()}`} color="green" />
                <StatCard icon={ArrowDownRight} title="本月支出" value={`¥${monthlyExpense.toLocaleString()}`} color="red" />
            </div>

            {/* Quick Add Form Context */}
            {isAddMode && (
                <div className="bg-corporate-800 rounded-xl p-5 border border-corporate-primary/50 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-corporate-primary"></div>
                    <h3 className="text-lg font-bold mb-4">记录收支明细</h3>
                    <form onSubmit={handleAddTx}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                                <label className="block text-xs text-corporate-text-secondary mb-1">交易类型</label>
                                <div className="flex rounded-lg overflow-hidden border border-corporate-700">
                                    <button type="button" onClick={() => setNewTx({ ...newTx, type: 'expense' })} className={`flex-1 py-2 text-sm font-medium transition ${newTx.type === 'expense' ? 'bg-corporate-danger text-white' : 'bg-corporate-900 text-corporate-text-secondary'}`}>支出</button>
                                    <button type="button" onClick={() => setNewTx({ ...newTx, type: 'income' })} className={`flex-1 py-2 text-sm font-medium transition ${newTx.type === 'income' ? 'bg-corporate-success text-white' : 'bg-corporate-900 text-corporate-text-secondary'}`}>收入</button>
                                    <button type="button" onClick={() => setNewTx({ ...newTx, type: 'transfer' })} className={`flex-1 py-2 text-sm font-medium transition ${newTx.type === 'transfer' ? 'bg-corporate-accent text-white' : 'bg-corporate-900 text-corporate-text-secondary'}`}>转账</button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs text-corporate-text-secondary mb-1">金额</label>
                                <input type="number" step="0.01" min="0" required placeholder="0.00" value={newTx.amount} onChange={e => setNewTx({ ...newTx, amount: e.target.value })} className="w-full bg-corporate-900 border border-corporate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-corporate-primary font-mono text-lg" />
                            </div>
                            <div>
                                <label className="block text-xs text-corporate-text-secondary mb-1">日期</label>
                                <input type="date" required value={newTx.transaction_date} onChange={e => setNewTx({ ...newTx, transaction_date: e.target.value })} className="w-full bg-corporate-900 border border-corporate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-corporate-primary" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                                <label className="block text-xs text-corporate-text-secondary mb-1">资金账户</label>
                                <select value={newTx.account_id} onChange={e => setNewTx({ ...newTx, account_id: e.target.value })} className="w-full bg-corporate-900 border border-corporate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-corporate-primary">
                                    {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name} (余额: {parseFloat(acc.balance).toFixed(0)})</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs text-corporate-text-secondary mb-1">分类</label>
                                <select value={newTx.category} onChange={e => setNewTx({ ...newTx, category: e.target.value })} className="w-full bg-corporate-900 border border-corporate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-corporate-primary">
                                    {newTx.type === 'expense' && ['餐饮', '交通', '购物', '居住', '娱乐', '人情', '其他'].map(c => <option key={c} value={c}>{c}</option>)}
                                    {newTx.type === 'income' && ['薪资', '奖金', '投资收益', '二手闲置', '其他'].map(c => <option key={c} value={c}>{c}</option>)}
                                    {newTx.type === 'transfer' && ['内部转账', '信用卡还款'].map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs text-corporate-text-secondary mb-1">备注说明</label>
                                <input type="text" placeholder="去哪花/赚了什么" value={newTx.description} onChange={e => setNewTx({ ...newTx, description: e.target.value })} className="w-full bg-corporate-900 border border-corporate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-corporate-primary" />
                            </div>
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button type="button" onClick={() => setIsAddMode(false)} className="px-4 py-2 hover:bg-corporate-700 rounded-lg text-sm text-corporate-text-secondary transition">取消</button>
                            <button type="submit" className="px-6 py-2 bg-corporate-primary hover:bg-corporate-primary-hover text-white rounded-lg text-sm font-bold transition shadow">确认记录</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Transactions List */}
            <div className="bg-corporate-800 rounded-xl border border-corporate-700 overflow-hidden">
                <div className="p-4 border-b border-corporate-700 bg-corporate-900/50">
                    <h4 className="font-bold flex items-center"><Wallet size={16} className="mr-2 text-corporate-text-secondary" /> 近期流水明细</h4>
                </div>
                <div className="divide-y divide-corporate-700">
                    {transactions.map(tx => {
                        const isIncome = tx.type === 'income'
                        const isExpense = tx.type === 'expense'
                        return (
                            <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-corporate-750 transition-colors">
                                <div className="flex items-center space-x-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isIncome ? 'bg-corporate-success/20 text-corporate-success' :
                                            isExpense ? 'bg-corporate-danger/20 text-corporate-danger' :
                                                'bg-corporate-accent/20 text-corporate-accent'
                                        }`}>
                                        {isIncome ? <ArrowUpRight size={20} /> : isExpense ? <ArrowDownRight size={20} /> : <Repeat size={20} />}
                                    </div>
                                    <div>
                                        <div className="font-bold text-white mb-0.5">{tx.category}</div>
                                        <div className="text-xs text-corporate-text-secondary flex items-center space-x-2">
                                            <span>{new Date(tx.transaction_date).toLocaleDateString()}</span>
                                            <span className="w-1 h-1 rounded-full bg-corporate-700"></span>
                                            <span>{tx.account_name}</span>
                                            {tx.description && (
                                                <>
                                                    <span className="w-1 h-1 rounded-full bg-corporate-700"></span>
                                                    <span className="truncate max-w-[150px]">{tx.description}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className={`font-mono font-bold text-lg ${isIncome ? 'text-corporate-success' :
                                        isExpense ? 'text-white' :
                                            'text-corporate-text-secondary'
                                    }`}>
                                    {isIncome ? '+' : isExpense ? '-' : ''}¥{parseFloat(tx.amount).toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                                </div>
                            </div>
                        )
                    })}

                    {transactions.length === 0 && (
                        <div className="p-12 text-center text-corporate-text-secondary">
                            没有近期交易流水记录
                        </div>
                    )}
                </div>
            </div>

        </div>
    )
}
