import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Building2, Plus, Zap, Activity, Loader2, FileText, ShieldAlert, CheckCircle2, Clock, XCircle, History, ChevronRight, MessageSquareQuote } from 'lucide-react'

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

// --- Helper Components for the Rooms ---

// --- v2.2 Approval Slip Component (Modal Version) ---
function ApprovalSlip({ decision, report, thought, adaRisk, onClose }) {
    const isApproved = decision === 'approve';
    const isRejected = decision === 'reject';
    const isCooling = decision === 'cooling_off';
    const isPendingTasks = decision === 'pending_tasks';

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20, rotateX: 10 }}
                animate={{ scale: 1, y: 0, rotateX: 0 }}
                exit={{ scale: 0.9, y: 20, rotateX: -10 }}
                className="w-full max-w-2xl bg-[#f8fafc] text-slate-900 shadow-[0_50px_100px_rgba(0,0,0,0.5)] border-t-[16px] border-purple-600 relative overflow-hidden font-serif"
                onClick={e => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-600 z-50"
                >
                    <XCircle size={24} />
                </button>

                {/* Watermark */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[150px] font-black text-slate-200/40 -rotate-12 pointer-events-none select-none">
                    M.E. CORP
                </div>

                <div className="relative z-10 p-10">
                    <div className="flex justify-between items-start mb-8 border-b-2 border-slate-200 pb-6">
                        <div>
                            <h2 className="text-3xl font-black tracking-tighter text-slate-800 uppercase">M.E. CORP 战略资产购置签批单</h2>
                            <p className="text-xs font-mono font-bold text-slate-400 mt-2 tracking-widest">ORDER NO: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                        </div>
                        <div className={`px-6 py-3 border-4 font-black uppercase tracking-[0.2em] text-xl transform -rotate-2 ${isApproved ? 'border-emerald-500 text-emerald-600' : isRejected ? 'border-red-500 text-red-600' : 'border-amber-500 text-amber-600'}`}>
                            {isApproved ? 'APPROVED' : isRejected ? 'REJECTED' : isCooling ? 'COOLING' : 'PENDING'}
                        </div>
                    </div>

                    <div className="space-y-6 text-base leading-relaxed">
                        <div className="bg-slate-100 p-5 rounded-lg border-l-8 border-slate-300">
                            <span className="font-bold flex items-center gap-2 mb-2 text-slate-500 uppercase text-xs tracking-widest">
                                <ShieldAlert size={14} className="text-emerald-500" /> 财务风控部审计结论 (ADA AUDIT)
                            </span>
                            <p className="italic text-slate-700 font-medium">
                                评估结果：该资产购置申请触发 {adaRisk ? adaRisk.toUpperCase() : 'MEDIUM'} 风险预警。
                                当前存量流动性：NORMAL。ROI 预期收益率分析结论为：建议{isApproved ? '执行' : '克制'}。
                            </p>
                        </div>

                        <div className="py-2">
                            <span className="font-bold block mb-3 underline decoration-purple-400 decoration-2 underline-offset-4 uppercase text-xs tracking-widest text-slate-400">CEO 最终签署意见 (FINAL DECREE)</span>
                            <div className="pl-6 border-l-2 border-purple-100 whitespace-pre-wrap text-slate-800 font-medium text-lg leading-relaxed antialiased">
                                {report}
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-slate-200 flex justify-between items-end">
                        <div className="text-[11px] text-slate-400 font-mono leading-tight">
                            DIGITALLY SIGNED VIA LLM HIERARCHY ENGINE<br />
                            STAMP ID: ME-H892-DECISION-V2.2<br />
                            OFFICIAL DATE: {new Date().toLocaleDateString()}
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="font-cursive text-3xl text-purple-900 opacity-70 -rotate-6 select-none drop-shadow-sm">CEO Proxy Signature</div>
                            <div className="w-56 h-[1px] bg-slate-300"></div>
                            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">AUTHORIZED BY M.E. AI CORE</div>
                        </div>
                    </div>
                </div>

                {/* Red Stamps Overlay */}
                {isRejected && (
                    <div className="absolute top-1/2 left-2/3 w-48 h-48 border-[8px] border-red-500/60 rounded-full flex items-center justify-center -rotate-[25deg] opacity-70 select-none pointer-events-none">
                        <span className="text-red-600 font-black text-5xl uppercase tracking-tighter">驳回</span>
                    </div>
                )}
                {isApproved && (
                    <div className="absolute top-1/3 left-3/4 w-32 h-32 border-[6px] border-emerald-500/40 rounded flex items-center justify-center rotate-[15deg] opacity-40 select-none pointer-events-none">
                        <span className="text-emerald-600 font-black text-2xl uppercase">PASSED</span>
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
}

function RoomBackground({ color, label }) {
    return (
        <div className="absolute inset-0 pointer-events-none">
            {/* Ambient Glow */}
            <div className={`absolute top-0 right-0 w-48 h-48 bg-${color}-500/20 blur-[60px] rounded-full`}></div>

            {/* Floor Line */}
            <div className={`absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-${color}-500/80 to-transparent opacity-80 shadow-[0_0_15px_currentColor]`}></div>

            {/* Room Label Badge */}
            <div className="absolute top-3 left-3 px-3 py-1 bg-black/60 backdrop-blur-md rounded-md border border-white/20 flex items-center gap-2 shadow-glow">
                <div className={`w-1.5 h-1.5 rounded-full bg-${color}-400 shadow-[0_0_8px_currentColor]`}></div>
                <span className="text-[10px] text-white/90 font-bold tracking-widest leading-none drop-shadow-md">{label}</span>
            </div>
        </div>
    )
}

function RoomProps({ type }) {
    switch (type) {
        case 'ceo':
            return (
                <div className="absolute bottom-1 right-12 flex items-end gap-2 opacity-90 pointer-events-none">
                    <div className="w-12 h-20 border-r-2 border-purple-500/30 flex flex-col items-center justify-end pb-2 gap-2 relative">
                        <div className="w-8 h-6 border border-purple-500/40 bg-purple-500/20 rounded-sm shadow-[0_0_10px_rgba(168,85,247,0.3)]"></div>
                        <div className="w-8 h-6 border border-blue-500/40 bg-blue-500/20 rounded-sm shadow-[0_0_10px_rgba(59,130,246,0.3)]"></div>
                    </div>
                    <div className="w-56 h-[4px] bg-white/30 rounded-full relative shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                        <div className="absolute -top-14 left-10 w-20 h-12 border border-teal-400/50 bg-teal-400/10 rounded shadow-glow backdrop-blur-sm"></div>
                        <div className="absolute bottom-full left-4 w-5 h-14 bg-white/10 border-l border-white/20"></div>
                        <div className="absolute bottom-full right-4 w-5 h-14 bg-white/10 border-r border-white/20"></div>
                    </div>
                    {/* RAG Memory Core */}
                    <div className="ml-12 w-20 h-32 border border-fuchsia-500/40 bg-fuchsia-500/10 rounded-t-full flex flex-col items-center justify-center relative overflow-hidden shadow-[0_0_40px_rgba(217,70,239,0.2)]">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-fuchsia-500/20 opacity-50"></div>
                        <div className="w-10 h-10 rounded-full bg-fuchsia-500/20 border-2 border-fuchsia-400/60 animate-pulse shadow-glow flex items-center justify-center">
                            <div className="w-4 h-4 rounded-full bg-fuchsia-300 shadow-[0_0_20px_#f0abfc]"></div>
                        </div>
                        <div className="absolute bottom-0 w-full h-10 bg-gradient-to-t from-fuchsia-500/60 to-transparent blur-sm"></div>
                        <div className="absolute top-3 w-full text-center text-[8px] font-bold text-fuchsia-300 tracking-widest opacity-90 drop-shadow-md">RAG CORE</div>
                    </div>
                </div>
            )
        case 'finance':
            return (
                <div className="absolute bottom-1 right-6 flex items-end gap-1.5 opacity-90 pointer-events-none">
                    <div className="w-10 h-28 border border-emerald-500/50 bg-emerald-500/10 rounded-t-md flex flex-col gap-1 p-1 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                        {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-full h-3.5 border-b border-emerald-400/40"></div>)}
                    </div>
                </div>
            )
        case 'legal':
            return (
                <div className="absolute bottom-1 right-8 flex flex-col items-center opacity-90 pointer-events-none">
                    <div className="w-20 h-1 bg-slate-300/40 relative mt-5 shadow-[0_0_10px_rgba(203,213,225,0.5)]">
                        <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-1.5 h-24 bg-slate-400/50"></div>
                        <div className="absolute top-0 left-0 w-5 h-8 border-b-2 border-x-2 border-slate-400/50 rounded-b-full bg-slate-400/10"></div>
                        <div className="absolute top-0 right-0 w-5 h-8 border-b-2 border-x-2 border-slate-400/50 rounded-b-full bg-slate-400/10"></div>
                    </div>
                </div>
            )
        case 'commerce':
            return (
                <div className="absolute bottom-1 right-8 flex flex-col items-center opacity-90 pointer-events-none">
                    <div className="w-24 h-20 border-2 border-orange-500/40 bg-orange-500/10 rounded-lg flex items-end p-1.5 gap-1.5 relative shadow-[0_0_20px_rgba(249,115,22,0.15)]">
                        <div className="w-4 h-16 bg-orange-400/90 border-t border-orange-300/100 shadow-[0_0_10px_rgba(249,115,22,0.8)]"></div>
                        <div className="absolute top-3 w-[90%] left-[5%] h-[1px] bg-white/40 border-t border-dashed border-orange-400/70"></div>
                    </div>
                </div>
            )
        case 'rd':
            return (
                <div className="absolute bottom-1 right-12 flex items-end gap-3 opacity-90 pointer-events-none">
                    <div className="w-20 h-8 border-t-2 border-cyan-400/60 bg-cyan-500/10 rounded-t-full relative flex justify-center shadow-[0_0_20px_rgba(34,211,238,0.2)]">
                        <div className="absolute bottom-full w-14 h-14 border-[3px] border-dashed border-cyan-400/60 rounded-full animate-[spin_10s_linear_infinite] shadow-[0_0_15px_rgba(34,211,238,0.5)]"></div>
                    </div>
                </div>
            )
        case 'pr':
            return (
                <div className="absolute bottom-1 right-8 flex flex-col items-center opacity-90 pointer-events-none">
                    <div className="w-32 h-16 border-[3px] border-pink-500/40 rounded-full border-b-0 rounded-b-none flex justify-center items-center bg-pink-500/5 shadow-[0_-10px_20px_rgba(236,72,153,0.1)]">
                        <div className="w-3 h-3 rounded-full bg-pink-400 absolute shadow-[0_0_15px_rgba(244,114,182,0.8)] animate-pulse"></div>
                    </div>
                </div>
            )
        case 'hr':
            return (
                <div className="absolute bottom-1 right-8 flex items-end gap-2 opacity-90 pointer-events-none">
                    <div className="w-12 h-20 border border-rose-500/40 bg-rose-500/10 flex flex-col rounded shadow-[0_0_15px_rgba(244,63,94,0.15)]">
                        <div className="flex-1 border-b border-rose-500/30 flex items-center justify-center"><div className="w-4 h-1.5 bg-white/40 rounded-sm"></div></div>
                    </div>
                </div>
            )
        case 'ops':
            return (
                <div className="absolute bottom-1 right-6 flex items-end gap-2 opacity-90 pointer-events-none">
                    <div className="w-20 h-16 border-t border-l border-blue-400/30 rounded-tl-xl bg-blue-500/10 relative shadow-[0_-5px_15px_rgba(59,130,246,0.1)]">
                        <div className="absolute top-3 left-3 w-10 h-5 bg-cyan-400/30 border border-cyan-400/50 rounded-sm skew-x-12 animate-pulse shadow-[0_0_10px_rgba(34,211,238,0.4)]"></div>
                    </div>
                </div>
            )
        case 'admin':
            return (
                <div className="absolute bottom-1 right-8 flex items-end gap-1.5 opacity-90 pointer-events-none">
                    <div className="w-10 h-10 border border-yellow-500/40 bg-yellow-500/10 rounded-sm relative shadow-[0_0_15px_rgba(234,179,8,0.15)] flex justify-center">
                        <div className="absolute top-3 w-[80%] h-[2px] bg-yellow-400/40"></div>
                    </div>
                </div>
            )
        case 'health':
            return (
                <div className="absolute bottom-1 right-8 flex items-end gap-2 opacity-90 pointer-events-none">
                    <div className="w-28 h-10 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-center relative shadow-[0_0_20px_rgba(245,158,11,0.15)]">
                        <Activity className="text-amber-400 w-8 h-8 z-10 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)] filter" />
                    </div>
                </div>
            )
        case 'travel':
            return (
                <div className="absolute bottom-1 right-12 flex flex-col items-center opacity-90 pointer-events-none">
                    <div className="w-20 h-20 rounded-full border-[3px] border-indigo-500/50 bg-indigo-500/10 relative overflow-hidden flex items-center justify-center shadow-[0_0_25px_rgba(99,102,241,0.2)]">
                        <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_15px_white] animate-[pulse_2s_infinite]"></div>
                    </div>
                </div>
            )
        default: return null
    }
}

