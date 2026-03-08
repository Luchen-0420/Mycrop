import { useState, useEffect } from 'react'
import { Monitor, Plus, DollarSign, Calendar, MapPin, Loader2 } from 'lucide-react'

export default function Assets() {
    const [assets, setAssets] = useState([])
    const [loading, setLoading] = useState(true)
    const [newAsset, setNewAsset] = useState({ name: '', category: '电子设备', purchase_date: new Date().toISOString().split('T')[0], purchase_price: '', status: '使用中', location: '' })
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)

    useEffect(() => {
        fetchAssets()
    }, [])

    const fetchAssets = async () => {
        try {
            const res = await fetch('/api/admin/assets')
            if (res.ok) {
                const data = await res.json()
                setAssets(data)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleAddAsset = async (e) => {
        e.preventDefault()
        try {
            const res = await fetch('/api/admin/assets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newAsset)
            })
            if (res.ok) {
                setIsAddModalOpen(false)
                setNewAsset({ name: '', category: '电子设备', purchase_date: new Date().toISOString().split('T')[0], purchase_price: '', status: '使用中', location: '' })
                fetchAssets()
            }
        } catch (err) {
            console.error(err)
        }
    }

    const totalValue = assets.reduce((sum, current) => sum + parseFloat(current.purchase_price || 0), 0)

    if (loading) return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-corp-accent" /></div>

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold flex items-center"><Monitor size={20} className="mr-2 text-corp-muted" /> 固定资产台账 (Fixed Assets)</h3>
                <button onClick={() => setIsAddModalOpen(true)} className="btn-primary flex items-center space-x-2">
                    <Plus size={16} />
                    <span>登记新资产</span>
                </button>
            </div>

            <div className="bg-corp-surface rounded-xl p-6 border border-corp-border flex justify-between items-center bg-gradient-to-r from-corp-surface to-corp-bg">
                <div>
                    <h4 className="text-corp-muted text-sm mb-1">资产总计价值</h4>
                    <div className="text-3xl font-bold flex items-center"><DollarSign size={24} className="text-corp-accent mr-1" />{totalValue.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</div>
                </div>
                <div className="text-right">
                    <h4 className="text-corp-muted text-sm mb-1">资产总数</h4>
                    <div className="text-2xl font-bold">{assets.length} <span className="text-sm font-normal text-corp-muted">件</span></div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {assets.map(asset => {
                    const purchaseDate = new Date(asset.purchase_date).toLocaleDateString()
                    return (
                        <div key={asset.id} className="bg-corp-surface rounded-xl p-5 border border-corp-border hover:border-corp-border transition-colors">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h4 className="font-bold text-lg mb-1">{asset.name}</h4>
                                    <span className="text-xs px-2 py-0.5 rounded text-corp-muted bg-corp-bg border border-corp-border">
                                        {asset.category}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <span className={`text-xs px-2 py-1 rounded font-bold ${asset.status === '使用中' ? 'bg-corp-success/20 text-corp-success' :
                                            asset.status === '已闲置' ? 'bg-corp-warning/20 text-corp-warning' :
                                                'bg-corp-bg text-corp-muted border border-corp-border'
                                        }`}>
                                        {asset.status}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-2 mt-4 text-sm text-corp-muted border-t border-corp-border/50 pt-4">
                                <div className="flex justify-between">
                                    <span className="flex items-center"><DollarSign size={14} className="mr-1" /> 购入价格</span>
                                    <span className="font-mono text-corp-accent">¥{parseFloat(asset.purchase_price).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="flex items-center"><Calendar size={14} className="mr-1" /> 购入时间</span>
                                    <span>{purchaseDate}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="flex items-center"><MapPin size={14} className="mr-1" /> 所在位置</span>
                                    <span>{asset.location || '未记录'}</span>
                                </div>
                            </div>
                        </div>
                    )
                })}

                {assets.length === 0 && (
                    <div className="col-span-full py-12 text-center text-corp-muted border border-dashed border-corp-border rounded-xl">
                        <Monitor size={32} className="mx-auto mb-2 opacity-50" />
                        <p>名下暂无固定资产记录</p>
                    </div>
                )}
            </div>

            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex flex-col items-center justify-center z-50 p-4">
                    <div className="bg-corp-surface rounded-xl max-w-md w-full p-6 border border-corp-border shadow-2xl">
                        <h3 className="text-xl font-bold mb-4">登记新固定资产</h3>
                        <form onSubmit={handleAddAsset}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-corp-muted mb-1">资产名称</label>
                                    <input type="text" required className="form-input w-full bg-corp-bg border border-corp-border rounded px-3 py-2 text-white outline-none focus:border-corp-accent" placeholder="e.g. MacBook Pro" value={newAsset.name} onChange={e => setNewAsset({ ...newAsset, name: e.target.value })} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-corp-muted mb-1">分类</label>
                                        <select className="form-select w-full bg-corp-bg border border-corp-border rounded px-3 py-2 text-white outline-none focus:border-corp-accent" value={newAsset.category} onChange={e => setNewAsset({ ...newAsset, category: e.target.value })}>
                                            <option value="电子设备">电子设备</option>
                                            <option value="家居家具">家居家具</option>
                                            <option value="交通工具">交通工具</option>
                                            <option value="房产">房产</option>
                                            <option value="其他">其他</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-corp-muted mb-1">当前状态</label>
                                        <select className="form-select w-full bg-corp-bg border border-corp-border rounded px-3 py-2 text-white outline-none focus:border-corp-accent" value={newAsset.status} onChange={e => setNewAsset({ ...newAsset, status: e.target.value })}>
                                            <option value="使用中">使用中</option>
                                            <option value="已闲置">已闲置</option>
                                            <option value="已出二手">已出二手</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-corp-muted mb-1">购入日期</label>
                                        <input type="date" required className="form-input w-full bg-corp-bg border border-corp-border rounded px-3 py-2 text-white outline-none focus:border-corp-accent" value={newAsset.purchase_date} onChange={e => setNewAsset({ ...newAsset, purchase_date: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-corp-muted mb-1">购入价格 (元)</label>
                                        <input type="number" step="0.01" min="0" required className="form-input w-full bg-corp-bg border border-corp-border rounded px-3 py-2 text-white outline-none focus:border-corp-accent" value={newAsset.purchase_price} onChange={e => setNewAsset({ ...newAsset, purchase_price: e.target.value })} />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-corp-muted mb-1">设备位置</label>
                                    <input type="text" className="form-input w-full bg-corp-bg border border-corp-border rounded px-3 py-2 text-white outline-none focus:border-corp-accent" placeholder="e.g. 书房书桌" value={newAsset.location} onChange={e => setNewAsset({ ...newAsset, location: e.target.value })} />
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end space-x-3">
                                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 bg-corp-bg hover:bg-corp-border border border-corp-border rounded text-sm transition">取消</button>
                                <button type="submit" className="btn-primary text-sm">确认登记</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
