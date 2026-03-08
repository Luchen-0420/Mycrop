import { NavLink, Outlet } from 'react-router-dom'
import { Lightbulb, Code, BookOpen, Briefcase, Rocket } from 'lucide-react'

const tabs = [
    { path: 'workshops', label: '项目工坊', icon: Code },
    { path: 'ideas', label: '创意池', icon: Lightbulb },
    { path: 'notes', label: '技术笔记', icon: BookOpen },
    { path: 'portfolio', label: '作品集', icon: Briefcase },
]

export default function RDLayout() {
    return (
        <div className="space-y-6">
            <div className="corp-card">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-white">研发部</h2>
                        <p className="text-sm text-corp-muted">CTO R&D — 个人产出与技术沉淀</p>
                    </div>
                </div>
            </div>

            <div className="corp-card p-0">
                <div className="flex border-b border-corp-border">
                    {tabs.map(({ path, label, icon: Icon }) => (
                        <NavLink
                            key={path}
                            to={path}
                            end={path === 'workshops'}
                            className={({ isActive }) =>
                                `flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                                    isActive
                                        ? 'text-corp-accent border-corp-accent bg-corp-accent/5'
                                        : 'text-corp-muted border-transparent hover:text-white hover:bg-white/5'
                                }`
                            }
                        >
                            <Icon size={16} />
                            {label}
                        </NavLink>
                    ))}
                </div>
                <div className="p-6">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}