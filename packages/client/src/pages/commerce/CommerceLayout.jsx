import { NavLink, Outlet } from 'react-router-dom'
import { DollarSign, Handshake, TrendingUp, Briefcase } from 'lucide-react'

const tabs = [
    { path: 'revenue', label: '收入流', icon: TrendingUp },
    { path: 'partnerships', label: '商务合作', icon: Handshake },
    { path: 'career', label: '职业发展', icon: Briefcase },
    { path: 'monetization', label: '变现分析', icon: DollarSign },
]

export default function CommerceLayout() {
    return (
        <div className="space-y-6">
            <div className="corp-card">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-white">商务部</h2>
                        <p className="text-sm text-corp-muted">CSO Commerce — 外部收入与商业变现</p>
                    </div>
                </div>
            </div>

            <div className="corp-card p-0">
                <div className="flex border-b border-corp-border">
                    {tabs.map(({ path, label, icon: Icon }) => (
                        <NavLink
                            key={path}
                            to={path}
                            end={path === 'revenue'}
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