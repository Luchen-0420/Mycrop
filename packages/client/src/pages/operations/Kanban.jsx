import { useState, useEffect } from 'react'
import { Plus, ArrowRight, ArrowLeft, CheckCircle2, Clock, Inbox, Loader2, Trash2, Sparkles, Target } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import StatCard from '../../components/StatCard'

export default function Kanban() {
    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(true)
    const [isAddMode, setIsAddMode] = useState(false)
    const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'medium', due_date: '', points_reward: 0 })

    useEffect(() => {
        fetchTasks()
    }, [])

    const fetchTasks = async () => {
        try {
            const res = await fetch('/api/operations/tasks')
            if (res.ok) {
                const data = await res.json()
                setTasks(data)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleAddTask = async (e) => {
        e.preventDefault()
        try {
            const res = await fetch('/api/operations/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTask)
            })
            if (res.ok) {
                setIsAddMode(false)
                setNewTask({ title: '', description: '', priority: 'medium', due_date: '', points_reward: 0 })
                fetchTasks()
            }
        } catch (err) {
            console.error(err)
        }
    }

    const updateStatus = async (id, currentStatus, direction) => {
        let newStatus = currentStatus
        if (direction === 'forward') {
            newStatus = currentStatus === 'todo' ? 'in_progress' : 'done'
        } else if (direction === 'backward') {
            newStatus = currentStatus === 'done' ? 'in_progress' : 'todo'
        }

        try {
            const res = await fetch(`/api/operations/tasks/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            })
            if (res.ok) {
                fetchTasks()
            }
        } catch (err) {
            console.error(err)
        }
    }

    const deleteTask = async (id) => {
        if (!confirm('确定要删除这条任务吗？此操作不可恢复。')) return;
        try {
            const res = await fetch(`/api/operations/tasks/${id}`, { method: 'DELETE' })
            if (res.ok) fetchTasks()
        } catch (err) {
            console.error(err)
        }
    }

    const columns = [
        { id: 'todo', title: '待办清单', icon: <Inbox className="text-white/60" size={18} />, color: 'from-blue-500/10 to-transparent', border: 'border-blue-500/20' },
        { id: 'in_progress', title: '执行中', icon: <Clock className="text-corporate-warning" size={18} />, color: 'from-corporate-warning/10 to-transparent', border: 'border-corporate-warning/30' },
        { id: 'done', title: '已交付', icon: <CheckCircle2 className="text-corporate-success" size={18} />, color: 'from-corporate-success/10 to-transparent', border: 'border-corporate-success/30' }
    ]

    const priorityStyles = {
        urgent: 'bg-red-500/20 text-red-400 border-red-500/30',
        high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
        medium: 'bg-blue-500/10 text-blue-300 border-blue-500/20',
        low: 'bg-white/5 text-white/40 border-white/10'
    }

    const priorityLabels = { urgent: '紧急', high: '高', medium: '中', low: '低' }

    if (loading) return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-corporate-accent" /></div>

    const totalPointsAvailable = tasks.filter(t => t.status !== 'done').reduce((sum, t) => sum + (t.points_reward || 0), 0)
    const totalPointsEarned = tasks.filter(t => t.status === 'done').reduce((sum, t) => sum + (t.points_reward || 0), 0)

    return (
        <div className="space-y-6 h-full flex flex-col">

            {/* CEO Stats Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                <div className="bg-corporate-900/40 backdrop-blur-xl border border-white/5 rounded-2xl p-5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700"></div>
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <p className="text-white/40 text-xs font-medium uppercase tracking-wider mb-1">执行中引擎负载</p>
                            <h3 className="text-3xl font-light text-white tracking-tight">{tasks.filter(t => t.status === 'in_progress').length} <span className="text-lg text-white/30">/ {tasks.length}</span></h3>
                        </div>
                        <div className="p-2.5 bg-blue-500/10 rounded-xl border border-blue-500/20 text-blue-400">
                            <Clock size={20} />
                        </div>
                    </div>
                </div>

                <div className="bg-corporate-900/40 backdrop-blur-xl border border-white/5 rounded-2xl p-5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700"></div>
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <p className="text-white/40 text-xs font-medium uppercase tracking-wider mb-1">待开发期权积分</p>
                            <h3 className="text-3xl font-light text-purple-400 tracking-tight">{totalPointsAvailable} <span className="text-sm text-purple-400/50">pts</span></h3>
                        </div>
                        <div className="p-2.5 bg-purple-500/10 rounded-xl border border-purple-500/20 text-purple-400">
                            <Target size={20} />
                        </div>
                    </div>
                </div>

                <div className="bg-corporate-900/40 backdrop-blur-xl border border-white/5 rounded-2xl p-5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700"></div>
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <p className="text-white/40 text-xs font-medium uppercase tracking-wider mb-1">已变现积分产出</p>
                            <h3 className="text-3xl font-light text-emerald-400 tracking-tight">{totalPointsEarned} <span className="text-sm text-emerald-400/50">pts</span></h3>
                        </div>
                        <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400">
                            <Sparkles size={20} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="flex justify-between items-center px-1">
                <h3 className="text-lg font-medium text-white/80">调度监控阵列 <span className="text-sm text-white/30 ml-2 font-normal">Task Array</span></h3>
                <button onClick={() => setIsAddMode(!isAddMode)} className="flex items-center space-x-2 text-sm px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white transition-all backdrop-blur-sm">
                    <Plus size={16} /> <span>{isAddMode ? '关闭特批面板' : 'CEO 特批下达'}</span>
                </button>
            </div>

            <AnimatePresence>
                {isAddMode && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, scale: 0.95 }}
                        animate={{ opacity: 1, height: 'auto', scale: 1 }}
                        exit={{ opacity: 0, height: 0, scale: 0.95 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="bg-corporate-900/60 backdrop-blur-2xl rounded-2xl p-6 border border-white/10 shadow-2xl relative overflow-hidden shrink-0 origin-top"
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-corporate-primary via-purple-500 to-corporate-accent"></div>
                        <form onSubmit={handleAddTask} className="flex flex-col gap-5">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">指令名称</label>
                                    <input type="text" required placeholder="下达具体作战任务..." value={newTask.title} onChange={e => setNewTask({ ...newTask, title: e.target.value })} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 outline-none focus:border-corporate-primary transition-colors focus:bg-black/40" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">悬赏积分 (产出预估)</label>
                                    <input type="number" min="0" placeholder="0" value={newTask.points_reward} onChange={e => setNewTask({ ...newTask, points_reward: parseInt(e.target.value) || 0 })} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-purple-400 font-mono outline-none focus:border-purple-500 transition-colors focus:bg-black/40" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">执行细节 (可选)</label>
                                    <textarea rows="2" placeholder="补充上下文..." value={newTask.description} onChange={e => setNewTask({ ...newTask, description: e.target.value })} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white/80 placeholder-white/20 outline-none focus:border-corporate-primary transition-colors focus:bg-black/40 resize-none custom-scrollbar"></textarea>
                                </div>
                                <div className="flex flex-col justify-between">
                                    <div className="flex gap-3">
                                        <div className="flex-1">
                                            <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">优先级</label>
                                            <select value={newTask.priority} onChange={e => setNewTask({ ...newTask, priority: e.target.value })} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-corporate-primary transition-colors appearance-none cursor-pointer">
                                                <option value="urgent">🔴 最高紧急 (Urgent)</option>
                                                <option value="high">🟠 优先 (High)</option>
                                                <option value="medium">🔵 极简 (Medium)</option>
                                                <option value="low">⚪ 兜底 (Low)</option>
                                            </select>
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">交付死线</label>
                                            <input type="date" value={newTask.due_date} onChange={e => setNewTask({ ...newTask, due_date: e.target.value })} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white/80 outline-none focus:border-corporate-primary transition-colors [color-scheme:dark]" />
                                        </div>
                                    </div>
                                    <div className="flex justify-end space-x-3 mt-4">
                                        <button type="button" onClick={() => setIsAddMode(false)} className="px-5 py-2.5 rounded-xl text-sm text-white/50 hover:text-white hover:bg-white/5 transition-colors">驳回</button>
                                        <button type="submit" className="bg-gradient-to-r from-corporate-primary to-corporate-accent hover:opacity-90 text-white font-medium py-2.5 px-8 rounded-xl shadow-lg shadow-corporate-primary/20 transition-all active:scale-95">正式下达</button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Kanban Board Container */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden min-h-[600px]">
                {columns.map((col, idx) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1, duration: 0.5, ease: "easeOut" }}
                        key={col.id}
                        className={`bg-black/20 backdrop-blur-md rounded-2xl border ${col.border} flex flex-col overflow-hidden relative group`}
                    >
                        {/* Background subtle gradient */}
                        <div className={`absolute top-0 left-0 w-full h-32 bg-gradient-to-b ${col.color} opacity-50 pointer-events-none`}></div>

                        <div className="p-5 border-b border-white/5 flex items-center justify-between relative z-10">
                            <div className="flex items-center space-x-3">
                                <div className={`p-2 rounded-lg bg-black/40 border border-white/5 backdrop-blur-md`}>
                                    {col.icon}
                                </div>
                                <span className="font-semibold text-white/90 tracking-wide">{col.title}</span>
                            </div>
                            <div className="flex items-center bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/5">
                                <span className="text-xs font-mono text-white/60">
                                    {tasks.filter(t => t.status === col.id).length}
                                </span>
                            </div>
                        </div>

                        <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar relative z-10">
                            <AnimatePresence>
                                {tasks.filter(t => t.status === col.id).map(task => (
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.2 }}
                                        key={task.id}
                                        className={`bg-white/5 backdrop-blur-xl rounded-xl p-5 border border-white/10 hover:border-white/20 transition-all duration-300 group/card relative overflow-hidden ${task.status === 'done' ? 'opacity-70 hover:opacity-100' : ''}`}
                                    >

                                        {/* Points Badge (absolute top right if points exist) */}
                                        {task.points_reward > 0 && (
                                            <div className="absolute top-4 right-4 flex items-center bg-purple-500/10 border border-purple-500/20 text-purple-300 px-2 py-0.5 rounded-md text-[10px] font-mono tracking-wider">
                                                <Sparkles size={10} className="mr-1" />
                                                {task.points_reward} PTS
                                            </div>
                                        )}

                                        <div className="flex justify-between items-start mb-3 pr-20">
                                            <div className={`text-[9px] px-2 py-0.5 rounded border uppercase font-bold tracking-widest ${priorityStyles[task.priority]}`}>
                                                {priorityLabels[task.priority]}
                                            </div>
                                        </div>

                                        <h4 className={`font-semibold text-sm leading-relaxed mb-2 ${task.status === 'done' ? 'text-white/60 line-through decoration-white/20' : 'text-white/90'}`}>
                                            {task.title}
                                        </h4>

                                        {task.description && (
                                            <p className="text-xs text-white/40 leading-relaxed line-clamp-2 mt-1 mb-3">{task.description}</p>
                                        )}

                                        {(task.due_date || task.linked_wishlist_id) && (
                                            <div className="flex flex-wrap gap-2 mt-4">
                                                {task.due_date && (
                                                    <div className="text-[10px] bg-black/30 border border-white/5 px-2 py-1 rounded-md text-white/40 flex items-center">
                                                        <Clock size={10} className="mr-1.5 opacity-70" />
                                                        {new Date(task.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                    </div>
                                                )}
                                                {task.linked_wishlist_id && (
                                                    <div className="text-[10px] bg-corporate-primary/10 border border-corporate-primary/20 text-corporate-accent px-2 py-1 rounded-md flex items-center">
                                                        <Target size={10} className="mr-1.5" />
                                                        心愿关联
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Actions Overlay (Glassmorphic hover state) */}
                                        <div className="absolute bottom-0 left-0 w-full p-3 bg-gradient-to-t from-black/80 via-black/60 to-transparent opacity-0 translate-y-4 group-hover/card:opacity-100 group-hover/card:translate-y-0 transition-all duration-300 flex justify-between items-end backdrop-blur-[2px]">

                                            <button onClick={() => deleteTask(task.id)} className="text-red-400/50 hover:text-red-400 hover:bg-red-400/10 p-2 rounded-lg transition-colors" title="强制抹除">
                                                <Trash2 size={14} />
                                            </button>

                                            <div className="flex space-x-2">
                                                {task.status !== 'todo' && (
                                                    <button onClick={() => updateStatus(task.id, task.status, 'backward')} className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-white/70 hover:text-white text-xs font-medium transition-all backdrop-blur-md flex items-center">
                                                        <ArrowLeft size={12} className="mr-1" /> 回退
                                                    </button>
                                                )}
                                                {task.status !== 'done' && (
                                                    <button onClick={() => updateStatus(task.id, task.status, 'forward')} className={`px-4 py-1.5 rounded-lg border text-xs font-medium transition-all backdrop-blur-md flex items-center shadow-lg ${task.status === 'in_progress'
                                                            ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500 hover:text-white shadow-emerald-500/20'
                                                            : 'bg-corporate-primary/20 border-corporate-primary/30 text-corporate-accent hover:bg-corporate-primary hover:text-white shadow-corporate-primary/20'
                                                        }`}>
                                                        推进 <ArrowRight size={12} className="ml-1" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {tasks.filter(t => t.status === col.id).length === 0 && (
                                <div className="h-32 border border-dashed border-white/10 rounded-xl flex items-center justify-center text-xs text-white/30 bg-black/20">
                                    暂无任务驻留
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
