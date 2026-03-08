import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldAlert, Activity, ArrowRight, Check, X, TerminalSquare } from 'lucide-react'

export default function ReviewBoard() {
    const [missionPrompt, setMissionPrompt] = useState('')
    const [status, setStatus] = useState('idle') // idle, negotiating, completed, rejected, blocked, error
    const [result, setResult] = useState(null)
    const [isExpanded, setIsExpanded] = useState(false)

    const executeMission = async () => {
        if (!missionPrompt.trim()) return

        setStatus('negotiating')
        setResult(null)
        setIsExpanded(true)

        try {
            const res = await fetch('http://localhost:3002/api/missions/execute', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ missionPrompt })
            })

            const data = await res.json()
            if (res.ok) {
                setStatus(data.status) // 'completed', 'rejected', 'blocked'
                setResult(data)
            } else {
                setStatus('error')
            }
        } catch (err) {
            console.error(err)
            setStatus('error')
        }
    }

    return (
        <div className="corp-card border-red-500/30 bg-gradient-to-br from-red-500/5 to-transparent relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-3xl"></div>

            <div className="flex items-center justify-between mb-4 relative z-10">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <ShieldAlert size={18} className="text-red-400" />
                    中枢审批管线 (Review Board)
                </h3>
                {status === 'negotiating' && (
                    <span className="px-2 py-1 text-[10px] bg-blue-500/20 text-blue-400 rounded-md animate-pulse flex items-center gap-1">
                        <Activity size={10} /> 高管博弈中...
                    </span>
                )}
            </div>

            <div className="relative z-10 mb-4 flex gap-2">
                <input
                    type="text"
                    value={missionPrompt}
                    onChange={e => setMissionPrompt(e.target.value)}
                    placeholder="输入总裁指令 (如: 买台一万块的电脑)"
                    className="flex-1 bg-black/40 border border-corp-border rounded-lg px-3 py-2 text-sm text-corp-text focus:outline-none focus:border-corp-accent/50"
                    onKeyDown={(e) => e.key === 'Enter' && executeMission()}
                    disabled={status === 'negotiating'}
                />
                <button
                    onClick={executeMission}
                    disabled={status === 'negotiating' || !missionPrompt.trim()}
                    className="px-4 py-2 bg-corp-accent/20 hover:bg-corp-accent/30 text-corp-accent-light text-sm rounded-lg border border-corp-accent/30 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                    <TerminalSquare size={16} /> 下达
                </button>
            </div>

            <AnimatePresence>
                {isExpanded && result && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="space-y-4 overflow-hidden relative z-10"
                    >
                        <div className={`p-4 rounded-lg border ${status === 'completed' ? 'bg-green-500/10 border-green-500/30' :
                                status === 'rejected' ? 'bg-red-500/10 border-red-500/30' :
                                    'bg-yellow-500/10 border-yellow-500/30'
                            }`}>
                            <div className="flex items-center gap-2 mb-2">
                                {status === 'completed' ? <Check size={16} className="text-green-400" /> :
                                    status === 'rejected' ? <X size={16} className="text-red-400" /> :
                                        <AlertTriangle size={16} className="text-yellow-400" />}
                                <span className={`text-sm font-bold ${status === 'completed' ? 'text-green-400' :
                                        status === 'rejected' ? 'text-red-400' :
                                            'text-yellow-400'
                                    }`}>
                                    {status === 'completed' ? '提案已通过并调度 (Approved)' :
                                        status === 'rejected' ? '风控驳回 (Vetoed by Review Board)' :
                                            '审批阻塞 (Blocked)'}
                                </span>
                            </div>

                            <div className="text-sm text-corp-text bg-black/30 p-3 rounded-md border border-white/5 whitespace-pre-wrap leading-relaxed">
                                {result.report || result.reason || '未返回详细报告。'}
                            </div>
                        </div>

                        {status !== 'completed' && status !== 'idle' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="pt-2 border-t border-corp-border flex gap-3"
                            >
                                <button onClick={() => setIsExpanded(false)} className="flex-1 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-medium rounded-lg border border-red-500/20 transition-colors">
                                    遵从建议 (Cancel)
                                </button>
                                <button className="flex-1 py-2 bg-corp-bg hover:bg-white/5 text-corp-text text-xs font-medium rounded-lg border border-corp-border transition-colors">
                                    CEO 强制执行 (Override Workflow)
                                </button>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
