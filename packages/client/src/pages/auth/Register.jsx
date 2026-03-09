import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Building2, Mail, Lock, User, ArrowRight, ArrowLeft, CheckCircle2, ShieldCheck, Briefcase, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '../../store/authStore'

const INITIAL_AGENTS = [
    { id: 'triage', role: '接待前台 (Triage)', avatar: '🤖', name: 'Front Desk', tone: '八面玲珑，绝对客观。分拣指令并启动协同链条。', type: 'governance' },
    { id: 'strategy', role: '战略规划办 (Strategy)', avatar: '🧠', name: 'Visionary', tone: '填缝找补，逻辑严密，不择手段实现你的构想。', type: 'governance' },
    { id: 'review', role: '审核委员会 (Review)', avatar: '⚖️', name: 'Guardian', tone: '极度死板的合规风控机器。对预算和健康进行严苛审查。', type: 'governance' },
    { id: 'dispatch', role: '运营调度中心 (Ops Hub)', avatar: '📮', name: 'Dispatcher', tone: '严厉的周报催命鬼。派发任务并汇总各部门执行结果。', type: 'governance' },
    { id: 'finance', role: '财务部 (CFO)', avatar: '💰', name: 'Ada', tone: '铁面管家，毒舌节俭。死守预算红线，管理专项融资。', type: 'execution' },
    { id: 'ops', role: '运营部 (COO)', avatar: '⚙️', name: 'Max', tone: '魔鬼教练，高标准。将愿景转化为极端细致的执行任务任务控制点。', type: 'execution' },
    { id: 'audit', role: '审计办 (CAO)', avatar: '🛡️', name: 'Zane', tone: '秋后算账，毒舌点评。每晚准时盘点任务达成率与拖延指数。', type: 'execution' },
    { id: 'health', role: '健康中心 (CWO)', avatar: '🩺', name: 'Dr.Chen', tone: '私人医生，温柔坚定。监控疲劳值，拥有一票否决权。', type: 'execution' },
    { id: 'rd', role: '研发部 (CTO)', avatar: '💻', name: 'Neo', tone: '技能研发与项目孵化。对接最新 AI 技术栈与 Side Projects。', type: 'execution' },
    { id: 'pr', role: '公关部 (CPO)', avatar: '🤝', name: 'Lisa', tone: '贴心秘书，温暖细腻。管理人脉关系网，提醒重要社交节点。', type: 'execution' },
    { id: 'commerce', role: '商务部 (CSO)', avatar: '📈', name: 'Victor', tone: '搞钱与恰饭。寻找副业收入流，优化投资回报率。', type: 'execution' },
    { id: 'legal', role: '法务部 (CLO)', avatar: '📜', name: 'Counselor', tone: '绝境长城。审核各类合同协议，识别潜在法律风险。', type: 'execution' },
    { id: 'admin', role: '行政部 (CAO)', avatar: '🏠', name: 'Ben', tone: '物资与防呆。管理固定资产台账，追踪订阅服务到期。', type: 'execution' },
    { id: 'travel', role: '差旅中心', avatar: '✈️', name: 'Sky', tone: '向外探索。安排路书、预订行程并自动化处理报销回表。', type: 'execution' }
]

