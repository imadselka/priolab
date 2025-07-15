import { GitBranch, Heart, ArrowLeft, Users, Target, Code, Zap, Globe, Shield } from "lucide-react";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-800/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 sm:space-x-3 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg">
              <GitBranch className="w-4 h-4 sm:w-6 sm:h-6 text-slate-900" />
            </div>
            <div>
              <h1 className="font-bold text-lg sm:text-xl text-white">PrioLab</h1>
            </div>
          </Link>
          
          <Link 
            to="/"
            className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 w-full h-full opacity-20">
          <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center relative">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            About PrioLab
          </h1>
          <p className="text-xl sm:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Empowering developers to shape the future of open source through community-driven issue prioritization and collaboration.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-white">Our Mission</h2>
            <p className="text-lg text-slate-400 leading-relaxed">
              To democratize open source development by giving every developer a voice in prioritizing the issues that matter most to the community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Community First</h3>
              <p className="text-slate-400">
                Every decision is driven by community input, ensuring that the most important issues get the attention they deserve.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Focused Impact</h3>
              <p className="text-slate-400">
                By highlighting critical issues, we help maintainers focus their limited time on what truly matters to their users.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Code className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Developer Focused</h3>
              <p className="text-slate-400">
                Built by developers, for developers, with transparency and collaboration at the heart of everything we do.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 sm:p-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-white text-center">Our Story</h2>
            <div className="space-y-6 text-slate-300 leading-relaxed">
              <p>
                PrioLab was born from a simple observation: in the world of open source, maintainers are overwhelmed with issues, feature requests, and bug reports, while contributors often struggle to find the most impactful ways to help.
              </p>
              <p>
                We saw passionate developers wanting to contribute but unsure which issues would make the biggest difference. We witnessed maintainers drowning in hundreds of issues, unable to gauge community sentiment about priorities. We realized that the voice of the community was getting lost in the noise.
              </p>
              <p>
                That's when we decided to build PrioLab - a platform that bridges this gap by giving the community a structured way to voice their priorities, while providing maintainers with clear insights into what their users value most.
              </p>
              <p>
                Today, PrioLab serves thousands of developers across hundreds of repositories, fostering a more collaborative and efficient development ecosystem where every voice matters and every contribution counts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-white">Our Values</h2>
            <p className="text-lg text-slate-400">
              The principles that guide everything we do at PrioLab
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">Transparency</h3>
              <p className="text-slate-400 text-sm">
                We believe in open processes, clear communication, and honest feedback. Our algorithms and decisions are transparent to the community.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">Inclusivity</h3>
              <p className="text-slate-400 text-sm">
                Every developer's voice matters, regardless of experience level, background, or contribution history. We foster an inclusive environment for all.
              </p>
            </div>

            <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-400 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">Efficiency</h3>
              <p className="text-slate-400 text-sm">
                We help developers and maintainers focus their time and energy on what truly matters, making software development more efficient.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-xl flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">Global Impact</h3>
              <p className="text-slate-400 text-sm">
                We're building tools that serve the global developer community, breaking down barriers and connecting people across the world.
              </p>
            </div>

            <div className="bg-gradient-to-br from-teal-500/10 to-green-500/10 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-green-400 rounded-xl flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">Community Love</h3>
              <p className="text-slate-400 text-sm">
                Everything we do is driven by our love for the developer community and our desire to see it thrive and grow.
              </p>
            </div>

            <div className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-violet-400 to-purple-400 rounded-xl flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">Quality Focus</h3>
              <p className="text-slate-400 text-sm">
                We prioritize quality over quantity, building tools that are reliable, useful, and designed to last.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-emerald-600 via-cyan-600 to-purple-600 rounded-2xl p-8 sm:p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-white">
                Join Our Mission
              </h2>
              <p className="text-lg mb-8 text-white/90 max-w-2xl mx-auto">
                Be part of a community that's reshaping how open source development works. Every voice matters, every vote counts.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/"
                  className="bg-white hover:bg-gray-100 text-slate-900 px-8 py-3 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg"
                >
                  Get Started Today
                </Link>
                <Link 
                  to="/contact"
                  className="bg-slate-800/50 hover:bg-slate-700/50 text-white border border-white/20 px-8 py-3 rounded-lg font-semibold transition-all duration-200"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 bg-slate-800/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-lg flex items-center justify-center">
                <GitBranch className="w-4 h-4 sm:w-5 sm:h-5 text-slate-900" />
              </div>
              <span className="font-bold text-white text-sm sm:text-base">PrioLab</span>
            </div>
            <div className="text-slate-400 text-center md:text-right">
              <p className="flex items-center justify-center md:justify-end space-x-2 text-sm">
                <span>&copy; {new Date().getFullYear()}. PrioLab. Built with</span>
                <Heart className="w-3 h-3 text-red-400" />
                <span>for the open source community.</span>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
