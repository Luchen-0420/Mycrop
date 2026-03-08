import { useState, useEffect } from 'react'
import { Package, Plus, Minus, AlertTriangle, Search, Loader2 } from 'lucide-react'

export default function Inventory() {
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [newItem, setNewItem] = useState({ name: '', category: '日用品', location: '', quantity: 1, unit: '个', min_alert_quantity: 1 })
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)

    useEffect(() => {
        fetchInventory()
    }, [])

    const fetchInventory = async () => {
        try {
            const res = await fetch('/api/admin/inventory')
            if (res.ok) {
                const data = await res.json()
                setItems(data)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleAddItem = async (e) => {
        e.preventDefault()
        try {
            const res = await fetch('/api/admin/inventory', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newItem)
            })
            if (res.ok) {
                setIsAddModalOpen(false)
                setNewItem({ name: '', category: '日用品', location: '', quantity: 1, unit: '个', min_alert_quantity: 1 })
                fetchInventory()
            }
        } catch (err) {
            console.error(err)
        }
    }

    const handleUpdateQuantity = async (id, newQuantity) => {
        if (newQuantity < 0) return; // Prevent negative inventory
        try {
            const res = await fetch(`/api/admin/inventory/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ quantity: newQuantity })
            })
            if (res.ok) {
                fetchInventory()
            }
        } catch (err) {
            console.error(err)
        }
    }

    const categoryColors = {
        '食品': 'bg-corp-success',
        '日用品': 'bg-corp-accent',
        '文具': 'bg-corp-accent',
        '电器耗材': 'bg-corp-warning'
    }

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const alertItems = items.filter(item => item.quantity <= item.min_alert_quantity)

    if (loading) return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-corp-accent" /></div>

    return (
        <div className="space-y-6">

            {/* Top Alerts Row */}
            {alertItems.length > 0 && (
                <div className="bg-corp-danger/10 border border-corp-danger/20 rounded-xl p-4 flex items-start space-x-3">
                    <AlertTriangle className="text-corp-danger shrink-0 mt-0.5" size={20} />
                    <div>
                        <h4 className="font-bold text-corp-danger">库存告急预警</h4>
                        <p className="text-sm text-corp-muted mt-1">以下物品库存已达到或低于预警线，请及时补充：</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {alertItems.map(item => (
                                <span key={item.id} className="text-xs px-2 py-1 bg-corp-danger/20 text-corp-danger rounded">
                                    {item.name} (余 {item.quantity}{item.unit})
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <h3 className="text-xl font-bold flex items-center"><Package size={20} className="mr-2 text-corp-muted" /> 物资台账 (Inventory)</h3>
                <div className="flex space-x-3 w-full md:w-auto">
                    <div className="relative flex-grow md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-corp-muted" size={16} />
                        <input
                            type="text"
                            placeholder="搜索物品..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-corp-bg border border-corp-border rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:border-corp-accent outline-none"
                        />
                    </div>
                    <button onClick={() => setIsAddModalOpen(true)} className="btn-primary flex items-center space-x-2 whitespace-nowrap">
                        <Plus size={16} />
                        <span>入库新物资</span>
                    </button>
                </div>
            </div>

            {/* Inventory Table/Cards for mobile */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredItems.map(item => (
                    <div key={item.id} className={`bg-corp-surface rounded-xl p-5 border transition-colors ${item.quantity <= item.min_alert_quantity ? 'border-corp-danger/50' : 'border-corp-border hover:border-corp-border'}`}>
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center space-x-2">
                                <h4 className="font-bold text-lg">{item.name}</h4>
                                <span className={`text-xs px-2 py-0.5 rounded text-white ${categoryColors[item.category] || 'bg-corp-border'}`}>
                                    {item.category}
                                </span>
                            </div>
                        </div>

                        <div className="text-sm text-corp-muted mb-4 flex justify-between">
                            <span>存放于: <span className="text-white">{item.location || '未记录'}</span></span>
                            {item.quantity <= item.min_alert_quantity && <span className="text-corp-danger font-medium flex items-center"><AlertTriangle size={12} className="mr-1" /> 低库存</span>}
                        </div>

                        <div className="flex justify-between items-center p-2 bg-corp-bg rounded-lg border border-corp-border">
                            <span className="text-sm text-corp-muted">余量</span>
                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={() => handleUpdateQuantity(item.id, parseInt(item.quantity) - 1)}
                                    className="w-8 h-8 rounded shrink-0 flex items-center justify-center bg-corp-surface border border-corp-border text-corp-muted hover:text-white hover:border-corp-accent transition"
                                >
                                    <Minus size={14} />
                                </button>
                                <span className="font-mono text-lg font-bold w-12 text-center text-corp-accent">{item.quantity}</span>
                                <button
                                    onClick={() => handleUpdateQuantity(item.id, parseInt(item.quantity) + 1)}
                                    className="w-8 h-8 rounded shrink-0 flex items-center justify-center bg-corp-surface border border-corp-border text-corp-muted hover:text-white hover:border-corp-accent transition"
                                >
                                    <Plus size={14} />
                                </button>
                                <span className="text-sm text-corp-muted">{item.unit}</span>
                            </div>
                        </div>
                    </div>
                ))}

                {filteredItems.length === 0 && (
                    <div className="col-span-full py-12 text-center text-corp-muted border border-dashed border-corp-border rounded-xl">
                        <Package size={32} className="mx-auto mb-2 opacity-50" />
                        <p>没有找到相关物资记录</p>
                    </div>
                )}
            </div>

            {/* Add Item Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex flex-col items-center justify-center z-50 p-4">
                    <div className="bg-corp-surface rounded-xl max-w-md w-full p-6 border border-corp-border shadow-2xl max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-bold mb-4">入库新物资</h3>
                        <form onSubmit={handleAddItem}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-corp-muted mb-1">物品名称</label>
                                    <input type="text" required className="form-input w-full bg-corp-bg border border-corp-border rounded px-3 py-2 text-white outline-none focus:border-corp-accent" placeholder="e.g. 咖啡豆" value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-corp-muted mb-1">分类</label>
                                        <select className="form-select w-full bg-corp-bg border border-corp-border rounded px-3 py-2 text-white outline-none focus:border-corp-accent" value={newItem.category} onChange={e => setNewItem({ ...newItem, category: e.target.value })}>
                                            <option value="日用品">日用品</option>
                                            <option value="食品">食品</option>
                                            <option value="文具">文具</option>
                                            <option value="电器耗材">电器耗材</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-corp-muted mb-1">存放位置</label>
                                        <input type="text" className="form-input w-full bg-corp-bg border border-corp-border rounded px-3 py-2 text-white outline-none focus:border-corp-accent" placeholder="e.g. 客厅柜子" value={newItem.location} onChange={e => setNewItem({ ...newItem, location: e.target.value })} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-corp-muted mb-1">初始数量</label>
                                        <input type="number" min="0" required className="form-input w-full bg-corp-bg border border-corp-border rounded px-3 py-2 text-white outline-none focus:border-corp-accent" value={newItem.quantity} onChange={e => setNewItem({ ...newItem, quantity: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-corp-muted mb-1">单位</label>
                                        <input type="text" required className="form-input w-full bg-corp-bg border border-corp-border rounded px-3 py-2 text-white outline-none focus:border-corp-accent" placeholder="个/包/瓶" value={newItem.unit} onChange={e => setNewItem({ ...newItem, unit: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-corp-muted mb-1">低预警线</label>
                                        <input type="number" min="0" className="form-input w-full bg-corp-bg border border-corp-border rounded px-3 py-2 text-white outline-none focus:border-corp-accent" value={newItem.min_alert_quantity} onChange={e => setNewItem({ ...newItem, min_alert_quantity: e.target.value })} />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end space-x-3">
                                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 bg-corp-bg hover:bg-corp-border border border-corp-border rounded text-sm transition">取消</button>
                                <button type="submit" className="btn-primary text-sm">确认添加</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
