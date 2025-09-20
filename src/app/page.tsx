"use client";
import React, { useState, useEffect } from "react";
import {
  Shield,
  Smartphone,
  MapPin,
  Clock,
  Users,
  Star,
  Download,
  Play,
  CheckCircle,
  ArrowRight,
  Menu,
  X,
  Zap,
  Award,
  Globe,
  Camera,
  Bell,
  BarChart3,
  Settings,
  MessageSquare,
  Heart,
  Building2,
  Target,
} from "lucide-react";

const CivicConnectLanding: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Auto-rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Mayor of Springfield",
      image: "/api/placeholder/60/60",
      quote:
        "CivicConnect has transformed how we serve our community. Response times improved by 85% in just 3 months.",
    },
    {
      name: "Michael Chen",
      role: "City Manager, Riverside",
      image: "/api/placeholder/60/60",
      quote:
        "The automated routing feature alone has saved us countless hours. Our departments are more efficient than ever.",
    },
    {
      name: "Dr. Emily Rodriguez",
      role: "Director of Public Works",
      image: "/api/placeholder/60/60",
      quote:
        "Citizens love the transparency. They can track their reports from submission to resolution. It's game-changing.",
    },
  ];

  const stats = [
    { number: "250K+", label: "Issues Resolved", icon: CheckCircle },
    { number: "150+", label: "Cities Using", icon: Building2 },
    { number: "98%", label: "Satisfaction Rate", icon: Heart },
    { number: "24hr", label: "Avg Response", icon: Clock },
  ];

  const features = [
    {
      icon: Camera,
      title: "Photo & Video Reports",
      description:
        "Citizens can capture issues with multimedia evidence for better context and faster resolution.",
    },
    {
      icon: MapPin,
      title: "GPS Auto-Location",
      description:
        "Automatically tag exact locations with precise GPS coordinates for accurate department routing.",
    },
    {
      icon: Bell,
      title: "Real-time Notifications",
      description:
        "Keep everyone informed with instant updates on report status, assignments, and resolutions.",
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description:
        "Comprehensive dashboards with insights into trends, performance metrics, and citizen satisfaction.",
    },
    {
      icon: Zap,
      title: "Smart Routing",
      description:
        "AI-powered system automatically routes issues to the right department based on type and priority.",
    },
    {
      icon: Settings,
      title: "Admin Controls",
      description:
        "Powerful administrative tools for managing teams, workflows, and municipal service operations.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-pink-50">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-md shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-orange-400 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
                  CivicConnect
                </h1>
                <p className="text-xs text-gray-500">
                  Municipal Services Platform
                </p>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8">
              <a
                href="/mission&vision"
                className="text-gray-600 hover:text-red-500 transition-colors font-medium"
              >
                Mission & Vision
              </a>
              <a
                href="#features"
                className="text-gray-600 hover:text-red-500 transition-colors font-medium"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-gray-600 hover:text-red-500 transition-colors font-medium"
              >
                How It Works
              </a>
            </div>

            <div className="hidden md:flex space-x-3">
              <a
                href="/signin"
                className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-2 rounded-lg hover:from-red-600 hover:to-orange-600 transition-all shadow-lg font-medium"
              >
                Official's Login to Portal
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-red-100">
            <div className="px-4 py-6 space-y-4">
              <a
                href="/mission&vision"
                className="block text-gray-600 hover:text-red-500 transition-colors font-medium"
              >
                Mission & Vision
              </a>
              <a
                href="#features"
                className="block text-gray-600 hover:text-red-500 transition-colors font-medium"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="block text-gray-600 hover:text-red-500 transition-colors font-medium"
              >
                How It Works
              </a>
              <div className="pt-4 border-t border-red-100 space-y-3">
                <a
                href="/signin" className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-2 rounded-lg hover:from-red-600 hover:to-orange-600 transition-all shadow-lg font-medium">
                  Official's Login to Portal
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}

      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/heritage-building.jpg')`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/10"></div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-900/60 via-transparent to-blue-900/60"></div>
      </div>

      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-100/50 via-orange-100/30 to-pink-100/50"></div>
        <div className="absolute top-20 left-10 w-32 h-32 bg-red-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-orange-200/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-20 h-20 bg-pink-200/40 rounded-full blur-2xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm text-red-600 px-4 py-2 rounded-full shadow-lg border border-red-100">
                <Shield className="w-4 h-4" />
                <span className="font-semibold text-sm">
                  Trusted by 150+ Municipalities
                </span>
              </div>

              {/* Headline */}
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                  Transform Your
                  <span className="bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent block">
                    Civic Services
                  </span>
                </h1>
                <p className="text-xl lg:text-2xl leading-relaxed">
                  Streamline municipal operations, engage citizens, and resolve
                  community issues faster than ever with our comprehensive civic
                  management platform.
                </p>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center space-x-8 pt-8 border-t border-red-600">
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="font-semibold text-gray-200">4.9/5</span>
                  <span className="text-gray-200">User Rating</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-red-500" />
                  <span className="text-gray-200">Gov Certified</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-green-500" />
                  <span className="text-gray-200">SOC 2 Compliant</span>
                </div>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative">
              {/* Main App Mockup */}
              <div className="relative bg-gray-100 rounded-3xl shadow-2xl p-6 transform rotate-3 hover:rotate-0 transition-transform duration-700">
                <div className="bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl p-6 text-white mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Smartphone className="w-6 h-6" />
                      <span className="font-semibold">CivicConnect App</span>
                    </div>
                    <div className="bg-green-400 w-3 h-3 rounded-full animate-pulse"></div>
                  </div>
                  <div className="text-2xl font-bold mb-2">Report an Issue</div>
                  <div className="text-red-100">
                    Help improve your community
                  </div>
                </div>

                {/* Mock Interface Elements */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                    <div className="flex items-center space-x-3">
                      <Camera className="w-5 h-5 text-red-500" />
                      <span className="font-medium text-gray-800">
                        Add Photo
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-red-400" />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-100">
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-orange-500" />
                      <span className="font-medium text-gray-800">
                        Auto Location
                      </span>
                    </div>
                    <div className="bg-green-500 w-2 h-2 rounded-full"></div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-pink-50 rounded-lg border border-pink-100">
                    <div className="flex items-center space-x-3">
                      <MessageSquare className="w-5 h-5 text-pink-500" />
                      <span className="font-medium text-gray-800">
                        Description
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-pink-400" />
                  </div>

                  <button className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white py-3 rounded-lg font-semibold hover:from-red-600 hover:to-orange-600 transition-colors">
                    Submit Report
                  </button>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -left-4 bg-white shadow-xl rounded-2xl p-4 animate-bounce">
                <Bell className="w-8 h-8 text-red-500" />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-orange-400 to-red-400 text-white rounded-2xl p-4 shadow-xl">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div className="absolute top-1/4 -right-8 bg-white shadow-lg rounded-xl p-3">
                <div className="text-2xl font-bold text-red-600">98%</div>
                <div className="text-xs text-gray-500">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2 border border-red-100">
                  <stat.icon className="w-8 h-8 text-red-500 mx-auto mb-4" />
                  <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-20 bg-gradient-to-b from-red-50/30 to-orange-50/30"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm text-red-600 px-4 py-2 rounded-full shadow-lg border border-red-100 mb-6">
              <Star className="w-4 h-4" />
              <span className="font-semibold">Powerful Features</span>
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Everything You Need for
              <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent block lg:inline">
                {" "}
                Modern Governance
              </span>
            </h2>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              From citizen reporting to administrative dashboards, our platform
              provides comprehensive tools for efficient municipal management.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-red-100"
              >
                <div className="bg-gradient-to-r from-red-100 to-orange-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              How It{" "}
              <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                Works
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple, intuitive process that gets results fast
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="text-center relative">
              <div className="bg-gradient-to-r from-red-500 to-orange-500 w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 shadow-lg">
                1
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-red-100 mb-6">
                <Camera className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <div className="bg-red-50 h-24 rounded-lg mb-4"></div>
                <div className="text-sm text-gray-500">
                  Photo + Location + Description
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Citizens Report
              </h3>
              <p className="text-gray-600">
                Citizens easily report issues using our mobile app with photos,
                GPS location, and descriptions.
              </p>

              {/* Connector Line */}
              <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-red-300 to-orange-300 transform translate-y-0"></div>
            </div>

            {/* Step 2 */}
            <div className="text-center relative">
              <div className="bg-gradient-to-r from-red-500 to-orange-500 w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 shadow-lg">
                2
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-100 mb-6">
                <Zap className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="bg-orange-100 h-6 rounded"></div>
                  <div className="bg-orange-200 h-6 rounded"></div>
                  <div className="bg-orange-300 h-6 rounded"></div>
                </div>
                <div className="text-sm text-gray-500">
                  Smart Department Routing
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Auto-Route & Assign
              </h3>
              <p className="text-gray-600">
                AI automatically routes issues to the right department and
                assigns priority based on urgency and location.
              </p>

              {/* Connector Line */}
              <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-orange-300 to-red-300 transform translate-y-0"></div>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="bg-gradient-to-r from-red-500 to-orange-500 w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 shadow-lg">
                3
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-red-100 mb-6">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <div className="bg-green-50 h-24 rounded-lg mb-4 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <div className="text-sm text-gray-500">
                  Issue Resolved & Verified
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Track & Resolve
              </h3>
              <p className="text-gray-600">
                Teams resolve issues efficiently while citizens track progress
                in real-time until completion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* App Download Section */}
      <section className="py-20 bg-gradient-to-br from-red-100/50 via-orange-100/30 to-pink-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Download Our
                <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent block">
                  Mobile App
                </span>
              </h2>

              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Empower your citizens with direct access to municipal services.
                Available for both iOS and Android devices.
              </p>

              <div className="space-y-6 mb-8">
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-r from-red-100 to-orange-100 w-12 h-12 rounded-xl flex items-center justify-center">
                    <Smartphone className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      Easy Reporting
                    </div>
                    <div className="text-gray-600">
                      One-tap issue submission with photos and location
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-r from-red-100 to-orange-100 w-12 h-12 rounded-xl flex items-center justify-center">
                    <Bell className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      Real-time Updates
                    </div>
                    <div className="text-gray-600">
                      Get notified when your reports are being addressed
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-r from-red-100 to-orange-100 w-12 h-12 rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      Track Progress
                    </div>
                    <div className="text-gray-600">
                      See the status of all your submitted reports
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                {/* App Store Button */}
                <button className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors flex items-center space-x-3 shadow-lg">
                  <div className="bg-white/20 w-8 h-8 rounded-lg flex items-center justify-center">
                    <Download className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs">Download on the</div>
                    <div className="font-semibold">App Store</div>
                  </div>
                </button>

                {/* Google Play Button */}
                <button className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors flex items-center space-x-3 shadow-lg">
                  <div className="bg-white/20 w-8 h-8 rounded-lg flex items-center justify-center">
                    <Play className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs">Get it on</div>
                    <div className="font-semibold">Google Play</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Phone Mockup */}
            <div className="relative">
              <div className="bg-gradient-to-br from-red-500 to-orange-500 rounded-[3rem] p-4 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-700">
                <div className="bg-white rounded-[2.5rem] p-6 h-[600px] overflow-hidden">
                  {/* Phone Screen Content */}
                  <div className="text-center mb-6">
                    <div className="bg-gradient-to-r from-red-500 to-orange-500 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900">CivicConnect</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-red-50 p-4 rounded-2xl border border-red-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-800">
                          Broken Streetlight
                        </span>
                        <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs">
                          High
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Main St & Oak Ave
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        Reported 2 hours ago
                      </div>
                    </div>

                    <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-800">
                          Pothole Repair
                        </span>
                        <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded-full text-xs">
                          Medium
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        2nd St & Pine Ave
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        Reported 1 hour ago
                      </div>
                    </div>

                    <div className="bg-green-50 p-4 rounded-2xl border border-green-100">
                      <div className="flex items-center justify-between mb-2"></div>
                      <span className="font-medium text-gray-800">
                        Graffiti Removal
                      </span>
                      <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs">
                        Low
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      3rd St & Elm Ave
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      Reported 30 minutes ago
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* footer  */}
      <footer className="bg-gray-100 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                CivicConnect
              </h3>
              <p className="text-gray-600 text-sm">
                © 2025 CivicConnect. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-6">
              <a
                href="#"
                className="text-gray-600 hover:text-gray-900 transition"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-gray-900 transition"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-gray-900 transition"
              >
                Contact Us
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-gray-900 transition"
              >
                About Us
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-gray-900 transition"
              >
                Blog
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-gray-900 transition"
              >
                Careers
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CivicConnectLanding;
