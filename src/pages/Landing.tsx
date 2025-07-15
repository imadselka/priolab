import { useState } from "react";
import { 
  Github, 
  Star, 
  TrendingUp, 
  Users, 
  MessageSquare, 
  GitBranch,
  Eye,
  Heart,
  Zap,
  Shield,
  Globe,
  ArrowRight,
  Play,
  CheckCircle,
  Sparkles
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Landing() {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const {signInWithGitHub} = useAuth()
  const handleSignIn = async () => {
    setIsSigningIn(true);
    await signInWithGitHub();
    setTimeout(() => {
      setIsSigningIn(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-800/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg">
              <GitBranch className="w-4 h-4 sm:w-6 sm:h-6 text-slate-900" />
            </div>
            <div>
              <h1 className="font-bold text-lg sm:text-xl text-white">PrioLab</h1>
            </div>
          </div>
          
          <button 
            onClick={handleSignIn} 
            disabled={isSigningIn}
            className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white px-3 py-2 sm:px-6 sm:py-2.5 rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/25 disabled:opacity-50 flex items-center space-x-1 sm:space-x-2 text-sm sm:text-base"
          >
            <Github className="w-4 h-4" />
            <span className="hidden xs:inline">{isSigningIn ? 'Signing in...' : 'Sign in with GitHub'}</span>
            <span className="xs:hidden">{isSigningIn ? 'Signing in...' : 'Sign in'}</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background decorations - Full width */}
        <div className="absolute inset-0 w-full h-full opacity-20">
          <div className="absolute top-5 left-5 sm:top-10 sm:left-10 lg:top-20 lg:left-20 w-16 h-16 sm:w-32 sm:h-32 lg:w-48 lg:h-48 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-5 right-5 sm:bottom-10 sm:right-10 lg:bottom-20 lg:right-20 w-20 h-20 sm:w-40 sm:h-40 lg:w-56 lg:h-56 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 sm:w-64 sm:h-64 lg:w-96 lg:h-96 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full blur-3xl opacity-30"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20 text-center relative">
        
        <div className="max-w-5xl mx-auto relative">
          <div className="inline-flex items-center space-x-1 sm:space-x-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-6 sm:mb-8">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-400" />
            <span className="text-xs sm:text-sm text-slate-300">Community-Driven Issue Prioritization</span>
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-400 rounded-full animate-pulse"></div>
          </div>
          
          <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 sm:mb-8 leading-tight">
            Discover & Prioritize
            <span className="block bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Open Source Issues
            </span>
          </h1>
          
         
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
            <button 
              onClick={handleSignIn}
              disabled={isSigningIn}
              className="group bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/25 hover:scale-105 disabled:opacity-50 flex items-center justify-center space-x-2 w-full sm:w-auto"
            >
              <Github className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden xs:inline">{isSigningIn ? 'Connecting...' : 'Get Started with GitHub'}</span>
              <span className="xs:hidden">{isSigningIn ? 'Connecting...' : 'Get Started'}</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="group bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 hover:border-slate-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition-all duration-300 hover:bg-slate-700/50 flex items-center justify-center space-x-2 w-full sm:w-auto">
              <Play className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Watch Demo</span>
            </button>
          </div>
        </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            Why Choose PrioLab?
          </h2>
          <p className="text-lg sm:text-xl text-slate-400 max-w-xs sm:max-w-lg lg:max-w-2xl mx-auto px-4 sm:px-0">
            Built by developers, for developers. A powerful tool for prioritizing and discussing project issues with GitHub integration.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[
            {
              icon: TrendingUp,
              title: "Community Voting",
              description: "Let the community decide which issues matter most through democratic voting and intelligent ranking",
              gradient: "from-emerald-400 to-cyan-400",
              bgGradient: "from-emerald-500/10 to-cyan-500/10"
            },
            {
              icon: MessageSquare,
              title: "Rich Discussions",
              description: "Engage in meaningful conversations about issues with GitHub integration and platform comments",
              gradient: "from-purple-400 to-pink-400",
              bgGradient: "from-purple-500/10 to-pink-500/10"
            },
            {
              icon: Zap,
              title: "GitHub Integration",
              description: "Seamlessly connect with GitHub repositories and sync issues in real-time while respecting GitHub's API guidelines",
              gradient: "from-amber-400 to-orange-400",
              bgGradient: "from-amber-500/10 to-orange-500/10"
            },
            {
              icon: Shield,
              title: "Privacy First",
              description: "We only access public GitHub data and never store your credentials permanently or share your data",
              gradient: "from-blue-400 to-indigo-400",
              bgGradient: "from-blue-500/10 to-indigo-500/10"
            },
            {
              icon: Globe,
              title: "Global Community",
              description: "Connect with developers worldwide and discover trending issues across thousands of projects on GitHub",
              gradient: "from-teal-400 to-green-400",
              bgGradient: "from-teal-500/10 to-green-500/10"
            }
          ].map((feature, index) => (
            <div key={index} className={`group relative bg-gradient-to-br ${feature.bgGradient} backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 sm:p-8 hover:border-slate-600/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl`}>
              <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-4 sm:mb-6 shadow-lg`}>
                <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-white">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed text-sm sm:text-base">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            How It Works
          </h2>
          <p className="text-lg sm:text-xl text-slate-400 px-4 sm:px-0">
            Get started in minutes with our simple, intuitive process
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
          {[
            {
              step: "1",
              title: "Connect GitHub",
              description: "Sign in with your GitHub account to access your repositories and join the broader developer community",
              gradient: "from-emerald-500 to-cyan-500"
            },
            {
              step: "2", 
              title: "Discover Issues",
              description: "Browse and search through issues from GitHub repositories you follow or explore trending ones across the platform",
              gradient: "from-purple-500 to-pink-500"
            },
            {
              step: "3",
              title: "Vote & Discuss",
              description: "Vote on issues you care about and participate in discussions to influence prioritization",
              gradient: "from-amber-500 to-orange-500"
            }
          ].map((step, index) => (
            <div key={index} className="text-center group">
              <div className={`w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br ${step.gradient} text-white rounded-2xl flex items-center justify-center text-xl sm:text-2xl font-bold mx-auto mb-6 sm:mb-8 shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                {step.step}
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-white">{step.title}</h3>
              <p className="text-slate-400 text-base sm:text-lg leading-relaxed px-4 sm:px-0">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
        <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-8 sm:p-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
            {[
              { value: "50K+", label: "GitHub Issues", gradient: "from-emerald-400 to-cyan-400" },
              { value: "12K+", label: "Active Developers", gradient: "from-purple-400 to-pink-400" },
              { value: "2.5K+", label: "Repositories", gradient: "from-amber-400 to-orange-400" },
              { value: "250K+", label: "Community Votes", gradient: "from-blue-400 to-indigo-400" }
            ].map((stat, index) => (
              <div key={index} className="group">
                <div className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300`}>
                  {stat.value}
                </div>
                <div className="text-slate-400 text-sm sm:text-base lg:text-lg font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
        <div className="text-center bg-gradient-to-r from-emerald-600 via-cyan-600 to-purple-600 rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
          
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8 text-white">
              Ready to Make an Impact?
            </h2>
            <p className="text-base sm:text-lg lg:text-xl mb-8 sm:mb-12 text-white/90 max-w-xs sm:max-w-lg lg:max-w-3xl mx-auto leading-relaxed px-4 sm:px-0">
              Join thousands of developers who are already using PrioLab to prioritize and contribute to projects. 
              Your voice matters in shaping the future of software development.
            </p>
            <button 
              onClick={handleSignIn}
              disabled={isSigningIn}
              className="group bg-white hover:bg-gray-100 text-slate-900 px-8 sm:px-10 py-4 sm:py-5 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 disabled:opacity-50 flex items-center justify-center space-x-2 sm:space-x-3 mx-auto w-full sm:w-auto max-w-sm sm:max-w-none"
            >
              <Github className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="hidden xs:inline">{isSigningIn ? 'Connecting...' : 'Start Contributing Today'}</span>
              <span className="xs:hidden">{isSigningIn ? 'Connecting...' : 'Start Contributing'}</span>
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 bg-slate-800/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center space-x-2 sm:space-x-3 mb-4">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-lg flex items-center justify-center">
                  <GitBranch className="w-4 h-4 sm:w-5 sm:h-5 text-slate-900" />
                </div>
                <span className="font-bold text-white text-sm sm:text-base">PrioLab</span>
              </div>
              <p className="text-slate-400 text-sm text-center md:text-left">
                Community-driven issue prioritization for software projects.
              </p>
            </div>

            {/* Product */}
            <div className="text-center md:text-left">
              <h3 className="font-semibold text-white mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a></li>
                <li><a href="/dashboard" className="hover:text-white transition-colors">Dashboard</a></li>
                <li><a href="/trending" className="hover:text-white transition-colors">Trending</a></li>
              </ul>
            </div>

            {/* Company */}
            <div className="text-center md:text-left">
              <h3 className="font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="/about" className="hover:text-white transition-colors">About</a></li>
                <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="https://github.com/priolab" className="hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">GitHub</a></li>
                <li><a href="https://discord.gg/JrvPWhS9Ec" className="hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">Community</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div className="text-center md:text-left">
              <h3 className="font-semibold text-white mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="/help" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="/contact" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-700/50 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-slate-400 text-center md:text-left">
                <p className="flex flex-col sm:flex-row items-center justify-center md:justify-start space-y-1 sm:space-y-0 sm:space-x-2 text-sm">
                  <span>&copy; {new Date().getFullYear()}. PrioLab. Built with</span>
                  <span className="flex items-center space-x-2">
                    <Heart className="w-3 h-3 text-red-400" />
                    <span>for the developer community.</span>
                  </span>
                </p>
              </div>
              <div className="flex items-center space-x-4 text-slate-400">
                <a href="https://github.com/priolab" className="hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                  <Github className="w-5 h-5" />
                </a>
                <a href="https://discord.gg/JrvPWhS9Ec" className="hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                  <MessageSquare className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}