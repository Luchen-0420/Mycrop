import { useState, useEffect } from 'react'
import { Plus, Search, Eye, EyeOff, X, CreditCard, KeyRound, ShieldAlert, Laptop, Briefcase, Gamepad2, AlertTriangle, ExternalLink, CalendarDays, Loader2, Plane, Home, Car } from 'lucide-react'

export default function Credentials() {
    const [credentials, setCredentials] = useState([])
    const [accounts, setAccounts] = useState([])
    const [loading, setLoading] = useState(true)

    // Modals state
    const [isCredModalOpen, setIsCredModalOpen] = useState(false)
    const [isAccModalOpen, setIsAccModalOpen] = useState(false)

    // Form state
    const [credForm, setCredForm] = useState({ type: 'id_card', name: '', identifier: '', issue_date: '', expiry_date: '', location: '', notes: '' })
    const [accForm, setAccForm] = useState({ platform_name: '', account_type: 'social', username: '', password_hint: '', bind_email: '', bind_phone: '', notes: '' })

    // UI state
    const [searchQuery, setSearchQuery] = useState('')
    const [visiblePasswords, setVisiblePasswords] = useState(new Set()) // Set of account IDs where password_hint is visible

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const [cRes, aRes] = await Promise.all([
                fetch('/api/admin/credentials'),
                fetch('/api/admin/accounts')
            ])
            if (cRes.ok && aRes.ok) {
                setCredentials(await cRes.json())
                setAccounts(await aRes.json())
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleCredSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await fetch('/api/admin/credentials', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credForm)
            })
            if (res.ok) {
                setIsCredModalOpen(false)
                setCredForm({ type: 'id_card', name: '', identifier: '', issue_date: '', expiry_date: '', location: '', notes: '' })
                fetchData()
            }
        } catch (err) {
            console.error(err)
        }
    }

    const handleAccSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await fetch('/api/admin/accounts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(accForm)
            })
            if (res.ok) {
                setIsAccModalOpen(false)
                setAccForm({ platform_name: '', account_type: 'social', username: '', password_hint: '', bind_email: '', bind_phone: '', notes: '' })
                fetchData()
            }
        } catch (err) {
            console.error(err)
        }
    }

    const togglePasswordVisibility = (id) => {
        const newSet = new Set(visiblePasswords)
        if (newSet.has(id)) {
            newSet.delete(id)
        } else {
            newSet.add(id)
        }
        setVisiblePasswords(newSet)
    }

    const deleteAccount = async (id) => {
        if (!confirm('确定废弃并删除该账号档案吗？')) return;
        try {
            await fetch(`/api/admin/accounts/${id}`, { method: 'DELETE' })
            fetchData()
        } catch (e) {
            console.error(e)
        }
    }

    const getCredIcon = (type) => {
        switch (type) {
            case 'passport': return <Plane size={24} className="text-blue-400" />
            case 'id_card': return <CreditCard size={24} className="text-emerald-400" />
            case 'property': return <Home size={24} className="text-amber-400" />
            case 'visa': return <ExternalLink size={24} className="text-purple-400" />
            case 'driver_license': return <Car size={24} className="text-slate-400" />
            default: return <ShieldAlert size={24} className="text-corp-muted" />
        }
    }

    const getAccTypeIcon = (type) => {
        switch (type) {
            case 'social': return <span className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded text-[10px] font-bold">社交网络</span>
            case 'finance': return <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded text-[10px] font-bold">金融资产</span>
            case 'work': return <span className="bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded text-[10px] font-bold">工作效能</span>
            case 'dev': return <span className="bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded text-[10px] font-bold">开发/IT</span>
            case 'game': return <span className="bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded text-[10px] font-bold">游戏娱乐</span>
            default: return <span className="bg-gray-500/20 text-gray-400 px-2 py-0.5 rounded text-[10px] font-bold">其他分类</span>
        }
    }

    if (loading) return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-corp-accent" /></div>

    // Top Alerts Logic (Expired or Expiring in 180 days)
    const expiringCreds = credentials.filter(c => c.expiry_date && c.days_until_expiry <= 180)

    const filteredAccounts = accounts.filter(a =>
        a.platform_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (a.username && a.username.toLowerCase().includes(searchQuery.toLowerCase()))
    )

    return (
        <div className="space-y-6 flex flex-col h-full">

            {/* 1. Header & Top Alerts */}
            {expiringCreds.length > 0 && (
                <div className="bg-gradient-to-r from-corp-danger/20 to-corp-danger/5 border border-corp-danger rounded-xl p-4 shadow-lg flex items-start shrink-0">
                    <AlertTriangle className="text-corp-danger mt-1 mr-4 shrink-0" size={28} />
                    <div>
                        <h3 className="font-bold text-corp-danger text-lg flex items-center">
                            顶级预警：证照生命周期危机
                            <span className="ml-3 bg-corp-danger text-white text-xs px-2 py-0.5 rounded-full">{expiringCreds.length} 项</span>
                        </h3>
                        <div className="mt-2 space-y-2">
                            {expiringCreds.map(c => (
                                <div key={c.id} className="text-sm text-white/90 flex justify-between max-w-2xl bg-black/20 p-2 rounded">
                                    <span>【{c.name}】</span>
                                    <span className="font-mono text-corp-danger font-bold">
                                        {c.days_until_expiry < 0 ? `已过期 ${Math.abs(c.days_until_expiry)} 天` : `剩余 ${c.days_until_expiry} 天到期`}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div className="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-6 min-h-0">

                {/* 2. Left: Digital Accounts Vault */}
                <div className="bg-corp-surface rounded-xl border border-corp-border flex flex-col overflow-hidden shadow-sm">
                    <div className="p-5 border-b border-corp-border flex justify-between items-center bg-corp-bg/50 shrink-0">
                        <div>
                            <h3 className="text-lg font-bold flex items-center text-white"><Laptop className="mr-2 text-corp-accent" size={20} /> 数字保险柜</h3>
                            <p className="text-xs text-corp-muted mt-1">账号矩阵与暗号提示词 (Hints-only)</p>
                        </div>
                        <button onClick={() => setIsAccModalOpen(true)} className="btn-primary flex items-center space-x-1 py-1.5 px-3 text-sm">
                            <Plus size={14} /> <span>新增账号</span>
                        </button>
                    </div>

                    <div className="p-4 border-b border-corp-border shrink-0">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-corp-muted" size={16} />
                            <input
                                type="text"
                                placeholder="搜索平台名称、注册邮箱或用户名..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="w-full bg-corp-bg border border-corp-border rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:border-corp-accent outline-none transition"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-3">
                        {filteredAccounts.map(acc => (
                            <div key={acc.id} className="bg-corp-bg/60 border border-corp-border/60 hover:border-corp-accent/50 rounded-lg p-4 transition-colors group relative">
                                <button onClick={() => deleteAccount(acc.id)} className="absolute top-2 right-2 text-corp-muted hover:text-corp-danger opacity-0 group-hover:opacity-100 transition"><X size={14} /></button>

                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-8 h-8 rounded bg-corp-surface border border-corp-border flex items-center justify-center text-white font-bold text-sm shadow-sm">
                                            {acc.platform_name.substring(0, 1).toUpperCase()}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white leading-none">{acc.platform_name}</h4>
                                            <div className="mt-1">{getAccTypeIcon(acc.account_type)}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2 mt-4 text-sm bg-corp-bg p-3 rounded border border-corp-border/30">
                                    <div className="flex justify-between items-center group/item">
                                        <span className="text-corp-muted text-xs">登陆凭证：</span>
                                        <span className="text-white font-mono bg-corp-surface px-2 py-0.5 rounded">{acc.username || '未登记'}</span>
                                    </div>

                                    <div className="flex justify-between items-center bg-black/20 -mx-3 px-3 py-1.5 border-y border-corp-surface">
                                        <div className="flex items-center text-xs text-corp-warning">
                                            <KeyRound size={12} className="mr-1" />
                                            密码提示词
                                        </div>
                                        <div className="flex items-center">
                                            {visiblePasswords.has(acc.id) ? (
                                                <span className="font-mono text-corp-warning text-xs tracking-wider bg-corp-warning/10 px-2 py-0.5 rounded">{acc.password_hint || '无提示词'}</span>
                                            ) : (
                                                <span className="font-mono text-corp-muted tracking-widest px-2 relative top-0.5">••••••••</span>
                                            )}
                                            <button onClick={() => togglePasswordVisibility(acc.id)} className="ml-2 text-corp-muted hover:text-white transition">
                                                {visiblePasswords.has(acc.id) ? <EyeOff size={14} /> : <Eye size={14} />}
                                            </button>
                                        </div>
                                    </div>

                                    {(acc.bind_email || acc.bind_phone) && (
                                        <div className="flex gap-2 pt-1 text-[10px] text-corp-muted">
                                            {acc.bind_phone && <span className="bg-corp-surface px-1.5 py-0.5 rounded border border-corp-border/50">📱 {acc.bind_phone}</span>}
                                            {acc.bind_email && <span className="bg-corp-surface px-1.5 py-0.5 rounded border border-corp-border/50">✉️ {acc.bind_email}</span>}
                                        </div>
                                    )}
                                </div>
                                {acc.notes && (
                                    <p className="mt-3 text-xs text-corp-muted italic line-clamp-2 px-1">注: {acc.notes}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* 3. Right: Physical Credentials Wallet */}
                <div className="bg-corp-surface rounded-xl border border-corp-border flex flex-col overflow-hidden shadow-sm">
                    <div className="p-5 border-b border-corp-border flex justify-between items-center bg-corp-bg/50 shrink-0">
                        <div>
                            <h3 className="text-lg font-bold flex items-center text-white"><Briefcase className="mr-2 text-corp-accent" size={20} /> 实体证照卡包</h3>
                            <p className="text-xs text-corp-muted mt-1">你的物理通行证与重要契约证书</p>
                        </div>
                        <button onClick={() => setIsCredModalOpen(true)} className="btn-primary flex items-center space-x-1 py-1.5 px-3 text-sm">
                            <Plus size={14} /> <span>录入证照</span>
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-5 custom-scrollbar grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-4 content-start">
                        {credentials.map(c => {
                            const isExpired = c.days_until_expiry < 0;
                            const isWarning = c.days_until_expiry >= 0 && c.days_until_expiry <= 180;

                            return (
                                <div key={c.id} className="relative bg-gradient-to-br from-corp-bg to-corp-surface border border-corp-border rounded-xl p-5 shadow-lg overflow-hidden group">
                                    {/* Background Accent */}
                                    <div className="absolute -right-6 -top-6 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                                        {getCredIcon(c.type)}
                                    </div>

                                    <div className="flex justify-between items-start mb-4 relative z-10">
                                        <div className="flex items-center space-x-3">
                                            {getCredIcon(c.type)}
                                            <h4 className="font-bold text-white text-lg tracking-wide">{c.name}</h4>
                                        </div>
                                        {c.expiry_date && (
                                            <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${isExpired ? 'bg-corp-danger/20 text-corp-danger border-corp-danger/50' :
                                                    isWarning ? 'bg-corp-warning/20 text-corp-warning border-corp-warning/50' :
                                                        'bg-corp-success/20 text-corp-success border-corp-success/50'
                                                }`}>
                                                {isExpired ? '已失效' : '有效'}
                                            </span>
                                        )}
                                    </div>

                                    <div className="space-y-2 mb-4 relative z-10">
                                        {c.identifier && (
                                            <div className="font-mono text-sm text-white/90 tracking-widest bg-black/30 p-2 rounded shadow-inner">
                                                {c.identifier}
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 text-xs border-t border-corp-border/50 pt-3 relative z-10">
                                        <div>
                                            <span className="text-corp-muted block mb-0.5">签发日期</span>
                                            <span className="font-mono text-white/80">{c.issue_date ? new Date(c.issue_date).toLocaleDateString() : '-'}</span>
                                        </div>
                                        <div>
                                            <span className="text-corp-muted block mb-0.5">到期日期</span>
                                            <span className={`font-mono font-bold ${isExpired ? 'text-corp-danger' : isWarning ? 'text-corp-warning' : 'text-white/80'}`}>
                                                {c.expiry_date ? new Date(c.expiry_date).toLocaleDateString() : '长期有效'}
                                            </span>
                                        </div>
                                    </div>

                                    {c.location && (
                                        <div className="mt-3 text-[10px] text-corp-muted flex items-center bg-corp-bg/50 px-2 py-1.5 rounded border border-corp-border/30 w-fit">
                                            <ShieldAlert size={10} className="mr-1 inline text-corp-accent" />
                                            位置：{c.location}
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>

            </div>

            {/* Modals */}

            {/* Account Modal */}
            {isAccModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
                    <div className="bg-corp-surface rounded-xl border border-corp-muted shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="p-4 border-b border-corp-border flex justify-between items-center bg-corp-bg">
                            <h3 className="font-bold text-lg text-white">存入数字保险柜</h3>
                            <button onClick={() => setIsAccModalOpen(false)} className="text-corp-muted hover:text-white"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleAccSubmit} className="p-5 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-xs text-corp-muted mb-1">平台名称</label>
                                    <input type="text" required placeholder="如: Github, AWS, 招商银行" value={accForm.platform_name} onChange={e => setAccForm({ ...accForm, platform_name: e.target.value })} className="w-full bg-corp-bg border border-corp-border rounded-lg px-3 py-2 text-white outline-none focus:border-corp-accent text-sm" />
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="block text-xs text-corp-muted mb-1">账号大类</label>
                                    <select value={accForm.account_type} onChange={e => setAccForm({ ...accForm, account_type: e.target.value })} className="w-full bg-corp-bg border border-corp-border rounded-lg px-3 py-2 text-white outline-none focus:border-corp-accent text-sm">
                                        <option value="finance">金融/银行</option>
                                        <option value="dev">开发/云服务</option>
                                        <option value="work">工作/协作</option>
                                        <option value="social">社交/内容</option>
                                        <option value="game">游戏/娱乐</option>
                                    </select>
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="block text-xs text-corp-muted mb-1">登录凭证 (Username)</label>
                                    <input type="text" placeholder="手机号/邮箱/登入名" value={accForm.username} onChange={e => setAccForm({ ...accForm, username: e.target.value })} className="w-full bg-corp-bg border border-corp-border rounded-lg px-3 py-2 text-white outline-none focus:border-corp-accent text-sm font-mono" />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs text-corp-muted mb-1 flex justify-between items-center">
                                        <span>密码提示词 (Hint) ⚠️极度机密</span>
                                        <span className="text-[10px] text-corp-warning">强烈建议勿填明文</span>
                                    </label>
                                    <input type="text" placeholder="例如: 常用密码A+平台首字母大写" value={accForm.password_hint} onChange={e => setAccForm({ ...accForm, password_hint: e.target.value })} className="w-full bg-corp-bg border border-corp-warning/50 rounded-lg px-3 py-2 text-corp-warning outline-none focus:border-corp-warning text-sm font-mono" />
                                </div>
                            </div>
                            <div className="border-t border-corp-border pt-3">
                                <label className="block text-xs text-corp-muted mb-2">安全绑定信息 (备忘用)</label>
                                <div className="flex gap-2">
                                    <input type="text" placeholder="绑定手机" value={accForm.bind_phone} onChange={e => setAccForm({ ...accForm, bind_phone: e.target.value })} className="flex-1 bg-corp-bg border border-corp-border rounded-lg px-3 py-2 text-white outline-none focus:border-corp-accent text-xs font-mono" />
                                    <input type="email" placeholder="绑定安全邮箱" value={accForm.bind_email} onChange={e => setAccForm({ ...accForm, bind_email: e.target.value })} className="flex-1 bg-corp-bg border border-corp-border rounded-lg px-3 py-2 text-white outline-none focus:border-corp-accent text-xs font-mono" />
                                </div>
                            </div>
                            <div className="flex justify-end pt-4">
                                <button type="submit" className="btn-primary py-2 px-6 w-full shadow">封存入库</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Credential Modal */}
            {isCredModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
                    <div className="bg-corp-surface rounded-xl border border-corp-muted shadow-2xl w-full max-w-lg overflow-hidden">
                        <div className="p-4 border-b border-corp-border flex justify-between items-center bg-corp-bg">
                            <h3 className="font-bold text-lg text-white">建档新生实体证照</h3>
                            <button onClick={() => setIsCredModalOpen(false)} className="text-corp-muted hover:text-white"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleCredSubmit} className="p-5 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="block text-xs text-corp-muted mb-1">证照大类</label>
                                    <select value={credForm.type} onChange={e => setCredForm({ ...credForm, type: e.target.value })} className="w-full bg-corp-bg border border-corp-border rounded-lg px-3 py-2 text-white outline-none focus:border-corp-accent text-sm">
                                        <option value="passport">护照 (Passport)</option>
                                        <option value="visa">签证 (Visa)</option>
                                        <option value="id_card">身份类 (ID / 居住证)</option>
                                        <option value="driver_license">驾照 (Driver License)</option>
                                        <option value="property">资质与资产 (如房产证)</option>
                                        <option value="other">其他纸质文件</option>
                                    </select>
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="block text-xs text-corp-muted mb-1">证件名称 (全称)</label>
                                    <input type="text" required placeholder="如: 中华人民共和国护照" value={credForm.name} onChange={e => setCredForm({ ...credForm, name: e.target.value })} className="w-full bg-corp-bg border border-corp-border rounded-lg px-3 py-2 text-white outline-none focus:border-corp-accent text-sm" />
                                </div>
                                <div className="col-span-2 text-center text-xs text-corp-muted my-1 border-t border-corp-border pt-2 pb-1">
                                    --- 核心元数据 ---
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs text-corp-muted mb-1">证件编号 (非必填，用于办事复制)</label>
                                    <input type="text" placeholder="E12345678" value={credForm.identifier} onChange={e => setCredForm({ ...credForm, identifier: e.target.value })} className="w-full bg-corp-bg border border-corp-border rounded-lg px-3 py-2 text-white outline-none focus:border-corp-accent text-sm font-mono tracking-widest" />
                                </div>
                                <div>
                                    <label className="block text-xs text-corp-muted mb-1">签发日期</label>
                                    <input type="date" value={credForm.issue_date} onChange={e => setCredForm({ ...credForm, issue_date: e.target.value })} className="w-full bg-corp-bg border border-corp-border rounded-lg px-3 py-2 text-white outline-none focus:border-corp-accent text-sm font-mono" />
                                </div>
                                <div>
                                    <label className="block text-xs text-corp-muted mb-1 text-corp-danger">过期日期 (用于预警雷达)</label>
                                    <input type="date" value={credForm.expiry_date} onChange={e => setCredForm({ ...credForm, expiry_date: e.target.value })} className="w-full bg-corp-bg border border-corp-danger/50 rounded-lg px-3 py-2 text-white outline-none focus:border-corp-danger text-sm font-mono" />
                                </div>
                                <div className="col-span-2 text-center text-xs text-corp-muted my-1 border-t border-corp-border pt-2 pb-1">
                                    --- 物理链路追踪 ---
                                </div>
                                <div className="col-span-2 flex gap-3 items-end">
                                    <div className="flex-1">
                                        <label className="block text-xs text-corp-muted mb-1">物理存放位置</label>
                                        <input type="text" placeholder="比如: 书房保险柜 A 区" value={credForm.location} onChange={e => setCredForm({ ...credForm, location: e.target.value })} className="w-full bg-corp-bg border border-corp-border rounded-lg px-3 py-2 text-white outline-none focus:border-corp-accent text-sm" />
                                    </div>
                                    <button type="submit" className="btn-primary py-2 px-8 shadow hidden sm:block">建档</button>
                                </div>
                                <button type="submit" className="btn-primary py-2 px-8 w-full shadow block sm:hidden col-span-2 mt-2">建档</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    )
}
