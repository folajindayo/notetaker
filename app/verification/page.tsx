'use client';

import { useState } from 'react';
import { CheckCircle, Upload, Link as LinkIcon, Twitter, Instagram, Globe, Send, AlertCircle } from 'lucide-react';

interface VerificationRequest {
  fullName: string;
  category: string;
  followers: string;
  reason: string;
  website?: string;
  twitter?: string;
  instagram?: string;
  otherLinks?: string;
  documents: File[];
}

export default function VerificationPage() {
  const [formData, setFormData] = useState<VerificationRequest>({
    fullName: '',
    category: '',
    followers: '',
    reason: '',
    website: '',
    twitter: '',
    instagram: '',
    otherLinks: '',
    documents: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const categories = [
    { value: 'creator', label: 'Content Creator', icon: '🎨' },
    { value: 'developer', label: 'Developer/Tech', icon: '💻' },
    { value: 'business', label: 'Business/Brand', icon: '🏢' },
    { value: 'influencer', label: 'Influencer', icon: '⭐' },
    { value: 'artist', label: 'Artist/Musician', icon: '🎵' },
    { value: 'journalist', label: 'Journalist/Media', icon: '📰' },
    { value: 'government', label: 'Government/Politics', icon: '🏛️' },
    { value: 'nonprofit', label: 'Non-Profit Organization', icon: '❤️' },
    { value: 'other', label: 'Other', icon: '📌' },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setFormData({ ...formData, documents: [...formData.documents, ...files] });
    }
  };

  const removeDocument = (index: number) => {
    setFormData({
      ...formData,
      documents: formData.documents.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // In a real app, this would upload to IPFS and call smart contract
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log('Verification request submitted:', formData);
    setSubmitted(true);
    setIsSubmitting(false);
  };

  const isFormValid = () => {
    return (
      formData.fullName.trim() &&
      formData.category &&
      formData.reason.trim().length >= 100 &&
      (formData.website || formData.twitter || formData.instagram)
    );
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-12 text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Send className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Application Submitted!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">
            Your verification request has been submitted successfully. Our team will review your
            application and get back to you within 5-7 business days.
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              You'll receive a notification on your account once your request has been reviewed.
            </p>
          </div>
          <button
            onClick={() => (window.location.href = '/')}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg font-semibold"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <CheckCircle className="w-12 h-12 text-blue-500" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Get Verified
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Apply for a verified badge to show your account is authentic
          </p>
        </div>

        {/* Info Banner */}
        <div className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
          <div className="flex gap-4">
            <AlertCircle className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Verification Requirements
              </h3>
              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <li>✅ Active account in good standing</li>
                <li>✅ Complete profile with bio and profile picture</li>
                <li>✅ Notable presence or recognition in your field</li>
                <li>✅ Authentic identity (no impersonation)</li>
                <li>✅ Complies with community guidelines</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Basic Information
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Full Name or Brand Name *
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Enter your real name or official brand name"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Category *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {categories.map((cat) => (
                    <label
                      key={cat.value}
                      className={`flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        formData.category === cat.value
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <input
                        type="radio"
                        name="category"
                        value={cat.value}
                        checked={formData.category === cat.value}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="sr-only"
                      />
                      <span className="text-xl">{cat.icon}</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {cat.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Approximate Follower Count (Other Platforms)
                </label>
                <select
                  value={formData.followers}
                  onChange={(e) => setFormData({ ...formData, followers: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select range</option>
                  <option value="1k-10k">1,000 - 10,000</option>
                  <option value="10k-50k">10,000 - 50,000</option>
                  <option value="50k-100k">50,000 - 100,000</option>
                  <option value="100k-500k">100,000 - 500,000</option>
                  <option value="500k+">500,000+</option>
                </select>
              </div>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Social Media & Online Presence
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Provide at least one link to verify your identity
            </p>

            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <Globe className="w-4 h-4" />
                  Website
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://yourwebsite.com"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <Twitter className="w-4 h-4" />
                  Twitter/X Profile
                </label>
                <input
                  type="text"
                  value={formData.twitter}
                  onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                  placeholder="@username or profile URL"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <Instagram className="w-4 h-4" />
                  Instagram Profile
                </label>
                <input
                  type="text"
                  value={formData.instagram}
                  onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                  placeholder="@username or profile URL"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <LinkIcon className="w-4 h-4" />
                  Other Links (LinkedIn, YouTube, etc.)
                </label>
                <textarea
                  value={formData.otherLinks}
                  onChange={(e) => setFormData({ ...formData, otherLinks: e.target.value })}
                  placeholder="Add any additional links, one per line"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
            </div>
          </div>

          {/* Reason for Verification */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Why Should You Be Verified?
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Explain why you should receive a verified badge (minimum 100 characters) *
            </p>
            <textarea
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              placeholder="Describe your achievements, recognition, or why your account should be verified..."
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              required
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {formData.reason.length}/100 characters minimum
            </p>
          </div>

          {/* Supporting Documents */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Supporting Documents (Optional)
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Upload any documents that help verify your identity (ID, press articles, certifications, etc.)
            </p>

            <label className="flex flex-col items-center gap-3 p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 dark:hover:border-blue-500 transition-colors">
              <Upload className="w-8 h-8 text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Click to upload or drag and drop
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                PDF, PNG, JPG up to 10MB
              </span>
              <input
                type="file"
                onChange={handleFileUpload}
                accept=".pdf,.png,.jpg,.jpeg"
                multiple
                className="hidden"
              />
            </label>

            {formData.documents.length > 0 && (
              <div className="mt-4 space-y-2">
                {formData.documents.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <span className="text-sm text-gray-700 dark:text-gray-300">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeDocument(index)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => (window.location.href = '/')}
              className="px-8 py-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isFormValid() || isSubmitting}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Submit Application
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

