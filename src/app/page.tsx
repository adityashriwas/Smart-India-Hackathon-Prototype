'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppSelector, useAppDispatch } from '@/redux/hooks'
import { formLogin } from '@/redux/slices/authSlice'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { isAuthenticated, error: authError } = useAppSelector((state) => state.auth)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(formLogin({ email, password }))
  }

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/dashboard')
    }
  }, [isAuthenticated, router])

  // Don't render login form if already authenticated
  if (isAuthenticated) {
    router.replace('/dashboard')
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Demo credentials for easy access
  const demoCredentials = [
    { email: 'admin@gov.in', password: 'admin123', role: 'Admin' },
    { email: 'ravi.sanitation@gov.in', password: 'dept123', role: 'Department Head' },
    { email: 'meena.publicworks@gov.in', password: 'dept123', role: 'Department Head' },
    { email: 'staffa.san@gov.in', password: 'staff123', role: 'Staff' },
    { email: 'staffb.san@gov.in', password: 'staff123', role: 'Staff' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-2xl">SIH</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Civic Issue Reporting Platform
          </h1>
          <p className="text-lg text-gray-600">
            Smart India Hackathon 2025
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Login</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  required
                />
              </div>
              {authError && (
                <div className="text-red-500 text-sm text-center p-2 bg-red-50 rounded">
                  {authError}
                </div>
              )}
              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </form>

            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Demo Credentials:</h3>
              <div className="space-y-2">
                {demoCredentials.map((cred, index) => (
                  <div key={index} className="text-xs p-2 bg-gray-50 rounded border">
                    <p className="font-medium">{cred.role}</p>
                    <p className="text-gray-600">Email: {cred.email}</p>
                    <p className="text-gray-600">Password: {cred.password}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-gray-500 text-sm">
          <p>
            This is a demo application for SIH 2025. All data is mock data for demonstration purposes.
          </p>
        </div>
      </div>
    </div>
  )
}
