import { Outlet, NavLink, useLocation } from 'react-router-dom'
import PageHeader from '../../components/PageHeader'
import { Package, ShoppingCart, Monitor, ShieldCheck } from 'lucide-react'

export default function AdminLayout() {
    const location = useLocation()

    const tabs = [
        { name: '物资台账', path: '/admin/inventory', icon: Package },
        { name: '采购审批', path: '/admin/procurement', icon: ShoppingCart },
        { name: '固定资产', path: '/admin/assets', icon: Monitor },
        { name: '证照账号', path: '/admin/credentials', icon: ShieldCheck }, // Phase 2 placeholder
    ]

    return (
        <div className="space-y-6">
            <PageHeader
                title="行政部"
                subtitle="CAO Logistics — 资源调配与采购风控"
                icon={Package}
            />

            <div className="corp-card p-0">
                <div className="flex border-b border-corp-border">
                    {tabs.map((tab) => {
                        const Icon = tab.icon
                        const isActive = location.pathname.startsWith(tab.path)

                        return (
                            <NavLink
                                key={tab.path}
                                to={tab.path}
                                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${isActive
                                        ? 'text-corp-accent border-corp-accent bg-corp-accent/5'
                                        : 'text-corp-muted border-transparent hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <Icon size={16} />
                                <span>{tab.name}</span>
                            </NavLink>
                        )
                    })}
                </div>
                <div className="p-6">
                    <Outlet />
                </div>
            </div>

            {/* Sub-page Content Area */}
            <div className="min-h-[500px]">
                <Outlet />
            </div>
        </div>
    )
}
