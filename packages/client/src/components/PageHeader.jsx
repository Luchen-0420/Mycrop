export default function PageHeader({ title, subtitle, icon: Icon, children }) {
    return (
        <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
                {Icon && (
                    <div className="w-11 h-11 rounded-xl bg-corp-accent/15 flex items-center justify-center">
                        <Icon size={22} className="text-corp-accent-light" />
                    </div>
                )}
                <div>
                    <h1 className="text-2xl font-bold text-white">{title}</h1>
                    {subtitle && <p className="text-sm text-corp-muted mt-0.5">{subtitle}</p>}
                </div>
            </div>
            {children && <div className="flex items-center gap-3">{children}</div>}
        </div>
    )
}
