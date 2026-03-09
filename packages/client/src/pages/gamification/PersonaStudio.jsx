import { useState, useEffect } from 'react'
import PageHeader from '../../components/PageHeader'
import { Users, Settings2, Save, CheckCircle2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const DEFAULT_AGENTS = [
    { id: 'triage', role: '接待前台 (Triage)', defaultIcon: '🤖', defaultName: 'Front Desk', tone: '八面玲珑，绝对客观。分拣指令并启动协同链条。', model: 'deepseek-v3' },
    { id: 'strategy', role: '战略规划办 (Strategy)', defaultIcon: '🧠', defaultName: 'Visionary', tone: '填缝找补，逻辑严密，不择手段实现你的构想。', model: 'deepseek-v3' },
    { id: 'review', role: '审核委员会 (Review)', defaultIcon: '⚖️', defaultName: 'Guardian', tone: '极度死板的合规风控机器。对预算和健康进行严苛审查。', model: 'deepseek-v3' },
    { id: 'dispatch', role: '运营调度中心 (Ops Hub)', defaultIcon: '📮', defaultName: 'Dispatcher', tone: '严厉的周报催命鬼。派发任务并汇总各部门执行结果。', model: 'deepseek-v3' },
    { id: 'finance', role: '财务部 (CFO)', defaultIcon: '💰', defaultName: 'Ada', tone: '铁面管家，毒舌节俭。死守预算红线，管理专项融资。', model: 'deepseek-v3' },
    { id: 'ops', role: '运营部 (COO)', defaultIcon: '⚙️', defaultName: 'Max', tone: '魔鬼教练，高标准。将愿景转化为极端细致的执行任务。', model: 'gpt-4o' },
    { id: 'audit', role: '审计办 (CAO)', defaultIcon: '🛡️', defaultName: 'Zane', tone: '秋后算账，毒舌点评。每晚准时盘点任务达成率与拖延指数。', model: 'deepseek-v3' },
    { id: 'health', role: '健康中心 (CWO)', defaultIcon: '🩺', defaultName: 'Dr.Chen', tone: '私人医生，温柔坚定。监控疲劳值，拥有一票否决权。', model: 'deepseek-v3' },
    { id: 'rd', role: '研发部 (CTO)', defaultIcon: '💻', defaultName: 'Neo', tone: '技能研发与项目孵化。对接最新 AI 技术栈与 Side Projects。', model: 'gpt-4o' },
    { id: 'pr', role: '公关部 (CPO)', defaultIcon: '🤝', defaultName: 'Lisa', tone: '贴心秘书，温暖细腻。管理人脉关系网，提醒重要社交节点', model: 'claude-3.5-sonnet' },
    { id: 'commerce', role: '商务部 (CSO)', defaultIcon: '📈', defaultName: 'Victor', tone: '搞钱与恰饭。寻找副业收入流，优化投资回报率。', model: 'deepseek-v3' },
    { id: 'legal', role: '法务部 (CLO)', defaultIcon: '📜', defaultName: 'Counselor', tone: '绝境长城。审核各类合同协议，识别潜在法律风险。', model: 'deepseek-v3' },
    { id: 'admin', role: '行政部 (CAO)', defaultIcon: '🏠', defaultName: 'Ben', tone: '物资与防呆。管理固定资产台账，追踪订阅服务到期。', model: 'deepseek-v3' },
    { id: 'travel', role: '差旅中心', defaultIcon: '✈️', defaultName: 'Sky', tone: '向外探索。安排路书、预订行程并自动化处理报销回表。', model: 'deepseek-v3' }
]

export default function PersonaStudio() {
    const [ceoName, setCeoName] = useState('Boss')
    const [greetingStyle, setGreetingStyle] = useState('formal')
    const [agents, setAgents] = useState([])
    const [saved, setSaved] = useState(false)

    useEffect(() => {
        const storedConfigs = JSON.parse(localStorage.getItem('me-corp-agent-configs') || '[]')
        const storedCeoName = localStorage.getItem('me-corp-ceo-name') || 'Boss'
        const storedGreeting = localStorage.getItem('me-corp-greeting-style') || 'formal'

        setCeoName(storedCeoName)
        setGreetingStyle(storedGreeting)

        const merged = DEFAULT_AGENTS.map(agent => {
            const config = storedConfigs.find(c => c.id === agent.id)
            return {
                ...agent,
                name: config?.name || agent.defaultName,
                tone: config?.tone || agent.tone,
                model: config?.model || agent.model
            }
        })
        setAgents(merged)
    }, [])

    const handleSave = () => {
        localStorage.setItem('me-corp-ceo-name', ceoName)
        localStorage.setItem('me-corp-greeting-style', greetingStyle)
        localStorage.setItem('me-corp-agent-configs', JSON.stringify(agents.map(a => ({
            id: a.id,
            name: a.name,
            tone: a.tone,
            model: a.model
        }))))

        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
    }

    const updateAgent = (id, field, value) => {
        setAgents(prev => prev.map(a => a.id === id ? { ...a, [field]: value } : a))
    }

    return (
        <div>
            <PageHeader icon={Users} title="人设终端配置" subtitle="高管人设与全局定制">
                <button
                    onClick={handleSave}
                    className={`btn ${saved ? 'bg-green-500 hover:bg-green-600' : 'btn-primary'} flex items-center gap-2 transition-all`}
                >
                    {saved ? <CheckCircle2 size={16} /> : <Save size={16} />}
                    {saved ? '配置已同步' : '保存配置'}
                </button>
            </PageHeader>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
                {/* Global CEO Settings */}
                <div className="corp-card lg:col-span-1 h-fit relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 to-transparent rounded-[20px] pointer-events-none"></div>
                    <h3 className="text-sm font-bold text-white mb-6 border-b border-white/5 pb-3 flex items-center gap-2 relative z-10">
                        <Settings2 className="text-blue-400" size={18} /> CEO 偏好设定
                    </h3>

                    <div className="space-y-5 relative z-10">
                        <div>
                            <label className="block text-xs font-medium text-corp-muted/80 mb-1.5 uppercase tracking-wider">智能体对你的称呼</label>
                            <input
                                type="text"
                                value={ceoName}
                                onChange={(e) => setCeoName(e.target.value)}
                                className="corp-input w-full"
                                placeholder="例如: Boss, 船长, 老板"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-corp-muted/80 mb-1.5 uppercase tracking-wider">每日早会汇报风格</label>
                            <select
                                value={greetingStyle}
                                onChange={(e) => setGreetingStyle(e.target.value)}
                                className="corp-input w-full"
                            >
                                <option value="formal" className="bg-corp-bg">正式商务风</option>
                                <option value="casual" className="bg-corp-bg">轻松随意风</option>
                                <option value="fun" className="bg-corp-bg">幽默搞怪风</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Agents List */}
                <div className="lg:col-span-2 space-y-4">
                    {agents.map((agent) => (
                        <motion.div
                            key={agent.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="corp-card py-5 hover:border-purple-500/30 group"
                        >
                            <div className="flex items-start gap-5">
                                <div className="text-4xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-glow transition-shadow relative overflow-hidden backdrop-blur-md">
                                    <div className="absolute inset-0 bg-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <span className="relative z-10">{agent.defaultIcon}</span>
                                </div>
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-[11px] font-bold text-corp-muted/80 uppercase tracking-wider mb-1.5">代号与展示名称</label>
                                        <div className="flex gap-2">
                                            <span className="inline-flex items-center px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-bold text-purple-400 w-16 justify-center">
                                                {agent.id.toUpperCase()}
                                            </span>
                                            <input
                                                type="text"
                                                value={agent.name}
                                                onChange={(e) => updateAgent(agent.id, 'name', e.target.value)}
                                                className="corp-input flex-1 py-1 px-3"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-corp-muted/80 uppercase tracking-wider mb-1.5">默认底层模型</label>
                                        <select
                                            value={agent.model}
                                            onChange={(e) => updateAgent(agent.id, 'model', e.target.value)}
                                            className="corp-input w-full py-1.5 px-3 appearance-none"
                                        >
                                            <option value="deepseek-v3" className="bg-corp-bg">DeepSeek V3 (速度+成本)</option>
                                            <option value="claude-3.5-sonnet" className="bg-corp-bg">Claude 3.5 Sonnet (长文/代码)</option>
                                            <option value="gpt-4o" className="bg-corp-bg">GPT-4o (全能)</option>
                                        </select>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-[11px] font-bold text-corp-muted/80 uppercase tracking-wider mb-1.5">性格与 Prompt Tone ({agent.role})</label>
                                        <input
                                            type="text"
                                            value={agent.tone}
                                            onChange={(e) => updateAgent(agent.id, 'tone', e.target.value)}
                                            className="corp-input w-full py-1.5 px-3"
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )
}
