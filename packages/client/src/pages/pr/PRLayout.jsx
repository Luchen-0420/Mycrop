import { NavLink, Outlet } from 'react-router-dom'
import { Users, Handshake } from 'lucide-react'
import PageHeader from '../../components/PageHeader'

const tabs = [
    { path: 'contacts', label: '人脉管理', icon: Users },
    { path: 'maintenance', label: '关系维护', icon: Handshake },
]

export default function PRLayout() {
    return (
        <div className="space-y-6">
            <PageHeader title="公共关系部" subtitle="CMO PR & CRM — 对外人脉与关系维系" icon={Users} />

            <div className="corp-card p-0">
                <div className="flex border-b border-corp-border">
                    {tabs.map(({ path, label, icon: Icon }) => (
                        <NavLink
                            key={path}
                            to={path}
                            className={({ isActive }) =>
                                `flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${isActive
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