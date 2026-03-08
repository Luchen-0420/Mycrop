import { motion } from 'framer-motion'
import AgentBubble from './AgentBubble'
import { Calendar, ChevronRight, Sparkles } from 'lucide-react'

const FAKE_BRIEFING_DATA = [
    {
        id: 1,
        agentRole: 'COO',
        agentName: 'Max',
        avatar: '👔',
        message: 'Boss，昨日 OKR 进度 +3%，但“早睡”习惯已断签 2 天。自律积分即将扣除。',
        status: 'warning'
    },
    {
        id: 2,
        agentRole: 'CFO',
        agentName: 'Ada',
        avatar: '👩‍💼',
        message: '昨日总消费 ¥187。咖啡开销连续 5 天超标。建议本周开启挂壁模式。',
        status: 'warning'
    },
    {
        id: 3,
        agentRole: 'CPO',
        agentName: 'Lisa',
        avatar: '🤝',
        message: '老板早！妈妈生日还有 12 天，礼物还没着落。建议今天在系统立项审批。',
        status: 'info'
    },
    {
        id: 4,
        agentRole: 'CWO',
        agentName: 'Dr.Chen',
        avatar: '🩺',
        message: '经过昨夜数据分析，睡眠仅 5.5h，心率变异性(HRV)下降。我已在日程中为您将今天的高强度会议延后。',
        status: 'info'
    }
]

export default function DailyBriefing() {
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
                            <p className="text-[11px] font-mono text-corp-muted uppercase tracking-widest mt-0.5">高层管理每日汇报</p>
                        </div>
                    </div>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-full text-xs font-medium text-corp-text transition-all backdrop-blur-sm">
                        查看完整报告 <ChevronRight size={14} />
                    </button>
                </div>

                <div className="h-[1px] w-full bg-gradient-to-r from-white/10 via-white/5 to-transparent mb-6"></div>

                {/* The chat bubbles container */}
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
                    {FAKE_BRIEFING_DATA.map((item) => (
                        <AgentBubble key={item.id} {...item} />
                    ))}
                </motion.div>
            </div>
        </div>
    )
}
