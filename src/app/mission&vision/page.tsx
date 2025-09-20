import React from 'react';
import { Shield, Target, Users, Globe, Award, Heart, Zap, Building2 } from 'lucide-react';

const MissionVisionPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-red-500 to-orange-500 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 to-orange-900/20"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-orange-300/20 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-red-300/30 rounded-full blur-lg"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Shield className="w-5 h-5" />
            <span className="font-medium">Government Initiative</span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
            Our <span className="text-orange-200">Mission</span>
            <br />& <span className="text-red-200">Vision</span>
          </h1>
          
          <p className="text-xl lg:text-2xl max-w-4xl mx-auto leading-relaxed text-red-100">
            Empowering communities through transparent, efficient, and responsive municipal services that bridge the gap between citizens and government.
          </p>
        
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 bg-red-100 text-red-700 px-4 py-2 rounded-full mb-6">
                <Target className="w-5 h-5" />
                <span className="font-semibold">Our Mission</span>
              </div>
              
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8">
                Transforming Municipal
                <span className="bg-gradient-to-br from-red-500 to-orange-500 bg-clip-text text-transparent"> Governance</span>
              </h2>
              
              <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                <p>
                  To revolutionize how municipal governments interact with their citizens by providing a comprehensive, 
                  technology-driven platform that ensures every civic issue is heard, tracked, and resolved efficiently.
                </p>
                
                <p>
                  We are committed to fostering transparency, accountability, and community engagement through innovative 
                  digital solutions that make government services more accessible and responsive to citizen needs.
                </p>
                
                <p>
                  Our mission extends beyond technology – we aim to rebuild trust between communities and their local 
                  governments by creating meaningful channels for civic participation and collaborative problem-solving.
                </p>
              </div>
              
              {/* Mission Stats */}
              <div className="grid grid-cols-2 gap-6 mt-12">
                <div className="text-center p-6 bg-red-50 rounded-2xl border border-red-100">
                  <div className="text-3xl font-bold text-red-600 mb-2">100+</div>
                  <div className="text-sm text-red-700">Municipalities Served</div>
                </div>
                <div className="text-center p-6 bg-orange-50 rounded-2xl border border-orange-100">
                  <div className="text-3xl font-bold text-orange-600 mb-2">1M+</div>
                  <div className="text-sm text-orange-700">Citizens Connected</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              {/* Main Image Placeholder */}
              <div className="bg-gradient-to-br from-red-500 to-orange-500 rounded-3xl p-8 text-white shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Building2 className="w-6 h-6" />
                      <span className="font-semibold">Municipal Dashboard</span>
                    </div>
                    <div className="bg-green-400 w-3 h-3 rounded-full animate-pulse"></div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-white/30 h-4 rounded-full"></div>
                    <div className="bg-white/30 h-4 rounded-full w-3/4"></div>
                    <div className="bg-white/30 h-4 rounded-full w-1/2"></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold">98%</div>
                    <div className="text-sm opacity-75">Satisfaction</div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold">24/7</div>
                    <div className="text-sm opacity-75">Support</div>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -left-4 bg-white shadow-xl rounded-2xl p-4">
                <Users className="w-8 h-8 text-red-500" />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-orange-100 rounded-2xl p-4">
                <Award className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-20 bg-gradient-to-br from-red-50 via-orange-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="lg:order-2">
              <div className="inline-flex items-center space-x-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full mb-6">
                <Globe className="w-5 h-5" />
                <span className="font-semibold">Our Vision</span>
              </div>
              
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8">
                A Future of
                <span className="bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent"> Connected</span>
                <br />Communities
              </h2>
              
              <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                <p>
                  We envision a world where every citizen has a direct, meaningful connection to their local government, 
                  where civic issues are resolved swiftly and transparently, and where community voices shape the future 
                  of their neighborhoods.
                </p>
                
                <p>
                  Our vision extends to creating smart, responsive cities where technology serves humanity, where data 
                  drives decision-making, and where every municipal service is optimized for citizen satisfaction and 
                  community well-being.
                </p>
                
                <p>
                  We see a future where the gap between government and governed disappears, replaced by collaborative 
                  partnerships that build stronger, more resilient communities for generations to come.
                </p>
              </div>
              
              {/* Vision Goals */}
              <div className="mt-12 space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-white rounded-xl shadow-sm border border-red-100">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <Zap className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Instant Response</div>
                    <div className="text-sm text-gray-600">Real-time issue resolution</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 p-4 bg-white rounded-xl shadow-sm border border-orange-100">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <Heart className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Community First</div>
                    <div className="text-sm text-gray-600">Citizen-centered solutions</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:order-1 relative">
              {/* Vision Image Placeholder */}
              <div className="bg-gradient-to-br from-orange-600 to-red-500 rounded-3xl p-8 text-white shadow-2xl transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Globe className="w-6 h-6" />
                      <span className="font-semibold">Smart City Network</span>
                    </div>
                    <div className="flex space-x-1">
                      <div className="bg-green-400 w-2 h-2 rounded-full animate-pulse"></div>
                      <div className="bg-blue-400 w-2 h-2 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                      <div className="bg-yellow-400 w-2 h-2 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                    </div>
                  </div>
                  
                  {/* Mock Network Visualization */}
                  <div className="relative h-32">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                        <div className="w-4 h-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"></div>
                      </div>
                    </div>
                    
                    {/* Connection Lines */}
                    <div className="absolute top-1/2 left-1/2 w-20 h-px bg-white/50 transform -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
                    <div className="absolute top-1/2 left-1/2 w-20 h-px bg-white/50 transform -translate-x-1/2 -translate-y-1/2 -rotate-45"></div>
                    <div className="absolute top-1/2 left-1/2 w-20 h-px bg-white/50 transform -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute top-1/2 left-1/2 w-px h-20 bg-white/50 transform -translate-x-1/2 -translate-y-1/2"></div>
                    
                    {/* Node Points */}
                    <div className="absolute top-2 left-1/2 w-4 h-4 bg-white/60 rounded-full transform -translate-x-1/2"></div>
                    <div className="absolute bottom-2 left-1/2 w-4 h-4 bg-white/60 rounded-full transform -translate-x-1/2"></div>
                    <div className="absolute top-1/2 left-2 w-4 h-4 bg-white/60 rounded-full transform -translate-y-1/2"></div>
                    <div className="absolute top-1/2 right-2 w-4 h-4 bg-white/60 rounded-full transform -translate-y-1/2"></div>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">2030</div>
                  <div className="text-sm opacity-75">Vision Timeline</div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-white shadow-xl rounded-2xl p-4">
                <Target className="w-8 h-8 text-orange-500" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-red-100 rounded-2xl p-4">
                <Globe className="w-8 h-8 text-red-600" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-red-100 to-orange-100 text-red-700 px-4 py-2 rounded-full mb-6">
              <Heart className="w-5 h-5" />
              <span className="font-semibold">Our Core Values</span>
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Principles That
              <span className="bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent"> Guide Us</span>
            </h2>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These fundamental values shape every decision we make and every solution we build for our communities.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Value 1 */}
            <div className="group bg-gradient-to-br from-red-50 to-orange-50 p-8 rounded-3xl border border-red-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="bg-gradient-to-r from-red-600 to-orange-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Transparency</h3>
              <p className="text-gray-600 leading-relaxed">
                Open, honest communication and clear visibility into all processes, ensuring citizens can track progress and understand outcomes.
              </p>
            </div>
            
            {/* Value 2 */}
            <div className="group bg-gradient-to-br from-orange-50 to-red-50 p-8 rounded-3xl border border-orange-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="bg-gradient-to-r from-orange-600 to-red-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Inclusivity</h3>
              <p className="text-gray-600 leading-relaxed">
                Ensuring every citizen, regardless of background or technical ability, can access and benefit from our municipal services.
              </p>
            </div>
            
            {/* Value 3 */}
            <div className="group bg-gradient-to-br from-red-50 to-orange-50 p-8 rounded-3xl border border-red-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="bg-gradient-to-r from-red-600 to-orange-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Efficiency</h3>
              <p className="text-gray-600 leading-relaxed">
                Streamlining processes and leveraging technology to deliver faster, more effective solutions to community challenges.
              </p>
            </div>
            
            {/* Value 4 */}
            <div className="group bg-gradient-to-br from-orange-50 to-red-50 p-8 rounded-3xl border border-orange-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="bg-gradient-to-r from-orange-600 to-red-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Excellence</h3>
              <p className="text-gray-600 leading-relaxed">
                Maintaining the highest standards in everything we do, from user experience to data security and system reliability.
              </p>
            </div>
            
            {/* Value 5 */}
            <div className="group bg-gradient-to-br from-red-50 to-orange-50 p-8 rounded-3xl border border-red-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="bg-gradient-to-r from-red-600 to-orange-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Compassion</h3>
              <p className="text-gray-600 leading-relaxed">
                Understanding that behind every report is a real person with genuine concerns that deserve empathy and prompt attention.
              </p>
            </div>
            
            {/* Value 6 */}
            <div className="group bg-gradient-to-br from-orange-50 to-red-50 p-8 rounded-3xl border border-orange-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="bg-gradient-to-r from-orange-600 to-red-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Sustainability</h3>
              <p className="text-gray-600 leading-relaxed">
                Building solutions that not only solve today's problems but create lasting positive impact for future generations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-red-500 to-orange-500 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/5 to-black/20"></div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 border border-white rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 border border-white/50 rounded-full"></div>
          <div className="absolute top-1/2 left-1/3 w-16 h-16 border border-white/30 rounded-full"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Ready to Transform Your
            <span className="text-orange-200"> Community?</span>
          </h2>
          
          <p className="text-xl text-red-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            Join hundreds of municipalities already using CivicConnect to build stronger, more responsive communities. 
            Together, we can bridge the gap between citizens and government.
          </p>

          
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">24/7</div>
              <div className="text-red-200">Support Available</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">100%</div>
              <div className="text-red-200">Government Certified</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">∞</div>
              <div className="text-red-200">Scalable Solutions</div>
            </div>
          </div>
        </div>
      </section>

            {/* footer  */}
      <footer className="bg-gray-300 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                CivicConnect
              </h3>
              <p className="text-gray-600 text-sm">
                © 2024 CivicConnect. All rights reserved.
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

export default MissionVisionPage;