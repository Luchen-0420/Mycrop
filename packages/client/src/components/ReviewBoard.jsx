import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldAlert, Check, X, AlertTriangle, FileSignature, ArrowRight, Activity } from 'lucide-react'

const MOCK_PROPOSAL = {
    id: 'PRP-20260308-01',
    origin: 'CPO (公关部)',
    title: '购置新款高配游戏主机',
    reason: '下周有连续3天的游戏新品试玩期，为了保持娱乐状态与放松，申请购置 15,000 元游戏设备。',
    reviews: [
        { role: 'CFO (财务部)', status: 'rejected', comment: '预算超支！本月自由现金流仅剩 8,000。建议：租用或降配。' },
        { role: 'CWO (健康中心)', status: 'rejected', comment: '严重警告：连续超长游戏时间将导致睡眠剥夺和颈椎风险增加。违背健康原则。' },
        { role: 'CLO (法务/合规)', status: 'approved', comment: '符合年度享乐配额条款，无合规问题。' }
    ]
}

export default function ReviewBoard() {
    const [isOpen, setIsOpen] = useState(false)
    const [reviewState, setReviewState] = useState('idle') // idle, reviewing, decided
    const [finalDecision, setFinalDecision] = useState('rejected')

    // Simulate review process when opened
    useEffect(() => {
        if (isOpen && reviewState === 'idle') {
            setReviewState('reviewing')
            setTimeout(() => {
                setReviewState('decided')
            }, 2000)
        }
    }, [isOpen, reviewState])

    return (
        <div className="corp-card border-red-500/30 bg-gradient-to-br from-red-500/5 to-transparent relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-3xl"></div>

            <div className="flex items-center justify-between mb-4 relative z-10">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <ShieldAlert size={18} className="text-red-400" />
                    立项审批中心 (Approval Board)
                </h3>
                {reviewState === 'decided' ? (
                    <span className="kpi-badge down border-red-500/50">提案被驳回 (Vetoed)</span>
                ) : (
                    <span className="px-2 py-1 text-[10px] bg-blue-500/20 text-blue-400 rounded-md animate-pulse flex items-center gap-1">
                        <Activity size={10} /> 智能体评估中
                    </span>
                )}
            </div>

            <div className="bg-corp-bg/50 border border-corp-border rounded-lg p-4 mb-4 relative z-10">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-mono text-corp-muted">{MOCK_PROPOSAL.id}</span>
                    <span className="text-xs bg-white/5 border border-white/10 px-2 py-0.5 rounded text-corp-muted">{MOCK_PROPOSAL.origin}</span>
                </div>
                <h4 className="font-medium text-corp-text text-sm mb-1">{MOCK_PROPOSAL.title}</h4>
                <p className="text-xs text-corp-muted line-clamp-2">{MOCK_PROPOSAL.reason}</p>
            </div>

            <AnimatePresence>
                {!isOpen ? (
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(true)}
                        className="w-full py-2 bg-corp-accent/10 hover:bg-corp-accent/20 text-corp-accent-light text-sm rounded-lg border border-corp-accent/20 transition-colors flex items-center justify-center gap-2"
                    >
                        查看高管评审意见 <ArrowRight size={14} />
                    </motion.button>
                ) : (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        className="space-y-4 overflow-hidden relative z-10"
                    >
                        <div className="space-y-3 pt-2">
                            <p className="text-xs font-bold text-corp-muted uppercase tracking-wider">部门评估结果：</p>
                            {MOCK_PROPOSAL.reviews.map((r, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: i * 0.4 }}
                                    className={`p-3 rounded-lg border ${r.status === 'rejected' ? 'bg-red-500/5 border-red-500/20' : 'bg-green-500/5 border-green-500/20'}`}
                                >
                                    <div className="flex items-center gap-2 mb-1">
                                        {r.status === 'rejected' ? <X size={14} className="text-red-400" /> : <Check size={14} className="text-green-400" />}
                                        <span className={`text-xs font-bold ${r.status === 'rejected' ? 'text-red-400' : 'text-green-400'}`}>{r.role}</span>
                                    </div>
                                    <p className="text-xs text-corp-text leading-relaxed">{r.comment}</p>
                                </motion.div>
                            ))}
                        </div>

                        {reviewState === 'decided' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.5 }}
                                className="pt-4 border-t border-corp-border flex gap-3"
                            >
                                <button className="flex-1 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-medium rounded-lg border border-red-500/20 transition-colors">
                                    遵从建议 (Cancel)
                                </button>
                                <button className="flex-1 py-2 bg-corp-bg hover:bg-white/5 text-corp-text text-xs font-medium rounded-lg border border-corp-border transition-colors">
                                    CEO 强制执行 (Override)
                                </button>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
