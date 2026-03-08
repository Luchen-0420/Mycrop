import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import AgentBubble from './AgentBubble'
import { ChevronRight, Sparkles, Loader2 } from 'lucide-react'

export default function DailyBriefing() {
    const [briefingData, setBriefingData] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchBriefings = async () => {
            try {
                // Fetch from multiple agents
                const agentsToQuery = [
                    { id: 'briefing', role: '晨会助理', name: 'System', avatar: '🎙️', prompt: '请生成一份今天早上的简明扼要的早报（约50字以内）。' },
                    { id: 'finance', role: 'CFO', name: 'Ada', avatar: '👩‍💼', prompt: '老板早上好！请简短点评一下最近的开销状况，要求语气精干（约40字以内）。' },
                    { id: 'rd', role: 'CTO', name: 'Neo', avatar: '🧑‍💻', prompt: '早！请向Boss汇报一句关于今天系统代码运转状况的极客语录，体现出你的技术热情（约40字以内）。' }
                ];

                const results = await Promise.all(
                    agentsToQuery.map(async (agent, index) => {
                        try {
                            const res = await fetch('http://localhost:3002/api/agents/chat', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ agentId: agent.id, message: agent.prompt })
                            });

                            if (!res.ok) throw new Error('API Error');

                            const data = await res.json();
                            return {
                                id: index + 1,
                                agentRole: agent.role,
                                agentName: agent.name,
                                avatar: agent.avatar,
                                message: data.reply || '系统故障，未能获取智能体汇报。',
                                status: 'info'
                            };
                        } catch (e) {
                            console.error(`Agent ${agent.id} err:`, e);
                            return {
                                id: index + 1,
                                agentRole: agent.role,
                                agentName: agent.name,
                                avatar: agent.avatar,
                                message: '无法连接到大厦大模型机房，该线路暂时离线。',
                                status: 'warning'
                            };
                        }
                    })
                )

                setBriefingData(results)
            } catch (error) {
                console.error("Failed to fetch briefings", error)
            } finally {
                setLoading(false)
            }
        }

        fetchBriefings()
    }, [])

    return (
        <div className="corp-card mb-8 relative overflow-hidden bg-white/[0.02] border-white/10 group hover:border-purple-500/30">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-purple-500/20 via-blue-500/10 to-transparent rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none group-hover:from-purple-500/30 transition-colors duration-500"></div>

            <div className="relative z-10">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl border border-white/10 shadow-glow">
                            <Sparkles size={20} className="text-purple-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white tracking-wide">
                                晨间早会图文简报
                            </h2>
                            <p className="text-[11px] font-mono text-corp-muted uppercase tracking-widest mt-0.5">高层管理每日汇报 - LLM 实时介入中</p>
                        </div>
                    </div>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-full text-xs font-medium text-corp-text transition-all backdrop-blur-sm">
                        查看完整报告 <ChevronRight size={14} />
                    </button>
                </div>

                <div className="h-[1px] w-full bg-gradient-to-r from-white/10 via-white/5 to-transparent mb-6"></div>

                {/* The chat bubbles container */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12 text-purple-400">
                        <Loader2 className="w-8 h-8 animate-spin mb-4" />
                        <p className="text-xs font-mono tracking-widest">正在连接 DeepSeek API，唤醒众神仙...</p>
                    </div>
                ) : (
                    <motion.div
                        variants={{
                            hidden: { opacity: 0 },
                            visible: {
                                opacity: 1,
                                transition: {
                                    staggerChildren: 0.4
                                }
                            }
                        }}
                        initial="hidden"
                        animate="visible"
                        className="space-y-6 pl-2"
                    >
                        {briefingData.map((item) => (
                            <AgentBubble key={item.id} {...item} />
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    )
}
