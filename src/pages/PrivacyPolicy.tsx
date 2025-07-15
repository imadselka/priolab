import { GitBranch, Heart, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function PrivacyPolicy() {
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

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 max-w-4xl">
        <div className="prose prose-invert prose-emerald max-w-none">
          <h1 className="text-4xl sm:text-5xl font-bold mb-8 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          
          <p className="text-slate-400 text-lg mb-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Introduction</h2>
              <p className="text-slate-300 leading-relaxed">
                At PrioLab, we respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you use our service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Information We Collect</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-emerald-400 mb-2">GitHub Integration Data</h3>
                  <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                    <li>Your GitHub username and public profile information</li>
                    <li>Public repository data that you choose to connect</li>
                    <li>Public issues and comments from connected repositories</li>
                    <li>Your voting activity on issues within our platform</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-emerald-400 mb-2">Usage Data</h3>
                  <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                    <li>Log data including IP address, browser type, and access times</li>
                    <li>Feature usage and interaction patterns</li>
                    <li>Device information and operating system</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">How We Use Your Information</h2>
              <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                <li>To provide and maintain our service</li>
                <li>To sync and display GitHub issues and repository data</li>
                <li>To enable community voting and discussion features</li>
                <li>To improve our platform and user experience</li>
                <li>To communicate important updates about our service</li>
                <li>To ensure security and prevent abuse</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Data Sharing and Third Parties</h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may share data in the following limited circumstances:
              </p>
              <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                <li>With GitHub (as required for API integration)</li>
                <li>With service providers who help us operate our platform</li>
                <li>When required by law or to protect our rights</li>
                <li>In the event of a business transfer or acquisition</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Data Security</h2>
              <p className="text-slate-300 leading-relaxed">
                We implement appropriate security measures to protect your data against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Your Rights</h2>
              <p className="text-slate-300 leading-relaxed mb-4">You have the right to:</p>
              <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                <li>Access and review your personal data</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your account and associated data</li>
                <li>Withdraw consent for data processing</li>
                <li>Export your data in a portable format</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Changes to This Policy</h2>
              <p className="text-slate-300 leading-relaxed">
                We may update this privacy policy from time to time. We will notify you of any significant changes by posting the new policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
              <p className="text-slate-300 leading-relaxed">
                If you have any questions about this privacy policy or our data practices, please contact us at:
              </p>
              <div className="mt-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                <p className="text-emerald-400 font-medium">Email: contact@devoria.me</p>
                <p className="text-slate-300">Response time: Within 48 hours</p>
              </div>
            </section>
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
