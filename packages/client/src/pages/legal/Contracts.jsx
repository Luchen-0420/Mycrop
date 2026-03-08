import { useState, useEffect } from 'react'
import { FileText, Plus, Search, ChevronDown, Calendar, AlertCircle, X } from 'lucide-react'
import StatCard from '../../components/StatCard'

import { UploadCloud, File as FileIcon } from 'lucide-react'

function ContractModal({ isOpen, onClose, onSave, contract: initialContract }) {
    const [contract, setContract] = useState(initialContract || {})
    const [file, setFile] = useState(null)
    const [isAnalyzing, setIsAnalyzing] = useState(false)

    const handleFileChange = (e) => {
        setFile(e.target.files[0])
    }

    const handleAnalyze = async () => {
        if (!file) return
        setIsAnalyzing(true)
        const formData = new FormData()
        formData.append('contract', file)

        try {
            const response = await fetch('/api/legal/contracts/analyze', {
                method: 'POST',
                body: formData,
            })
            const data = await response.json()
            setContract(prev => ({ ...prev, ...data.extractedInfo, keyTerms: data.riskAnalysis.join('\n') }))
        } catch (error) {
            console.error("AI analysis failed:", error)
        }
        setIsAnalyzing(false)
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-corp-surface p-6 rounded-lg w-full max-w-lg border border-corp-border">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-white">添加新合同</h3>
                    <button onClick={onClose} className="text-corp-muted hover:text-white">
                        <X size={20} />
                    </button>
                </div>
                <div className="space-y-4">
                    <input type="text" placeholder="合同标题" value={contract.title || ''} onChange={e => setContract({...contract, title: e.target.value})} className="w-full bg-corp-bg border border-corp-border rounded-lg px-3 py-2 text-sm text-white" />
                    <input type="text" placeholder="签约方" value={contract.party || ''} onChange={e => setContract({...contract, party: e.target.value})} className="w-full bg-corp-bg border border-corp-border rounded-lg px-3 py-2 text-sm text-white" />
                    <div className="flex gap-4">
                        <input type="date" placeholder="开始日期" value={contract.startDate || ''} onChange={e => setContract({...contract, startDate: e.target.value})} className="w-full bg-corp-bg border border-corp-border rounded-lg px-3 py-2 text-sm text-white" />
                        <input type="date" placeholder="结束日期" value={contract.endDate || ''} onChange={e => setContract({...contract, endDate: e.target.value})} className="w-full bg-corp-bg border border-corp-border rounded-lg px-3 py-2 text-sm text-white" />
                    </div>
                    <textarea placeholder="关键条款 (每行一个)" value={contract.keyTerms || ''} onChange={e => setContract({...contract, keyTerms: e.target.value})} rows="3" className="w-full bg-corp-bg border border-corp-border rounded-lg px-3 py-2 text-sm text-white"></textarea>
                    <div className="border border-dashed border-corp-border rounded-lg p-6 text-center">
                        <input type="file" id="file-upload" className="hidden" onChange={handleFileChange} />
                        <label htmlFor="file-upload" className="cursor-pointer">
                            <UploadCloud className="mx-auto h-12 w-12 text-corp-muted" />
                            <p className="mt-2 text-sm text-corp-muted">拖拽文件至此, 或 <span className="font-semibold text-corp-accent">点击上传</span></p>
                            {file && <p className="text-xs text-white mt-2"><FileIcon size={12} className="inline mr-1"/>{file.name}</p>}
                        </label>
                    </div>
                    <button onClick={handleAnalyze} disabled={!file || isAnalyzing} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm text-white transition disabled:opacity-50">
                        {isAnalyzing ? '分析中...' : 'AI智能分析'}
                    </button>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                    <button onClick={onClose} className="px-4 py-2 text-sm text-white bg-corp-bg rounded-lg border border-corp-border hover:bg-white/5">取消</button>
                    <button onClick={() => onSave(contract)} className="px-4 py-2 text-sm text-white bg-corp-accent hover:bg-corp-accent-light rounded-lg">保存</button>
                </div>
            </div>
        </div>
    )
}



export default function Contracts() {
    const [contracts, setContracts] = useState([])
    const [stats, setStats] = useState({ total: 0, active: 0, expiringSoon: 0 })
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)

    useEffect(() => {
        const fetchContracts = async () => {
            setLoading(true)
            try {
                const response = await fetch('/api/legal/contracts')
                const data = await response.json()
                setContracts(data.contracts)
                setStats(data.stats)
            } catch (error) {
                console.error("Failed to fetch contracts:", error)
            }
            setLoading(false)
        }
        fetchContracts()
    }, [])

    const getStatusChip = (status) => {
        switch (status) {
            case 'active':
                return <span className="px-2 py-0.5 text-xs text-emerald-400 bg-emerald-400/10 rounded-full">生效中</span>
            case 'expired':
                return <span className="px-2 py-0.5 text-xs text-slate-400 bg-slate-400/10 rounded-full">已到期</span>
            case 'terminated':
                return <span className="px-2 py-0.5 text-xs text-amber-400 bg-amber-400/10 rounded-full">已终止</span>
            default:
                return null
        }
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard icon={FileText} title="合同总数" value={stats.total} color="blue" />
                <StatCard icon={Calendar} title="生效中" value={stats.active} color="green" />
                <StatCard icon={AlertCircle} title="即将到期" value={stats.expiringSoon} color="yellow" />
            </div>

            <div className="corp-card">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-white">合同列表</h3>
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-corp-muted" />
                            <input
                                type="text"
                                placeholder="搜索合同..."
                                className="pl-9 pr-3 py-2 w-48 bg-corp-surface border border-corp-border rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-corp-accent"
                            />
                        </div>
                        <button className="flex items-center gap-2 px-3 py-2 bg-corp-surface border border-corp-border rounded-lg text-sm text-white hover:bg-white/5 transition">
                            状态 <ChevronDown size={16} />
                        </button>
                        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-corp-accent hover:bg-corp-accent-light rounded-lg text-sm text-white transition">
                            <Plus size={16} /> 添加合同
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    {loading ? (
                        <p className="text-corp-muted">加载中...</p>
                    ) : (
                        contracts.map((contract) => (
                            <div key={contract.id} className="p-4 bg-corp-surface rounded-lg border border-corp-border hover:border-corp-accent transition-all duration-300 ease-in-out transform hover:-translate-y-1">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <h4 className="font-semibold text-white">{contract.title}</h4>
                                        <p className="text-sm text-corp-muted">签约方: {contract.party}</p>
                                        <p className="text-xs text-corp-muted font-mono">{contract.startDate} ~ {contract.endDate}</p>
                                    </div>
                                    <div className="text-right space-y-2">
                                        {getStatusChip(contract.status)}
                                        <p className="text-xs text-corp-muted">续签提醒: {contract.renewalReminder}</p>
                                    </div>
                                </div>
                                <div className="mt-3 pt-3 border-t border-corp-border/50">
                                    <p className="text-xs text-corp-muted">关键条款: {contract.keyTerms.join(', ')}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}