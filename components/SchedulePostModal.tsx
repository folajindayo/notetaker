'use client';

import { useState } from 'react';

interface SchedulePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (scheduledDate: Date) => void;
  noteContent?: string;
}

export default function SchedulePostModal({
  isOpen,
  onClose,
  onSchedule,
  noteContent = '',
}: SchedulePostModalProps) {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [timezone, setTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  // Get current date for min date validation
  const now = new Date();
  const minDate = now.toISOString().split('T')[0];
  const minTime = now.toTimeString().slice(0, 5);

  // Quick schedule options
  const quickSchedule = [
    { label: '1 hour', minutes: 60 },
    { label: '3 hours', minutes: 180 },
    { label: '6 hours', minutes: 360 },
    { label: '12 hours', minutes: 720 },
    { label: '1 day', minutes: 1440 },
    { label: '3 days', minutes: 4320 },
    { label: '1 week', minutes: 10080 },
  ];

  const handleQuickSchedule = (minutes: number) => {
    const scheduledDate = new Date(Date.now() + minutes * 60 * 1000);
    setSelectedDate(scheduledDate.toISOString().split('T')[0]);
    setSelectedTime(scheduledDate.toTimeString().slice(0, 5));
  };

  const handleSchedule = () => {
    if (!selectedDate || !selectedTime) {
      alert('Please select both date and time');
      return;
    }

    const scheduledDateTime = new Date(`${selectedDate}T${selectedTime}`);
    
    if (scheduledDateTime <= new Date()) {
      alert('Scheduled time must be in the future');
      return;
    }

    onSchedule(scheduledDateTime);
    onClose();
  };

  const getFormattedScheduleTime = () => {
    if (!selectedDate || !selectedTime) return null;
    const scheduledDateTime = new Date(`${selectedDate}T${selectedTime}`);
    return scheduledDateTime.toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: timezone,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              📅 Schedule Post
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Choose when to publish your note
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Note Preview */}
          {noteContent && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {noteContent.slice(0, 200)}
                {noteContent.length > 200 && '...'}
              </p>
            </div>
          )}

          {/* Quick Schedule Buttons */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Quick Schedule
            </label>
            <div className="grid grid-cols-4 gap-2">
              {quickSchedule.map((option) => (
                <button
                  key={option.label}
                  onClick={() => handleQuickSchedule(option.minutes)}
                  className="px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg transition-colors"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Date & Time */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Custom Schedule
            </label>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Date Picker */}
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  min={minDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Time Picker */}
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-2">
                  Time
                </label>
                <input
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            {/* Timezone */}
            <div>
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-2">
                Timezone
              </label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="America/Chicago">Central Time (CT)</option>
                <option value="America/Denver">Mountain Time (MT)</option>
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                <option value="Europe/London">London (GMT)</option>
                <option value="Europe/Paris">Paris (CET)</option>
                <option value="Asia/Tokyo">Tokyo (JST)</option>
                <option value="Asia/Dubai">Dubai (GST)</option>
                <option value="Australia/Sydney">Sydney (AEST)</option>
                <option value={Intl.DateTimeFormat().resolvedOptions().timeZone}>
                  Local ({Intl.DateTimeFormat().resolvedOptions().timeZone})
                </option>
              </select>
            </div>
          </div>

          {/* Schedule Preview */}
          {getFormattedScheduleTime() && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <span className="text-2xl">✅</span>
                <div>
                  <p className="text-sm font-medium text-green-800 dark:text-green-300">
                    Will be published on:
                  </p>
                  <p className="text-lg font-bold text-green-900 dark:text-green-200 mt-1">
                    {getFormattedScheduleTime()}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <span className="text-xl">ℹ️</span>
              <div className="text-sm text-blue-800 dark:text-blue-300">
                <p className="font-medium mb-1">How scheduling works:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Your note will be stored securely until the scheduled time</li>
                  <li>It will automatically post to the blockchain at the exact time</li>
                  <li>You can view and manage scheduled posts in your drafts</li>
                  <li>You can cancel or reschedule anytime before posting</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSchedule}
            disabled={!selectedDate || !selectedTime}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            Schedule Post
          </button>
        </div>
      </div>
    </div>
  );
}

