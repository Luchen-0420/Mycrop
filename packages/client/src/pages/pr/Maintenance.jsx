import { useState, useEffect } from 'react'
import { AlertCircle, Calendar, MessageSquare, PhoneCall, Coffee, PartyPopper, Loader2 } from 'lucide-react'

export default function Maintenance() {
    const [overdue, setOverdue] = useState([])
    const [upcoming, setUpcoming] = useState([])
    const [interactions, setInteractions] = useState([])
    const [loading, setLoading] = useState(true)

    // Log Interaction states
    const [showLogModal, setShowLogModal] = useState(false)
    const [selectedContact, setSelectedContact] = useState(null)
    const [logForm, setLogForm] = useState({ type: 'chat', notes: '', interaction_date: new Date().toISOString().split('T')[0] })

    useEffect(() => {
        fetchAllData()
    }, [])

    const fetchAllData = async () => {
        try {
            const [oRes, uRes, iRes] = await Promise.all([
                fetch('/api/pr/maintenance/overdue'),
                fetch('/api/pr/maintenance/upcoming'),
                fetch('/api/pr/interactions')
            ])

            if (oRes.ok && uRes.ok && iRes.ok) {
                setOverdue(await oRes.json())
                setUpcoming(await uRes.json())
                setInteractions(await iRes.json())
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const openLogModal = (contactId, contactName) => {
        setSelectedContact({ id: contactId, name: contactName })
        setLogForm({ type: 'chat', notes: '', interaction_date: new Date().toISOString().split('T')[0] })
        setShowLogModal(true)
    }

    const handleLogSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await fetch('/api/pr/interactions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contact_id: selectedContact.id,
                    ...logForm
                })
            })
            if (res.ok) {
                setShowLogModal(false)
                fetchAllData() // Refresh lists, which might remove them from overdue
            }
        } catch (err) {
            console.error(err)
        }
    }

    const getTypeIcon = (type) => {
        switch (type) {
            case 'meet': return <Coffee size={14} className="text-amber-400" />
            case 'call': return <PhoneCall size={14} className="text-blue-400" />
            case 'event': return <PartyPopper size={14} className="text-rose-400" />
            default: return <MessageSquare size={14} className="text-emerald-400" />
        }
    }
    const getTypeLabel = (type) => {
        switch (type) {
            case 'meet': return '线下碰面/请客'
            case 'call': return '语音/视频通话'
            case 'event': return '同场出席活动'
            default: return '微信/在线扯淡'
        }
    }

    if (loading) return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-corp-accent" /></div>

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">

            {/* Left Column: Alerts & Red Radar */}
            <div className="lg:col-span-1 space-y-6 flex flex-col">

                {/* Upcoming Events Box */}
                <div className="bg-corp-surface rounded-xl border border-corp-border overflow-hidden shadow-sm shrink-0">
                    <div className="p-4 border-b border-corp-border flex items-center bg-corp-bg/50">
                        <Calendar size={18} className="text-corp-success mr-2" />
                        <h3 className="font-bold text-white">即将到来的纪念日</h3>
                    </div>
                    <div className="p-2">
                        {upcoming.length === 0 ? (
                            <p className="text-xs text-corp-muted text-center py-4">近 30 天内风平浪静。</p>
                        ) : (
                            <div className="space-y-1">
                                {upcoming.map(u => (
                                    <div key={u.id} className="flex justify-between items-center p-3 hover:bg-corp-bg/50 rounded-lg transition">
                                        <div>
                                            <div className="font-bold text-sm text-white">{u.name}</div>
                                            <div className="text-[10px] text-corp-muted font-mono">{new Date(u.birthday).toLocaleDateString()}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-base font-black text-corp-success">{u.days_until}</div>
                                            <div className="text-[10px] text-corp-muted">天后</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Overdue Warning List */}
                <div className="bg-corp-danger/10 rounded-xl border border-corp-danger/30 overflow-hidden shadow-[0_0_15px_rgba(239,68,68,0.05)] flex-1 flex flex-col min-h-[300px]">
                    <div className="p-4 border-b border-corp-danger/20 flex items-center bg-corp-danger/5">
                        <AlertCircle size={18} className="text-corp-danger mr-2 animate-pulse" />
                        <h3 className="font-bold text-corp-danger">社交逾期红线警告</h3>
                    </div>
                    <div className="p-3 overflow-y-auto flex-1 custom-scrollbar">
                        {overdue.length === 0 ? (
                            <div className="text-center py-10 opacity-50">
                                <MessageSquare size={32} className="mx-auto mb-2 text-corp-muted" />
                                <p className="text-xs text-corp-muted">很棒！你的社交维护网运转良好，没有需要紧急抢救的干涸节点。</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {overdue.map(c => (
                                    <div key={c.id} className="bg-corp-bg border border-corp-danger/20 p-3 rounded-lg relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-1 h-full bg-corp-danger"></div>
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-bold text-sm text-white">{c.name}</h4>
                                            <span className="text-[10px] bg-corp-danger/20 text-corp-danger px-1.5 py-0.5 rounded font-mono">失联 {c.days_since_last_contact} 天</span>
                                        </div>
                                        <p className="text-[10px] text-corp-muted line-clamp-1 mb-3">目标频率: 每 {c.target_frequency} 天/次</p>
                                        <button onClick={() => openLogModal(c.id, c.name)} className="w-full py-1.5 text-xs bg-corp-surface hover:bg-corp-accent hover:text-white border border-corp-border hover:border-corp-accent transition-colors rounded text-corp-muted shadow-sm">
                                            录入互动以消除警告
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

            </div>

            {/* Right Column: Interaction Timelines */}
            <div className="lg:col-span-2 bg-corp-surface rounded-xl border border-corp-border overflow-hidden shadow-sm flex flex-col h-full">

                <div className="p-5 border-b border-corp-border flex justify-between items-center bg-corp-bg/30 shrink-0">
                    <h3 className="font-bold text-white flex items-center">
                        <MessageSquare size={18} className="mr-2 text-corp-accent" />
                        历史互动纪要轴
                    </h3>
                    <span className="text-xs text-corp-muted bg-corp-bg px-2 py-1 rounded">全局视图</span>
                </div>

                <div className="flex-1 p-5 overflow-y-auto custom-scrollbar">
                    {interactions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-corp-muted opacity-60">
                            <Coffee size={40} className="mb-3" />
                            <p className="text-sm">尚未有任何互动记录，人际关系是一天天结成的网。</p>
                        </div>
                    ) : (
                        <div className="relative pl-6 space-y-8 before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-corp-border before:to-transparent">
                            {interactions.map(log => (
                                <div key={log.id} className="relative flex items-start group">
                                    <div className="absolute left-0 -ml-6 md:left-1/2 md:ml-0 md:-translate-x-1/2 w-8 h-8 rounded-full bg-corp-bg border-2 border-corp-border flex items-center justify-center shadow-lg group-hover:border-corp-accent transition-colors z-10">
                                        {getTypeIcon(log.type)}
                                    </div>
                                    <div className="bg-corp-bg/80 border border-corp-border/50 p-4 rounded-xl ml-6 md:ml-0 w-full md:w-[calc(50%-2rem)] shadow-sm hover:shadow-md transition">
                                        <div className="flex justify-between items-center mb-2 border-b border-corp-border/30 pb-2">
                                            <span className="font-bold text-sm text-white text-corp-accent">{log.contact_name}</span>
                                            <span className="text-[10px] font-mono text-corp-muted">{new Date(log.interaction_date).toLocaleDateString()}</span>
                                        </div>
                                        <div className="text-[10px] text-corp-muted mb-2 uppercase tracking-wide">
                                            [ {getTypeLabel(log.type)} ]
                                        </div>
                                        <p className="text-xs text-white/80 leading-relaxed whitespace-pre-wrap">{log.notes || '此次互动无备忘录。'}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>

            {/* Interaction Logging Modal Overlay */}
            {showLogModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 animate-in fade-in duration-200 p-4">
                    <div className="bg-corp-surface rounded-xl border border-corp-muted shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-5 border-b border-corp-border">
                            <h3 className="font-bold text-lg text-white">记录与 <span className="text-corp-accent">{selectedContact?.name}</span> 的节点</h3>
                            <p className="text-xs text-corp-muted mt-1">记录之后，其失联计时器将归零重置。</p>
                        </div>
                        <form onSubmit={handleLogSubmit} className="p-5 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-corp-muted mb-1">互动方式</label>
                                    <select value={logForm.type} onChange={e => setLogForm({ ...logForm, type: e.target.value })} className="w-full bg-corp-bg border border-corp-border rounded-lg px-3 py-2 text-white outline-none focus:border-corp-accent text-sm">
                                        <option value="chat">微信/死群激活</option>
                                        <option value="call">电话/语音连麦</option>
                                        <option value="meet">线下约饭/见茶</option>
                                        <option value="event">同场活动/偶遇</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs text-corp-muted mb-1">发生日期</label>
                                    <input type="date" required value={logForm.interaction_date} onChange={e => setLogForm({ ...logForm, interaction_date: e.target.value })} className="w-full bg-corp-bg border border-corp-border rounded-lg px-3 py-2 text-white outline-none focus:border-corp-accent text-sm font-mono" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs text-corp-muted mb-1">核心信息纪要 (非常关键！)</label>
                                <textarea rows="4" placeholder="聊了什么？暴露了对方什么新需求？以后可以怎么合作？" value={logForm.notes} onChange={e => setLogForm({ ...logForm, notes: e.target.value })} className="w-full bg-corp-bg border border-corp-border rounded-lg px-3 py-2 text-white outline-none focus:border-corp-accent resize-none text-sm"></textarea>
                            </div>

                            <div className="flex justify-end space-x-3 pt-2">
                                <button type="button" onClick={() => setShowLogModal(false)} className="px-4 py-2 hover:bg-corp-border rounded-lg text-sm transition text-corp-muted">直接取消</button>
                                <button type="submit" className="btn-primary py-2 px-6 shadow">提交并在系统落痕</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    )
}
