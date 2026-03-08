import { NavLink, useNavigate } from 'react-router-dom'
import {
    LayoutDashboard,
    Landmark,
    Settings2,
    GraduationCap,
    Users,
    Warehouse,
    HeartPulse,
    Building2,
    LogOut,
    UserCircle,
    Scale,
    FileText,
    Code,
    DollarSign,
    MapPin
} from 'lucide-react'
import { useAuthStore } from '../store/authStore'

const departments = [
    { path: '/', icon: LayoutDashboard, label: '总裁办', subtitle: 'CEO Dashboard' },
    { path: '/finance', icon: Landmark, label: '财务部', subtitle: 'CFO Finance' },
    { path: '/operations', icon: Settings2, label: '运营部', subtitle: 'COO Operations' },
    { path: '/hr', icon: GraduationCap, label: '人力资源部', subtitle: 'CHRO HR & L&D' },
    { path: '/pr', icon: Users, label: '公共关系部', subtitle: 'CMO PR & CRM' },
    { path: '/admin', icon: Warehouse, label: '行政部', subtitle: 'CAO Logistics' },
    { path: '/health', icon: HeartPulse, label: '健康中心', subtitle: 'Medical & Diet' },
    { path: '/legal', icon: Scale, label: '法务部', subtitle: 'Legal & Secretariat' },
    { path: '/rd', icon: Code, label: '研发部', subtitle: 'CTO R&D' },
    { path: '/commerce', icon: DollarSign, label: '商务部', subtitle: 'CSO Commerce' },
    { path: '/travel', icon: MapPin, label: '差旅中心', subtitle: 'Travel & Logistics' },
]

export default function Sidebar() {
    const { user, logout } = useAuthStore()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <aside className="fixed left-0 top-0 w-64 h-screen bg-corp-surface border-r border-corp-border flex flex-col z-50">
            {/* Logo */}
            <div className="px-6 py-5 border-b border-corp-border">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-corp-accent to-blue-400 flex items-center justify-center">
                        <Building2 size={20} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-base font-bold text-white tracking-wide">Me Corp</h1>
                        <p className="text-[10px] text-corp-muted font-mono uppercase tracking-widest">Personal ERP</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
                {departments.map((dept) => (
                    <NavLink
                        key={dept.path}
                        to={dept.path}
                        end={dept.path === '/'}
                        className={({ isActive }) =>
                            `sidebar-link flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${isActive
                                ? 'active bg-corp-accent/10 text-white'
                                : 'text-corp-muted hover:text-white'
                            }`
                        }
                    >
                        <dept.icon size={18} />
                        <div>
                            <div className="font-medium">{dept.label}</div>
                            <div className="text-[10px] opacity-60 font-mono">{dept.subtitle}</div>
                        </div>
                    </NavLink>
                ))}
            </nav>

            {/* Footer / User Profile */}
            <div className="p-4 border-t border-corp-border bg-corp-surface">
                {user && (
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <UserCircle size={28} className="text-corp-accent-light" />
                            <div>
                                <p className="text-sm font-medium text-white">{user.username}</p>
                                <p className="text-[10px] text-corp-muted font-mono">{user.email}</p>
                            </div>
                        </div>
                    </div>
                )}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="pulse-dot" />
                        <span className="text-xs text-corp-muted">系统运行中</span>
                    </div>
                    <button onClick={handleLogout} title="退出系统"
                        className="p-1.5 text-corp-muted hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors">
                        <LogOut size={16} />
                    </button>
                </div>
            </div>
        </aside>
    )
}
