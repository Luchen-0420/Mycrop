import { useState, useEffect } from 'react'
import { Plus, ArrowRight, ArrowLeft, CheckCircle2, Clock, Inbox, Loader2, Trash2 } from 'lucide-react'

export default function Kanban() {
    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(true)
    const [isAddMode, setIsAddMode] = useState(false)
    const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'medium', due_date: '' })

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
                setNewTask({ title: '', description: '', priority: 'medium', due_date: '' })
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
        { id: 'todo', title: '待办 (TODO)', icon: <Inbox className="text-corporate-text-secondary" size={18} /> },
        { id: 'in_progress', title: '进行中 (IN PROGRESS)', icon: <Clock className="text-corporate-warning" size={18} /> },
        { id: 'done', title: '已完成 (DONE)', icon: <CheckCircle2 className="text-corporate-success" size={18} /> }
    ]

    const priorityColors = {
        urgent: 'bg-corporate-danger text-white border-corporate-danger',
        high: 'bg-corporate-warning/20 text-corporate-warning border-corporate-warning/30',
        medium: 'bg-corporate-700 text-corporate-text-secondary border-corporate-600',
        low: 'bg-corporate-800 text-corporate-text-secondary border-corporate-700'
    }

    const priorityLabels = { urgent: '紧急', high: '高', medium: '中', low: '低' }

    if (loading) return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-corporate-accent" /></div>

    return (
        <div className="space-y-6 h-full flex flex-col">
            <div className="flex justify-end">
                <button onClick={() => setIsAddMode(!isAddMode)} className="btn-primary flex items-center space-x-2 text-sm px-4 py-2">
                    <Plus size={16} /> <span>新建任务</span>
                </button>
            </div>

            {isAddMode && (
                <div className="bg-corporate-800 rounded-xl p-5 border border-corporate-primary/50 shadow-lg relative overflow-hidden shrink-0">
                    <div className="absolute top-0 left-0 w-1 h-full bg-corporate-primary"></div>
                    <form onSubmit={handleAddTask} className="flex flex-col gap-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-corporate-text-secondary mb-1">任务名称</label>
                                <input type="text" required placeholder="今天要完成什么？" value={newTask.title} onChange={e => setNewTask({ ...newTask, title: e.target.value })} className="w-full bg-corporate-900 border border-corporate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-corporate-primary" />
                            </div>
                            <div>
                                <label className="block text-xs text-corporate-text-secondary mb-1">截止日期 (可选)</label>
                                <input type="date" value={newTask.due_date} onChange={e => setNewTask({ ...newTask, due_date: e.target.value })} className="w-full bg-corporate-900 border border-corporate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-corporate-primary" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-corporate-text-secondary mb-1">详细描述</label>
                                <textarea rows="2" placeholder="备注..." value={newTask.description} onChange={e => setNewTask({ ...newTask, description: e.target.value })} className="w-full bg-corporate-900 border border-corporate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-corporate-primary resize-none"></textarea>
                            </div>
                            <div>
                                <label className="block text-xs text-corporate-text-secondary mb-1">优先级</label>
                                <select value={newTask.priority} onChange={e => setNewTask({ ...newTask, priority: e.target.value })} className="w-full bg-corporate-900 border border-corporate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-corporate-primary">
                                    <option value="urgent">最高紧急 (Urgent)</option>
                                    <option value="high">高 (High)</option>
                                    <option value="medium">中等 (Medium)</option>
                                    <option value="low">较低 (Low)</option>
                                </select>
                                <div className="flex justify-end space-x-3 mt-4">
                                    <button type="button" onClick={() => setIsAddMode(false)} className="px-4 py-2 hover:bg-corporate-700 rounded-lg text-sm text-corporate-text-secondary transition">取消</button>
                                    <button type="submit" className="btn-primary py-2 px-6">落板</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            {/* Kanban Board */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden min-h-[500px]">
                {columns.map(col => (
                    <div key={col.id} className="bg-corporate-900/30 rounded-xl border border-corporate-700/50 flex flex-col overflow-hidden">

                        <div className="p-4 border-b border-corporate-700/50 flex items-center justify-between bg-corporate-800/50">
                            <div className="flex items-center space-x-2 font-bold text-sm">
                                {col.icon} <span>{col.title}</span>
                            </div>
                            <span className="text-xs font-mono bg-corporate-900 px-2 py-1 rounded text-corporate-text-secondary border border-corporate-700">
                                {tasks.filter(t => t.status === col.id).length}
                            </span>
                        </div>

                        <div className="flex-1 p-3 overflow-y-auto space-y-3 custom-scrollbar">
                            {tasks.filter(t => t.status === col.id).map(task => (
                                <div key={task.id} className="bg-corporate-800 rounded-lg p-4 border border-corporate-700 shadow-sm hover:border-corporate-500 transition-colors group relative">

                                    <div className="flex justify-between items-start mb-2 pr-6">
                                        <div className={`text-[10px] px-2 py-0.5 rounded border uppercase font-bold tracking-wider ${priorityColors[task.priority]}`}>
                                            {priorityLabels[task.priority]}
                                        </div>
                                    </div>

                                    <h4 className="font-bold text-sm text-white leading-snug">{task.title}</h4>

                                    {task.description && (
                                        <p className="text-xs text-corporate-text-secondary mt-2 line-clamp-2">{task.description}</p>
                                    )}

                                    {task.due_date && (
                                        <div className="mt-3 text-[11px] text-corporate-text-secondary flex items-center">
                                            <Clock size={12} className="mr-1" />
                                            截止: {new Date(task.due_date).toLocaleDateString()}
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="mt-4 pt-3 border-t border-corporate-700/50 flex justify-between items-center">

                                        <button onClick={() => deleteTask(task.id)} className="text-corporate-danger/50 hover:text-corporate-danger transition p-1 opacity-0 group-hover:opacity-100">
                                            <Trash2 size={14} />
                                        </button>

                                        <div className="flex space-x-1">
                                            {task.status !== 'todo' && (
                                                <button onClick={() => updateStatus(task.id, task.status, 'backward')} className="p-1.5 rounded bg-corporate-900 hover:bg-corporate-700 text-corporate-text-secondary transition" title="移回上一列">
                                                    <ArrowLeft size={14} />
                                                </button>
                                            )}
                                            {task.status !== 'done' && (
                                                <button onClick={() => updateStatus(task.id, task.status, 'forward')} className="p-1.5 rounded bg-corporate-primary/20 text-corporate-primary hover:bg-corporate-primary hover:text-white transition" title="移至下一列">
                                                    <ArrowRight size={14} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {tasks.filter(t => t.status === col.id).length === 0 && (
                                <div className="h-24 border-2 border-dashed border-corporate-700/50 rounded-lg flex items-center justify-center text-xs text-corporate-text-secondary">
                                    拖拽到此 (其实点箭头就行)
                                </div>
                            )}
                        </div>

                    </div>
                ))}
            </div>

        </div>
    )
}
