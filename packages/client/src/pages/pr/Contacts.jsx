import { useState, useEffect } from 'react'
import { Plus, User, Tag, Calendar, Coffee, Loader2 } from 'lucide-react'

import StatCard from '../../components/StatCard'

export default function Contacts() {
    const [contacts, setContacts] = useState([])
    const [loading, setLoading] = useState(true)
    const [isAddMode, setIsAddMode] = useState(false)
    const [newContact, setNewContact] = useState({
        name: '', relationship: 'friend', tags: '', birthday: '', preferences: '', target_frequency: 30
    })

    useEffect(() => {
        fetchContacts()
    }, [])

    const fetchContacts = async () => {
        try {
            const res = await fetch('/api/pr/contacts')
            if (res.ok) {
                const data = await res.json()
                setContacts(data)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleAddContact = async (e) => {
        e.preventDefault()
        try {
            const res = await fetch('/api/pr/contacts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newContact)
            })
            if (res.ok) {
                setIsAddMode(false)
                setNewContact({ name: '', relationship: 'friend', tags: '', birthday: '', preferences: '', target_frequency: 30 })
                fetchContacts()
            }
        } catch (err) {
            console.error(err)
        }
    }

    const relationshipColors = {
        family: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
        friend: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        colleague: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        mentor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
        client: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    }

    const relationshipLabels = {
        family: '家人', friend: '朋友', colleague: '同事', mentor: '导师', client: '客户/老板'
    }

    const coreContacts = contacts.filter(c => c.relationship === 'client' || c.relationship === 'mentor').length
    // This is a placeholder, real logic would come from maintenance data
    const needsMaintenance = contacts.length > 5 ? 3 : 0 

    if (loading) return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-corp-accent" /></div>

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard icon={User} title="人脉总数" value={contacts.length} color="blue" />
                <StatCard icon={Coffee} title="核心利益" value={coreContacts} color="purple" />
                <StatCard icon={Calendar} title="待维系" value={needsMaintenance} color="yellow" />
            </div>

            <div className="flex justify-end">
                <button onClick={() => setIsAddMode(!isAddMode)} className="btn-primary flex items-center space-x-2">
                    <Plus size={16} /> <span>录入新节点</span>
                </button>
            </div>

            {isAddMode && (
                <div className="bg-corp-surface rounded-xl p-5 border border-corp-accent/50 shadow-lg relative overflow-hidden mb-6">
                    <div className="absolute top-0 left-0 w-1 h-full bg-corp-accent"></div>
                    <form onSubmit={handleAddContact} className="flex flex-col gap-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs text-corp-muted mb-1">姓名 / 昵称</label>
                                <input type="text" required placeholder="例如: 投资人张总" value={newContact.name} onChange={e => setNewContact({ ...newContact, name: e.target.value })} className="w-full bg-corp-bg border border-corp-border rounded-lg px-3 py-2 text-white outline-none focus:border-corp-accent" />
                            </div>
                            <div>
                                <label className="block text-xs text-corp-muted mb-1">关系类别</label>
                                <select value={newContact.relationship} onChange={e => setNewContact({ ...newContact, relationship: e.target.value })} className="w-full bg-corp-bg border border-corp-border rounded-lg px-3 py-2 text-white outline-none focus:border-corp-accent">
                                    <option value="client">核心利益 (Client/Boss)</option>
                                    <option value="mentor">贵人引路 (Mentor/Sensei)</option>
                                    <option value="colleague">战友同僚 (Colleague)</option>
                                    <option value="friend">江湖知己 (Friend)</option>
                                    <option value="family">血亲家人 (Family)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs text-corp-muted mb-1">维系频率 (默认天数)</label>
                                <input type="number" min="1" required placeholder="30" value={newContact.target_frequency} onChange={e => setNewContact({ ...newContact, target_frequency: parseInt(e.target.value) })} className="w-full bg-corp-bg border border-corp-border rounded-lg px-3 py-2 text-white outline-none focus:border-corp-accent font-mono" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs text-corp-muted mb-1">生日 / 纪念日</label>
                                <input type="date" value={newContact.birthday} onChange={e => setNewContact({ ...newContact, birthday: e.target.value })} className="w-full bg-corp-bg border border-corp-border rounded-lg px-3 py-2 text-white outline-none focus:border-corp-accent" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs text-corp-muted mb-1">特征标签 (如: 钓鱼王, 喜欢喝茶)</label>
                                <input type="text" placeholder="用逗号分隔..." value={newContact.tags} onChange={e => setNewContact({ ...newContact, tags: e.target.value })} className="w-full bg-corp-bg border border-corp-border rounded-lg px-3 py-2 text-white outline-none focus:border-corp-accent" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs text-corp-muted mb-1">终极偏好与忌口 (极其重要！)</label>
                            <textarea rows="2" placeholder="如：此人绝对不吃香菜，严重花生过敏，喜欢收书，不喜欢被打扰私人时间..." value={newContact.preferences} onChange={e => setNewContact({ ...newContact, preferences: e.target.value })} className="w-full bg-corp-bg border border-corp-border rounded-lg px-3 py-2 text-white outline-none focus:border-corp-accent resize-none"></textarea>
                        </div>

                        <div className="flex justify-end space-x-3 mt-2">
                            <button type="button" onClick={() => setIsAddMode(false)} className="px-4 py-2 hover:bg-corp-border rounded-lg text-sm transition text-corp-muted">取消</button>
                            <button type="submit" className="btn-primary py-2 px-6 shadow">建档保存</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {contacts.map(contact => (
                    <div key={contact.id} className="corp-card p-5 relative group overflow-hidden">

                        {/* Header: Avatar, Name & Status */}
                        <div className="flex items-start justify-between mb-4 relative z-10">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 rounded-full bg-corp-surface flex items-center justify-center border-2 border-corp-border shadow-inner">
                                    <span className="text-lg font-bold text-white/80">{contact.name.substring(0, 1)}</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg text-white leading-tight">{contact.name}</h4>
                                    <div className={`mt-1 text-[10px] px-2 py-0.5 rounded border uppercase font-bold tracking-wider inline-block ${relationshipColors[contact.relationship]}`}>
                                        {relationshipLabels[contact.relationship]}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="space-y-3 relative z-10 text-sm">

                            {contact.tags && (
                                <div className="flex items-start space-x-2 text-corp-muted">
                                    <Tag size={14} className="mt-0.5 text-corp-accent flex-shrink-0" />
                                    <div className="flex flex-wrap gap-1">
                                        {contact.tags.split(',').map((tag, i) => (
                                            <span key={i} className="bg-corp-surface px-1.5 py-0.5 rounded text-xs">{tag.trim()}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {contact.birthday && (
                                <div className="flex items-center space-x-2 text-corp-muted">
                                    <Calendar size={14} className="text-corp-success flex-shrink-0" />
                                    <span className="text-xs">生诞日 / 纪念日: <span className="font-mono">{new Date(contact.birthday).toLocaleDateString()}</span></span>
                                </div>
                            )}

                            {contact.preferences && (
                                <div className="flex items-start space-x-2 text-corp-muted bg-corp-surface/50 p-2 rounded border border-corp-border/50">
                                    <Coffee size={14} className="mt-0.5 text-corp-warning flex-shrink-0" />
                                    <p className="text-xs italic leading-relaxed line-clamp-3" title={contact.preferences}>{contact.preferences}</p>
                                </div>
                            )}
                        </div>

                        {/* Footer stats */}
                        <div className="mt-5 pt-3 border-t border-corp-border/50 flex justify-between items-center relative z-10">
                            <div className="text-xs text-corp-muted">
                                距上次联系: <span className={`font-mono font-bold ${contact.days_since_last_contact > contact.target_frequency ? 'text-corp-danger' : 'text-white'}`}>{contact.days_since_last_contact}</span> 天
                            </div>
                            <div className="text-[10px] text-corp-muted bg-corp-surface px-2 py-1 rounded">
                                目标: {contact.target_frequency}天/次
                            </div>
                        </div>

                    </div>
                ))}
            </div>

            {contacts.length === 0 && !isAddMode && (
                <div className="py-20 text-center text-corp-muted border-2 border-dashed border-corp-border bg-corp-surface/50 rounded-xl">
                    <User size={48} className="mx-auto mb-4 opacity-30 text-corp-accent" />
                    <h4 className="text-lg font-bold text-white/80 mb-2">人脉库空空如也</h4>
                    <p className="text-sm max-w-sm mx-auto">
                        作为公司 CEO，你怎么能没有核心的维系圈层？立刻录入你的第一个重点人脉关系吧。
                    </p>
                </div>
            )}
        </div>
    )
}
