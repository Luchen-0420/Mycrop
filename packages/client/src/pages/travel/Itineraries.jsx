import { useState, useEffect } from 'react'
import { MapPin, Plus, Calendar, Users, Plane, Hotel, Clock, X, Send } from 'lucide-react'

function ItineraryModal({ isOpen, onClose, onSave, itinerary: initialItinerary }) {
    const [itinerary, setItinerary] = useState(initialItinerary || { destination: '', startDate: '', endDate: '', type: 'leisure', travelers: 1 })

    useEffect(() => {
        setItinerary(initialItinerary || { destination: '', startDate: '', endDate: '', type: 'leisure', travelers: 1 })
    }, [initialItinerary, isOpen])

    const handleChange = (e) => {
        const { name, value } = e.target
        setItinerary(prev => ({ ...prev, [name]: value }))
    }

    const handleSave = () => {
        onSave(itinerary)
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-corp-surface p-6 rounded-lg w-full max-w-lg border border-corp-border">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-white">{itinerary.id ? '编辑行程' : '新建行程'}</h3>
                    <button onClick={onClose} className="text-corp-muted hover:text-white"><X size={20} /></button>
                </div>
                <div className="space-y-4">
                    <input name="destination" value={itinerary.destination} onChange={handleChange} type="text" placeholder="目的地" className="w-full bg-corp-bg border border-corp-border rounded-lg px-3 py-2 text-sm text-white" />
                    <div className="flex gap-4">
                        <input name="startDate" value={itinerary.startDate} onChange={handleChange} type="date" className="w-full bg-corp-bg border border-corp-border rounded-lg px-3 py-2 text-sm text-white" />
                        <input name="endDate" value={itinerary.endDate} onChange={handleChange} type="date" className="w-full bg-corp-bg border border-corp-border rounded-lg px-3 py-2 text-sm text-white" />
                    </div>
                    <div className="flex gap-4">
                        <select name="type" value={itinerary.type} onChange={handleChange} className="w-full bg-corp-bg border border-corp-border rounded-lg px-3 py-2 text-sm text-white">
                            <option value="leisure">休闲度假</option>
                            <option value="business">商务出差</option>
                            <option value="family">家庭旅行</option>
                        </select>
                        <input name="travelers" value={itinerary.travelers} onChange={handleChange} type="number" placeholder="人数" min="1" className="w-full bg-corp-bg border border-corp-border rounded-lg px-3 py-2 text-sm text-white" />
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

export default function Itineraries() {
    const [itineraries, setItineraries] = useState([])
    const [selectedItinerary, setSelectedItinerary] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const fetchItineraries = async () => {
        setLoading(true)
        try {
            const response = await fetch('/api/travel/itineraries')
            const data = await response.json()
            setItineraries(data.itineraries)
            if (!selectedItinerary && data.itineraries.length > 0) {
                setSelectedItinerary(data.itineraries[0])
            }
        } catch (error) {
            console.error("Failed to fetch itineraries:", error)
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchItineraries()
    }, [])

    const handleSaveItinerary = async (itinerary) => {
        const url = itinerary.id ? `/api/travel/itineraries/${itinerary.id}` : '/api/travel/itineraries'
        const method = itinerary.id ? 'PUT' : 'POST'

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(itinerary),
            })
            if (response.ok) {
                fetchItineraries()
                setIsModalOpen(false)
            }
        } catch (error) {
            console.error("Failed to save itinerary:", error)
        }
    }

    const handleEdit = (itinerary) => {
        setSelectedItinerary(itinerary)
        setIsModalOpen(true)
    }

    const handleConvertToTasks = async () => {
        if (!selectedItinerary) return

        const tasks = selectedItinerary.dailySchedules.flatMap(day => 
            day.activities.map(act => ({
                title: `[${selectedItinerary.destination}] ${act.activity}`,
                description: `地点: ${act.location}`,
                due_date: day.date,
                priority: 'medium',
            }))
        )

        try {
            await fetch('/api/operations/tasks/batch', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tasks }),
            })
            alert('行程已成功转为待办事项！')
        } catch (error) {
            console.error("Failed to convert to tasks:", error)
        }
    }

    // ... (getStatusChip remains the same)

    return (
        <div className="flex h-[calc(100vh-180px)]">
            {/* Left Panel with onClick for edit */}
            <div className="w-1/3 border-r border-corp-border pr-6 space-y-4 overflow-y-auto">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-white">行程列表</h3>
                    <button onClick={() => { setSelectedItinerary(null); setIsModalOpen(true); }} className="flex items-center gap-2 px-3 py-1.5 bg-corp-accent hover:bg-corp-accent-light rounded-lg text-sm text-white transition">
                        <Plus size={16} /> 新建行程
                    </button>
                </div>
                {loading ? <p className="text-corp-muted">加载中...</p> : 
                    itineraries.map(it => (
                        <div key={it.id} onClick={() => setSelectedItinerary(it)} 
                             className={`p-4 rounded-lg cursor-pointer border transition-all ${selectedItinerary?.id === it.id ? 'bg-corp-surface border-corp-accent' : 'bg-corp-bg border-corp-border hover:border-white/20'}`}>
                             <div onDoubleClick={() => handleEdit(it)}>{/* ... content ... */}</div>
                        </div>
                    ))
                }
            </div>

            {/* Right Panel */}
            <div className="w-2/3 pl-6 overflow-y-auto">
                {selectedItinerary ? (
                    <div className="space-y-6">
                        <div className="corp-card p-4">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-white">每日日程</h3>
                                <button onClick={handleConvertToTasks} className="flex items-center gap-2 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-700 rounded-lg text-sm text-white transition">
                                    <Send size={14} /> 转为待办
                                </button>
                            </div>
                            {/* existing daily schedule content here */}
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full text-corp-muted">请选择一个行程查看详情</div>
                )}
            </div>

            <ItineraryModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSave={handleSaveItinerary} 
                itinerary={selectedItinerary} 
            />
        </div>
    )
}