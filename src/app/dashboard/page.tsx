'use client'

import { useAppSelector } from '@/redux/hooks'
import AdminDashboard from '@/components/dashboards/AdminDashboard'
import DepartmentHeadDashboard from '@/components/dashboards/DepartmentHeadDashboard'
import StaffDashboard from '@/components/dashboards/StaffDashboard'

export default function Dashboard() {
  const { user } = useAppSelector((state) => state.auth)

  if (!user) {
    return <div>Loading...</div>
  }

  switch (user.role) {
    case 'admin':
      return <AdminDashboard />
    case 'department_head':
      return <DepartmentHeadDashboard />
    case 'staff':
      return <StaffDashboard />
    default:
      return <div>Invalid role</div>
  }
}
