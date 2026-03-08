import { useState, useEffect } from 'react'
import { ShoppingCart, BrainCircuit, Bot, Zap, Plus, AlertTriangle, CheckCircle, XCircle, Loader2 } from 'lucide-react'

export default function Procurement() {
    const [requests, setRequests] = useState([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [newReq, setNewReq] = useState({ item_name: '', estimated_price: '', reason: '', is_promotion_day: false })
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)

    useEffect(() => {
        fetchRequests()
    }, [])

    const fetchRequests = async () => {
        try {
            const res = await fetch('/api/admin/procurement')
            if (res.ok) {
                const data = await res.json()
                setRequests(data)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmitRequest = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        try {
            const res = await fetch('/api/admin/procurement/request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newReq)
            })
            if (res.ok) {
                setIsAddModalOpen(false)
                setNewReq({ item_name: '', estimated_price: '', reason: '', is_promotion_day: false })
                fetchRequests()
            }
        } catch (err) {
            console.error(err)
        } finally {
            setSubmitting(false)
        }
    }

    const handleUpdateStatus = async (id, status) => {
        try {
            const res = await fetch(`/api/admin/procurement/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            })
            if (res.ok) {
                fetchRequests()
            }
        } catch (err) {
            console.error(err)
        }
    }

    if (loading) return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-corp-accent" /></div>

    return (
        <div className="space-y-6">

            <div className="bg-gradient-to-r from-corp-muted/20 to-corp-accent/20 border border-corp-muted/30 rounded-xl p-6 mb-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 text-corp-accent/10">
                    <BrainCircuit size={120} />
                </div>
                <div className="relative z-10">
                    <h3 className="text-xl font-bold flex items-center text-white mb-2"><Bot size={24} className="mr-2 text-corp-accent" /> AI 采购审批风控 (AI Procurement Review)</h3>
                    <p className="text-corp-muted max-w-2xl text-sm">
                        在购物前冷静一下。将你想买的物品和理由提交给“AI CFO”进行审查。系统会根据金额、你的理由以及是否遇到大促节点来判定这是「真需求」还是冲动消费产生的「伪需求」。
                    </p>
                </div>
            </div>

            <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-lg">历史审批单</h4>
                <button onClick={() => setIsAddModalOpen(true)} className="btn-primary flex items-center space-x-2">
                    <ShoppingCart size={16} />
                    <span>我想买点什么...</span>
                </button>
            </div>

            <div className="space-y-4">
                {requests.map(req => {
                    const reqDate = new Date(req.created_at).toLocaleString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                    const isApproved = req.ai_decision === 'approved'
                    const isRejected = req.ai_decision === 'rejected'

                    return (
                        <div key={req.id} className={`bg-corp-surface rounded-xl p-0 border transition-all ${isApproved ? 'border-corp-success/40' :
                                isRejected ? 'border-corp-danger/40' : 'border-corp-border'
                            }`}>
                            <div className="p-5 flex flex-col md:flex-row gap-6">

                                {/* Left: Request details */}
                                <div className="flex-1 space-y-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h5 className="font-bold text-lg flex items-center">
                                                {req.item_name}
                                                {req.is_promotion_day && <span className="ml-2 text-[10px] px-1.5 py-0.5 bg-corp-accent/20 text-corp-accent rounded border border-corp-accent/30 font-bold flex items-center"><Zap size={10} className="mr-0.5" />大促节点</span>}
                                            </h5>
                                            <div className="text-xs text-corp-muted mt-1">{reqDate} 提交</div>
                                        </div>
                                        <div className="text-xl font-mono font-bold text-white">¥{parseFloat(req.estimated_price).toLocaleString()}</div>
                                    </div>
                                    <div className="text-sm bg-corp-bg rounded-lg p-3 border border-corp-border">
                                        <span className="text-corp-muted text-xs block mb-1">申请理由：</span>
                                        {req.reason}
                                    </div>
                                </div>

                                {/* Right: AI Decision & Actions */}
                                <div className="w-full md:w-1/3 flex flex-col pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-corp-border/50 md:pl-6">
                                    <span className="text-corp-muted text-xs block mb-2 flex items-center"><Bot size={12} className="mr-1" /> AI CFO 审批意见</span>

                                    <div className={`flex items-start flex-1 ${isApproved ? 'text-corp-success' :
                                            isRejected ? 'text-corp-danger' : 'text-corp-warning'
                                        }`}>
                                        {isApproved ? <CheckCircle size={20} className="mr-2 shrink-0 mt-0.5" /> :
                                            isRejected ? <XCircle size={20} className="mr-2 shrink-0 mt-0.5" /> :
                                                <Loader2 size={20} className="mr-2 shrink-0 mt-0.5 animate-spin" />}

                                        <div className="text-sm">
                                            <strong className="block mb-1">
                                                {isApproved ? '批准购买 (APPROVED)' : isRejected ? '驳回申请 (REJECTED)' : '正在审核 (PENDING)'}
                                            </strong>
                                            <p className="text-xs opacity-90 leading-relaxed italic border-l-2 p-l-2 border-current pl-2">
                                                "{req.ai_comment}"
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex items-center justify-between">
                                        <span className={`text-xs px-2 py-1 rounded bg-corp-bg border ${req.status === '待购买' ? 'text-corp-warning border-corp-warning/30' :
                                                req.status === '已购买' ? 'text-corp-success border-corp-success/30' :
                                                    'text-corp-muted border-corp-border'
                                            }`}>
                                            进度: {req.status}
                                        </span>

                                        {isApproved && req.status === '待购买' && (
                                            <button
                                                onClick={() => handleUpdateStatus(req.id, '已购买')}
                                                className="text-xs px-3 py-1 bg-corp-success/20 text-corp-success hover:bg-corp-success hover:text-white rounded transition"
                                            >
                                                确认已购入
                                            </button>
                                        )}
                                        {req.status === '待购买' && (
                                            <button
                                                onClick={() => handleUpdateStatus(req.id, '已放弃')}
                                                className="text-xs px-3 py-1 bg-corp-border text-corp-muted hover:bg-corp-border rounded transition"
                                            >
                                                放弃购买
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}

                {requests.length === 0 && (
                    <div className="py-12 text-center text-corp-muted border border-dashed border-corp-border rounded-xl">
                        <ShoppingCart size={32} className="mx-auto mb-2 opacity-50" />
                        <p>没有找到采购申请记录</p>
                        <p className="text-sm mt-1">目前是个省钱的好员工！</p>
                    </div>
                )}
            </div>

            {/* Procurement Request Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex flex-col items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-corp-surface rounded-xl max-w-lg w-full p-6 border border-corp-border shadow-2xl relative overflow-hidden">

                        {submitting && (
                            <div className="absolute inset-0 bg-corp-bg/80 z-20 flex flex-col items-center justify-center backdrop-blur-sm">
                                <BrainCircuit size={48} className="text-corp-accent animate-pulse mb-4" />
                                <div className="text-lg font-bold text-white">AI CFO 正在艰难抉择...</div>
                                <div className="text-sm text-corp-muted mt-2">正在评估该物品对你的真实价值</div>
                            </div>
                        )}

                        <h3 className="text-xl font-bold mb-4 flex items-center"><ShoppingCart size={20} className="mr-2" /> 提交采购申请</h3>
                        <p className="text-sm text-corp-muted mb-6 border-b border-corp-border pb-4">
                            购买电子产品、大件生活用品、或任何非计划内的大额支出前，请先提交至该风控系统审批。
                        </p>

                        <form onSubmit={handleSubmitRequest}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-corp-muted mb-1">想买什么物品？</label>
                                    <input type="text" required className="form-input w-full bg-corp-bg border border-corp-border rounded px-3 py-2 text-white outline-none focus:border-corp-accent" placeholder="e.g. PlayStation 5 Pro" value={newReq.item_name} onChange={e => setNewReq({ ...newReq, item_name: e.target.value })} />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-corp-muted mb-1">预计花费金额 (¥)</label>
                                    <input type="number" step="0.01" min="0" required className="form-input w-full bg-corp-bg border border-corp-border rounded px-3 py-2 text-white outline-none focus:border-corp-accent font-mono text-lg" placeholder="5699.00" value={newReq.estimated_price} onChange={e => setNewReq({ ...newReq, estimated_price: e.target.value })} />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-corp-muted mb-1">诚实地说，为什么需要买它？</label>
                                    <textarea rows="3" required className="form-textarea w-full bg-corp-bg border border-corp-border rounded px-3 py-2 text-white outline-none focus:border-corp-accent text-sm" placeholder="AI 会根据你的理由判定该消费是否合理（尽量写满 15 个字）" value={newReq.reason} onChange={e => setNewReq({ ...newReq, reason: e.target.value })}></textarea>
                                </div>

                                <div className="flex items-center space-x-3 p-3 bg-corp-bg/50 rounded-lg border border-corp-border">
                                    <input
                                        type="checkbox"
                                        id="promo"
                                        className="w-4 h-4 rounded accent-corp-accent cursor-pointer"
                                        checked={newReq.is_promotion_day}
                                        onChange={(e) => setNewReq({ ...newReq, is_promotion_day: e.target.checked })}
                                    />
                                    <label htmlFor="promo" className="text-sm text-white cursor-pointer select-none">
                                        当前是否为重大电商促销节点 (如 618、马上要过期的超大额满减券)？
                                        <span className="block text-xs text-corp-muted mt-0.5">选择是，有助于提高中低价位物品的审批侧重点。</span>
                                    </label>
                                </div>
                            </div>
                            <div className="mt-8 flex justify-end space-x-3">
                                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 bg-transparent text-corp-muted hover:text-white transition">取消</button>
                                <button type="submit" className="btn-primary flex items-center">
                                    <BrainCircuit size={16} className="mr-2" />
                                    <span>提交给 AI 审批</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
