import { useState } from 'react'
import PageHeader from '../../components/PageHeader'
import { Users, Settings2, Save } from 'lucide-react'
import { motion } from 'framer-motion'

const DEFAULT_AGENTS = [
    { id: 'cfo', defaultName: 'Ada', defaultIcon: '👩‍💼', role: 'CFO (财务总监)', tone: '铁面管家，毒舌节俭', model: 'deepseek-v3' },
    { id: 'coo', defaultName: 'Max', defaultIcon: '👔', role: 'COO (运营总监)', tone: '魔鬼教练，高标准', model: 'gpt-4o' },
    { id: 'cpo', defaultName: 'Lisa', defaultIcon: '🤝', role: 'CPO (公关总监)', tone: '贴心秘书，温暖细腻', model: 'claude-3.5-sonnet' },
    { id: 'cwo', defaultName: 'Dr.Chen', defaultIcon: '🩺', role: 'CWO (健康总监)', tone: '私人医生，温柔坚定', model: 'deepseek-v3' }
]

export default function PersonaStudio() {
    const [ceoName, setCeoName] = useState('Boss')
    const [greetingStyle, setGreetingStyle] = useState('formal')

    return (
        <div>
            <PageHeader icon={Users} title="人设终端配置" subtitle="高管人设与全局定制">
                <button className="btn btn-primary flex items-center gap-2">
                    <Save size={16} /> 保存配置
                </button>
            </PageHeader>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                    <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                        高管雇员档案
                    </h3>

                    {DEFAULT_AGENTS.map((agent) => (
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
                                        <label className="block text-[11px] font-bold text-corp-muted/80 uppercase tracking-wider mb-1.5">代号与名字</label>
                                        <div className="flex gap-2">
                                            <span className="inline-flex items-center px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-bold text-purple-400 w-16 justify-center">
                                                {agent.id.toUpperCase()}
                                            </span>
                                            <input type="text" defaultValue={agent.defaultName} className="corp-input flex-1 py-1 px-3" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-corp-muted/80 uppercase tracking-wider mb-1.5">默认底层模型</label>
                                        <select defaultValue={agent.model} className="corp-input w-full py-1.5 px-3 appearance-none">
                                            <option value="deepseek-v3" className="bg-corp-bg">DeepSeek V3 (速度+成本)</option>
                                            <option value="claude-3.5-sonnet" className="bg-corp-bg">Claude 3.5 Sonnet (长文/代码)</option>
                                            <option value="gpt-4o" className="bg-corp-bg">GPT-4o (全能)</option>
                                        </select>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-[11px] font-bold text-corp-muted/80 uppercase tracking-wider mb-1.5">性格与 Prompt Tone</label>
                                        <input type="text" defaultValue={agent.tone} className="corp-input w-full py-1.5 px-3" />
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
