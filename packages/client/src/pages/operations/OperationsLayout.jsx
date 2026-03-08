import { NavLink, Outlet } from 'react-router-dom'
import { Trello, Repeat, Target } from 'lucide-react'

const tabs = [
    { path: 'kanban', label: '看板', icon: Trello },
    { path: 'habits', label: '习惯', icon: Repeat },
    { path: 'okrs', label: 'OKRs', icon: Target },
]

export default function OperationsLayout() {
    return (
        <div className="space-y-6">
            <div className="corp-card">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-white">运营部</h2>
                        <p className="text-sm text-corp-muted">COO Operations — 个人执行与成长引擎</p>
                    </div>
                </div>
            </div>

            <div className="corp-card p-0">
                <div className="flex border-b border-corp-border">
                    {tabs.map(({ path, label, icon: Icon }) => (
                        <NavLink
                            key={path}
                            to={path}
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