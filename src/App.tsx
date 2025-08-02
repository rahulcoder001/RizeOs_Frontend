import { useState } from 'react';
  import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

function App() {
  const [, setActiveSection] = useState('hero');
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
            <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="bg-indigo-600 text-white font-bold text-xl px-3 py-2 rounded-lg">RizeOS</div>
                <span className="ml-2 text-gray-800 font-semibold text-xl">Job Network</span>
              </div>
            </div>
            <div className="flex items-center">
              {isAuthenticated ? (
                <>
                  <div className="flex-shrink-0">
                    <Link 
                      to="/dashboard" 
                      className="relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Dashboard
                    </Link>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    <button 
                      onClick={handleLogout}
                      className="relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex-shrink-0">
                    <Link 
                      to="/login" 
                      className="relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Login
                    </Link>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    <Link 
                      to="/signup" 
                      className="relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Sign Up
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-indigo-50 via-white to-purple-50 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/5 to-purple-600/5"></div>
        <div className="max-w-7xl mx-auto relative">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center min-h-[600px]">
            {/* Left Content */}
            <div className="lg:col-span-6 px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
              <div className="space-y-8">
                <div className="space-y-4">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                    <span className="block">The Future of</span>
                    <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      Job Hunting is Here
                    </span>
                  </h1>
                  <p className="text-lg sm:text-xl text-gray-600 max-w-2xl leading-relaxed">
                    AI-powered job matching, blockchain payments, and professional networking - all in one platform. 
                    Find your dream job or the perfect candidate faster than ever before.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={() => {setActiveSection('find-jobs');navigate('/jobs')}}
                    className="px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    Find Jobs
                  </button>
                  <button 
                    onClick={() => {setActiveSection('post-job');navigate('/post-job')}}
                    className="px-8 py-4 text-lg font-semibold text-indigo-700 bg-white hover:bg-indigo-50 border-2 border-indigo-200 hover:border-indigo-300 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    Post a Job
                  </button>
                </div>
              </div>
            </div>

            {/* Right Visual */}
            <div className="lg:col-span-6 px-4 sm:px-6 lg:px-8 py-12">
              <div className="relative">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-8 shadow-2xl">
                  <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 border border-white/30">
                    <div className="text-white text-2xl font-bold mb-6 flex items-center">
                      <div className="w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse"></div>
                      AI-Powered Matching
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center backdrop-blur">
                            <div className="w-6 h-6 bg-indigo-400 rounded-full"></div>
                          </div>
                          <span className="text-white font-medium">Job Seeker</span>
                        </div>
                        <div className="text-white text-sm">→</div>
                        <div className="px-3 py-1 bg-green-500 text-white font-bold rounded-full text-sm">
                          92% Match
                        </div>
                        <div className="text-white text-sm">→</div>
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center backdrop-blur">
                            <div className="w-6 h-6 bg-green-400 rounded-full"></div>
                          </div>
                          <span className="text-white font-medium">Dream Job</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-white text-sm">
                          <span>Compatibility Score</span>
                          <span>92%</span>
                        </div>
                        <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: '92%' }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-yellow-400 rounded-full opacity-80 animate-bounce"></div>
                <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-pink-400 rounded-full opacity-70 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-wider">Features</h2>
            <h3 className="text-4xl lg:text-5xl font-bold text-gray-900">
              Everything you need in a modern job platform
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Combining cutting-edge technologies to revolutionize how professionals connect
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            <div className="group flex p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
              </div>
              <div className="ml-6">
                <h4 className="text-xl font-bold text-gray-900 mb-3">AI-Powered Matching</h4>
                <p className="text-gray-600 leading-relaxed">
                  Our advanced NLP algorithms match job seekers with relevant opportunities based on skills, experience, and preferences.
                </p>
              </div>
            </div>

            <div className="group flex p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
              </div>
              <div className="ml-6">
                <h4 className="text-xl font-bold text-gray-900 mb-3">Blockchain Payments</h4>
                <p className="text-gray-600 leading-relaxed">
                  Secure, transparent payments using Web3 technology. Pay and get paid instantly with cryptocurrency.
                </p>
              </div>
            </div>

            <div className="group flex p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </div>
              </div>
              <div className="ml-6">
                <h4 className="text-xl font-bold text-gray-900 mb-3">Professional Networking</h4>
                <p className="text-gray-600 leading-relaxed">
                  Connect with industry professionals, join communities, and build your professional network.
                </p>
              </div>
            </div>

            <div className="group flex p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-600 text-white shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <div className="ml-6">
                <h4 className="text-xl font-bold text-gray-900 mb-3">Smart Skill Extraction</h4>
                <p className="text-gray-600 leading-relaxed">
                  Automatically identify and highlight your key skills from resumes and profiles using AI technology.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-24 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
            <div className="space-y-6">
              <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                Ready to transform your career?
              </h2>
              <p className="text-xl text-indigo-100">
                Join thousands of professionals already using RizeOS to advance their careers.
              </p>
            </div>
            <div className="mt-8 lg:mt-0 flex justify-center lg:justify-end">
              <button className="px-10 py-4 text-xl font-bold text-indigo-600 bg-white hover:bg-gray-50 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2">
                Get Started Today
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex justify-center md:order-2 mb-8 md:mb-0">
              <div className="flex space-x-6">
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                  <span className="sr-only">GitHub</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            <div className="md:order-1">
              <p className="text-center text-base text-gray-400">
                &copy; 2024 RizeOS Job Network. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;




