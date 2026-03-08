import { motion } from 'framer-motion'

export default function AgentBubble({ agentRole, agentName, avatar, message, status }) {
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, scale: 0.95, y: 20 },
                visible: { opacity: 1, scale: 1, y: 0 }
            }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="flex items-start gap-4 relative"
        >
            <div className="flex-shrink-0 relative mt-1 group cursor-pointer">
                {/* Avatar Glow on hover */}
                <div className="absolute inset-0 bg-purple-500/40 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/20 flex items-center justify-center text-2xl shadow-xl relative overflow-hidden backdrop-blur-md">
                    <span className="relative z-10">{avatar}</span>
                </div>
                {status === 'warning' && <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-orange-500 rounded-full border-[3px] border-corp-bg z-20 shadow-glow"></div>}
                {status === 'info' && <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-[3px] border-corp-bg z-20 shadow-glow"></div>}
                {status === 'error' && <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-rose-500 rounded-full border-[3px] border-corp-bg z-20 shadow-glow"></div>}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5 ml-1">
                    <span className="font-bold text-white text-sm tracking-wide">{agentName}</span>
                    <span className="text-[10px] uppercase font-bold text-corp-muted/80 px-2 py-0.5 rounded-md bg-white/5 border border-white/5">{agentRole}</span>
                </div>
                {/* Message Bubble - Glass style */}
                <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl rounded-tl-sm opacity-50 blur-[2px] -z-10 group-hover:from-purple-500/10 transition-colors"></div>
                    <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl rounded-tl-sm px-5 py-3.5 inline-block shadow-glass relative z-10 transition-colors group-hover:border-white/20">
                        <p className="text-[14px] text-slate-200 leading-relaxed tracking-wide">
                            {message}
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
