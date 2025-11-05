'use client';

import { FileText, Scale, AlertTriangle, CheckCircle, XCircle, Shield, Users, DollarSign } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <Scale className="w-12 h-12 text-blue-500" />
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
              Terms of Service
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-4">
            Please read these terms carefully before using NoteBoard
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Effective Date: November 5, 2025
          </p>
        </div>

        {/* Quick Summary */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 mb-12 text-white">
          <h2 className="text-2xl font-bold mb-6">Terms Summary (Not Legal Advice)</h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>You own your content and wallet</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>We provide the platform as-is</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>You're responsible for your account</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>Follow community guidelines</span>
            </div>
            <div className="flex items-start gap-3">
              <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>No illegal activities allowed</span>
            </div>
            <div className="flex items-start gap-3">
              <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>Blockchain transactions are final</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Acceptance */}
          <section className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-8 h-8 text-blue-500" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                1. Acceptance of Terms
              </h2>
            </div>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                By accessing or using NoteBoard ("the Service"), you agree to be bound by these Terms
                of Service ("Terms"). If you do not agree to these Terms, do not use the Service.
              </p>
              <p>
                These Terms constitute a legally binding agreement between you and NoteBoard. We may
                modify these Terms at any time, and your continued use of the Service constitutes
                acceptance of the modified Terms.
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  <strong>Important:</strong> You must be at least 13 years old to use NoteBoard. If
                  you are under 18, you must have parental consent.
                </p>
              </div>
            </div>
          </section>

          {/* User Accounts */}
          <section className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-8 h-8 text-purple-500" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                2. User Accounts and Wallets
              </h2>
            </div>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                Wallet Connection
              </h3>
              <ul className="space-y-2 ml-5">
                <li>• You connect to NoteBoard using your Web3 wallet (e.g., MetaMask)</li>
                <li>• You are solely responsible for the security of your wallet and private keys</li>
                <li>• We never have access to your private keys or wallet funds</li>
                <li>• Lost or stolen wallets cannot be recovered by NoteBoard</li>
              </ul>

              <h3 className="font-semibold text-lg text-gray-900 dark:text-white mt-6">
                Account Responsibility
              </h3>
              <ul className="space-y-2 ml-5">
                <li>• You are responsible for all activity on your account</li>
                <li>• Maintain the security of your wallet at all times</li>
                <li>• Do not share your wallet access with others</li>
                <li>• Notify us immediately if you suspect unauthorized access</li>
              </ul>

              <h3 className="font-semibold text-lg text-gray-900 dark:text-white mt-6">
                Account Termination
              </h3>
              <p>
                We reserve the right to suspend or terminate accounts that violate these Terms or our
                Community Guidelines. You may stop using the Service at any time, though blockchain
                data is permanent.
              </p>
            </div>
          </section>

          {/* User Content */}
          <section className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-8 h-8 text-green-500" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                3. User Content and Intellectual Property
              </h2>
            </div>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                Your Content Ownership
              </h3>
              <p>
                You retain all ownership rights to content you post on NoteBoard. By posting content,
                you grant NoteBoard a non-exclusive, worldwide, royalty-free license to display,
                distribute, and promote your content on the platform.
              </p>

              <h3 className="font-semibold text-lg text-gray-900 dark:text-white mt-6">
                Content Responsibilities
              </h3>
              <ul className="space-y-2 ml-5">
                <li>• You must have the right to post all content you share</li>
                <li>• Do not infringe on others' copyrights, trademarks, or IP rights</li>
                <li>• Content posted on blockchain is permanent and public</li>
                <li>• You are liable for any legal issues arising from your content</li>
              </ul>

              <h3 className="font-semibold text-lg text-gray-900 dark:text-white mt-6">
                Platform Rights
              </h3>
              <p>
                NoteBoard and its original content, features, and functionality are owned by NoteBoard
                and are protected by international copyright, trademark, and other intellectual
                property laws.
              </p>
            </div>
          </section>

          {/* Blockchain & Transactions */}
          <section className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <DollarSign className="w-8 h-8 text-yellow-500" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                4. Blockchain Transactions and Fees
              </h2>
            </div>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                Transaction Finality
              </h3>
              <p>
                All blockchain transactions are final and irreversible. Once a transaction is
                confirmed on the blockchain, it cannot be undone. This includes:
              </p>
              <ul className="space-y-2 ml-5">
                <li>• Tips and payments to other users</li>
                <li>• Subscription purchases</li>
                <li>• Reward claims</li>
                <li>• NFT transfers</li>
              </ul>

              <h3 className="font-semibold text-lg text-gray-900 dark:text-white mt-6">
                Gas Fees
              </h3>
              <p>
                You are responsible for paying all blockchain network fees (gas fees) associated with
                your transactions. These fees go to network validators, not to NoteBoard.
              </p>

              <h3 className="font-semibold text-lg text-gray-900 dark:text-white mt-6">
                Platform Fees
              </h3>
              <p>
                NoteBoard may charge platform fees for certain features (e.g., subscriptions, tips).
                These fees are disclosed before you complete transactions.
              </p>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <div className="flex gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-yellow-800 dark:text-yellow-300">
                    <strong>Warning:</strong> Cryptocurrency transactions are irreversible. Always
                    verify recipient addresses and amounts before confirming transactions.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Prohibited Conduct */}
          <section className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-8 h-8 text-red-500" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                5. Prohibited Conduct
              </h2>
            </div>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>You agree not to:</p>
              <ul className="space-y-2 ml-5">
                <li>• Violate any laws or regulations</li>
                <li>• Infringe on intellectual property rights</li>
                <li>• Harass, threaten, or harm others</li>
                <li>• Post spam, scams, or misleading content</li>
                <li>• Engage in market manipulation or fraud</li>
                <li>• Attempt to hack or compromise the platform</li>
                <li>• Create multiple accounts to abuse features</li>
                <li>• Use bots or automated tools without permission</li>
                <li>• Impersonate others or provide false information</li>
                <li>• Share malware, viruses, or harmful code</li>
              </ul>
              <p className="font-semibold">
                Violations may result in account suspension or termination without refund.
              </p>
            </div>
          </section>

          {/* Disclaimers */}
          <section className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="w-8 h-8 text-orange-500" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                6. Disclaimers and Limitations
              </h2>
            </div>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                Service "As Is"
              </h3>
              <p>
                NoteBoard is provided "as is" and "as available" without warranties of any kind,
                either express or implied. We do not guarantee that the Service will be:
              </p>
              <ul className="space-y-2 ml-5">
                <li>• Uninterrupted or error-free</li>
                <li>• Secure from hacks or data breaches</li>
                <li>• Free from bugs or technical issues</li>
                <li>• Compatible with all devices or browsers</li>
              </ul>

              <h3 className="font-semibold text-lg text-gray-900 dark:text-white mt-6">
                Limitation of Liability
              </h3>
              <p>
                To the maximum extent permitted by law, NoteBoard shall not be liable for any
                indirect, incidental, special, consequential, or punitive damages, including but not
                limited to:
              </p>
              <ul className="space-y-2 ml-5">
                <li>• Loss of profits or revenue</li>
                <li>• Loss of data or cryptocurrency</li>
                <li>• Loss of business opportunities</li>
                <li>• Service interruptions</li>
              </ul>

              <h3 className="font-semibold text-lg text-gray-900 dark:text-white mt-6">
                Blockchain Risks
              </h3>
              <p>
                You acknowledge and accept the risks associated with blockchain technology, including
                but not limited to: smart contract bugs, network congestion, regulatory changes, and
                volatility of cryptocurrency values.
              </p>
            </div>
          </section>

          {/* Governing Law */}
          <section className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Scale className="w-8 h-8 text-indigo-500" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                7. Governing Law and Disputes
              </h2>
            </div>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the
                jurisdiction in which NoteBoard operates, without regard to its conflict of law
                provisions.
              </p>
              <p>
                Any disputes arising from these Terms or your use of the Service shall be resolved
                through binding arbitration, except where prohibited by law.
              </p>
            </div>
          </section>

          {/* Changes to Terms */}
          <section className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-8 h-8 text-teal-500" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                8. Changes to Terms
              </h2>
            </div>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                We reserve the right to modify these Terms at any time. We will notify users of
                material changes via:
              </p>
              <ul className="space-y-2 ml-5">
                <li>• Email notification (if provided)</li>
                <li>• In-app notification</li>
                <li>• Announcement on the platform</li>
              </ul>
              <p>
                Your continued use of the Service after such modifications constitutes your acceptance
                of the updated Terms.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-8 h-8 text-blue-500" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                9. Contact Information
              </h2>
            </div>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                If you have questions about these Terms, please contact us at:
              </p>
              <ul className="space-y-2 ml-5">
                <li>• Email: legal@noteboard.io</li>
                <li>• Support: <a href="/help" className="text-blue-600 dark:text-blue-400 hover:underline">Help Center</a></li>
              </ul>
            </div>
          </section>
        </div>

        {/* Acceptance Button */}
        <div className="mt-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Agree to Terms</h2>
          <p className="mb-6">
            By clicking "I Agree" or by using NoteBoard, you acknowledge that you have read,
            understood, and agree to be bound by these Terms of Service.
          </p>
          <button className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-bold text-lg shadow-xl">
            I Agree to the Terms
          </button>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            Last Updated: November 5, 2025
          </p>
          <p className="mt-2">
            These terms are binding and enforceable. Please read them carefully.
          </p>
        </div>
      </div>
    </div>
  );
}

