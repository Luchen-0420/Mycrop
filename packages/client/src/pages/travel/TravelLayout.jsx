import { NavLink, Outlet } from 'react-router-dom'
import { MapPin, Package, Plane, Calculator } from 'lucide-react'

const tabs = [
    { path: 'itineraries', label: '造梦出行', icon: MapPin },
    { path: 'packing', label: '打包清单', icon: Package },
    { path: 'logs', label: '差旅日记', icon: Plane },
    { path: 'expenses', label: '费用报销', icon: Calculator },
]

export default function TravelLayout() {
    return (
        <div className="space-y-6">
            <div className="corp-card">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-white">差旅中心</h2>
                        <p className="text-sm text-corp-muted">Travel & Logistics — 出行计划与经费核销</p>
                    </div>
                </div>
            </div>

            <div className="corp-card p-0">
                <div className="flex border-b border-corp-border">
                    {tabs.map(({ path, label, icon: Icon }) => (
                        <NavLink
                            key={path}
                            to={path}
                            end={path === 'itineraries'}
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