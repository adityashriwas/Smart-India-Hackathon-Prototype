'use client'

import React, { useEffect } from 'react'
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

  // Restore auth state after hydration
  useEffect(() => {
    dispatch(restoreAuth())
  }, [dispatch])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    )
  }

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
