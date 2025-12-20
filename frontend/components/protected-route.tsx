"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface ProtectedRouteProps {
  children: React.ReactNode
  redirectTo?: string
  requireAuth?: boolean
}

export default function ProtectedRoute({ 
  children, 
  redirectTo = "/", 
  requireAuth = true 
}: ProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      const authStatus = localStorage.getItem('isAuthenticated') === 'true'
      setIsAuthenticated(authStatus)
      
      if (requireAuth && !authStatus) {
        router.push(redirectTo)
      }
    }

    checkAuth()
  }, [router, redirectTo, requireAuth])

  // Show loading while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent-sky/30 border-t-accent-sky rounded-full animate-spin" />
      </div>
    )
  }

  // If auth is required but user is not authenticated, don't render children
  if (requireAuth && !isAuthenticated) {
    return null
  }

  return <>{children}</>
}

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [userEmail, setUserEmail] = useState<string>("")

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated') === 'true'
    const email = localStorage.getItem('userEmail') || ""
    setIsAuthenticated(authStatus)
    setUserEmail(email)
  }, [])

  const login = (email: string) => {
    localStorage.setItem('isAuthenticated', 'true')
    localStorage.setItem('userEmail', email)
    setIsAuthenticated(true)
    setUserEmail(email)
  }

  const logout = () => {
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('userEmail')
    setIsAuthenticated(false)
    setUserEmail("")
  }

  return { isAuthenticated, userEmail, login, logout }
}
