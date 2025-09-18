'use client'

import { useAppSelector } from '@/redux/hooks'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Building2, 
  BarChart3, 
  Settings,
  ClipboardList,
  UserCheck,
  MapPin
} from 'lucide-react'

const adminNavItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/reports', label: 'All Reports', icon: FileText },
  { href: '/maps', label: 'Interactive Maps', icon: MapPin },
  { href: '/departments', label: 'Departments', icon: Building2 },
  { href: '/users', label: 'Users', icon: Users },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/settings', label: 'Settings', icon: Settings },
]

const departmentHeadNavItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/reports', label: 'Department Reports', icon: FileText },
  { href: '/maps', label: 'Area Maps', icon: MapPin },
  { href: '/staff', label: 'Staff Management', icon: UserCheck },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
]

const staffNavItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/tasks', label: 'My Tasks', icon: ClipboardList },
  { href: '/reports', label: 'Reports', icon: FileText },
  { href: '/maps', label: 'Task Maps', icon: MapPin },
]

export default function Sidebar() {
  const { sidebarOpen } = useAppSelector((state) => state.ui)
  const { user } = useAppSelector((state) => state.auth)
  const pathname = usePathname()

  const getNavItems = () => {
    switch (user?.role) {
      case 'admin':
        return adminNavItems
      case 'department_head':
        return departmentHeadNavItems
      case 'staff':
        return staffNavItems
      default:
        return []
    }
  }

  const navItems = getNavItems()

  return (
    <aside
      className={cn(
        'fixed left-0 top-16 h-[calc(100vh-4rem)]  border-r border-gray-300 transition-all duration-300 z-40 shadow-sm',
        sidebarOpen ? 'w-64' : 'w-16'
      )}
    >
      <div className="p-4">
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  sidebarOpen ? 'space-x-3' : 'justify-center',
                  isActive
                    ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                )}
              >
                <Icon className="h-5 w-5" />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
