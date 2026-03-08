import { useState, useEffect } from 'react'
import { Package, CheckSquare, Square, Plus, X } from 'lucide-react'

function TemplateModal({ isOpen, onClose, onSave, template: initialTemplate }) {
    const [template, setTemplate] = useState(initialTemplate || { name: '', category: '', climate: '', duration: '', items: [] })
    const [newItem, setNewItem] = useState('')

    useEffect(() => {
        setTemplate(initialTemplate || { name: '', category: '', climate: '', duration: '', items: [] })
    }, [initialTemplate, isOpen])

    const handleChange = (e) => {
        const { name, value } = e.target
        setTemplate(prev => ({ ...prev, [name]: value }))
    }

    const handleAddItem = () => {
        if (newItem.trim() === '') return
        const item = { category: '未分类', item: newItem.trim(), quantity: 1, essential: false }
        setTemplate(prev => ({ ...prev, items: [...prev.items, item] }))
        setNewItem('')
    }

    const handleSave = () => {
        onSave(template)
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-corp-surface p-6 rounded-lg w-full max-w-lg border border-corp-border">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-white">{template.id ? '编辑模板' : '新建模板'}</h3>
                    <button onClick={onClose} className="text-corp-muted hover:text-white"><X size={20} /></button>
                </div>
                <div className="space-y-4">
                    <input name="name" value={template.name} onChange={handleChange} type="text" placeholder="模板名称" className="w-full bg-corp-bg border border-corp-border rounded-lg px-3 py-2 text-sm text-white" />
                    {/* ... other inputs for category, climate, duration ... */}
                    <div>
                        <h4 className="text-md font-semibold text-white mb-2">物品列表</h4>
                        <div className="flex gap-2 mb-2">
                            <input value={newItem} onChange={(e) => setNewItem(e.target.value)} type="text" placeholder="新物品名称..." className="w-full bg-corp-bg border border-corp-border rounded-lg px-3 py-2 text-sm text-white" />
                            <button onClick={handleAddItem} className="px-4 py-2 bg-corp-accent rounded-lg text-sm text-white">添加</button>
                        </div>
                        <ul className="space-y-1 max-h-40 overflow-y-auto">
                            {template.items.map((item, i) => <li key={i} className="text-sm text-white">{item.item}</li>)}
                        </ul>
                    </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                    <button onClick={onClose} className="px-4 py-2 text-sm text-white bg-corp-bg rounded-lg border border-corp-border hover:bg-white/5">取消</button>
                    <button onClick={handleSave} className="px-4 py-2 text-sm text-white bg-corp-accent hover:bg-corp-accent-light rounded-lg">保存</button>
                </div>
            </div>
        </div>
    )
}

export default function PackingLists() {
    // ... (existing state and useEffect)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedTemplateForEdit, setSelectedTemplateForEdit] = useState(null)

    const handleSaveTemplate = async (template) => {
        // ... (API call logic similar to Itineraries)
        console.log("Saving template:", template)
        setIsModalOpen(false)
    }

    return (
        <div className="flex h-[calc(100vh-180px)]">
            <div className="w-1/3 border-r border-corp-border pr-6 space-y-4 overflow-y-auto">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-white">打包模板</h3>
                    <button onClick={() => { setSelectedTemplateForEdit(null); setIsModalOpen(true); }} className="flex items-center gap-2 px-3 py-1.5 bg-corp-accent hover:bg-corp-accent-light rounded-lg text-sm text-white transition">
                        <Plus size={16} /> 新建模板
                    </button>
                </div>
                {/* ... list of templates with onDoubleClick to open modal ... */}
            </div>
            
            {/* ... (Right Panel remains the same) */}

            <TemplateModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSave={handleSaveTemplate} 
                template={selectedTemplateForEdit} 
            />
        </div>
    )
}