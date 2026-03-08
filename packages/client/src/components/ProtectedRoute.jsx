import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function ProtectedRoute() {
    const token = useAuthStore((state) => state.token)

    // If no token, redirect to login page
    if (!token) {
        return <Navigate to="/login" replace />
    }

    // Otherwise, render the child routes (e.g., Layout and the department pages)
    return <Outlet />
}
