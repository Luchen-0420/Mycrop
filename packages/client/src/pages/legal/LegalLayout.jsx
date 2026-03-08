import { NavLink, Outlet } from 'react-router-dom'
import { FileText, Shield, AlertTriangle, Scale } from 'lucide-react'

const tabs = [
    { path: 'contracts', label: '合同档案', icon: FileText },
    { path: 'insurances', label: '保单管理', icon: Shield },
    { path: 'disputes', label: '维权纠纷', icon: AlertTriangle },
    { path: 'reminders', label: '到期提醒', icon: Scale },
]

export default function LegalLayout() {
    return (
        <div className="space-y-6">
            <div className="corp-card">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-white">法务部</h2>
                        <p className="text-sm text-corp-muted">Legal & Secretariat — 个人风控与契约管理</p>
                    </div>
                </div>
            </div>

            <div className="corp-card p-0">
                <div className="flex border-b border-corp-border">
                    {tabs.map(({ path, label, icon: Icon }) => (
                        <NavLink
                            key={path}
                            to={path}
                            end={path === 'contracts'}
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