import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft, Send } from 'lucide-react'

export default function ForgotPassword() {
    const [email, setEmail] = useState('')
    const [status, setStatus] = useState('idle')
    const [message, setMessage] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setStatus('loading')
        setMessage('')

        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Request failed')
            }

            setStatus('success')
            setMessage(data.message)
        } catch (err) {
            setStatus('error')
            setMessage(err.message)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-corp-bg p-4 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-corp-accent/20 rounded-full blur-[100px] opacity-50 pointer-events-none" />

            <div className="corp-card w-full max-w-md relative z-10 p-8">
                <div className="mb-8">
                    <Link to="/login" className="inline-flex items-center gap-2 text-sm text-corp-muted hover:text-white transition mb-6">
                        <ArrowLeft size={16} /> 返回登录
                    </Link>
                    <h1 className="text-2xl font-bold text-white mb-2">重置口令</h1>
                    <p className="text-sm text-corp-muted">输入您的企业邮箱，我们将发送重置链接给您（MVP 阶段仅作 Mock 展示）。</p>
                </div>

                {status === 'error' && (
                    <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">
                        {message}
                    </div>
                )}

                {status === 'success' ? (
                    <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-center">
                        <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-3">
                            <Send size={24} className="text-emerald-400" />
                        </div>
                        <p className="text-sm text-emerald-400 font-medium">{message}</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
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

                        <button
                            type="submit" disabled={status === 'loading'}
                            className="w-full mt-6 bg-corp-accent hover:bg-corp-accent-light text-white font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {status === 'loading' ? '处理中...' : '发送重置邮件'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}
