import { TrendingUp, TrendingDown } from 'lucide-react'

export default function StatCard({ title, value, subtitle, trend, trendValue, icon: Icon, color = 'blue' }) {
    const colorMap = {
        blue: 'from-blue-500/20 to-blue-600/5 border-blue-500/20',
        green: 'from-emerald-500/20 to-emerald-600/5 border-emerald-500/20',
        yellow: 'from-amber-500/20 to-amber-600/5 border-amber-500/20',
        red: 'from-red-500/20 to-red-600/5 border-red-500/20',
        purple: 'from-purple-500/20 to-purple-600/5 border-purple-500/20',
        cyan: 'from-cyan-500/20 to-cyan-600/5 border-cyan-500/20',
    }

    const iconColorMap = {
        blue: 'text-blue-400',
        green: 'text-emerald-400',
        yellow: 'text-amber-400',
        red: 'text-red-400',
        purple: 'text-purple-400',
        cyan: 'text-cyan-400',
    }

    return (
        <div className={`corp-card bg-gradient-to-br ${colorMap[color]}`}>
            <div className="flex items-start justify-between mb-3">
                <p className="text-sm text-corp-muted font-medium">{title}</p>
                {Icon && <Icon size={20} className={iconColorMap[color]} />}
            </div>
            <p className="stat-value text-2xl mb-1">{value}</p>
            <div className="flex items-center gap-2">
                {trend && (
                    <span className={`kpi-badge ${trend === 'up' ? 'up' : 'down'}`}>
                        {trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {trendValue}
                    </span>
                )}
                {subtitle && <span className="text-xs text-corp-muted">{subtitle}</span>}
            </div>
        </div>
    )
}
