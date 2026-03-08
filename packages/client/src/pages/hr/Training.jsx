import { useState, useEffect } from 'react'
import { BookOpen, Link as LinkIcon, Plus, CheckCircle2, PlayCircle, Loader2 } from 'lucide-react'

import StatCard from '../../components/StatCard'

export default function Training() {
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true)

    // Parse Modal State
    const [isParseModalOpen, setIsParseModalOpen] = useState(false)
    const [parseUrl, setParseUrl] = useState('')
    const [isParsing, setIsParsing] = useState(false)
    const [parsedResult, setParsedResult] = useState(null)
    const [selectedProjectId, setSelectedProjectId] = useState('')

    useEffect(() => {
        fetchProjects()
    }, [])

    const fetchProjects = async () => {
        try {
            const res = await fetch('/api/hr/training/projects')
            if (res.ok) {
                const data = await res.json()
                setProjects(data)
                if (data.length > 0) setSelectedProjectId(data[0].id)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleParse = async (e) => {
        e.preventDefault()
        setIsParsing(true)
        setParsedResult(null)
        try {
            const res = await fetch('/api/hr/training/parse', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: parseUrl })
            })
            if (res.ok) {
                const data = await res.json()
                setParsedResult(data)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setIsParsing(false)
        }
    }

    const handleConfirmImport = async () => {
        if (!parsedResult || !selectedProjectId) return

        try {
            const res = await fetch('/api/hr/training/resources', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    project_id: selectedProjectId,
                    title: parsedResult.title,
                    type: parsedResult.type,
                    url: parsedResult.url,
                    total_items: parsedResult.total_items
                })
            })
            if (res.ok) {
                setIsParseModalOpen(false)
                setParseUrl('')
                setParsedResult(null)
                // In a real app, refetch project details here
                alert('资源解析并导入成功！(打卡详情迭代二开发)')
            }
        } catch (err) {
            console.error(err)
        }
    }

    const handleCreateDemoProject = async () => {
        try {
            await fetch('/api/hr/training/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: "神经网络入门",
                    goal: "掌握 CNN/RNN 基础",
                    limit_days: 30
                })
            })
            fetchProjects()
        } catch (err) { console.error(err) }
    }

    if (loading) return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-corporate-accent" /></div>

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard icon={BookOpen} title="进行中计划" value={projects.length} color="blue" />
                <StatCard icon={CheckCircle2} title="已完成课程" value={0} color="green" />
                <StatCard icon={PlayCircle} title="总学习时长" value="0h" color="purple" />
            </div>

            <div className="flex justify-end space-x-3">
                <button onClick={handleCreateDemoProject} className="btn-secondary flex items-center space-x-2">
                    <Plus size={16} />
                    <span>新建计划</span>
                </button>
                <button
                    onClick={() => setIsParseModalOpen(true)}
                    className="btn-primary flex items-center justify-center space-x-2"
                >
                    <LinkIcon size={16} />
                    <span>解析在线资源</span>
                </button>
            </div>

            {/* Projects List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {projects.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-corporate-text-secondary border-2 border-dashed border-corporate-700 rounded-xl">
                        <p>还没有进行中的培训计划。</p>
                        <button onClick={handleCreateDemoProject} className="text-corporate-accent hover:underline mt-2">点击创建一个测试计划 "神经网络入门"</button>
                    </div>
                ) : (
                    projects.map(project => (
                        <div key={project.id} className="bg-corporate-800 rounded-xl p-6 border border-corporate-700">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h4 className="text-lg font-bold">{project.name}</h4>
                                    <p className="text-sm text-corporate-text-secondary mt-1">{project.goal}</p>
                                </div>
                                <span className="px-2 py-1 bg-corporate-primary/20 text-corporate-primary border border-corporate-primary/30 rounded text-xs">
                                    进行中
                                </span>
                            </div>

                            <div className="mt-6 border-t border-corporate-700 pt-4">
                                <h5 className="text-sm font-semibold mb-3">关联学习资源</h5>
                                {/* List of resources would go here, fetching from /api/hr/training/projects/:id/resources. 
                                    Mocking for display based on Phase 1 plan */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 bg-corporate-900 rounded border border-corporate-700">
                                        <div className="flex items-center space-x-3">
                                            <PlayCircle size={18} className="text-corporate-accent" />
                                            <div>
                                                <div className="text-sm font-medium">吴恩达深度学习</div>
                                                <div className="text-xs text-corporate-text-secondary">视频 · 共 200 集</div>
                                            </div>
                                        </div>
                                        <div className="text-sm">25/200</div>
                                    </div>
                                    <button className="w-full py-2 border border-dashed border-corporate-600 rounded text-sm text-corporate-text-secondary hover:text-white hover:border-corporate-500 transition">
                                        + 添加外部资源
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Parse Resource Modal */}
            {isParseModalOpen && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-corporate-800 rounded-xl max-w-2xl w-full border border-corporate-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-corporate-700">
                            <h3 className="text-xl font-bold flex items-center"><LinkIcon size={20} className="mr-2" /> 解析学习资源</h3>
                            <p className="text-sm text-corporate-text-secondary mt-1">支持 B站视频列表、Coursera 课程链接等。系统将自动提取目录并排课。</p>
                        </div>

                        <div className="p-6 overflow-y-auto">
                            {!parsedResult ? (
                                <form onSubmit={handleParse} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-corporate-text-secondary mb-2">资源链接 (URL)</label>
                                        <div className="flex space-x-2">
                                            <input
                                                type="url"
                                                required
                                                className="flex-1 bg-corporate-900 border border-corporate-700 rounded-lg px-4 py-2 text-white outline-none focus:border-corporate-primary focus:ring-1 focus:ring-corporate-primary transition-all"
                                                placeholder="https://www.bilibili.com/video/BV..."
                                                value={parseUrl}
                                                onChange={e => setParseUrl(e.target.value)}
                                            />
                                            <button
                                                type="submit"
                                                disabled={isParsing || !parseUrl}
                                                className="btn-primary flex items-center"
                                            >
                                                {isParsing ? <Loader2 size={16} className="animate-spin" /> : '开始解析'}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            ) : (
                                <div className="space-y-6">
                                    <div className="p-4 bg-corporate-success/10 border border-corporate-success/20 rounded-lg flex items-start space-x-3">
                                        <CheckCircle2 className="text-corporate-success shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="font-bold text-corporate-success">解析成功</h4>
                                            <p className="text-sm mt-1">提取到 <span className="font-bold text-white">{parsedResult.title}</span>，共 <span className="font-bold text-white">{parsedResult.total_items}</span> 个内容单元。</p>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-corporate-text-secondary mb-2">归属项目</label>
                                        <select
                                            className="w-full bg-corporate-900 border border-corporate-700 rounded-lg px-4 py-2 text-white outline-none focus:border-corporate-primary"
                                            value={selectedProjectId}
                                            onChange={e => setSelectedProjectId(e.target.value)}
                                        >
                                            {projects.map(p => (
                                                <option key={p.id} value={p.id}>{p.name}</option>
                                            ))}
                                            {projects.length === 0 && <option value="">无可用项目，请先创建</option>}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-corporate-text-secondary mb-2">排课预览 (部分展示)</label>
                                        <div className="border border-corporate-700 rounded-lg overflow-hidden">
                                            <table className="w-full text-sm text-left">
                                                <thead className="bg-corporate-900 text-corporate-text-secondary">
                                                    <tr>
                                                        <th className="px-4 py-2 font-medium">序号</th>
                                                        <th className="px-4 py-2 font-medium">标题</th>
                                                        <th className="px-4 py-2 font-medium">预估时常</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {parsedResult.mock_chapters.map(chapter => (
                                                        <tr key={chapter.id} className="border-b border-corporate-800 last:border-0 hover:bg-corporate-800">
                                                            <td className="px-4 py-2 text-corporate-text-secondary">P{chapter.id}</td>
                                                            <td className="px-4 py-2">{chapter.title}</td>
                                                            <td className="px-4 py-2 text-corporate-text-secondary">{chapter.duration}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                            <div className="bg-corporate-900 py-2 text-center text-xs text-corporate-text-secondary">
                                                ... 以及另外 {parsedResult.total_items - parsedResult.mock_chapters.length} 节
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t border-corporate-700 bg-corporate-900/50 flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => { setIsParseModalOpen(false); setParsedResult(null); setParseUrl(''); }}
                                className="px-4 py-2 bg-corporate-800 hover:bg-corporate-700 border border-corporate-700 rounded-lg text-sm font-medium transition"
                            >
                                取消
                            </button>
                            {parsedResult && (
                                <button
                                    onClick={handleConfirmImport}
                                    disabled={!selectedProjectId}
                                    className="btn-primary text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    确认导入并排课
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}
