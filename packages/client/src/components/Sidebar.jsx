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
    MapPin,
    Trophy
} from 'lucide-react'
import { useAuthStore } from '../store/authStore'

const departments = [
    { path: '/', icon: LayoutDashboard, label: '总裁办', subtitle: '经营大盘' },
    { path: '/finance', icon: Landmark, label: '财务部', subtitle: '资金管控' },
    { path: '/operations', icon: Settings2, label: '运营部', subtitle: '日程与调度' },
    { path: '/hr', icon: GraduationCap, label: '人力资源部', subtitle: '能力提升' },
    { path: '/pr', icon: Users, label: '公共关系部', subtitle: '人际与社交' },
    { path: '/admin', icon: Warehouse, label: '行政部', subtitle: '后勤保障' },
    { path: '/health', icon: HeartPulse, label: '健康中心', subtitle: '医疗与体检' },
    { path: '/legal', icon: Scale, label: '法务部', subtitle: '合规审查' },
    { path: '/rd', icon: Code, label: '研发部', subtitle: '技能研发' },
    { path: '/commerce', icon: DollarSign, label: '商务部', subtitle: '商业谈判' },
    { path: '/travel', icon: MapPin, label: '差旅中心', subtitle: '行程规划' },
    { path: '/achievements', icon: Trophy, label: '成就展示', subtitle: '成就系统' },
    { path: '/persona', icon: Users, label: '人设终端', subtitle: '高管配置' },
]

export default function Sidebar() {
    const { user, logout } = useAuthStore()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <aside className="w-[280px] h-full bg-corp-surface/40 backdrop-blur-2xl rounded-[24px] border border-white/10 flex flex-col shadow-glass shrink-0 relative overflow-hidden z-20 transition-all hover:bg-corp-surface/50">
            {/* Ambient top glow */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-purple-500/10 to-transparent pointer-events-none"></div>

            {/* Logo */}
            <div className="px-6 py-6 relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-corp-accent to-blue-500 flex items-center justify-center shadow-glow animate-float">
                        <Building2 size={22} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-white tracking-wide leading-tight">Me Corp</h1>
                        <p className="text-[10px] text-corp-muted font-mono uppercase tracking-widest bg-white/5 rounded px-1 inline-block mt-0.5 backdrop-blur-sm border border-white/5">OS v2.0</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-2 px-4 space-y-1.5 overflow-y-auto relative z-10 custom-scrollbar">
                <div className="text-[10px] font-bold text-corp-muted/70 uppercase tracking-widest pl-3 mb-3 mt-2">高管业务模块</div>
                {departments.map((dept) => (
                    <NavLink
                        key={dept.path}
                        to={dept.path}
                        end={dept.path === '/'}
                        className={({ isActive }) =>
                            `sidebar-link flex items-center gap-3.5 px-3 py-3 rounded-xl text-sm transition-all group ${isActive
                                ? 'active shadow-lg shadow-purple-500/10'
                                : 'text-corp-muted'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <div className={`p-1.5 rounded-lg transition-colors ${isActive ? 'bg-gradient-to-br from-purple-500/20 to-blue-500/20 text-corp-accent-light' : 'bg-white/5 text-corp-muted group-hover:text-white'}`}>
                                    <dept.icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                                </div>
                                <div className="flex-1">
                                    <div className={`font-semibold tracking-wide ${isActive ? 'text-white' : 'group-hover:text-white'}`}>{dept.label}</div>
                                    <div className="text-[10px] opacity-60 font-mono hidden md:block">{dept.subtitle}</div>
                                </div>
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Footer / User Profile */}
            <div className="p-4 m-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md relative z-10">
                {user && (
                    <div className="flex items-center gap-3 mb-3 pb-3 border-b border-white/5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-400 to-pink-500 p-[2px]">
                            <div className="w-full h-full bg-corp-bg rounded-full flex items-center justify-center overflow-hidden">
                                <UserCircle size={28} className="text-white" />
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white truncate">{user.username}</p>
                            <p className="text-[10px] text-corp-muted font-mono truncate">{user.email}</p>
                        </div>
                    </div>
                )}
                <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                        <div className="pulse-dot" />
                        <span className="text-xs font-medium text-emerald-400">系统在线</span>
                    </div>
                    <button onClick={handleLogout} title="退出系统"
                        className="p-1.5 text-corp-muted hover:text-red-400 hover:bg-red-400/20 rounded-lg transition-colors">
                        <LogOut size={16} />
                    </button>
                </div>
            </div>
        </aside>
    )
}
