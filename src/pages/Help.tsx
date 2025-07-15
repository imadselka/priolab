import { GitBranch, Heart, ArrowLeft, HelpCircle, Search, Users, MessageSquare, Shield, Zap, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Help() {
  const [searchTerm, setSearchTerm] = useState("");

  const faqs = [
    {
      category: "Getting Started",
      icon: Users,
      color: "from-emerald-400 to-cyan-400",
      questions: [
        {
          q: "How do I get started with PrioLab?",
          a: "Simply sign in with your GitHub account on our homepage. Once authenticated, you'll have access to all features including voting on issues, discovering trending repositories, and participating in discussions."
        },
        {
          q: "Do I need to pay to use PrioLab?",
          a: "No, PrioLab is completely free to use. We believe in making developer collaboration accessible to everyone."
        },
        {
          q: "What permissions does PrioLab need from my GitHub account?",
          a: "We only access your public GitHub data including your public repositories, issues, and profile information. We never access private repositories or sensitive data."
        }
      ]
    },
    {
      category: "Voting & Prioritization",
      icon: MessageSquare,
      color: "from-purple-400 to-pink-400",
      questions: [
        {
          q: "How does the voting system work?",
          a: "Each authenticated user can vote once per issue. Votes help indicate community interest and priority. The more votes an issue receives, the higher it appears in priority rankings."
        },
        {
          q: "Can I change my vote on an issue?",
          a: "Yes, you can change or remove your vote at any time. Just click on the issue and toggle your vote status."
        },
        {
          q: "Who can vote on issues?",
          a: "Any authenticated GitHub user can vote on public repository issues that are available in PrioLab."
        },
        {
          q: "How are issue priorities calculated?",
          a: "Our algorithm considers vote count, vote velocity, issue age, community engagement, and maintainer responses to provide intelligent priority rankings."
        }
      ]
    },
    {
      category: "Repository Management",
      icon: Settings,
      color: "from-amber-400 to-orange-400",
      questions: [
        {
          q: "How do I add a repository to PrioLab?",
          a: "You can search for any public GitHub repository using our search feature. Once found, you can follow it to track its issues and participate in prioritization."
        },
        {
          q: "Can I add private repositories?",
          a: "Currently, PrioLab only supports public repositories to maintain transparency and open collaboration."
        },
        {
          q: "How often are repository issues synced?",
          a: "We sync repository data in real-time using GitHub webhooks and periodic updates to ensure you always see the latest information."
        }
      ]
    },
    {
      category: "Privacy & Security",
      icon: Shield,
      color: "from-blue-400 to-indigo-400",
      questions: [
        {
          q: "How do you protect my data?",
          a: "We only access public GitHub data and use industry-standard security practices. We never store your GitHub credentials and you can revoke access at any time through your GitHub settings."
        },
        {
          q: "Can I delete my account and data?",
          a: "Yes, you can request account deletion by contacting us. We'll remove all your personal data while preserving anonymized voting data for platform integrity."
        },
        {
          q: "Do you share data with third parties?",
          a: "We do not sell or share your personal data with third parties. See our Privacy Policy for complete details on data handling."
        }
      ]
    },
    {
      category: "Features & Functionality",
      icon: Zap,
      color: "from-teal-400 to-green-400",
      questions: [
        {
          q: "What's the difference between starring and watching a repository?",
          a: "Starring shows your interest in a repository, while watching means you'll receive notifications about important updates and trending issues."
        },
        {
          q: "How do discussions work?",
          a: "Discussions allow community members to collaborate on issue prioritization, share insights, and provide context beyond simple voting."
        },
        {
          q: "Can maintainers influence issue priorities?",
          a: "While maintainers can vote like any user, our algorithm also considers their responses and labels to provide balanced prioritization that respects both community input and maintainer perspectives."
        },
        {
          q: "How do I discover trending issues?",
          a: "Visit our Trending page to see issues gaining momentum across the platform, or use filters to find trending issues in specific technologies or repositories."
        }
      ]
    }
  ];

  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(
      faq => 
        faq.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.a.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

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
      <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center">
              <HelpCircle className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Help Center
          </h1>
          <p className="text-xl text-slate-400 mb-8">
            Find answers to common questions about using PrioLab
          </p>
          
          {/* Search */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search for help..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="container mx-auto px-4 sm:px-6 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            <Link 
              to="/contact"
              className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:border-slate-600/50 transition-all duration-300 hover:scale-105 text-center"
            >
              <MessageSquare className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
              <h3 className="font-semibold text-white mb-2">Contact Support</h3>
              <p className="text-slate-400 text-sm">Get personalized help</p>
            </Link>

            <Link 
              to="/about"
              className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:border-slate-600/50 transition-all duration-300 hover:scale-105 text-center"
            >
              <Users className="w-8 h-8 text-purple-400 mx-auto mb-3" />
              <h3 className="font-semibold text-white mb-2">About PrioLab</h3>
              <p className="text-slate-400 text-sm">Learn our mission</p>
            </Link>

            <a 
              href="https://github.com/priolab"
              className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:border-slate-600/50 transition-all duration-300 hover:scale-105 text-center"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GitBranch className="w-8 h-8 text-amber-400 mx-auto mb-3" />
              <h3 className="font-semibold text-white mb-2">GitHub</h3>
              <p className="text-slate-400 text-sm">View our code</p>
            </a>

            <a 
              href="https://discord.gg/JrvPWhS9Ec"
              className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:border-slate-600/50 transition-all duration-300 hover:scale-105 text-center"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageSquare className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <h3 className="font-semibold text-white mb-2">Community</h3>
              <p className="text-slate-400 text-sm">Join Discord</p>
            </a>
          </div>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="container mx-auto px-4 sm:px-6 pb-16">
        <div className="max-w-4xl mx-auto">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-400 text-lg">No results found for "{searchTerm}"</p>
              <button
                onClick={() => setSearchTerm("")}
                className="mt-4 text-emerald-400 hover:text-emerald-300 underline"
              >
                Clear search
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {filteredFaqs.map((category, categoryIndex) => (
                <div key={categoryIndex}>
                  <div className="flex items-center space-x-3 mb-6">
                    <div className={`w-10 h-10 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center`}>
                      <category.icon className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">{category.category}</h2>
                  </div>
                  
                  <div className="space-y-4">
                    {category.questions.map((faq, faqIndex) => (
                      <div 
                        key={faqIndex}
                        className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6"
                      >
                        <h3 className="text-lg font-semibold text-white mb-3">{faq.q}</h3>
                        <p className="text-slate-300 leading-relaxed">{faq.a}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Still Need Help */}
      <section className="container mx-auto px-4 sm:px-6 pb-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-gradient-to-r from-emerald-600/10 via-cyan-600/10 to-purple-600/10 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Still need help?</h2>
            <p className="text-slate-400 mb-6">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <Link 
              to="/contact"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Contact Support</span>
            </Link>
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
                <span>for the developer community.</span>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
