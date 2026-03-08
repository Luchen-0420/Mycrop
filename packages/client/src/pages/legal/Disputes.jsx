import { useState, useEffect } from 'react'
import { AlertTriangle, Plus, Search, ChevronDown, DollarSign, CheckCircle, Clock, X } from 'lucide-react'
import StatCard from '../../components/StatCard'

function DisputeModal({ isOpen, onClose, onSave, dispute: initialDispute }) {
    const [dispute, setDispute] = useState(initialDispute || { title: '', type: '', platform: '', amount: '', description: '' })

    useEffect(() => {
        setDispute(initialDispute || { title: '', type: '', platform: '', amount: '', description: '' })
    }, [initialDispute, isOpen])

    const handleChange = (e) => {
        const { name, value } = e.target
        setDispute(prev => ({ ...prev, [name]: value }))
    }

    const handleSave = () => {
        onSave(dispute)
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-corp-surface p-6 rounded-lg w-full max-w-lg border border-corp-border">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-white">{dispute.id ? '编辑纠纷' : '添加新纠纷'}</h3>
                    <button onClick={onClose} className="text-corp-muted hover:text-white"><X size={20} /></button>
                </div>
                <div className="space-y-4">
                    <input name="title" value={dispute.title} onChange={handleChange} type="text" placeholder="纠纷标题" className="w-full bg-corp-bg border border-corp-border rounded-lg px-3 py-2 text-sm text-white" />
                    <input name="type" value={dispute.type} onChange={handleChange} type="text" placeholder="纠纷类型 (如: 消费维权)" className="w-full bg-corp-bg border border-corp-border rounded-lg px-3 py-2 text-sm text-white" />
                    <input name="platform" value={dispute.platform} onChange={handleChange} type="text" placeholder="平台/公司" className="w-full bg-corp-bg border border-corp-border rounded-lg px-3 py-2 text-sm text-white" />
                    <input name="amount" value={dispute.amount} onChange={handleChange} type="number" placeholder="涉及金额" className="w-full bg-corp-bg border border-corp-border rounded-lg px-3 py-2 text-sm text-white" />
                    <textarea name="description" value={dispute.description} onChange={handleChange} placeholder="情况描述" rows="3" className="w-full bg-corp-bg border border-corp-border rounded-lg px-3 py-2 text-sm text-white"></textarea>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                    <button onClick={onClose} className="px-4 py-2 text-sm text-white bg-corp-bg rounded-lg border border-corp-border hover:bg-white/5">取消</button>
                    <button onClick={handleSave} className="px-4 py-2 text-sm text-white bg-corp-accent hover:bg-corp-accent-light rounded-lg">保存</button>
                </div>
            </div>
        </div>
    )
}

export default function Disputes() {
    const [disputes, setDisputes] = useState([])
    const [stats, setStats] = useState({ total: 0, resolved: 0, pending: 0, totalAmount: 0 })
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedDispute, setSelectedDispute] = useState(null)

    const fetchDisputes = async () => {
        setLoading(true)
        try {
            const response = await fetch('/api/legal/disputes')
            const data = await response.json()
            setDisputes(data.disputes)
            setStats(data.stats)
        } catch (error) {
            console.error("Failed to fetch disputes:", error)
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchDisputes()
    }, [])

    const handleSaveDispute = async (dispute) => {
        const url = dispute.id ? `/api/legal/disputes/${dispute.id}` : '/api/legal/disputes'
        const method = dispute.id ? 'PUT' : 'POST'

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dispute),
            })
            if (response.ok) {
                fetchDisputes() // Refresh list
                setIsModalOpen(false)
                setSelectedDispute(null)
            }
        } catch (error) {
            console.error("Failed to save dispute:", error)
        }
    }

    const handleEdit = (dispute) => {
        setSelectedDispute(dispute)
        setIsModalOpen(true)
    }

    // ... (getStatusChip remains the same)

    return (
        <div className="space-y-6">
            {/* ... (StatCards remain the same) */}
            <div className="corp-card">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-white">纠纷列表</h3>
                    <div className="flex items-center gap-2">
                        {/* ... (Search and Filter buttons) */}
                        <button onClick={() => { setSelectedDispute(null); setIsModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-corp-accent hover:bg-corp-accent-light rounded-lg text-sm text-white transition">
                            <Plus size={16} /> 添加纠纷
                        </button>
                    </div>
                </div>
                <div className="space-y-4">
                    {loading ? (
                        <p className="text-corp-muted">加载中...</p>
                    ) : (
                        disputes.map((dispute) => (
                            <div key={dispute.id} onClick={() => handleEdit(dispute)} className="p-4 bg-corp-surface rounded-lg border border-corp-border hover:border-corp-accent transition-all duration-300 ease-in-out transform hover:-translate-y-1 cursor-pointer">
                                {/* ... (Dispute details) */}
                            </div>
                        ))
                    )}
                </div>
            </div>
            <DisputeModal 
                isOpen={isModalOpen} 
                onClose={() => { setIsModalOpen(false); setSelectedDispute(null); }} 
                onSave={handleSaveDispute} 
                dispute={selectedDispute} 
            />
        </div>
    )
}