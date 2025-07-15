import { GitBranch, Heart, ArrowLeft, Mail, MessageSquare, Github, Users } from "lucide-react";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";

export default function Contact() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <SEO
        title="Contact PrioLab - Support, Feedback & Community"
        description="Have questions, suggestions, or need support? Get in touch with the PrioLab team and join our developer community."
        url="/contact"
      />
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

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Contact Us
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Have questions, suggestions, or need support? We'd love to hear from you. Choose the best way to reach out below.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Contact Cards */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 sm:p-8 hover:border-slate-600/50 transition-all duration-300">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">General Support</h3>
                <p className="text-slate-400">Questions about using PrioLab</p>
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-emerald-400 font-medium">contact@devoria.me</p>
              <p className="text-slate-300 text-sm">Response time: Within 24 hours</p>
              <p className="text-slate-400 text-sm">
                Perfect for account issues, feature questions, or general help with using the platform.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 sm:p-8 hover:border-slate-600/50 transition-all duration-300">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Feature Requests</h3>
                <p className="text-slate-400">Ideas and suggestions</p>
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-purple-400 font-medium">contact@devoria.me</p>
              <p className="text-slate-300 text-sm">Response time: Within 72 hours</p>
              <p className="text-slate-400 text-sm">
                Share your ideas for new features, improvements, or integrations you'd like to see.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 sm:p-8 hover:border-slate-600/50 transition-all duration-300">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Legal & Privacy</h3>
                <p className="text-slate-400">Privacy and legal matters</p>
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-red-400 font-medium">contact@devoria.me</p>
              <p className="text-slate-300 text-sm">Response time: Within 48 hours</p>
              <p className="text-slate-400 text-sm">
                For privacy concerns, data requests, legal questions, or compliance issues.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 sm:p-8 hover:border-slate-600/50 transition-all duration-300">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Partnerships</h3>
                <p className="text-slate-400">Business and collaboration</p>
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-blue-400 font-medium">contact@devoria.me</p>
              <p className="text-slate-300 text-sm">Response time: Within 1 week</p>
              <p className="text-slate-400 text-sm">
                Interested in partnering with us or integrating PrioLab into your workflow?
              </p>
            </div>
          </div>
        </div>

        {/* Community Links */}
        <div className="bg-gradient-to-r from-emerald-600/10 via-cyan-600/10 to-purple-600/10 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Join Our Community</h2>
          <p className="text-slate-400 mb-6 max-w-2xl mx-auto">
            Connect with other developers, share feedback, and stay updated on the latest features and improvements.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a 
              href="https://github.com/priolab" 
              className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-lg transition-all duration-200 hover:shadow-lg"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="w-5 h-5" />
              <span>Follow on GitHub</span>
            </a>
            
            <a 
              href="https://discord.gg/JrvPWhS9Ec" 
              className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white px-6 py-3 rounded-lg transition-all duration-200 hover:shadow-lg"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Join Discord</span>
            </a>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-emerald-400 mb-3">How quickly do you respond to support requests?</h3>
              <p className="text-slate-300">
                We aim to respond to all support requests within 24 hours during business days. Legal and privacy matters are handled within 48 hours, while feature requests may take up to 72 hours for a detailed response.
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-emerald-400 mb-3">Can I request a feature or integration?</h3>
              <p className="text-slate-300">
                Absolutely! We welcome feature requests and suggestions from our community. Send your ideas to contact@devoria.me with details about your use case and how the feature would benefit the community.
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-emerald-400 mb-3">Is PrioLab open source?</h3>
              <p className="text-slate-300">
                PrioLab is a proprietary platform, though we're committed to transparency in our development process. You can follow our updates and provide feedback through our community channels.
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-emerald-400 mb-3">How do you handle data privacy?</h3>
              <p className="text-slate-300">
                We take privacy seriously and only access public GitHub data as outlined in our <Link to="/privacy" className="text-emerald-400 hover:text-emerald-300 underline">Privacy Policy</Link>. We never store your GitHub credentials and you can revoke access at any time.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 bg-slate-800/50 backdrop-blur-sm mt-16">
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
