'use client'

import { Inter } from 'next/font/google'
import './globals.css'
import { Provider } from 'react-redux'
import { store } from '@/redux/store'
import { ToastProvider } from '@/components/ui/toast'
import Navbar from '@/components/layout/Navbar'
import Sidebar from '@/components/layout/Sidebar'
import { useAppSelector } from '@/redux/hooks'

const inter = Inter({ subsets: ['latin'] })

function AppLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const { sidebarOpen } = useAppSelector((state) => state.ui)

  if (!isAuthenticated) {
    return <div className="min-h-screen bg-gray-50">{children}</div>
  }

  return (
    <div className="min-h-screen bg-gray-200">
      <Navbar />
      <div className="flex min-h-screen pt-16">
        <Sidebar />
        <main className={`flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider store={store}>
          <ToastProvider>
            <AppLayout>{children}</AppLayout>
          </ToastProvider>
        </Provider>
      </body>
    </html>
  )
}
