import { useState, useEffect } from 'react'
import { Download, Briefcase, Calendar, MapPin, Mail, Loader2, Award } from 'lucide-react'

export default function Profile() {
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Fetch profile data from API
        const fetchProfile = async () => {
            try {
                // TODO: add actual token logic from zustand authStore if using custom fetch, 
                // but we might just use relative fetch for now if proxy is set or standard fetch
                const res = await fetch('/api/hr/profile')
                if (res.ok) {
                    const data = await res.json()
                    setProfile(data)
                }
            } catch (err) {
                console.error("Failed to fetch profile", err)
            } finally {
                setLoading(false)
            }
        }
        fetchProfile()
    }, [])

    const handleExportResume = () => {
        // Mock export logic for Phase 1. 
        // A simple window.print() is a decent start for "frontend generated PDF"
        window.print()
    }

    if (loading) {
        return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-corporate-accent" /></div>
    }

    return (
        <div className="space-y-6">

            {/* Header / Basic Info */}
            <div className="bg-corporate-800 rounded-xl p-8 border border-corporate-700 flex flex-col md:flex-row items-start md:items-center justify-between">
                <div className="flex items-center space-x-6">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-corporate-500 to-corporate-accent flex items-center justify-center text-3xl font-bold shadow-lg">
                        {profile?.user?.username?.charAt(0).toUpperCase() || 'M'}
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold">{profile?.user?.username || 'Me Corp User'}</h2>
                        <div className="text-corporate-text-secondary mt-1 flex items-center space-x-4">
                            <span className="flex items-center"><Briefcase size={14} className="mr-1" /> {profile?.title || 'CEO'} · {profile?.level || 'P1'}</span>
                            <span className="flex items-center"><Mail size={14} className="mr-1" /> {profile?.user?.email}</span>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                            {(profile?.tags || ['Strategic', 'Driven']).map(tag => (
                                <span key={tag} className="px-3 py-1 bg-corporate-900 border border-corporate-600 rounded-full text-xs font-semibold text-corporate-text-secondary">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-6 md:mt-0 flex flex-col items-end">
                    <div className="text-right mb-4">
                        <div className="text-sm text-corporate-text-secondary">入职天数</div>
                        <div className="text-3xl font-bold text-corporate-accent">{profile?.joinDays || 0} <span className="text-base font-normal text-corporate-text-secondary">天</span></div>
                    </div>
                    <button
                        onClick={handleExportResume}
                        className="btn-primary flex items-center space-x-2"
                    >
                        <Download size={16} />
                        <span>导出简历 (PDF)</span>
                    </button>
                </div>
            </div>

            {/* Career Path / Promotion History (Mock Data for now) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Promotion Path */}
                <div className="bg-corporate-800 rounded-xl p-6 border border-corporate-700">
                    <h3 className="text-xl font-bold mb-6 flex items-center"><Award size={20} className="mr-2 text-corporate-500" /> 职级晋升通道</h3>
                    <div className="relative border-l-2 border-corporate-700 ml-3 space-y-8">
                        <div className="relative pl-6">
                            <div className="absolute w-4 h-4 bg-corporate-800 border-2 border-corporate-700 rounded-full -left-[9px] top-1"></div>
                            <div className="font-bold text-corporate-text-secondary">P5 专家级 (Expert)</div>
                            <div className="text-sm text-corporate-text-secondary mt-1">需达成 3 项核心技能满级</div>
                        </div>
                        <div className="relative pl-6">
                            <div className="absolute w-4 h-4 bg-corporate-800 border-2 border-corporate-700 rounded-full -left-[9px] top-1"></div>
                            <div className="font-bold text-corporate-text-secondary">P4 资深级 (Senior)</div>
                            <div className="text-sm text-corporate-text-secondary mt-1">需独立完成 5 项重大项目</div>
                        </div>
                        <div className="relative pl-6">
                            <div className="absolute w-4 h-4 bg-corporate-accent border-2 border-corporate-accent rounded-full -left-[9px] top-1 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                            <div className="font-bold text-white flex items-center justify-between">
                                <span>P3 核心级 (Core)</span>
                                <span className="text-xs px-2 py-0.5 bg-corporate-accent/20 text-corporate-accent rounded border border-corporate-accent/50">当前职级</span>
                            </div>
                            <div className="text-sm text-corporate-text-secondary mt-1">熟练掌握各部门日常运作</div>
                        </div>
                        <div className="relative pl-6 opacity-50">
                            <div className="absolute w-4 h-4 bg-corporate-600 rounded-full -left-[9px] top-1"></div>
                            <div className="font-bold">P2 熟练级 (Proficient)</div>
                        </div>
                        <div className="relative pl-6 opacity-50">
                            <div className="absolute w-4 h-4 bg-corporate-600 rounded-full -left-[9px] top-1"></div>
                            <div className="font-bold">P1 初级 (Junior)</div>
                        </div>
                    </div>
                </div>

                {/* Promotion History */}
                <div className="bg-corporate-800 rounded-xl p-6 border border-corporate-700">
                    <h3 className="text-xl font-bold mb-6 flex items-center"><Calendar size={20} className="mr-2 text-corporate-500" /> 晋升记录</h3>
                    <div className="space-y-4">
                        <div className="p-4 bg-corporate-900 rounded-lg border border-corporate-700">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="font-bold flex items-center gap-2">晋升 P3 <span className="text-corporate-success text-sm">↑</span></div>
                                    <div className="text-sm text-corporate-text-secondary mt-1">通过了年度个人发展评估，各项维度达标。</div>
                                </div>
                                <div className="text-xs text-corporate-text-secondary">2026-01-15</div>
                            </div>
                        </div>
                        <div className="p-4 bg-corporate-900 rounded-lg border border-corporate-700">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="font-bold flex items-center gap-2">晋升 P2 <span className="text-corporate-success text-sm">↑</span></div>
                                    <div className="text-sm text-corporate-text-secondary mt-1">完成了最初的适应期，确立了系统的基本运作模式。</div>
                                </div>
                                <div className="text-xs text-corporate-text-secondary">2025-06-10</div>
                            </div>
                        </div>
                        <div className="p-4 bg-corporate-900 rounded-lg border border-corporate-700">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="font-bold flex items-center gap-2">入职定级 P1</div>
                                    <div className="text-sm text-corporate-text-secondary mt-1">Me Corp 个人公司正式创立。</div>
                                </div>
                                <div className="text-xs text-corporate-text-secondary">2025-01-01</div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
