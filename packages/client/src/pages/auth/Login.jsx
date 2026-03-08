import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Building2, Mail, Lock, ArrowRight } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const setAuth = useAuthStore((state) => state.setAuth)

    const handleLogin = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Login failed')
            }

            setAuth(data.token, data.user)
            navigate('/')
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-corp-bg p-4 relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-corp-accent/20 rounded-full blur-[100px] opacity-50 pointer-events-none" />

            <div className="corp-card w-full max-w-md relative z-10 p-8">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-corp-accent to-purple-600 flex items-center justify-center mb-4 shadow-lg shadow-corp-accent/20">
                        <Building2 size={32} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Me Corp</h1>
                    <p className="text-sm text-corp-muted mt-2">个人公司化管理系统</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-corp-muted mb-1.5 uppercase tracking-wider">企业邮箱 / Email</label>
                        <div className="relative">
                            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-corp-muted" />
                            <input
                                type="email" required
                                value={email} onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-corp-bg border border-corp-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:border-corp-accent focus:ring-1 focus:ring-corp-accent transition outline-none"
                                placeholder="ceo@mecorp.com"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-xs font-medium text-corp-muted uppercase tracking-wider">安全口令 / Password</label>
                            <Link to="/forgot-password" className="text-xs text-corp-accent hover:text-corp-accent-light transition">
                                忘记口令?
                            </Link>
                        </div>
                        <div className="relative">
                            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-corp-muted" />
                            <input
                                type="password" required
                                value={password} onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-corp-bg border border-corp-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:border-corp-accent focus:ring-1 focus:ring-corp-accent transition outline-none"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit" disabled={loading}
                        className="w-full mt-6 bg-corp-accent hover:bg-corp-accent-light text-white font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition disabled:opacity-70 disabled:cursor-not-allowed group"
                    >
                        {loading ? '身份验证中...' : '进入系统'}
                        {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                    </button>
                </form>

                <p className="text-center text-sm text-corp-muted mt-8">
                    尚未注册企业兵牌？ <Link to="/register" className="text-corp-accent hover:text-corp-accent-light transition ml-1">立即注册</Link>
                </p>
            </div>
        </div>
    )
}
