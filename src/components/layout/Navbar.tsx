'use client'

import { useState } from 'react'
import { useAppSelector, useAppDispatch } from '@/redux/hooks'
import { logout } from '@/redux/slices/authSlice'
import { toggleSidebar } from '@/redux/slices/uiSlice'
import { Button } from '@/components/ui/button'
import { Bell, Menu, User, LogOut } from 'lucide-react'

export default function Navbar() {
  const { user } = useAppSelector((state) => state.auth)
  const { unreadCount } = useAppSelector((state) => state.notifications)
  const dispatch = useAppDispatch()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const handleLogout = () => {
    dispatch(logout())
    setShowUserMenu(false)
    // Force redirect to login page
    window.location.href = '/'
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg border-b border-blue-500">
      <div className="max-w-full mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Left side */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => dispatch(toggleSidebar())}
              className="text-white hover:bg-blue-500"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">SIH</span>
              </div>
              <h1 className="text-xl font-bold">Civic Issue Platform</h1>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-blue-500 relative"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Button>

            {/* User Menu */}
            <div className="relative">
              <Button
                variant="ghost"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="text-white hover:bg-blue-500 flex items-center space-x-2"
              >
                <User className="h-5 w-5" />
                <span className="hidden md:block">{user?.name}</span>
              </Button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b">
                    <div className="font-medium">{user?.name}</div>
                    <div className="text-gray-500">{user?.email}</div>
                    <div className="text-xs text-blue-600 capitalize">{user?.role?.replace('_', ' ')}</div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
