import { useState, useEffect } from 'react'
import { PieChart, Plus, AlertTriangle, Loader2, CheckCircle2 } from 'lucide-react'

import StatCard from '../../components/StatCard'

export default function Budget() {
    const [budgets, setBudgets] = useState([])
    const [expenses, setExpenses] = useState([])
    const [loading, setLoading] = useState(true)

    const [isAddMode, setIsAddMode] = useState(false)
    const [currentMonth] = useState(new Date().toISOString().slice(0, 7)) // YYYY-MM
    const [newBudget, setNewBudget] = useState({ category: '餐饮', amount_limit: '' })

    useEffect(() => {
        fetchBudgets()
    }, [currentMonth])

    const fetchBudgets = async () => {
        try {
            const res = await fetch(`/api/finance/budgets/${currentMonth}`)
            if (res.ok) {
                const data = await res.json()
                setBudgets(data.budgets)
                setExpenses(data.expenses)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleSetBudget = async (e) => {
        e.preventDefault()
        try {
            const res = await fetch('/api/finance/budgets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...newBudget, month: currentMonth })
            })
            if (res.ok) {
                setIsAddMode(false)
                setNewBudget({ category: '餐饮', amount_limit: '' })
                fetchBudgets()
            }
        } catch (err) {
            console.error(err)
        }
    }

    // Combine budgets with actual expenses map
    const expenseMap = expenses.reduce((acc, curr) => {
        acc[curr.category] = parseFloat(curr.spent)
        return acc
    }, {})

    // Calculate total budget vs total spent
    const totalBudget = budgets.reduce((sum, b) => sum + parseFloat(b.amount_limit), 0)
    const totalSpentThisMonth = Object.values(expenseMap).reduce((sum, spent) => sum + spent, 0)
    const budgetBalance = totalBudget - totalSpentThisMonth

    // Sort budgets by total limit descending
    const sortedBudgets = [...budgets].sort((a, b) => parseFloat(b.amount_limit) - parseFloat(a.amount_limit))

    if (loading) return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-corporate-accent" /></div>

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard icon={PieChart} title="本月总预算" value={`¥${totalBudget.toLocaleString()}`} color="blue" />
                <StatCard icon={AlertTriangle} title="本月总支出" value={`¥${totalSpentThisMonth.toLocaleString()}`} color="red" />
                <StatCard icon={CheckCircle2} title="预算余额" value={`¥${budgetBalance.toLocaleString()}`} color="green" />
            </div>

            {/* Total Budget Overview */}
            <div className="bg-corporate-800 rounded-xl p-6 border border-corporate-700 text-center">
                <div className="text-sm text-corporate-text-secondary mb-2">本月总预算消费进度</div>
                <div className="flex items-baseline justify-center space-x-2 mb-4">
                    <span className="text-4xl font-bold font-mono text-white">¥{totalSpentThisMonth.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</span>
                    <span className="text-corporate-text-secondary">/ ¥{totalBudget.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</span>
                </div>

                {/* Master Progress Bar */}
                <div className="w-full max-w-2xl mx-auto h-4 bg-corporate-900 rounded-full overflow-hidden border border-corporate-700">
                    <div
                        className={`h-full transition-all duration-1000 ${totalBudget === 0 ? 'bg-corporate-700 w-0' :
                                (totalSpentThisMonth / totalBudget) > 0.9 ? 'bg-corporate-danger' :
                                    (totalSpentThisMonth / totalBudget) > 0.7 ? 'bg-corporate-warning' :
                                        'bg-corporate-primary'
                            }`}
                        style={{ width: `${Math.min((totalBudget > 0 ? (totalSpentThisMonth / totalBudget) * 100 : 0), 100)}%` }}
                    ></div>
                </div>
            </div>

            {/* Budget Modal */}
            {isAddMode && (
                <div className="bg-corporate-800 rounded-xl p-5 border border-corporate-primary/50 shadow-lg relative overflow-hidden mb-6">
                    <div className="absolute top-0 left-0 w-1 h-full bg-corporate-primary"></div>
                    <form onSubmit={handleSetBudget} className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex-1 w-full">
                            <label className="block text-xs text-corporate-text-secondary mb-1">消费分类 (支持覆盖已有)</label>
                            <select required value={newBudget.category} onChange={e => setNewBudget({ ...newBudget, category: e.target.value })} className="w-full bg-corporate-900 border border-corporate-700 rounded-lg px-3 py-2.5 text-white outline-none focus:border-corporate-primary">
                                <option value="餐饮">餐饮</option>
                                <option value="交通">交通</option>
                                <option value="购物">购物</option>
                                <option value="居住">居住</option>
                                <option value="娱乐">娱乐</option>
                                <option value="全局">全局 (其他)</option>
                            </select>
                        </div>
                        <div className="flex-1 w-full">
                            <label className="block text-xs text-corporate-text-secondary mb-1">月度预算上限 (¥)</label>
                            <input type="number" min="0" required placeholder="例如: 2000" value={newBudget.amount_limit} onChange={e => setNewBudget({ ...newBudget, amount_limit: e.target.value })} className="w-full bg-corporate-900 border border-corporate-700 rounded-lg px-3 py-2.5 text-white outline-none focus:border-corporate-primary font-mono" />
                        </div>
                        <div className="flex space-x-3 w-full md:w-auto">
                            <button type="button" onClick={() => setIsAddMode(false)} className="px-4 py-2.5 hover:bg-corporate-700 rounded-lg text-sm transition text-corporate-text-secondary w-full md:w-auto">取消</button>
                            <button type="submit" className="btn-primary py-2.5 px-6 w-full md:w-auto">保存限额</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Individual Category Budgets */}
            <div className="space-y-4">
                {sortedBudgets.map(b => {
                    const spent = expenseMap[b.category] || 0;
                    const limit = parseFloat(b.amount_limit);
                    const ratio = limit > 0 ? spent / limit : 1;
                    const percent = Math.min(ratio * 100, 100);

                    const isDanger = ratio >= 0.9;
                    const isWarning = ratio >= 0.75 && ratio < 0.9;
                    const isSafe = ratio < 0.75;

                    return (
                        <div key={b.id} className={`bg-corporate-800 rounded-xl p-5 border transition-colors ${isDanger ? 'border-corporate-danger/50 bg-corporate-danger/5' : 'border-corporate-700 hover:border-corporate-600'}`}>
                            <div className="flex justify-between items-end mb-3">
                                <h4 className="font-bold text-lg flex items-center">
                                    {b.category}
                                    {isDanger && <AlertTriangle size={14} className="ml-2 text-corporate-danger" />}
                                    {isSafe && <CheckCircle2 size={14} className="ml-2 text-corporate-success" />}
                                </h4>
                                <div className="text-right">
                                    <div className="font-mono text-sm">
                                        <span className={isDanger ? 'text-corporate-danger font-bold' : 'text-white'}>¥{spent.toLocaleString()}</span>
                                        <span className="text-corporate-text-secondary"> / ¥{limit.toLocaleString()}</span>
                                    </div>
                                    <div className="text-xs text-corporate-text-secondary mt-1">
                                        剩余可用: ¥{Math.max(limit - spent, 0).toLocaleString()}
                                    </div>
                                </div>
                            </div>

                            {/* Linear Progress Bar */}
                            <div className="w-full h-2.5 bg-corporate-900 rounded-full overflow-hidden border border-corporate-700/50">
                                <div
                                    className={`h-full transition-all duration-1000 rounded-full ${isDanger ? 'bg-corporate-danger' :
                                            isWarning ? 'bg-corporate-warning' :
                                                'bg-corporate-success'
                                        }`}
                                    style={{ width: `${percent}%` }}
                                ></div>
                            </div>
                        </div>
                    )
                })}

                {budgets.length === 0 && !isAddMode && (
                    <div className="py-12 text-center text-corporate-text-secondary border border-dashed border-corporate-700 rounded-xl">
                        <PieChart size={32} className="mx-auto mb-2 opacity-50" />
                        <p>本月尚未设定任何预算管控</p>
                        <p className="text-sm mt-1">建立预算是控制开支的第一步</p>
                    </div>
                )}
            </div>
        </div>
    )
}
