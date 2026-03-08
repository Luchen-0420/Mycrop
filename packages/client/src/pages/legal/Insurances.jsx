import { useState, useEffect } from 'react'
import { Shield, Plus, Search, ChevronDown, PiggyBank, Calendar, AlertCircle, X } from 'lucide-react'
import StatCard from '../../components/StatCard'

function InsuranceModal({ isOpen, onClose, onSave, insurance: initialInsurance }) {
    const [insurance, setInsurance] = useState(initialInsurance || { provider: '', type: '', policyNumber: '', premium: '', coverage: '' })

    useEffect(() => {
        setInsurance(initialInsurance || { provider: '', type: '', policyNumber: '', premium: '', coverage: '' })
    }, [initialInsurance, isOpen])

    const handleChange = (e) => {
        const { name, value } = e.target
        setInsurance(prev => ({ ...prev, [name]: value }))
    }

    const handleSave = () => {
        onSave(insurance)
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-corp-surface p-6 rounded-lg w-full max-w-lg border border-corp-border">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-white">{insurance.id ? '编辑保单' : '添加新保单'}</h3>
                    <button onClick={onClose} className="text-corp-muted hover:text-white"><X size={20} /></button>
                </div>
                <div className="space-y-4">
                    <input name="provider" value={insurance.provider} onChange={handleChange} type="text" placeholder="保险公司" className="w-full bg-corp-bg border border-corp-border rounded-lg px-3 py-2 text-sm text-white" />
                    <input name="type" value={insurance.type} onChange={handleChange} type="text" placeholder="保单类型 (如: 重疾险)" className="w-full bg-corp-bg border border-corp-border rounded-lg px-3 py-2 text-sm text-white" />
                    <input name="policyNumber" value={insurance.policyNumber} onChange={handleChange} type="text" placeholder="保单号" className="w-full bg-corp-bg border border-corp-border rounded-lg px-3 py-2 text-sm text-white" />
                    <input name="premium" value={insurance.premium} onChange={handleChange} type="number" placeholder="保费 (年)" className="w-full bg-corp-bg border border-corp-border rounded-lg px-3 py-2 text-sm text-white" />
                    <textarea name="coverage" value={insurance.coverage} onChange={handleChange} placeholder="保障范围摘要" rows="3" className="w-full bg-corp-bg border border-corp-border rounded-lg px-3 py-2 text-sm text-white"></textarea>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                    <button onClick={onClose} className="px-4 py-2 text-sm text-white bg-corp-bg rounded-lg border border-corp-border hover:bg-white/5">取消</button>
                    <button onClick={handleSave} className="px-4 py-2 text-sm text-white bg-corp-accent hover:bg-corp-accent-light rounded-lg">保存</button>
                </div>
            </div>
        </div>
    )
}

export default function Insurances() {
    const [insurances, setInsurances] = useState([])
    const [stats, setStats] = useState({ total: 0, totalPremium: 0, expiringSoon: 0 })
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedInsurance, setSelectedInsurance] = useState(null)

    const fetchInsurances = async () => {
        setLoading(true)
        try {
            const response = await fetch('/api/legal/insurances')
            const data = await response.json()
            setInsurances(data.insurances)
            setStats(data.stats)
        } catch (error) {
            console.error("Failed to fetch insurances:", error)
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchInsurances()
    }, [])

    const handleSaveInsurance = async (insurance) => {
        const url = insurance.id ? `/api/legal/insurances/${insurance.id}` : '/api/legal/insurances'
        const method = insurance.id ? 'PUT' : 'POST'

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(insurance),
            })
            if (response.ok) {
                fetchInsurances() // Refresh list
                setIsModalOpen(false)
                setSelectedInsurance(null)
            }
        } catch (error) {
            console.error("Failed to save insurance:", error)
        }
    }

    const handleEdit = (insurance) => {
        setSelectedInsurance(insurance)
        setIsModalOpen(true)
    }

    // ... (getStatusChip remains the same)

    return (
        <div className="space-y-6">
            {/* ... (StatCards remain the same) */}
            <div className="corp-card">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-white">保单列表</h3>
                    <div className="flex items-center gap-2">
                        {/* ... (Search and Filter buttons) */}
                        <button onClick={() => { setSelectedInsurance(null); setIsModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-corp-accent hover:bg-corp-accent-light rounded-lg text-sm text-white transition">
                            <Plus size={16} /> 添加保单
                        </button>
                    </div>
                </div>
                <div className="space-y-4">
                    {loading ? (
                        <p className="text-corp-muted">加载中...</p>
                    ) : (
                        insurances.map((insurance) => (
                            <div key={insurance.id} onClick={() => handleEdit(insurance)} className="p-4 bg-corp-surface rounded-lg border border-corp-border hover:border-corp-accent transition-all duration-300 ease-in-out transform hover:-translate-y-1 cursor-pointer">
                                {/* ... (Insurance details) */}
                            </div>
                        ))
                    )}
                </div>
            </div>
            <InsuranceModal 
                isOpen={isModalOpen} 
                onClose={() => { setIsModalOpen(false); setSelectedInsurance(null); }} 
                onSave={handleSaveInsurance} 
                insurance={selectedInsurance} 
            />
        </div>
    )
}