export default function Register() {
    const [step, setStep] = useState(1)
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [agents, setAgents] = useState(INITIAL_AGENTS)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()
    const setAuth = useAuthStore((state) => state.setAuth)

    const handleNextStep = (e) => {
        e.preventDefault()
        setError('')
        if (password !== confirmPassword) {
            setError('两次输入的密码不一致')
            return
        }
        setStep(2)
    }

    const handleAgentChange = (id, field, value) => {
        setAgents(prev => prev.map(a => a.id === id ? { ...a, [field]: value } : a))
    }

    const handleRegister = async () => {
        setLoading(true)
        setError('')

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || '注册失败')
            }

            // 保存 Agent 配置到 localStorage
            localStorage.setItem('me-corp-agent-configs', JSON.stringify(agents))
            localStorage.setItem('me-corp-ceo-name', username)

            setAuth(data.token, data.user)
            setStep(3)
        } catch (err) {
            setError(err.message)
            setStep(1) // 发生错误回到第一步
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={`min-h-screen bg-corp-bg text-white flex flex-col ${step === 1 ? 'items-center justify-center' : 'items-center pt-8 md:pt-16 pb-12'} p-4 relative overflow-x-hidden font-outfit`}>
            {/* Background Glow */}
            <div className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-corp-accent/10 rounded-full blur-[120px] opacity-30" />
            </div>

            {/* Progress Stepper */}
            {step < 3 && (
                <div className="max-w-md w-full mb-8 flex items-center justify-between relative z-10 px-4">
                    {[1, 2].map((s) => (
                        <div key={s} className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${step >= s ? 'border-corp-accent bg-corp-accent text-white shadow-glow' : 'border-corp-border bg-white/5 text-corp-muted'
                                }`}>
                                {step > s ? <CheckCircle2 size={16} /> : s}
                            </div>
                            <span className={`text-xs font-bold uppercase tracking-widest ${step >= s ? 'text-white' : 'text-corp-muted'}`}>
                                {s === 1 ? '身份认证' : '组建团队'}
                            </span>
                        </div>
                    ))}
                </div>
            )}

            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="corp-card w-full max-w-md relative z-10 p-8"
                    >
                        <div className="flex flex-col items-center mb-8">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-corp-accent to-purple-600 flex items-center justify-center mb-4 shadow-lg shadow-corp-accent/20">
                                <Building2 size={32} className="text-white" />
                            </div>
                            <h1 className="text-2xl font-bold tracking-tight">办理入职</h1>
                            <p className="text-sm text-corp-muted mt-2">第一步：注册您的 CEO 账号</p>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400 text-center">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleNextStep} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-corp-muted mb-1.5 uppercase tracking-wider">代号 / Username</label>
                                <div className="relative group/input">
                                    <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-corp-muted group-focus-within/input:text-corp-accent transition-colors z-20" />
                                    <input
                                        type="text" required
                                        value={username} onChange={(e) => setUsername(e.target.value)}
                                        className="corp-input w-full !pl-12 h-11 relative z-10"
                                        placeholder="CEO"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-corp-muted mb-1.5 uppercase tracking-wider">企业邮箱 / Email</label>
                                <div className="relative group/input">
                                    <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-corp-muted group-focus-within/input:text-corp-accent transition-colors z-20" />
                                    <input
                                        type="email" required
                                        value={email} onChange={(e) => setEmail(e.target.value)}
                                        className="corp-input w-full !pl-12 h-11 relative z-10"
                                        placeholder="ceo@mecorp.com"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-corp-muted mb-1.5 uppercase tracking-wider">安全口令 / Password</label>
                                <div className="relative group/input">
                                    <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-corp-muted group-focus-within/input:text-corp-accent transition-colors z-20" />
                                    <input
                                        type="password" required minLength={6}
                                        value={password} onChange={(e) => setPassword(e.target.value)}
                                        className="corp-input w-full !pl-12 h-11 relative z-10"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-corp-muted mb-1.5 uppercase tracking-wider">确认口令 / Confirm</label>
                                <div className="relative group/input">
                                    <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-corp-muted group-focus-within/input:text-corp-accent transition-colors z-20" />
                                    <input
                                        type="password" required minLength={6}
                                        value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="corp-input w-full !pl-12 h-11 relative z-10"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full mt-6 btn-primary flex items-center justify-center gap-2 group"
                            >
                                下一步：组建高管团队
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </form>

                        <p className="text-center text-sm text-corp-muted mt-8">
                            已有企业兵牌？ <Link to="/login" className="text-corp-accent hover:text-corp-accent-light transition ml-1">返回登录</Link>
                        </p>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="w-full max-w-4xl relative z-10"
                    >
                        <div className="flex flex-col items-center mb-8">
                            <h1 className="text-2xl font-bold tracking-tight">组建高管团队</h1>
                            <p className="text-sm text-corp-muted mt-2 text-center">配置您的 14 位 AI 雇员。您可以自定义他们的称呼与性格基调。</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[70vh] overflow-y-auto pr-3 custom-scrollbar relative z-20">
                            {agents.map((agent) => (
                                <div key={agent.id} className="corp-card p-4 hover:border-corp-accent/50 transition-colors">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="text-3xl bg-white/5 w-12 h-12 rounded-xl flex items-center justify-center border border-white/10">
                                            {agent.avatar}
                                        </div>
                                        <div>
                                            <div className={`text-[10px] font-bold uppercase tracking-tighter px-1.5 rounded ${agent.type === 'governance' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                                {agent.id.toUpperCase()}
                                            </div>
                                            <div className="text-xs text-corp-muted font-medium">{agent.role}</div>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <input
                                            type="text"
                                            value={agent.name}
                                            onChange={(e) => handleAgentChange(agent.id, 'name', e.target.value)}
                                            className="corp-input w-full text-sm py-1.5"
                                            placeholder="名称"
                                        />
                                        <textarea
                                            value={agent.tone}
                                            onChange={(e) => handleAgentChange(agent.id, 'tone', e.target.value)}
                                            className="corp-input w-full text-xs min-h-[60px] resize-none leading-relaxed"
                                            placeholder="性格设定"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 flex gap-4 max-w-md mx-auto">
                            <button
                                onClick={() => setStep(1)}
                                className="flex-1 py-2.5 rounded-xl border border-corp-border hover:bg-white/5 transition flex items-center justify-center gap-2 text-sm font-bold"
                            >
                                <ArrowLeft size={18} /> 返回修改
                            </button>
                            <button
                                onClick={handleRegister}
                                disabled={loading}
                                className="flex-[2] btn-primary py-2.5 flex items-center justify-center gap-2 group disabled:opacity-50"
                            >
                                {loading ? '正式入职中...' : '完成组建，激活公司'}
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div
                        key="step3"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-md relative z-10 flex flex-col items-center"
                    >
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="w-full corp-card p-1 relative overflow-hidden group mb-8"
                        >
                            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-corp-accent to-transparent opacity-50"></div>
                            <div className="p-8 flex flex-col items-center text-center">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-corp-accent to-purple-600 p-1 mb-6 shadow-2xl shadow-corp-accent/30 relative">
                                    <div className="absolute inset-0 rounded-full bg-corp-accent/20 animate-ping opacity-30"></div>
                                    <div className="w-full h-full rounded-full bg-corp-bg flex items-center justify-center">
                                        <User size={48} className="text-corp-accent" />
                                    </div>
                                </div>
                                <h1 className="text-3xl font-black italic tracking-tighter text-white uppercase italic">{username}</h1>
                                <div className="h-0.5 w-12 bg-corp-accent my-4"></div>
                                <div className="text-xs font-bold text-corp-accent uppercase tracking-[0.3em] mb-1">M.E. Corp 首席执行官</div>
                                <div className="text-[10px] text-corp-muted font-mono">{email}</div>
                                <div className="mt-6 flex items-center gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className="text-lg font-bold">14</div>
                                        <div className="text-[8px] uppercase tracking-widest text-corp-muted">高管直属部员</div>
                                    </div>
                                    <div className="w-[1px] h-8 bg-white/10"></div>
                                    <div className="flex flex-col items-center">
                                        <div className="text-lg font-bold">A</div>
                                        <div className="text-[8px] uppercase tracking-widest text-corp-muted">合规评级</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <div className="w-full grid grid-cols-4 md:grid-cols-7 gap-2 mb-10">
                            {agents.map((agent, i) => (
                                <motion.div
                                    key={agent.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 + i * 0.1 }}
                                    className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xl relative group/agent"
                                >
                                    {agent.avatar}
                                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-black/80 text-[8px] px-2 py-1 rounded opacity-0 group-hover/agent:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none border border-white/10 backdrop-blur-md">
                                        {agent.name} ({agent.id.toUpperCase()})
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 2.2 }}
                            className="flex flex-col items-center gap-4 w-full"
                        >
                            <div className="flex items-center gap-2 text-corp-accent animate-pulse">
                                <Sparkles size={16} />
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">系统环境初始化已完成</span>
                            </div>
                            <button
                                onClick={() => navigate('/')}
                                className="w-full btn-primary py-4 text-sm font-black uppercase tracking-[0.2em] shadow-glow-accent"
                            >
                                🏢 入驻公司大楼
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(139, 92, 246, 0.2);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(139, 92, 246, 0.4);
                }
                .shadow-glow {
                    box-shadow: 0 0 15px rgba(139, 92, 246, 0.5);
                }
                .shadow-glow-accent {
                    box-shadow: 0 4px 25px rgba(139, 92, 246, 0.4);
                }
            `}</style>
        </div>
    )
}
