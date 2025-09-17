'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppSelector, useAppDispatch } from '@/redux/hooks'
import { mockLogin } from '@/redux/slices/authSlice'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { users } from '@/lib/seedData'

export default function Home() {
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  const handleLogin = (userId: number) => {
    dispatch(mockLogin(userId))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-2xl">SIH</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Civic Issue Reporting Platform
          </h1>
          <p className="text-xl text-gray-600">
            Smart India Hackathon 2025 - Government Portal Demo
          </p>
        </div>

        {/* Login Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Admin Login */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <CardTitle className="text-blue-600">Admin Portal</CardTitle>
              <CardDescription>
                Manage departments, users, and system overview
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-gray-600">
                <p><strong>Features:</strong></p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Department management</li>
                  <li>User administration</li>
                  <li>System analytics</li>
                  <li>Report oversight</li>
                </ul>
              </div>
              <Button 
                onClick={() => handleLogin(1)} 
                className="w-full"
              >
                Login as Admin
              </Button>
            </CardContent>
          </Card>

          {/* Department Head Login */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <CardTitle className="text-green-600">Department Head</CardTitle>
              <CardDescription>
                Manage department reports and staff
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-gray-600">
                <p><strong>Features:</strong></p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Department reports</li>
                  <li>Staff assignment</li>
                  <li>Performance tracking</li>
                  <li>Department analytics</li>
                </ul>
              </div>
              <div className="space-y-2">
                {users.filter(u => u.role === 'department_head').slice(0, 2).map(user => (
                  <Button 
                    key={user.id}
                    onClick={() => handleLogin(user.id)} 
                    variant="outline"
                    className="w-full text-sm"
                  >
                    {user.name} - {user.email.split('.')[1].split('@')[0]}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Staff Login */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <CardTitle className="text-purple-600">Staff Portal</CardTitle>
              <CardDescription>
                Handle assigned tasks and reports
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-gray-600">
                <p><strong>Features:</strong></p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Assigned tasks</li>
                  <li>Status updates</li>
                  <li>Report management</li>
                  <li>Task notifications</li>
                </ul>
              </div>
              <div className="space-y-2">
                {users.filter(u => u.role === 'staff').slice(0, 2).map(user => (
                  <Button 
                    key={user.id}
                    onClick={() => handleLogin(user.id)} 
                    variant="outline"
                    className="w-full text-sm"
                  >
                    {user.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500">
          <p className="text-sm">
            This is a demo application for SIH 2025. All data is mock data for demonstration purposes.
          </p>
        </div>
      </div>
    </div>
  )
}