function SimulatedSprite({ agent, selectedAgent, onSelect, bounds, startX }) {
    const isWalking = agent.action === 'walking'
    const isSelected = selectedAgent === agent.id

    return (
        <motion.div
            className="absolute bottom-1.5 z-20 cursor-pointer group flex flex-col items-center justify-end"
            onClick={() => onSelect(agent.id === selectedAgent ? null : agent.id)}
            initial={{ x: startX }}
            animate={{
                x: isWalking ? [startX, startX + 50, startX - 30, startX] : startX,
                y: agent.action === 'typing' ? [0, -4, 0, -2, 0] : [0, -2, 0]
            }}
            transition={{
                duration: isWalking ? 10 : (agent.action === 'typing' ? 0.4 : 2),
                repeat: Infinity,
                ease: "easeInOut"
            }}
        >
            <AnimatePresence>
                {(isSelected || Math.random() > 0.95) && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: -20 }}
                        exit={{ opacity: 0, scale: 0.8, y: 10 }}
                        className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-xl text-white text-[10px] px-3 py-1.5 rounded-xl border border-white/20 shadow-[0_0_20px_rgba(0,0,0,0.8)] whitespace-nowrap z-50 font-bold flex items-center gap-1.5"
                    >
                        <div className={`w-1.5 h-1.5 rounded-full bg-${agent.color}-400 animate-pulse shadow-[0_0_5px_currentColor]`}></div>
                        {agent.status}
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black/80 rotate-45 border-r border-b border-white/20"></div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="text-[40px] leading-none flex items-center justify-center filter drop-shadow-[0_5px_15px_rgba(0,0,0,0.6)] relative z-10 w-[44px] h-[48px] pb-1">
                {agent.avatar}
                {isSelected && <div className="absolute inset-0 bg-white/20 blur-xl rounded-full scale-150 -z-10 animate-pulse"></div>}
            </div>
            <div className="w-8 h-1.5 bg-black/60 rounded-[100%] absolute bottom-0 blur-[2px] -z-10"></div>
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-md border border-white/10 text-white/90 text-[9px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-glow z-40">
                {agent.name}
            </div>
        </motion.div>
    )
}

