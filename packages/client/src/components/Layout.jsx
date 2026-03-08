import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import { motion, AnimatePresence } from 'framer-motion'

export default function Layout() {
    const location = useLocation()

    return (
        <div className="flex min-h-screen bg-corp-bg text-corp-text relative overflow-hidden font-sans">
            {/* Dynamic Background Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px] mix-blend-screen animate-blob pointer-events-none"></div>
            <div className="absolute top-[20%] right-[-5%] w-[30%] h-[50%] rounded-full bg-blue-600/10 blur-[100px] mix-blend-screen animate-blob pointer-events-none" style={{ animationDelay: '2s' }}></div>
            <div className="absolute bottom-[-20%] left-[20%] w-[50%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px] mix-blend-screen animate-blob pointer-events-none" style={{ animationDelay: '4s' }}></div>

            <div className="flex w-full h-screen p-4 gap-6 z-10 relative max-w-[1920px] mx-auto">
                <Sidebar />
                <main className="flex-1 overflow-y-auto overflow-x-hidden rounded-[24px] bg-corp-surface/30 backdrop-blur-xl border border-white/5 relative shadow-glass custom-scrollbar scroll-smooth">
                    <div className="p-8 md:p-10 max-w-7xl mx-auto min-h-full">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={location.pathname}
                                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -20, scale: 0.98 }}
                                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                            >
                                <Outlet />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </main>
            </div>
        </div>
    )
}
