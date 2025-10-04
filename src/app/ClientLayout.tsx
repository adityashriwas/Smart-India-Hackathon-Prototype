'use client'

import React, { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Provider } from 'react-redux'
import { store } from '@/redux/store'
import { ToastProvider } from '@/components/ui/toast'
import Navbar from '@/components/layout/Navbar'
import Sidebar from '@/components/layout/Sidebar'
import { useAppSelector, useAppDispatch } from '@/redux/hooks'
import { restoreAuth } from '@/redux/slices/authSlice'

function InnerLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const { sidebarOpen } = useAppSelector((state) => state.ui)
  const dispatch = useAppDispatch()
  const pathname = usePathname()
  const router = useRouter()

  // Restore auth state after hydration
  useEffect(() => {
    dispatch(restoreAuth())
  }, [dispatch])

  // Pages that should use clean layout (no navbar/sidebar) even when authenticated
  const publicPages = ['/', '/signin', '/mission&vision']
  const isPublicPage = publicPages.includes(pathname)

  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/reports', '/analytics', '/departments', '/users', '/staff', '/tasks']
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  // Redirect non-authenticated users to signin page when accessing protected routes
  useEffect(() => {
    if (!isAuthenticated && isProtectedRoute) {
      router.replace('/signin')
    }
  }, [isAuthenticated, isProtectedRoute, router])

  // Show loading for protected routes when not authenticated (during redirect)
  if (!isAuthenticated && isProtectedRoute) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  // Use clean layout for non-authenticated users OR public pages
  if (!isAuthenticated || isPublicPage) {
    return (
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    )
  }

  // Use authenticated layout for dashboard pages
  return (
    <div className="min-h-screen bg-blue-50">
      <Navbar />
      <div className="flex min-h-screen pt-16">
        <Sidebar />
        <main className={`flex-1 overflow-x-hidden overflow-y-auto bg-blue-50 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ToastProvider>
        <InnerLayout>{children}</InnerLayout>
      </ToastProvider>
    </Provider>
  )
}
