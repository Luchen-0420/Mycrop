import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './pages/Dashboard'
import Achievements from './pages/gamification/Achievements'
import PersonaStudio from './pages/gamification/PersonaStudio'
import FinanceLayout from './pages/finance/FinanceLayout'
import Ledger from './pages/finance/Ledger'
import Budget from './pages/finance/Budget'
import Points from './pages/finance/Points'
import Subscriptions from './pages/finance/Subscriptions'
import OperationsLayout from './pages/operations/OperationsLayout'
import Kanban from './pages/operations/Kanban'
import Habits from './pages/operations/Habits'
import OKRs from './pages/operations/OKRs'
import HRLayout from './pages/hr/HRLayout'
import Profile from './pages/hr/Profile'
import Skills from './pages/hr/Skills'
import Training from './pages/hr/Training'
import Wellness from './pages/hr/Wellness'
import Review from './pages/hr/Review'
import PRLayout from './pages/pr/PRLayout'
import Contacts from './pages/pr/Contacts'
import Maintenance from './pages/pr/Maintenance'
import Gifts from './pages/pr/Gifts'
import AdminLayout from './pages/admin/AdminLayout'
import Inventory from './pages/admin/Inventory'
import Procurement from './pages/admin/Procurement'
import Assets from './pages/admin/Assets'
import Credentials from './pages/admin/Credentials'
import Health from './pages/Health'
import LegalLayout from './pages/legal/LegalLayout'
import Contracts from './pages/legal/Contracts'
import Insurances from './pages/legal/Insurances'
import Disputes from './pages/legal/Disputes'
import Reminders from './pages/legal/Reminders'
import RDLayout from './pages/rd/RDLayout'
import Workshops from './pages/rd/Workshops'
import Ideas from './pages/rd/Ideas'
import TechNotes from './pages/rd/TechNotes'
import Portfolio from './pages/rd/Portfolio'
import CommerceLayout from './pages/commerce/CommerceLayout'
import Revenue from './pages/commerce/Revenue'
import Partnerships from './pages/commerce/Partnerships'
import Career from './pages/commerce/Career'
import Monetization from './pages/commerce/Monetization'
import TravelLayout from './pages/travel/TravelLayout'
import Itineraries from './pages/travel/Itineraries'
import PackingLists from './pages/travel/PackingLists'
import TravelLogs from './pages/travel/TravelLogs'
import TravelExpenses from './pages/travel/TravelExpenses'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'

export default function App() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="achievements" element={<Achievements />} />
                    <Route path="persona" element={<PersonaStudio />} />
                    <Route path="finance" element={<FinanceLayout />}>
                        <Route index element={<Navigate to="ledger" replace />} />
                        <Route path="ledger" element={<Ledger />} />
                        <Route path="budget" element={<Budget />} />
                        <Route path="points" element={<Points />} />
                        <Route path="subscriptions" element={<Subscriptions />} />
                    </Route>
                    <Route path="operations" element={<OperationsLayout />}>
                        <Route index element={<Navigate to="kanban" replace />} />
                        <Route path="kanban" element={<Kanban />} />
                        <Route path="habits" element={<Habits />} />
                        <Route path="okrs" element={<OKRs />} />
                    </Route>
                    <Route path="hr" element={<HRLayout />}>
                        <Route index element={<Navigate to="profile" replace />} />
                        <Route path="profile" element={<Profile />} />
                        <Route path="skills" element={<Skills />} />
                        <Route path="training" element={<Training />} />
                        <Route path="wellness" element={<Wellness />} />
                        <Route path="review" element={<Review />} />
                    </Route>
                    <Route path="pr" element={<PRLayout />}>
                        <Route index element={<Navigate to="contacts" replace />} />
                        <Route path="contacts" element={<Contacts />} />
                        <Route path="maintenance" element={<Maintenance />} />
                        <Route path="gifts" element={<Gifts />} />
                    </Route>
                    <Route path="admin" element={<AdminLayout />}>
                        <Route index element={<Navigate to="inventory" replace />} />
                        <Route path="inventory" element={<Inventory />} />
                        <Route path="procurement" element={<Procurement />} />
                        <Route path="assets" element={<Assets />} />
                        <Route path="credentials" element={<Credentials />} />
                    </Route>
                    <Route path="health" element={<Health />} />
                    <Route path="legal" element={<LegalLayout />}>
                        <Route index element={<Navigate to="contracts" replace />} />
                        <Route path="contracts" element={<Contracts />} />
                        <Route path="insurances" element={<Insurances />} />
                        <Route path="disputes" element={<Disputes />} />
                        <Route path="reminders" element={<Reminders />} />
                    </Route>
                    <Route path="rd" element={<RDLayout />}>
                        <Route index element={<Navigate to="workshops" replace />} />
                        <Route path="workshops" element={<Workshops />} />
                        <Route path="ideas" element={<Ideas />} />
                        <Route path="notes" element={<TechNotes />} />
                        <Route path="portfolio" element={<Portfolio />} />
                    </Route>
                    <Route path="commerce" element={<CommerceLayout />}>
                        <Route index element={<Navigate to="revenue" replace />} />
                        <Route path="revenue" element={<Revenue />} />
                        <Route path="partnerships" element={<Partnerships />} />
                        <Route path="career" element={<Career />} />
                        <Route path="monetization" element={<Monetization />} />
                    </Route>
                    <Route path="travel" element={<TravelLayout />}>
                        <Route index element={<Navigate to="itineraries" replace />} />
                        <Route path="itineraries" element={<Itineraries />} />
                        <Route path="packing" element={<PackingLists />} />
                        <Route path="logs" element={<TravelLogs />} />
                        <Route path="expenses" element={<TravelExpenses />} />
                    </Route>
                </Route>
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}
