import { NavLink, Outlet } from 'react-router-dom'
import { User, Award, School, Heart, Activity } from 'lucide-react'

const tabs = [
    { path: 'profile', label: '员工档案', icon: User },
    { path: 'skills', label: '技能中心', icon: Award },
    { path: 'training', label: '培训学院', icon: School },
    { path: 'wellness', label: '员工关怀', icon: Heart },
    { path: 'review', label: '绩效考核', icon: Activity },
]

export default function HRLayout() {
    return (
        <div className="space-y-6">
            <div className="corp-card">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-white">人力资源部</h2>
                        <p className="text-sm text-corp-muted">CHRO HR & L&D — 人才发展与组织文化</p>
                    </div>
                </div>
            </div>

            <div className="corp-card p-0">
                <div className="flex border-b border-corp-border overflow-x-auto">
                    {tabs.map(({ path, label, icon: Icon }) => (
                        <NavLink
                            key={path}
                            to={path}
                            className={({ isActive }) =>
                                `flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
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