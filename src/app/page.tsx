'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { formLogin } from '@/redux/slices/authSlice'

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
    <div className="min-h-screen bg-white flex">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-orange-500 to-orange-600 h-16 flex items-center px-6 z-10">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center p-1">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="50" cy="50" r="45" fill="#FF6B35" stroke="#FFF" strokeWidth="2"/>
              <circle cx="50" cy="35" r="12" fill="#FFF"/>
              <rect x="45" y="45" width="10" height="20" fill="#FFF"/>
              <polygon points="35,65 50,55 65,65 60,75 40,75" fill="#FFF"/>
              <text x="50" y="85" textAnchor="middle" fontSize="8" fill="#FFF" fontWeight="bold">JH</text>
            </svg>
          </div>
          <div>
            <h1 className="text-white font-bold text-lg">Jharkhand Municipal Corporation</h1>
            <p className="text-orange-100 text-xs">Government of Jharkhand</p>
          </div>
        </div>
        <div className="ml-auto">
          <div className="w-12 h-10 bg-white/20 rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">GOI</span>
          </div>
        </div>
      </div>

      {/* Left side - Background with hexagonal images */}
      <div className="flex-1 relative bg-gradient-to-br from-blue-800 via-blue-700 to-blue-900 pt-16">
        {/* Street lamp */}
        <div className="absolute left-8 top-24 w-16 h-32 opacity-80">
          <div className="w-2 h-24 bg-yellow-400 mx-auto"></div>
          <div className="w-8 h-6 bg-yellow-300 rounded-full mx-auto -mt-1"></div>
          <div className="w-12 h-8 bg-yellow-200 rounded-full mx-auto -mt-2"></div>
        </div>

        {/* Hexagonal image collage */}
        <div className="absolute right-20 top-32 transform rotate-12">
          <div className="relative">
            {/* Central hexagon */}
            <div className="w-24 h-24 bg-orange-400 transform rotate-45 rounded-lg shadow-lg"></div>
            
            {/* Surrounding hexagons */}
            <div className="absolute -top-12 left-6 w-20 h-20 bg-blue-300 transform rotate-45 rounded-lg shadow-lg"></div>
            <div className="absolute -top-6 -left-10 w-20 h-20 bg-green-400 transform rotate-45 rounded-lg shadow-lg"></div>
            <div className="absolute top-6 -left-16 w-20 h-20 bg-yellow-400 transform rotate-45 rounded-lg shadow-lg"></div>
            <div className="absolute top-18 left-6 w-20 h-20 bg-purple-400 transform rotate-45 rounded-lg shadow-lg"></div>
            <div className="absolute top-12 left-22 w-20 h-20 bg-red-400 transform rotate-45 rounded-lg shadow-lg"></div>
            <div className="absolute -top-6 left-22 w-20 h-20 bg-indigo-400 transform rotate-45 rounded-lg shadow-lg"></div>
          </div>
        </div>

        {/* Water/river effect at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-900 to-transparent">
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-blue-800 opacity-60"></div>
        </div>

        {/* City lights effect */}
        <div className="absolute bottom-20 left-0 right-0 h-8 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 opacity-30 blur-sm"></div>
      </div>

      {/* Right side - Login form */}
      <div className="w-96 bg-gray-50 pt-16 px-8 py-8 flex flex-col justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">LOGIN</h2>
            <div className="w-16 h-1 bg-orange-500 mx-auto"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Username/Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                required
              />
            </div>
            
            {authError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {authError}
              </div>
            )}
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-teal-400 to-teal-500 hover:from-teal-500 hover:to-teal-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 shadow-lg"
              disabled={false}
            >
              {false ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                'SUBMIT'
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Demo Credentials:</h4>
            <div className="space-y-2 text-xs">
              {demoCredentials.map((cred, index) => (
                <div 
                  key={index} 
                  className="flex justify-between items-center p-2 bg-white rounded border hover:bg-orange-50 cursor-pointer transition-colors"
                  onClick={() => {
                    setEmail(cred.email)
                    setPassword(cred.password)
                  }}
                >
                  <span className="text-gray-600">{cred.email}</span>
                  <span className="text-gray-500 font-mono">{cred.password}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
