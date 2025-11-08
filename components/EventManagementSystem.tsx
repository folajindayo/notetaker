'use client';

import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useReadContract } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/constants';

/**
 * EventManagementSystem - Comprehensive event management for the platform
 * Allows users to create, manage, and participate in virtual Web3 events
 */

interface Event {
  id: string;
  title: string;
  description: string;
  creator: string;
  startTime: number;
  endTime: number;
  location: string; // Virtual link or physical location
  category: string;
  maxAttendees: number;
  attendees: string[];
  ticketPrice: bigint;
  isPaid: boolean;
  isPrivate: boolean;
  tags: string[];
  imageUrl: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}

export default function EventManagementSystem() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  
  const [events, setEvents] = useState<Event[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  
  // Form state for creating new events
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    location: '',
    category: 'networking',
    maxAttendees: 100,
    ticketPrice: '0',
    isPaid: false,
    isPrivate: false,
    tags: '',
    imageUrl: '',
  });

  const categories = [
    { id: 'all', name: 'All Events', icon: '🎉' },
    { id: 'networking', name: 'Networking', icon: '🤝' },
    { id: 'workshop', name: 'Workshop', icon: '🎓' },
    { id: 'conference', name: 'Conference', icon: '🎤' },
    { id: 'hackathon', name: 'Hackathon', icon: '💻' },
    { id: 'social', name: 'Social', icon: '🎊' },
    { id: 'meetup', name: 'Meetup', icon: '👥' },
    { id: 'ama', name: 'AMA', icon: '💬' },
    { id: 'launch', name: 'Launch', icon: '🚀' },
  ];

  // Simulate fetching events (in production, this would be from the blockchain)
  useEffect(() => {
    // Mock data for demonstration
    const mockEvents: Event[] = [
      {
        id: '1',
        title: 'Web3 Developer Workshop',
        description: 'Learn how to build decentralized applications on Base',
        creator: '0x1234...',
        startTime: Date.now() / 1000 + 86400,
        endTime: Date.now() / 1000 + 90000,
        location: 'https://meet.google.com/abc-defg-hij',
        category: 'workshop',
        maxAttendees: 50,
        attendees: [],
        ticketPrice: BigInt(0),
        isPaid: false,
        isPrivate: false,
        tags: ['web3', 'development', 'base'],
        imageUrl: '',
        status: 'upcoming',
      },
    ];
    setEvents(mockEvents);
  }, []);

  const handleCreateEvent = async () => {
    if (!address || !newEvent.title || !newEvent.startTime || !newEvent.endTime) {
      alert('Please fill in all required fields');
      return;
    }

    const event: Event = {
      id: Date.now().toString(),
      title: newEvent.title,
      description: newEvent.description,
      creator: address,
      startTime: new Date(newEvent.startTime).getTime() / 1000,
      endTime: new Date(newEvent.endTime).getTime() / 1000,
      location: newEvent.location,
      category: newEvent.category,
      maxAttendees: newEvent.maxAttendees,
      attendees: [],
      ticketPrice: BigInt(parseFloat(newEvent.ticketPrice) * 1e18),
      isPaid: newEvent.isPaid,
      isPrivate: newEvent.isPrivate,
      tags: newEvent.tags.split(',').map(t => t.trim()),
      imageUrl: newEvent.imageUrl,
      status: 'upcoming',
    };

    setEvents([...events, event]);
    setShowCreateModal(false);
    
    // Reset form
    setNewEvent({
      title: '',
      description: '',
      startTime: '',
      endTime: '',
      location: '',
      category: 'networking',
      maxAttendees: 100,
      ticketPrice: '0',
      isPaid: false,
      isPrivate: false,
      tags: '',
      imageUrl: '',
    });
  };

  const handleRegisterForEvent = (eventId: string) => {
    if (!address) {
      alert('Please connect your wallet');
      return;
    }

    setEvents(events.map(event => {
      if (event.id === eventId) {
        if (event.attendees.includes(address)) {
          return {
            ...event,
            attendees: event.attendees.filter(a => a !== address),
          };
        } else if (event.attendees.length < event.maxAttendees) {
          return {
            ...event,
            attendees: [...event.attendees, address],
          };
        }
      }
      return event;
    }));
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getEventStatus = (event: Event) => {
    const now = Date.now() / 1000;
    if (event.status === 'cancelled') return 'cancelled';
    if (now > event.endTime) return 'completed';
    if (now >= event.startTime && now <= event.endTime) return 'ongoing';
    return 'upcoming';
  };

  const filteredEvents = events.filter(event => {
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            🎉 Event Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Discover, create, and participate in Web3 community events
          </p>
        </div>

        {/* Action Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 w-full md:w-auto">
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode(viewMode === 'list' ? 'calendar' : 'list')}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {viewMode === 'list' ? '📅 Calendar' : '📋 List'}
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                ➕ Create Event
              </button>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {category.icon} {category.name}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white">
            <div className="text-3xl font-bold">{events.length}</div>
            <div className="text-sm opacity-90">Total Events</div>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white">
            <div className="text-3xl font-bold">
              {events.filter(e => getEventStatus(e) === 'upcoming').length}
            </div>
            <div className="text-sm opacity-90">Upcoming</div>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-4 text-white">
            <div className="text-3xl font-bold">
              {events.filter(e => getEventStatus(e) === 'ongoing').length}
            </div>
            <div className="text-sm opacity-90">Live Now</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-4 text-white">
            <div className="text-3xl font-bold">
              {events.reduce((sum, e) => sum + e.attendees.length, 0)}
            </div>
            <div className="text-sm opacity-90">Attendees</div>
          </div>
        </div>

        {/* Events List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => {
            const status = getEventStatus(event);
            const isRegistered = address ? event.attendees.includes(address) : false;
            const isFull = event.attendees.length >= event.maxAttendees;

            return (
              <div
                key={event.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-lg transition-shadow overflow-hidden"
              >
                {/* Event Image */}
                <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 relative">
                  {event.imageUrl && (
                    <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
                  )}
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      status === 'ongoing' ? 'bg-green-500 text-white' :
                      status === 'upcoming' ? 'bg-blue-500 text-white' :
                      status === 'completed' ? 'bg-gray-500 text-white' :
                      'bg-red-500 text-white'
                    }`}>
                      {status.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Event Content */}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">
                      {categories.find(c => c.id === event.category)?.icon}
                    </span>
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      {event.category}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {event.title}
                  </h3>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {event.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <span>📅</span>
                      <span>{formatDate(event.startTime)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <span>👥</span>
                      <span>{event.attendees.length} / {event.maxAttendees} attendees</span>
                    </div>
                    {event.isPaid && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <span>💰</span>
                        <span>{(Number(event.ticketPrice) / 1e18).toFixed(4)} ETH</span>
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {event.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded-full text-gray-700 dark:text-gray-300"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handleRegisterForEvent(event.id)}
                    disabled={!address || (isFull && !isRegistered) || status !== 'upcoming'}
                    className={`w-full py-2 rounded-lg font-medium transition-colors ${
                      isRegistered
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : isFull
                        ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                        : status === 'upcoming'
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {!address ? 'Connect Wallet' :
                     isRegistered ? '✓ Registered' :
                     isFull ? 'Event Full' :
                     status !== 'upcoming' ? status.charAt(0).toUpperCase() + status.slice(1) :
                     'Register Now'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
            <p className="text-gray-600 dark:text-gray-400">No events found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Create New Event
            </h2>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Event Title *"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />

              <textarea
                placeholder="Event Description *"
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="datetime-local"
                  value={newEvent.startTime}
                  onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <input
                  type="datetime-local"
                  value={newEvent.endTime}
                  onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <input
                type="text"
                placeholder="Location (URL or Address)"
                value={newEvent.location}
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />

              <select
                value={newEvent.category}
                onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {categories.slice(1).map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Max Attendees"
                value={newEvent.maxAttendees}
                onChange={(e) => setNewEvent({ ...newEvent, maxAttendees: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />

              <input
                type="text"
                placeholder="Tags (comma-separated)"
                value={newEvent.tags}
                onChange={(e) => setNewEvent({ ...newEvent, tags: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />

              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <input
                    type="checkbox"
                    checked={newEvent.isPaid}
                    onChange={(e) => setNewEvent({ ...newEvent, isPaid: e.target.checked })}
                    className="w-4 h-4"
                  />
                  Paid Event
                </label>
                {newEvent.isPaid && (
                  <input
                    type="text"
                    placeholder="Ticket Price (ETH)"
                    value={newEvent.ticketPrice}
                    onChange={(e) => setNewEvent({ ...newEvent, ticketPrice: e.target.value })}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                )}
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateEvent}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

