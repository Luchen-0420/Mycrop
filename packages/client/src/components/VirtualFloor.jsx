import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Building2, Plus, Zap, Activity, Loader2 } from 'lucide-react'
import { Stage, Container as PixiContainer } from '@pixi/react'
import IsoRoom from './pixi/IsoRoom'
import IsoAgent from './pixi/IsoAgent'

// Simulation Agents Data for 2D side-view (Full 11 Departments Hierarchy)
const AGENTS = [
    // Floor 5: Penthouse
    { id: 'ceo', name: 'Boss (总裁)', avatar: '👑', status: '全局统筹决策中...', action: 'walking', role: '总裁办', color: 'purple' },

    // Floor 4: Core Business (Finance, Legal, Commerce)
    { id: 'finance', name: 'Ada (财务)', avatar: '👩‍💼', status: '核对 Q3 财报...', action: 'typing', role: '财务部', color: 'emerald' },
    { id: 'legal', name: 'Zane (法务)', avatar: '👨‍⚖️', status: '审核并购合同...', action: 'idle', role: '法务部', color: 'slate' },
    { id: 'commerce', name: 'Victor (商务)', avatar: '👨‍💼', status: '跨国视讯会议...', action: 'typing', role: '商务部', color: 'orange' },

    // Floor 3: Product & Market (R&D, PR)
    { id: 'rd', name: 'Neo (研发)', avatar: '🧑‍💻', status: '编译 AI 架构...', action: 'typing', role: '研发部', color: 'cyan' },
    { id: 'pr', name: 'Lisa (公关)', avatar: '👩‍🎤', status: '撰写危机公关稿...', action: 'walking', role: '公共关系部', color: 'pink' },

    // Floor 2: Internal Structure (HR, Operations, Admin)
    { id: 'hr', name: 'Mia (人力)', avatar: '👩‍🏫', status: '面试新算法专家...', action: 'idle', role: '人力资源部', color: 'rose' },
    { id: 'ops', name: 'Max (运营)', avatar: '👨‍🔧', status: '节点负载均衡调度...', action: 'typing', role: '运营部', color: 'blue' },
    { id: 'admin', name: 'Ben (行政)', avatar: '🕵️‍♂️', status: '盘点数字资产...', action: 'walking', role: '行政部', color: 'yellow' },

    // Floor 1: Facilities & Well-being (Health, Travel)
    { id: 'health', name: 'Dr.Chen (健康)', avatar: '👩‍⚕️', status: '全员血氧浓度监控...', action: 'idle', role: '健康中心', color: 'amber' },
    { id: 'travel', name: 'Sky (差旅)', avatar: '👩‍✈️', status: '预订下周私人专机...', action: 'typing', role: '差旅中心', color: 'indigo' }
]

// Mapping agents to their 2.5D Isometric Grid coordinates (x, y, width, height)
const MAP_LAYOUT = [
    { id: 'ceo', x: 4, y: 0, w: 4, h: 4 },
    { id: 'finance', x: 0, y: 0, w: 2, h: 4 },
    { id: 'legal', x: 2, y: 0, w: 2, h: 2 },
    { id: 'commerce', x: 2, y: 2, w: 2, h: 2 },
    { id: 'rd', x: 0, y: 4, w: 4, h: 4 },
    { id: 'pr', x: 4, y: 4, w: 2, h: 2 },
    { id: 'hr', x: 6, y: 4, w: 2, h: 2 },
    { id: 'ops', x: 4, y: 6, w: 2, h: 2 },
    { id: 'admin', x: 6, y: 6, w: 2, h: 2 },
    { id: 'health', x: 8, y: 0, w: 2, h: 4 },
    { id: 'travel', x: 8, y: 4, w: 2, h: 4 }
];

