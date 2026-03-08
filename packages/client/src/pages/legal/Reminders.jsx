import { useState, useEffect } from 'react'
import { Scale, Calendar, AlertCircle, Bell, ChevronDown, Search } from 'lucide-react'
import StatCard from '../../components/StatCard'

export default function Reminders() {
    const [reminders, setReminders] = useState([])
    const [stats, setStats] = useState({ total: 0, highPriority: 0, overdue: 0 })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchReminders = async () => {
            setLoading(true)
            try {
                const response = await fetch('/api/legal/reminders')
                const data = await response.json()
                setReminders(data.reminders)
                setStats(data.stats)
            } catch (error) {
                console.error("Failed to fetch reminders:", error)
            }
            setLoading(false)
        }
        fetchReminders()
    }, [])

    const getPriorityChip = (priority) => {
        switch (priority) {
            case 'high':
                return <span className="px-2 py-0.5 text-xs text-red-400 bg-red-400/10 rounded-full">高</span>
            case 'medium':
                return <span className="px-2 py-0.5 text-xs text-amber-400 bg-amber-400/10 rounded-full">中</span>
            case 'low':
                return <span className="px-2 py-0.5 text-xs text-slate-400 bg-slate-400/10 rounded-full">低</span>
            default:
                return null
        }
    }

    const getTypeIcon = (type) => {
        switch (type) {
            case 'contract':
                return <Scale size={16} className="text-blue-400" />
            case 'insurance':
                return <Scale size={16} className="text-green-400" />
            case 'document':
                return <Scale size={16} className="text-purple-400" />
            default:
                return <Bell size={16} className="text-gray-400" />
        }
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard icon={Bell} title="提醒总数" value={stats.total} color="blue" />
                <StatCard icon={AlertCircle} title="高优先级" value={stats.highPriority} color="red" />
                <StatCard icon={Calendar} title="已逾期" value={stats.overdue} color="yellow" />
            </div>

            <div className="corp-card">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-white">提醒列表</h3>
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-corp-muted" />
                            <input
                                type="text"
                                placeholder="搜索提醒..."
                                className="pl-9 pr-3 py-2 w-48 bg-corp-surface border border-corp-border rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-corp-accent"
                            />
                        </div>
                        <button className="flex items-center gap-2 px-3 py-2 bg-corp-surface border border-corp-border rounded-lg text-sm text-white hover:bg-white/5 transition">
                            优先级 <ChevronDown size={16} />
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    {loading ? (
                        <p className="text-corp-muted">加载中...</p>
                    ) : (
                        reminders.map((reminder) => (
                            <div key={reminder.id} className="p-4 bg-corp-surface rounded-lg border border-corp-border hover:border-corp-accent transition-all duration-300 ease-in-out transform hover:-translate-y-1">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        {getTypeIcon(reminder.type)}
                                        <div className="space-y-1">
                                            <h4 className="font-semibold text-white">{reminder.title}</h4>
                                            <p className="text-xs text-corp-muted">{reminder.description}</p>
                                        </div>
                                    </div>
                                    <div className="text-right space-y-2">
                                        {getPriorityChip(reminder.priority)}
                                        <p className="text-sm font-semibold text-white">{reminder.dueDate}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}