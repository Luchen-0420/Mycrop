import { useState, useEffect } from 'react'
import { BookOpen, DollarSign, Plus, X } from 'lucide-react'

function LogModal({ isOpen, onClose, onSave, log: initialLog }) {
    const [log, setLog] = useState(initialLog || { destination: '', startDate: '', endDate: '', rating: 5, diary: [] })
    const [newHighlight, setNewHighlight] = useState('')

    useEffect(() => {
        setLog(initialLog || { destination: '', startDate: '', endDate: '', rating: 5, diary: [] })
    }, [initialLog, isOpen])

    const handleChange = (e) => {
        const { name, value } = e.target
        setLog(prev => ({ ...prev, [name]: value }))
    }

    const addHighlightToDay = (dayIndex) => {
        if (newHighlight.trim() === '') return
        const updatedDiary = [...log.diary]
        updatedDiary[dayIndex].highlights.push(newHighlight.trim())
        setLog(prev => ({ ...prev, diary: updatedDiary }))
        setNewHighlight('')
    }

    const handleSave = () => {
        onSave(log)
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-corp-surface p-6 rounded-lg w-full max-w-2xl border border-corp-border">
                <h3 className="text-lg font-semibold text-white mb-4">{log.id ? '编辑日记' : '添加日记'}</h3>
                {/* ... Form inputs for destination, dates, rating ... */}
                <div>
                    <h4 className="text-md font-semibold text-white mt-4 mb-2">每日记录</h4>
                    {log.diary.map((day, i) => (
                        <div key={i} className="mb-2 p-2 border border-corp-border rounded-lg">
                            <p className="font-semibold text-corp-accent">{day.date}</p>
                            {/* ... inputs for mood, weather ... */}
                            <ul className="list-disc list-inside text-sm">{day.highlights.map((h, j) => <li key={j}>{h}</li>)}</ul>
                            <div className="flex gap-2 mt-2">
                                <input value={newHighlight} onChange={e => setNewHighlight(e.target.value)} placeholder="添加高光时刻..." className="w-full bg-corp-bg text-sm"/>
                                <button onClick={() => addHighlightToDay(i)} className="text-sm">添加</button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-end gap-3 mt-6">
                    <button onClick={onClose} className="px-4 py-2 text-sm">取消</button>
                    <button onClick={handleSave} className="px-4 py-2 text-sm bg-corp-accent rounded-lg">保存</button>
                </div>
            </div>
        </div>
    )
}

export default function TravelLogs() {
    // ... (existing state and useEffect)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedLog, setSelectedLog] = useState(null)

    const handleSaveLog = async (log) => {
        // ... (API call logic)
        console.log("Saving log:", log)
        setIsModalOpen(false)
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">差旅日记</h2>
                <button onClick={() => { setSelectedLog(null); setIsModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-corp-accent rounded-lg text-sm">
                    <Plus size={16} /> 添加日记
                </button>
            </div>

            {/* ... list of logs with onDoubleClick to open modal ... */}

            <LogModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSave={handleSaveLog} 
                log={selectedLog} 
            />
        </div>
    )
}