import { GitBranch, Heart, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function TermsOfService() {
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
            Terms of Service
          </h1>
          
          <p className="text-slate-400 text-lg mb-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Acceptance of Terms</h2>
              <p className="text-slate-300 leading-relaxed">
                By accessing and using PrioLab, you accept and agree to be bound by the terms and provision of this agreement. These Terms of Service ("Terms") govern your use of the PrioLab platform and services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Description of Service</h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                PrioLab is a community-driven platform that integrates with GitHub to help developers:
              </p>
              <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                <li>Discover and prioritize issues from GitHub repositories</li>
                <li>Vote on issue importance and priority</li>
                <li>Participate in discussions about project development</li>
                <li>Connect with the broader developer community</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">User Accounts and Registration</h2>
              <div className="space-y-4">
                <p className="text-slate-300 leading-relaxed">
                  To use PrioLab, you must have a valid GitHub account and authorize our application to access your public GitHub data.
                </p>
                <div>
                  <h3 className="text-xl font-semibold text-emerald-400 mb-2">Account Responsibilities</h3>
                  <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                    <li>Maintain the security of your account credentials</li>
                    <li>Provide accurate and up-to-date information</li>
                    <li>Notify us immediately of any unauthorized use</li>
                    <li>Use the service in compliance with all applicable laws</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Acceptable Use Policy</h2>
              <div className="space-y-4">
                <p className="text-slate-300 leading-relaxed">You agree not to use PrioLab to:</p>
                <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                  <li>Violate any laws, regulations, or third-party rights</li>
                  <li>Post spam, malicious content, or inappropriate material</li>
                  <li>Harass, intimidate, or abuse other users</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Interfere with the proper functioning of the service</li>
                  <li>Use automated tools to manipulate voting or discussions</li>
                  <li>Impersonate others or provide false information</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">GitHub Integration</h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                PrioLab integrates with GitHub's API to provide our services. By using our platform:
              </p>
              <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                <li>You grant us permission to access your public GitHub data</li>
                <li>You acknowledge that GitHub's Terms of Service also apply</li>
                <li>You understand we respect GitHub's API rate limits and guidelines</li>
                <li>You agree that we may sync and display public repository information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Intellectual Property</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-emerald-400 mb-2">Our Rights</h3>
                  <p className="text-slate-300 leading-relaxed">
                    PrioLab retains all rights to our platform, including our code, design, trademarks, and proprietary algorithms.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-emerald-400 mb-2">Your Content</h3>
                  <p className="text-slate-300 leading-relaxed">
                    You retain ownership of any content you contribute, including votes, comments, and discussions. You grant us a non-exclusive license to display and distribute this content within our platform.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Privacy and Data</h2>
              <p className="text-slate-300 leading-relaxed">
                Your privacy is important to us. Please review our <Link to="/privacy" className="text-emerald-400 hover:text-emerald-300 underline">Privacy Policy</Link> to understand how we collect, use, and protect your data.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Service Availability</h2>
              <p className="text-slate-300 leading-relaxed">
                While we strive to provide reliable service, PrioLab is provided "as is" without warranties. We may experience downtime, updates, or service interruptions. We reserve the right to modify or discontinue the service at any time.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Limitation of Liability</h2>
              <p className="text-slate-300 leading-relaxed">
                To the maximum extent permitted by law, PrioLab shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Termination</h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                We may terminate or suspend your access to PrioLab immediately, without prior notice, for conduct that we believe:
              </p>
              <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                <li>Violates these Terms of Service</li>
                <li>Is harmful to other users or our service</li>
                <li>Violates applicable laws or regulations</li>
                <li>Could expose us to liability or harm our reputation</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Changes to Terms</h2>
              <p className="text-slate-300 leading-relaxed">
                We reserve the right to modify these terms at any time. We will notify users of significant changes by posting the updated terms on our platform. Continued use of the service after changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Governing Law</h2>
              <p className="text-slate-300 leading-relaxed">
                These Terms shall be governed by and construed in accordance with applicable laws, without regard to conflict of law principles.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Contact Information</h2>
              <p className="text-slate-300 leading-relaxed">
                If you have any questions about these Terms of Service, please contact us:
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