export default function VirtualFloor() {
    const [selectedAgent, setSelectedAgent] = useState(null)
    const [timeInGame, setTimeInGame] = useState('09:00 AM')

    // AI Chat States
    const [chatInput, setChatInput] = useState('')
    const [chatReply, setChatReply] = useState('')
    const [isChatting, setIsChatting] = useState(false)

    // CEO Global Command States
    const [commandInput, setCommandInput] = useState('')
    const [chainSteps, setChainSteps] = useState([]) // For multi-agent flow
    const [activeStepDetail, setActiveStepDetail] = useState(null) // For clickable steps
    const [showModalApproval, setShowModalApproval] = useState(false)
    const [history, setHistory] = useState(() => {
        try {
            const saved = localStorage.getItem('strategic_history');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.error("Archive Load Error:", e);
            return [];
        }
    })
    const [showHistory, setShowHistory] = useState(false)

    const commandInputRef = useRef(null)

    // Save to history helper
    const saveToHistory = (entry) => {
        const newHistory = [entry, ...history].slice(0, 10);
        setHistory(newHistory);
        localStorage.setItem('strategic_history', JSON.stringify(newHistory));
    }

    // Ctrl+K Shortcut for Strategic Terminal
    useEffect(() => {
        const handleKeyPress = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                commandInputRef.current?.focus();
            }
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, []);

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
            setUserThought(data.thought || '');
            setChatReply(data.reply);
            setChatInput(''); // clear input on success

        } catch (error) {
            console.error("Chat Error:", error);
            setChatReply('无法连接到通讯网络，请确保 M.E. Corp 终端已启动。');
        } finally {
            setIsChatting(false)
        }
    }

    const [userThought, setUserThought] = useState('')

    const handleCommandSubmit = async () => {
        if (!commandInput.trim()) return

        setIsChatting(true)
        setChainSteps([])
        setChatReply('')
        setSelectedAgent('ceo') // Focus on CEO for global commands
        setShowModalApproval(false)

        try {
            const res = await fetch('http://localhost:3002/api/agents/command', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: commandInput })
            });

            if (!res.ok) throw new Error('Network error');
            const data = await res.json();

            setChainSteps(data.steps || []);
            setChatReply(data.finalReply);
            setCommandInput('');

            // If it's a CEO decision, show modal and save history
            const ceoStep = data.steps?.find(s => s.agentId === 'ceo');
            if (ceoStep) {
                setShowModalApproval(true);
                saveToHistory({
                    timestamp: new Date().toISOString(),
                    command: commandInput,
                    steps: data.steps,
                    finalReply: data.finalReply
                });
            }

        } catch (error) {
            console.error("Command Error:", error);
            setChatReply('远程决策链路中断，请检查 M.E. Corp 核心服务器。');
        } finally {
            setIsChatting(false)
        }
    }

    const closeHUD = () => {
        setSelectedAgent(null);
        setChatReply('');
        setChatInput('');
        setUserThought('');
        setChainSteps([]);
        setActiveStepDetail(null);
    }

    return (
        <div className="corp-card mb-8 relative overflow-hidden bg-[#0A0D14] min-h-[900px] flex flex-col border border-white/5 shadow-2xl">

            {/* Background Atmosphere */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMGh0MHY0MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0wIDEwaDQwTTAgMjBoNDBNMCAzMGh0ME0xMCAwdjQwTTIwIDB2NDBNMzAgMHY0MCIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3N2Zz4=')] opacity-50"></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none"></div>
            </div>

            {/* Game UI HUD (Top Bar & CEO Command Center) */}
            <div className="relative z-20 flex flex-col gap-4 p-6 pointer-events-none">
                <div className="flex justify-between items-start">
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

                {/* Global CEO Strategic Command Bar */}
                <div className="w-full max-w-2xl mx-auto mt-2 pointer-events-auto">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative flex items-center bg-black/60 backdrop-blur-2xl border border-white/10 rounded-2xl px-6 py-4 shadow-2xl">
                            <div className="flex items-center gap-3 mr-4 border-r border-white/10 pr-4">
                                <span className="text-xl">👑</span>
                                <span className="text-[10px] font-bold text-purple-400 tracking-tighter uppercase whitespace-nowrap">CEO Strategic<br />Terminal</span>
                            </div>
                            <input
                                ref={commandInputRef}
                                type="text"
                                value={commandInput}
                                onChange={(e) => setCommandInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleCommandSubmit()}
                                placeholder="输入战略指令（如：我想买一台 6800 的电脑）..."
                                className="flex-1 bg-transparent border-none text-white focus:ring-0 placeholder-white/20 text-sm font-medium pr-4"
                            />
                            <div className="hidden md:flex items-center gap-2 mr-4 bg-white/5 px-2 py-1 rounded-md border border-white/5">
                                <span className="text-[9px] text-white/40 font-mono">CTRL + K</span>
                            </div>
                            <button
                                onClick={() => setShowHistory(true)}
                                className="mr-2 p-2 text-white/40 hover:text-purple-400 transition-colors rounded-lg bg-white/5 border border-white/5"
                                title="战略档案历史"
                            >
                                <History size={18} />
                            </button>
                            <button
                                onClick={handleCommandSubmit}
                                disabled={isChatting || !commandInput.trim()}
                                className="bg-purple-600 hover:bg-purple-500 disabled:opacity-30 text-white font-bold text-[11px] px-5 py-2 rounded-lg transition-all shadow-glow flex items-center gap-2"
                            >
                                {isChatting ? <Loader2 size={14} className="animate-spin" /> : '战略分发'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Side-View Tower (Restored Premium CSS Version) */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-end pb-12 pt-8">

                {/* Roof */}
                <div className="w-[820px] h-8 bg-gradient-to-b from-white/10 to-transparent border-t border-x border-white/10 rounded-t-3xl mb-2 flex items-center justify-center relative">
                    <div className="w-20 h-1 bg-white/20 rounded-full"></div>
                    <div className="absolute bottom-full left-[20%] w-1 h-12 bg-white/10">
                        <div className="w-2 h-2 rounded-full bg-red-500 absolute -top-1 -left-0.5 animate-pulse"></div>
                    </div>
                    <div className="absolute bottom-full right-[20%] w-0.5 h-8 bg-white/10"></div>
                </div>

                {/* The Building Layout */}
                <div className="flex flex-col gap-2 w-[800px]">

                    {/* Floor 5: Penthouse (CEO) */}
                    <div className="w-full h-40 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl relative overflow-hidden group hover:border-purple-500/50 transition-colors">
                        <RoomBackground color="purple" label="总裁中枢 & 记忆核心 (CEO & RAG Memory)" />
                        <RoomProps type="ceo" />
                        <SimulatedSprite agent={AGENTS[0]} selectedAgent={selectedAgent} onSelect={setSelectedAgent} bounds={700} startX={300} />
                    </div>

                    {/* Floor 4: Core Business (Finance, Legal, Commerce) */}
                    <div className="w-full h-32 flex gap-2">
                        <div className="flex-[3] bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl relative overflow-hidden group hover:border-emerald-500/50 transition-colors">
                            <RoomBackground color="emerald" label={AGENTS[1].role} />
                            <RoomProps type="finance" />
                            <SimulatedSprite agent={AGENTS[1]} selectedAgent={selectedAgent} onSelect={setSelectedAgent} bounds={200} startX={100} />
                        </div>
                        <div className="flex-[2] bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl relative overflow-hidden group hover:border-slate-500/50 transition-colors">
                            <RoomBackground color="slate" label={AGENTS[2].role} />
                            <RoomProps type="legal" />
                            <SimulatedSprite agent={AGENTS[2]} selectedAgent={selectedAgent} onSelect={setSelectedAgent} bounds={150} startX={50} />
                        </div>
                        <div className="flex-[3] bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl relative overflow-hidden group hover:border-orange-500/50 transition-colors">
                            <RoomBackground color="orange" label={AGENTS[3].role} />
                            <RoomProps type="commerce" />
                            <SimulatedSprite agent={AGENTS[3]} selectedAgent={selectedAgent} onSelect={setSelectedAgent} bounds={200} startX={80} />
                        </div>
                    </div>

                    {/* Floor 3: Product & Market (R&D, PR) */}
                    <div className="w-full h-32 flex gap-2">
                        <div className="flex-[3] bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl relative overflow-hidden group hover:border-cyan-500/50 transition-colors">
                            <RoomBackground color="cyan" label={AGENTS[4].role} />
                            <RoomProps type="rd" />
                            <SimulatedSprite agent={AGENTS[4]} selectedAgent={selectedAgent} onSelect={setSelectedAgent} bounds={400} startX={180} />
                        </div>
                        <div className="flex-[2] bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl relative overflow-hidden group hover:border-pink-500/50 transition-colors">
                            <RoomBackground color="pink" label={AGENTS[5].role} />
                            <RoomProps type="pr" />
                            <SimulatedSprite agent={AGENTS[5]} selectedAgent={selectedAgent} onSelect={setSelectedAgent} bounds={200} startX={80} />
                        </div>
                    </div>

                    {/* Floor 2: Internal Structure (HR, Operations, Admin) */}
                    <div className="w-full h-32 flex gap-2">
                        <div className="flex-[2] bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl relative overflow-hidden group hover:border-rose-500/50 transition-colors">
                            <RoomBackground color="rose" label={AGENTS[6].role} />
                            <RoomProps type="hr" />
                            <SimulatedSprite agent={AGENTS[6]} selectedAgent={selectedAgent} onSelect={setSelectedAgent} bounds={150} startX={40} />
                        </div>
                        <div className="flex-[3] bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl relative overflow-hidden group hover:border-blue-500/50 transition-colors">
                            <RoomBackground color="blue" label={AGENTS[7].role} />
                            <RoomProps type="ops" />
                            <SimulatedSprite agent={AGENTS[7]} selectedAgent={selectedAgent} onSelect={setSelectedAgent} bounds={250} startX={100} />
                        </div>
                        <div className="flex-[2] bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl relative overflow-hidden group hover:border-yellow-500/50 transition-colors">
                            <RoomBackground color="yellow" label={AGENTS[8].role} />
                            <RoomProps type="admin" />
                            <SimulatedSprite agent={AGENTS[8]} selectedAgent={selectedAgent} onSelect={setSelectedAgent} bounds={150} startX={50} />
                        </div>
                    </div>

                    {/* Floor 1: Facilities & Well-being (Health, Travel) */}
                    <div className="w-full h-32 flex gap-2">
                        <div className="flex-[1] bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl relative overflow-hidden group hover:border-amber-500/50 transition-colors">
                            <RoomBackground color="amber" label={AGENTS[9].role} />
                            <RoomProps type="health" />
                            <SimulatedSprite agent={AGENTS[9]} selectedAgent={selectedAgent} onSelect={setSelectedAgent} bounds={350} startX={150} />
                        </div>
                        <div className="flex-[1] bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl relative overflow-hidden group hover:border-indigo-500/50 transition-colors">
                            <RoomBackground color="indigo" label={AGENTS[10].role} />
                            <RoomProps type="travel" />
                            <SimulatedSprite agent={AGENTS[10]} selectedAgent={selectedAgent} onSelect={setSelectedAgent} bounds={350} startX={150} />
                        </div>
                    </div>

                </div>

                {/* Ground */}
                <div className="w-[110%] h-8 mt-4 border-t-2 border-white/20 bg-gradient-to-b from-white/5 to-transparent rounded-t-[50%] opacity-50 relative">
                </div>
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
                            {/* Chain of Thought Visualization */}
                            {chainSteps.length > 0 && (
                                <div className="flex flex-col gap-2 mb-2">
                                    <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                                        <Activity size={10} /> 部门决策协同链条 (Multi-Agent Chain)
                                    </div>
                                    <div className="flex flex-col gap-1.5 pl-2 border-l border-white/10">
                                        {chainSteps.map((step, idx) => (
                                            <motion.div
                                                key={idx}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.2 }}
                                                className="text-[11px] leading-relaxed group cursor-pointer"
                                                onClick={() => setActiveStepDetail(step)}
                                            >
                                                <div className="flex items-center gap-2 text-white/50 group-hover:text-white/80 transition-colors">
                                                    <span className="font-bold text-purple-400">[{AGENTS.find(a => a.id === step.agentId)?.role || step.agentId}]</span>
                                                    <span className="italic opacity-60 truncate max-w-[280px]">{step.thought}</span>
                                                    <ChevronRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* v2.2 Active Step Detail Display */}
                            {activeStepDetail && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-black/60 border border-white/10 p-4 rounded-xl mb-2 relative"
                                >
                                    <button
                                        onClick={() => setActiveStepDetail(null)}
                                        className="absolute top-2 right-2 text-white/30 hover:text-white"
                                    >
                                        <XCircle size={14} />
                                    </button>
                                    <div className="text-[10px] font-bold text-purple-400 mb-2 flex items-center gap-2">
                                        <MessageSquareQuote size={12} /> {AGENTS.find(a => a.id === activeStepDetail.agentId)?.role} 深度反馈
                                    </div>
                                    <div className="text-[11px] text-white/80 leading-relaxed font-mono">
                                        <div className="text-white/40 mb-1 border-b border-white/5 pb-1">[思维轨迹]:</div>
                                        {activeStepDetail.thought}
                                    </div>
                                    <div className="text-[11px] text-purple-200/90 leading-relaxed mt-3 p-2 bg-purple-500/5 rounded">
                                        <div className="text-white/40 mb-1">执行报告:</div>
                                        {activeStepDetail.reply}
                                    </div>
                                </motion.div>
                            )}

                            {!chainSteps.length && userThought && (
                                <div className="text-[10px] text-purple-400 font-mono opacity-60 mb-1 italic">
                                    [Thinking]: {userThought.substring(0, 100)}...
                                </div>
                            )}

                            {chatReply && (
                                <AnimatePresence mode="wait">
                                    {chainSteps.length > 0 && chainSteps.some(s => s.agentId === 'ceo') ? (
                                        <button
                                            onClick={() => setShowModalApproval(true)}
                                            className="w-full p-4 bg-emerald-500/20 border border-emerald-500/30 hover:bg-emerald-500/30 transition-all rounded-xl text-emerald-200 flex items-center justify-center gap-3 shadow-glow group"
                                        >
                                            <FileText size={18} className="group-hover:scale-110 transition-transform" />
                                            <div className="text-left">
                                                <div className="text-xs font-bold uppercase tracking-widest">战略决策已签署</div>
                                                <div className="text-[10px] opacity-60">点击查看数字化签批公文</div>
                                            </div>
                                        </button>
                                    ) : (
                                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="p-4 bg-purple-500/10 border border-purple-500/20 shadow-glow rounded-xl text-sm text-purple-100">
                                            <p className="whitespace-pre-wrap leading-relaxed">
                                                {chainSteps.length > 0 && <span className="block text-[10px] font-bold text-purple-400 mb-2 uppercase tracking-tighter border-b border-purple-500/20 pb-1">Final Strategic Order / 最终战略指令</span>}
                                                {chatReply}
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
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

            {/* v2.2 Global Modals */}
            <AnimatePresence>
                {showModalApproval && (
                    <ApprovalSlip
                        decision={chainSteps.find(s => s.agentId === 'ceo')?.metadata?.decision || 'pending'}
                        report={chatReply}
                        thought={chainSteps.find(s => s.agentId === 'ceo')?.thought}
                        adaRisk={chainSteps.find(s => s.agentId === 'finance')?.metadata?.riskLevel || 'LOW'}
                        onClose={() => setShowModalApproval(false)}
                    />
                )}

                {showHistory && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-end bg-black/60 backdrop-blur-md"
                        onClick={() => setShowHistory(false)}
                    >
                        <motion.div
                            initial={{ x: 400 }}
                            animate={{ x: 0 }}
                            exit={{ x: 400 }}
                            className="w-[400px] h-full bg-[#0A0D14] border-l border-white/10 p-8 shadow-2xl flex flex-col gap-6"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center border-b border-white/10 pb-4">
                                <h3 className="text-white font-bold text-lg flex items-center gap-2">
                                    <History className="text-purple-400" /> 战略档案 (Archive)
                                </h3>
                                <button onClick={() => setShowHistory(false)} className="text-white/40 hover:text-white">
                                    <XCircle size={20} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                                {history.length === 0 && (
                                    <div className="text-center py-20 text-white/20 italic">
                                        暂无历史决策记录
                                    </div>
                                )}
                                {history.map((entry, idx) => (
                                    <div
                                        key={idx}
                                        className="p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all cursor-pointer group"
                                        onClick={() => {
                                            setChainSteps(entry.steps);
                                            setChatReply(entry.finalReply);
                                            setShowModalApproval(true);
                                            setShowHistory(false);
                                        }}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-[10px] text-white/40 font-mono">{new Date(entry.timestamp).toLocaleString()}</span>
                                            <div className={`w-2 h-2 rounded-full ${entry.steps.find(s => s.agentId === 'ceo')?.metadata?.decision === 'approve' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                                        </div>
                                        <div className="text-sm text-white font-medium group-hover:text-purple-300 transition-colors line-clamp-2">
                                            {entry.command}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
