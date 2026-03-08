import { useState, useEffect } from 'react'
import { DollarSign, Plus, Filter, Download, X, Send } from 'lucide-react'
import StatCard from '../../components/StatCard'

function ExpenseModal({ isOpen, onClose, onSave, expense: initialExpense }) {
    const [expense, setExpense] = useState(initialExpense || { date: '', category: '', item: '', amount: '' })

    useEffect(() => {
        setExpense(initialExpense || { date: '', category: '', item: '', amount: '' })
    }, [initialExpense, isOpen])

    const handleChange = (e) => {
        const { name, value } = e.target
        setExpense(prev => ({ ...prev, [name]: value }))
    }

    const handleSave = () => {
        onSave(expense)
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-corp-surface p-6 rounded-lg w-full max-w-lg border border-corp-border">
                <h3 className="text-lg font-semibold text-white mb-4">{expense.id ? '编辑费用' : '添加费用'}</h3>
                <div className="space-y-4">
                    <input name="date" value={expense.date} onChange={handleChange} type="date" className="w-full bg-corp-bg" />
                    <input name="category" value={expense.category} onChange={handleChange} type="text" placeholder="类别 (如: 交通)" className="w-full bg-corp-bg" />
                    <input name="item" value={expense.item} onChange={handleChange} type="text" placeholder="项目 (如: 高铁票)" className="w-full bg-corp-bg" />
                    <input name="amount" value={expense.amount} onChange={handleChange} type="number" placeholder="金额" className="w-full bg-corp-bg" />
                </div>
                <div className="flex justify-end gap-3 mt-6">
                    <button onClick={onClose}>取消</button>
                    <button onClick={handleSave}>保存</button>
                </div>
            </div>
        </div>
    )
}

export default function TravelExpenses() {
    // ... (existing state and useEffect)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedExpense, setSelectedExpense] = useState(null)

    const handleSaveExpense = async (expense) => {
        // ... (API call logic)
        console.log("Saving expense:", expense)
        setIsModalOpen(false)
    }

    const [selectedIds, setSelectedIds] = useState(new Set())

    const handleSelectRow = (id) => {
        setSelectedIds(prev => {
            const newSet = new Set(prev)
            if (newSet.has(id)) {
                newSet.delete(id)
            } else {
                newSet.add(id)
            }
            return newSet
        })
    }

    const handlePushToFinance = async () => {
        const selectedExpenses = expenses.filter(exp => selectedIds.has(exp.id))
        if (selectedExpenses.length === 0) {
            return alert('请先选择需要推送的费用条目')
        }

        try {
            await fetch('/api/finance/transactions/batch', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ transactions: selectedExpenses }),
            })
            alert('费用已成功推送到财务部！')
            setSelectedIds(new Set()) // Clear selection
        } catch (error) {
            console.error("Failed to push to finance:", error)
        }
    }

    return (
        <div className="space-y-6">
            {/* ... StatCards ... */}
            <div className="corp-card">




                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-white">费用明细</h3>
                    <div className="flex items-center gap-2">
                        {/* ... Filter and Export buttons ... */}
                        <button onClick={handlePushToFinance} className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 rounded-lg text-sm text-white transition disabled:opacity-50" disabled={selectedIds.size === 0}>
                            <Send size={16} /> 推送到财务
                        </button>
                        <button onClick={() => { setSelectedExpense(null); setIsModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-corp-accent rounded-lg text-sm">
                            <Plus size={16} /> 添加费用
                        </button>
                    </div>
                </div>

                <table className="w-full text-sm">
                    <thead>
                        <tr>
                            <th scope="col" className="px-4 py-3 w-12"><input type="checkbox" /></th>
                            {/* ... other headers ... */}
                        </tr>
                    </thead>
                    <tbody>
                        {expenses.map(exp => (
                            <tr key={exp.id} className="border-b hover:bg-corp-surface">
                                <td className="px-4 py-3">
                                    <input type="checkbox" checked={selectedIds.has(exp.id)} onChange={() => handleSelectRow(exp.id)} />
                                </td>
                                {/* ... other cells ... */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <ExpenseModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSave={handleSaveExpense} 
                expense={selectedExpense} 
            />
        </div>
    )
}