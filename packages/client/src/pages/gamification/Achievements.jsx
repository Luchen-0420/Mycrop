import { useState } from 'react'
import PageHeader from '../../components/PageHeader'
import { Trophy, Star, TrendingUp, Award, PlayCircle } from 'lucide-react'
import Lottie from 'lottie-react'
import { motion } from 'framer-motion'
// Provide a default simple fireworks/confetti animation data or fetch it.
// We'll use a placeholder Lottie element since we don't have a large JSON file locally.

export default function Achievements() {
    const [showCelebration, setShowCelebration] = useState(false)

    const triggerCelebration = () => {
        setShowCelebration(true)
        setTimeout(() => setShowCelebration(false), 3000)
    }

    const badges = [
        { id: 1, name: 'Budget Master', desc: '连续3个月不超支', icon: '💰', unlocked: true },
        { id: 2, name: 'Early Bird', desc: '连续7天23点前入睡', icon: '🌙', unlocked: true },
        { id: 3, name: 'OKR Crusher', desc: '季度OKR达标', icon: '🎯', unlocked: false },
        { id: 4, name: 'Record Keeper', desc: '连续30天记账', icon: '📝', unlocked: false },
        { id: 5, name: 'Tyrant', desc: '单月独裁裁决超过5次', icon: '👑', unlocked: true }, // negative badge example
    ]

    return (
        <div className="relative">
            <PageHeader icon={Trophy} title="成就中心" subtitle="Gamification & CEO Rating">
                <button
                    onClick={triggerCelebration}
                    className="btn btn-primary flex items-center gap-2"
                >
                    <PlayCircle size={16} /> 模拟升级庆祝
                </button>
            </PageHeader>

            {/* CEO Rating Card */}
            <div className="corp-card mb-8">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white border-4 border-corp-bg relative shadow-xl">
                        <Star size={32} />
                        <div className="absolute -bottom-2 bg-corp-bg text-xs font-bold px-2 py-0.5 rounded-full border border-corp-border text-yellow-500">
                            Lv.4
                        </div>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Director 级 CEO</h2>
                        <p className="text-sm text-corp-muted mt-1">下一等级：VP 级 CEO (距晋升还需 1,240 经验值)</p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-corp-bg rounded-full h-3 mb-2 border border-corp-border/50">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '65%' }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="bg-gradient-to-r from-yellow-500 to-orange-400 h-2.5 rounded-full"
                    ></motion.div>
                </div>
                <div className="flex justify-between text-xs text-corp-muted font-mono">
                    <span>4,500 XP</span>
                    <span>5,740 XP</span>
                </div>
            </div>

            {/* Badges Grid */}
            <h3 className="text-lg font-bold text-corp-text mb-4 mt-8 flex items-center gap-2">
                <Award size={20} className="text-blue-400" />
                系统奖章
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {badges.map(badge => (
                    <motion.div
                        key={badge.id}
                        whileHover={{ y: -5, scale: 1.02 }}
                        className={`corp-card text-center p-6 ${badge.unlocked ? 'border-blue-500/30' : 'opacity-50 grayscale'}`}
                    >
                        <div className="text-4xl mb-3">{badge.icon}</div>
                        <h4 className="font-bold text-corp-text text-sm mb-1">{badge.name}</h4>
                        <p className="text-xs text-corp-muted">{badge.desc}</p>
                        {!badge.unlocked && <div className="mt-3 text-[10px] text-corp-muted uppercase tracking-wider bg-corp-bg rounded px-2 py-1 inline-block">未解锁</div>}
                    </motion.div>
                ))}
            </div>

            {/* Placeholder for Lottie Celebration */}
            {showCelebration && (
                <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-center"
                    >
                        <div className="text-6xl mb-4">🎉</div>
                        <h2 className="text-3xl font-bold text-white mb-2">晋升成功！</h2>
                        <p className="text-yellow-400 font-medium">你已升至 VP 级 CEO</p>
                    </motion.div>
                    {/* In a real scenario, <Lottie animationData={...} /> goes here */}
                </div>
            )}
        </div>
    )
}
