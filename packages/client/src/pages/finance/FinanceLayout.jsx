import { NavLink, Outlet } from 'react-router-dom'
import { Landmark, PiggyBank, Star, Repeat } from 'lucide-react'

const tabs = [
    { path: 'ledger', label: '总账', icon: Landmark },
    { path: 'budget', label: '预算', icon: PiggyBank },
    { path: 'points', label: '积分', icon: Star },
    { path: 'subscriptions', label: '订阅', icon: Repeat },
]

export default function FinanceLayout() {
    return (
        <div className="space-y-6">
            <div className="corp-card">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-white">财务部</h2>
                        <p className="text-sm text-corp-muted">CFO Finance — 资金与价值管理</p>
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