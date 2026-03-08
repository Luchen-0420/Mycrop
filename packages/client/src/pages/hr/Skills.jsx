import { useState, useEffect } from 'react'
import { Plus, Award, Star, Loader2 } from 'lucide-react'

import StatCard from '../../components/StatCard'

export default function Skills() {
    const [skills, setSkills] = useState([])
    const [loading, setLoading] = useState(true)
    const [newSkill, setNewSkill] = useState({ name: '', category: 'hard' })
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)

    useEffect(() => {
        fetchSkills()
    }, [])

    const fetchSkills = async () => {
        try {
            const res = await fetch('/api/hr/skills')
            if (res.ok) {
                const data = await res.json()
                setSkills(data)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleAddSkill = async (e) => {
        e.preventDefault()
        try {
            const res = await fetch('/api/hr/skills', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newSkill)
            })
            if (res.ok) {
                setIsAddModalOpen(false)
                setNewSkill({ name: '', category: 'hard' })
                fetchSkills()
            }
        } catch (err) {
            console.error(err)
        }
    }

    const handleAddXp = async (skillId, xpToAdd = 10) => {
        try {
            const res = await fetch(`/api/hr/skills/${skillId}/xp`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ add_xp: xpToAdd })
            })
            if (res.ok) {
                fetchSkills()
            }
        } catch (err) {
            console.error(err)
        }
    }

    const categoryColors = {
        hard: 'bg-corporate-primary',
        soft: 'bg-corporate-success',
        language: 'bg-corporate-accent',
        life: 'bg-corporate-danger'
    }

    const categoryNames = {
        hard: '硬技能',
        soft: '软技能',
        language: '语言',
        life: '生活技能'
    }

    const totalSkills = skills.length
    const maxLevelSkills = skills.filter(s => s.level >= 5).length
    const avgLevel = totalSkills > 0 ? (skills.reduce((sum, s) => sum + s.level, 0) / totalSkills).toFixed(1) : 0

    if (loading) {
        return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-corporate-accent" /></div>
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard icon={Award} title="技能总数" value={totalSkills} color="blue" />
                <StatCard icon={Star} title="满级技能" value={maxLevelSkills} color="purple" />
                <StatCard icon={Award} title="平均等级" value={`Lv. ${avgLevel}`} color="yellow" />
            </div>

            <div className="flex justify-end">
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="btn-primary flex items-center space-x-2"
                >
                    <Plus size={16} />
                    <span>添加新技能</span>
                </button>
            </div>

            {/* Skills List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {skills.map(skill => (
                    <div key={skill.id} className="bg-corporate-800 rounded-xl p-5 border border-corporate-700 hover:border-corporate-600 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <div className="flex items-center space-x-3">
                                    <h4 className="text-lg font-bold">{skill.name}</h4>
                                    <span className={`px-2 py-0.5 rounded text-xs font-semibold text-white ${categoryColors[skill.category] || 'bg-corporate-600'}`}>
                                        {categoryNames[skill.category] || skill.category}
                                    </span>
                                </div>
                                <div className="text-corporate-text-secondary text-sm mt-1">Lv.{skill.level} 或 {skill.level >= 5 ? 'P5' : `P${skill.level}`} 级</div>
                            </div>

                            <button
                                onClick={() => handleAddXp(skill.id, 20)}
                                className="text-xs px-3 py-1.5 bg-corporate-900 border border-corporate-600 rounded hover:bg-corporate-700 transition"
                                title="手动增加 20 XP"
                            >
                                +20 XP
                            </button>
                        </div>

                        {/* XP Progress Bar */}
                        <div className="space-y-1">
                            <div className="flex justify-between text-xs text-corporate-text-secondary">
                                <span>{skill.xp} XP</span>
                                <span>{skill.max_xp} XP 升级</span>
                            </div>
                            <div className="h-2 w-full bg-corporate-900 rounded-full overflow-hidden">
                                <div
                                    className={`h-full ${categoryColors[skill.category] || 'bg-corporate-primary'} transition-all duration-500 ease-out`}
                                    style={{ width: `${Math.min(100, (skill.xp / skill.max_xp) * 100)}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                ))}

                {skills.length === 0 && (
                    <div className="col-span-full py-12 text-center text-corporate-text-secondary border-2 border-dashed border-corporate-700 rounded-xl">
                        <Award size={48} className="mx-auto mb-4 opacity-50" />
                        <p>还没有添加任何技能。</p>
                        <p className="text-sm mt-1">你的能力是公司最宝贵的资产，立刻开始构建技能树吧！</p>
                    </div>
                )}
            </div>

            {/* Add Skill Modal */}
            {
                isAddModalOpen && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-corporate-800 rounded-xl max-w-md w-full p-6 border border-corporate-700 shadow-2xl">
                            <h3 className="text-xl font-bold mb-4">添加新技能</h3>
                            <form onSubmit={handleAddSkill}>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-corporate-text-secondary mb-1">技能名称</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full bg-corporate-900 border border-corporate-700 rounded px-3 py-2 text-white outline-none focus:border-corporate-primary"
                                            placeholder="例如：Python 编程"
                                            value={newSkill.name}
                                            onChange={e => setNewSkill({ ...newSkill, name: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-corporate-text-secondary mb-1">技能分类</label>
                                        <select
                                            className="w-full bg-corporate-900 border border-corporate-700 rounded px-3 py-2 text-white outline-none focus:border-corporate-primary"
                                            value={newSkill.category}
                                            onChange={e => setNewSkill({ ...newSkill, category: e.target.value })}
                                        >
                                            <option value="hard">硬技能 (Hard Skill)</option>
                                            <option value="soft">软技能 (Soft Skill)</option>
                                            <option value="language">语言 (Language)</option>
                                            <option value="life">生活技能 (Life Skill)</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="mt-6 flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsAddModalOpen(false)}
                                        className="px-4 py-2 bg-corporate-900 hover:bg-corporate-700 border border-corporate-700 rounded text-sm transition"
                                    >
                                        取消
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn-primary text-sm"
                                    >
                                        确认添加
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
        </div >
    )
}
