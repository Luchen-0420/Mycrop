export default function PageHeader({ title, subtitle, icon: Icon, children }) {
    return (
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5 relative z-10">
            <div className="flex items-center gap-5">
                {Icon && (
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-corp-accent/40 to-blue-500/20 flex items-center justify-center border border-white/10 shadow-glow backdrop-blur-md">
                        <Icon size={28} className="text-white" strokeWidth={1.5} />
                    </div>
                )}
                <div>
                    <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 tracking-tight mb-1">{title}</h1>
                    {subtitle && <p className="text-sm font-medium text-corp-muted/80">{subtitle}</p>}
                </div>
            </div>
            {children && <div className="flex items-center gap-4">{children}</div>}
        </div>
    )
}