export default function VirtualFloor() {
    const [selectedAgent, setSelectedAgent] = useState(null)
    const [timeInGame, setTimeInGame] = useState('09:00 AM')

    // AI Chat States
    const [chatInput, setChatInput] = useState('')
    const [chatReply, setChatReply] = useState('')
    const [isChatting, setIsChatting] = useState(false)

    // Simulate game time passing
    useEffect(() => {
        const interval = setInterval(() => {
            setTimeInGame(prev => {
                let [hours, mins] = prev.split(' ')[0].split(':').map(Number)
                mins += 15
                if (mins >= 60) {
                    mins = 0
                    hours += 1
                }
                const ampm = hours >= 12 && hours < 24 ? 'PM' : 'AM'
                const displayHours = hours > 12 ? hours - 12 : (hours === 0 ? 12 : hours)
                return `${displayHours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')} ${ampm}`
            })
        }, 5000)
        return () => clearInterval(interval)
    }, [])

    const handleChatSubmit = async () => {
        if (!chatInput.trim() || !selectedAgent) return

        setIsChatting(true)
        setChatReply('') // hide old reply while generating

        try {
            const res = await fetch('http://localhost:3002/api/agents/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ agentId: selectedAgent, message: chatInput })
            });

            if (!res.ok) throw new Error('Network error');
            const data = await res.json();
            setChatReply(data.reply);
            setChatInput(''); // clear input on success

        } catch (error) {
            console.error("Chat Error:", error);
            setChatReply('无法连接到通讯网络，请确保 M.E. Corp 终端已启动。');
        } finally {
            setIsChatting(false)
        }
    }

    const closeHUD = () => {
        setSelectedAgent(null);
        setChatReply('');
        setChatInput('');
    }

    return (
        <div className="corp-card mb-8 relative overflow-hidden bg-[#0A0D14] min-h-[900px] flex flex-col border border-white/5 shadow-2xl">

            {/* Background Atmosphere */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0wIDEwaDQwTTAgMjBoNDBNMCAzMGh0ME0xMCAwdjQwTTIwIDB2NDBNMzAgMHY0MCIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3N2Zz4=')] opacity-50"></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none"></div>
            </div>

            {/* Game UI HUD (Top Bar) */}
            <div className="relative z-20 flex justify-between items-start p-6 pointer-events-none">
                <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-glow pointer-events-auto">
                    <div className="flex items-center gap-2 mb-3 pb-3 border-b border-white/5 text-purple-400">
                        <Building2 size={16} />
                        <span className="text-xs font-bold tracking-wider">M.E. Corp 全虚拟大厦引擎</span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-300 space-y-2 ml-1">
                        <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></div> <span className="opacity-80">运营周期:</span> 第 1 年 3 个月</div>
                        <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div> <span className="opacity-80">虚拟时钟:</span> {timeInGame}</div>
                        <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div> <span className="opacity-80">集团资金:</span> ¥53,600</div>
                    </div>
                </div>

                <div className="flex gap-3 pointer-events-auto">
                    <button className="flex items-center gap-2 bg-white/5 text-white text-xs px-4 py-2.5 rounded-xl border border-white/10 hover:bg-white/10 transition-all font-bold backdrop-blur-md">
                        <Plus size={14} /> 扩建楼层
                    </button>
                    <button className="flex items-center gap-2 bg-purple-500/20 text-purple-300 text-xs px-4 py-2.5 rounded-xl border border-purple-500/30 hover:bg-purple-500/40 hover:text-white transition-all font-bold backdrop-blur-md shadow-glow">
                        <Zap size={14} /> 招募新神仙
                    </button>
                </div>
            </div>

            {/* 2.5D Isometric WebGL Canvas */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center pb-12 pt-8 pointer-events-auto">
                <Stage width={1000} height={700} options={{ backgroundAlpha: 0, antialias: true, resolution: window.devicePixelRatio || 1 }}>
                    <PixiContainer x={500} y={150}>
                        {/* 1. Draw Iso Rooms / Floors */}
                        {MAP_LAYOUT.map(room => {
                            const agent = AGENTS.find(a => a.id === room.id);
                            return (
                                <IsoRoom
                                    key={`room-${room.id}`}
                                    x={room.x} y={room.y}
                                    width={room.w} height={room.h}
                                    colorName={agent.color}
                                    label={agent.role}
                                />
                            );
                        })}

                        {/* 2. Draw Iso Agents (Sorted by Isometric Depth X+Y) */}
                        {MAP_LAYOUT.slice().sort((a, b) => (a.x + a.y) - (b.x + b.y)).map(room => {
                            const agent = AGENTS.find(a => a.id === room.id);
                            return (
                                <IsoAgent
                                    key={`agent-${agent.id}`}
                                    agent={agent}
                                    x={room.x + room.w / 2 - 0.5}
                                    y={room.y + room.h / 2 - 0.5}
                                    selected={selectedAgent === agent.id}
                                    onClick={(id) => setSelectedAgent(prev => prev === id ? null : id)}
                                />
                            );
                        })}
                    </PixiContainer>
                </Stage>
            </div>

            {/* Bottom HUD Panel if Agent Selected */}
            <AnimatePresence>
                {selectedAgent && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-2xl border border-white/20 p-6 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] min-w-[420px] w-[500px] flex flex-col gap-5 z-50"
                    >
                        {/* Header Info */}
                        <div className="flex w-full items-center gap-5">
                            <div className="w-16 h-16 bg-gradient-to-br from-white/10 to-transparent rounded-2xl border border-white/20 flex items-center justify-center text-4xl shadow-inner relative overflow-hidden">
                                <div className="absolute inset-0 bg-purple-500/20 opacity-50 animate-pulse"></div>
                                <span className="relative z-10">{AGENTS.find(a => a.id === selectedAgent)?.avatar}</span>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-white font-bold text-base flex items-center gap-2 mb-1">
                                    {AGENTS.find(a => a.id === selectedAgent)?.name}
                                    <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">Active</span>
                                </h3>
                                <p className="text-purple-200/80 text-xs flex items-center gap-1.5">
                                    <Activity size={12} className="text-purple-400" />
                                    {AGENTS.find(a => a.id === selectedAgent)?.status}
                                </p>
                            </div>
                            <button className="bg-white/5 hover:bg-white/10 text-white/70 text-xs px-3 py-1.5 rounded-lg border border-white/10 transition-all font-bold self-start mt-1" onClick={closeHUD}>
                                X 关闭
                            </button>
                        </div>

                        {/* LLM Chat Section */}
                        <div className="w-full flex flex-col gap-3 border-t border-white/10 pt-4">
                            {chatReply && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="p-4 bg-purple-500/10 border border-purple-500/20 shadow-glow rounded-xl text-sm text-purple-100">
                                    <p className="whitespace-pre-wrap leading-relaxed">{chatReply}</p>
                                </motion.div>
                            )}
                            <div className="flex gap-2 w-full">
                                <input
                                    type="text"
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                    placeholder={`向 ${AGENTS.find(a => a.id === selectedAgent)?.role} 下达指令或交谈...`}
                                    className="flex-1 bg-black/60 border border-white/20 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 focus:bg-black/80 transition-all"
                                    onKeyDown={(e) => e.key === 'Enter' && handleChatSubmit()}
                                />
                                <button
                                    onClick={handleChatSubmit}
                                    disabled={isChatting || !chatInput.trim()}
                                    className="bg-purple-500/20 hover:bg-purple-500/40 disabled:opacity-50 text-purple-200 text-sm px-6 py-2.5 rounded-xl border border-purple-500/30 transition-all font-bold flex items-center gap-2 shadow-glow"
                                >
                                    {isChatting ? <Loader2 size={16} className="animate-spin" /> : '发送'}
                                </button>
                            </div>
                        </div>

                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}


