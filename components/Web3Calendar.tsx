"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import {
  Calendar as CalendarIcon,
  Clock,
  Users,
  Video,
  MapPin,
  CheckCircle,
  X,
  ChevronLeft,
  ChevronRight,
  Plus,
  Edit,
  Trash2,
  Bell,
  Link as LinkIcon,
  Award,
  Shield,
} from "lucide-react";

interface Web3Event {
  id: string;
  title: string;
  description: string;
  organizer: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  isVirtual: boolean;
  meetingLink?: string;
  maxAttendees?: number;
  rsvps: string[];
  tokenGated: boolean;
  requiredToken?: {
    address: string;
    symbol: string;
    minAmount: string;
  };
  isPOAP: boolean;
  poapClaimed: string[];
  status: "upcoming" | "ongoing" | "ended" | "cancelled";
  category: string;
  tags: string[];
}

export function Web3Calendar() {
  const { address, isConnected } = useAccount();
  const [events, setEvents] = useState<Web3Event[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Web3Event | null>(null);
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month");
  const [isCreating, setIsCreating] = useState(false);

  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    location: "",
    isVirtual: true,
    meetingLink: "",
    maxAttendees: "",
    tokenGated: false,
    requiredTokenAddress: "",
    requiredTokenSymbol: "",
    minTokenAmount: "",
    isPOAP: false,
    category: "meetup",
    tags: "",
  });

  const categories = ["meetup", "conference", "workshop", "ama", "hackathon", "launch", "other"];

  useEffect(() => {
    const now = new Date();
    const mockEvents: Web3Event[] = [
      {
        id: "1",
        title: "DAO Governance Call",
        description: "Monthly governance discussion and voting",
        organizer: "0x1111...2222",
        startTime: new Date(now.getFullYear(), now.getMonth(), 15, 18, 0),
        endTime: new Date(now.getFullYear(), now.getMonth(), 15, 19, 30),
        isVirtual: true,
        meetingLink: "https://meet.example.com/dao-call",
        maxAttendees: 100,
        rsvps: [address || "0x3333...4444", "0x5555...6666"],
        tokenGated: true,
        requiredToken: {
          address: "0x1234567890123456789012345678901234567890",
          symbol: "DAO",
          minAmount: "100",
        },
        isPOAP: true,
        poapClaimed: [],
        status: "upcoming",
        category: "meetup",
        tags: ["governance", "dao", "voting"],
      },
      {
        id: "2",
        title: "Web3 Developer Workshop",
        description: "Learn to build DApps with hands-on coding",
        organizer: address || "0x7777...8888",
        startTime: new Date(now.getFullYear(), now.getMonth(), 20, 14, 0),
        endTime: new Date(now.getFullYear(), now.getMonth(), 20, 17, 0),
        location: "Innovation Hub, Downtown",
        isVirtual: false,
        maxAttendees: 50,
        rsvps: ["0x9999...0000", "0xaaaa...bbbb"],
        tokenGated: false,
        isPOAP: true,
        poapClaimed: [],
        status: "upcoming",
        category: "workshop",
        tags: ["development", "education", "solidity"],
      },
      {
        id: "3",
        title: "NFT Project Launch Party",
        description: "Celebrate the launch of our new NFT collection",
        organizer: "0xcccc...dddd",
        startTime: new Date(now.getFullYear(), now.getMonth(), 25, 20, 0),
        endTime: new Date(now.getFullYear(), now.getMonth(), 25, 23, 0),
        isVirtual: true,
        meetingLink: "https://meet.example.com/nft-launch",
        rsvps: [address || "0x3333...4444"],
        tokenGated: true,
        requiredToken: {
          address: "0x2345678901234567890123456789012345678901",
          symbol: "NFT",
          minAmount: "1",
        },
        isPOAP: false,
        poapClaimed: [],
        status: "upcoming",
        category: "launch",
        tags: ["nft", "launch", "celebration"],
      },
    ];
    setEvents(mockEvents);
  }, [address]);

  const createEvent = () => {
    if (!newEvent.title || !newEvent.startTime || !newEvent.endTime) {
      alert("Please fill in required fields");
      return;
    }

    const event: Web3Event = {
      id: Date.now().toString(),
      title: newEvent.title,
      description: newEvent.description,
      organizer: address || "0x0000...0000",
      startTime: new Date(newEvent.startTime),
      endTime: new Date(newEvent.endTime),
      location: newEvent.location || undefined,
      isVirtual: newEvent.isVirtual,
      meetingLink: newEvent.meetingLink || undefined,
      maxAttendees: newEvent.maxAttendees ? parseInt(newEvent.maxAttendees) : undefined,
      rsvps: [],
      tokenGated: newEvent.tokenGated,
      requiredToken: newEvent.tokenGated
        ? {
            address: newEvent.requiredTokenAddress,
            symbol: newEvent.requiredTokenSymbol,
            minAmount: newEvent.minTokenAmount,
          }
        : undefined,
      isPOAP: newEvent.isPOAP,
      poapClaimed: [],
      status: "upcoming",
      category: newEvent.category,
      tags: newEvent.tags.split(",").map((t) => t.trim()).filter((t) => t),
    };

    setEvents([event, ...events]);
    setIsCreating(false);
    setNewEvent({
      title: "",
      description: "",
      startTime: "",
      endTime: "",
      location: "",
      isVirtual: true,
      meetingLink: "",
      maxAttendees: "",
      tokenGated: false,
      requiredTokenAddress: "",
      requiredTokenSymbol: "",
      minTokenAmount: "",
      isPOAP: false,
      category: "meetup",
      tags: "",
    });
    alert("Event created successfully!");
  };

  const rsvpEvent = (event: Web3Event) => {
    if (!address) return;

    if (event.rsvps.includes(address)) {
      alert("You've already RSVP'd to this event");
      return;
    }

    if (event.maxAttendees && event.rsvps.length >= event.maxAttendees) {
      alert("Event is full");
      return;
    }

    setEvents(
      events.map((e) =>
        e.id === event.id
          ? { ...e, rsvps: [...e.rsvps, address] }
          : e
      )
    );
    alert("RSVP confirmed!");
  };

  const claimPOAP = (event: Web3Event) => {
    if (!address) return;

    if (event.poapClaimed.includes(address)) {
      alert("You've already claimed the POAP for this event");
      return;
    }

    if (!event.rsvps.includes(address)) {
      alert("You must RSVP to claim POAP");
      return;
    }

    setEvents(
      events.map((e) =>
        e.id === event.id
          ? { ...e, poapClaimed: [...e.poapClaimed, address] }
          : e
      )
    );
    alert("POAP claimed successfully!");
  };

  // Calendar helpers
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const goToPreviousMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1));
  };

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.startTime);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(selectedDate);
    const firstDay = getFirstDayOfMonth(selectedDate);
    const days = [];

    // Previous month's trailing days
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="aspect-square p-2" />);
    }

    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
      const dayEvents = getEventsForDate(date);
      const isToday =
        date.getDate() === new Date().getDate() &&
        date.getMonth() === new Date().getMonth() &&
        date.getFullYear() === new Date().getFullYear();

      days.push(
        <div
          key={day}
          className={`aspect-square p-2 border border-gray-200 hover:bg-gray-50 cursor-pointer ${
            isToday ? "bg-blue-50 border-blue-300" : ""
          }`}
        >
          <div className={`text-sm font-medium mb-1 ${isToday ? "text-blue-600" : "text-gray-700"}`}>
            {day}
          </div>
          <div className="space-y-1">
            {dayEvents.slice(0, 2).map((event) => (
              <div
                key={event.id}
                onClick={() => setSelectedEvent(event)}
                className="text-xs p-1 bg-purple-100 text-purple-700 rounded truncate hover:bg-purple-200"
              >
                {event.title}
              </div>
            ))}
            {dayEvents.length > 2 && (
              <div className="text-xs text-gray-600 pl-1">+{dayEvents.length - 2} more</div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  const upcomingEvents = events
    .filter((e) => e.startTime > new Date() && e.status === "upcoming")
    .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

  const myEvents = events.filter((e) => e.organizer === address);
  const myRSVPs = events.filter((e) => e.rsvps.includes(address || ""));

  if (!isConnected) {
    return (
      <div className="p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center py-12">
          <CalendarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Connect your wallet to view Web3 events</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 rounded-lg">
            <CalendarIcon className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Web3 Calendar</h2>
            <p className="text-sm text-gray-600">On-chain event scheduling with RSVPs</p>
          </div>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Event
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600">{upcomingEvents.length}</div>
          <div className="text-sm text-gray-600">Upcoming Events</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-600">{myRSVPs.length}</div>
          <div className="text-sm text-gray-600">My RSVPs</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600">{myEvents.length}</div>
          <div className="text-sm text-gray-600">Organized by Me</div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-yellow-600">
            {events.filter((e) => e.isPOAP && e.poapClaimed.includes(address || "")).length}
          </div>
          <div className="text-sm text-gray-600">POAPs Collected</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={goToPreviousMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h3 className="text-lg font-bold text-gray-900">
                {selectedDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </h3>
              <button
                onClick={goToNextMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-center text-xs font-semibold text-gray-600 py-2">
                  {day}
                </div>
              ))}
              {renderCalendar()}
            </div>
          </div>
        </div>

        {/* Upcoming Events Sidebar */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Upcoming Events
          </h3>
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {upcomingEvents.slice(0, 10).map((event) => (
              <div
                key={event.id}
                onClick={() => setSelectedEvent(event)}
                className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900 text-sm">{event.title}</h4>
                  {event.tokenGated && (
                    <Shield className="w-4 h-4 text-purple-600 flex-shrink-0" />
                  )}
                </div>
                <div className="space-y-1 text-xs text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{event.startTime.toLocaleString()}</span>
                  </div>
                  {event.isVirtual ? (
                    <div className="flex items-center gap-1">
                      <Video className="w-3 h-3" />
                      <span>Virtual</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{event.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>
                      {event.rsvps.length}
                      {event.maxAttendees && `/${event.maxAttendees}`} attending
                    </span>
                  </div>
                </div>
                {event.isPOAP && (
                  <div className="mt-2 flex items-center gap-1 text-xs text-yellow-600">
                    <Award className="w-3 h-3" />
                    <span>POAP Available</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedEvent.title}</h2>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    selectedEvent.category === "meetup" ? "bg-blue-100 text-blue-700" :
                    selectedEvent.category === "workshop" ? "bg-purple-100 text-purple-700" :
                    "bg-green-100 text-green-700"
                  }`}>
                    {selectedEvent.category}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-gray-700 mb-4">{selectedEvent.description}</p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-gray-700">
                  <Clock className="w-5 h-5 text-gray-500" />
                  <div>
                    <div className="font-medium">
                      {selectedEvent.startTime.toLocaleDateString()} at{" "}
                      {selectedEvent.startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                    <div className="text-sm text-gray-600">
                      Ends at {selectedEvent.endTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </div>

                {selectedEvent.isVirtual ? (
                  <div className="flex items-center gap-3 text-gray-700">
                    <Video className="w-5 h-5 text-gray-500" />
                    <div>
                      <div className="font-medium">Virtual Event</div>
                      {selectedEvent.meetingLink && (
                        <a
                          href={selectedEvent.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                        >
                          <LinkIcon className="w-3 h-3" />
                          Join Meeting
                        </a>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 text-gray-700">
                    <MapPin className="w-5 h-5 text-gray-500" />
                    <div className="font-medium">{selectedEvent.location}</div>
                  </div>
                )}

                <div className="flex items-center gap-3 text-gray-700">
                  <Users className="w-5 h-5 text-gray-500" />
                  <div>
                    <div className="font-medium">
                      {selectedEvent.rsvps.length} attending
                      {selectedEvent.maxAttendees && ` / ${selectedEvent.maxAttendees} max`}
                    </div>
                  </div>
                </div>

                {selectedEvent.tokenGated && selectedEvent.requiredToken && (
                  <div className="flex items-center gap-3 text-purple-700 bg-purple-50 p-3 rounded-lg">
                    <Shield className="w-5 h-5" />
                    <div className="text-sm">
                      <div className="font-semibold">Token Gated</div>
                      <div>
                        Requires {selectedEvent.requiredToken.minAmount} {selectedEvent.requiredToken.symbol}
                      </div>
                    </div>
                  </div>
                )}

                {selectedEvent.isPOAP && (
                  <div className="flex items-center gap-3 text-yellow-700 bg-yellow-50 p-3 rounded-lg">
                    <Award className="w-5 h-5" />
                    <div className="text-sm">
                      <div className="font-semibold">POAP Available</div>
                      <div>{selectedEvent.poapClaimed.length} claimed</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {selectedEvent.tags.map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                {!selectedEvent.rsvps.includes(address || "") ? (
                  <button
                    onClick={() => rsvpEvent(selectedEvent)}
                    disabled={
                      selectedEvent.maxAttendees !== undefined &&
                      selectedEvent.rsvps.length >= selectedEvent.maxAttendees
                    }
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2 font-semibold"
                  >
                    <CheckCircle className="w-5 h-5" />
                    RSVP to Event
                  </button>
                ) : (
                  <div className="flex-1 px-6 py-3 bg-green-100 text-green-700 rounded-lg flex items-center justify-center gap-2 font-semibold">
                    <CheckCircle className="w-5 h-5" />
                    You're Attending
                  </div>
                )}

                {selectedEvent.isPOAP && selectedEvent.rsvps.includes(address || "") && !selectedEvent.poapClaimed.includes(address || "") && (
                  <button
                    onClick={() => claimPOAP(selectedEvent)}
                    className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center gap-2 font-semibold"
                  >
                    <Award className="w-5 h-5" />
                    Claim POAP
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Event Modal */}
      {isCreating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Event</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Event Title</label>
                  <input
                    type="text"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Community Meetup"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg min-h-[100px]"
                    placeholder="Describe your event..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                    <input
                      type="datetime-local"
                      value={newEvent.startTime}
                      onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                    <input
                      type="datetime-local"
                      value={newEvent.endTime}
                      onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    id="isVirtual"
                    checked={newEvent.isVirtual}
                    onChange={(e) => setNewEvent({ ...newEvent, isVirtual: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600"
                  />
                  <label htmlFor="isVirtual" className="text-sm text-gray-700">
                    Virtual Event
                  </label>
                </div>

                {newEvent.isVirtual ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Meeting Link</label>
                    <input
                      type="url"
                      value={newEvent.meetingLink}
                      onChange={(e) => setNewEvent({ ...newEvent, meetingLink: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="https://meet.example.com/event"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input
                      type="text"
                      value={newEvent.location}
                      onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="123 Main St, City"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={newEvent.category}
                      onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Max Attendees (Optional)</label>
                    <input
                      type="number"
                      value={newEvent.maxAttendees}
                      onChange={(e) => setNewEvent({ ...newEvent, maxAttendees: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="No limit"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={newEvent.tags}
                    onChange={(e) => setNewEvent({ ...newEvent, tags: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="web3, community, networking"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="tokenGated"
                    checked={newEvent.tokenGated}
                    onChange={(e) => setNewEvent({ ...newEvent, tokenGated: e.target.checked })}
                    className="rounded border-gray-300 text-purple-600"
                  />
                  <label htmlFor="tokenGated" className="text-sm text-gray-700">
                    Token Gated Event
                  </label>
                </div>

                {newEvent.tokenGated && (
                  <div className="pl-6 space-y-3 border-l-2 border-purple-200">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Token Address</label>
                      <input
                        type="text"
                        value={newEvent.requiredTokenAddress}
                        onChange={(e) => setNewEvent({ ...newEvent, requiredTokenAddress: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="0x..."
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Token Symbol</label>
                        <input
                          type="text"
                          value={newEvent.requiredTokenSymbol}
                          onChange={(e) => setNewEvent({ ...newEvent, requiredTokenSymbol: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          placeholder="TOKEN"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Min Amount</label>
                        <input
                          type="text"
                          value={newEvent.minTokenAmount}
                          onChange={(e) => setNewEvent({ ...newEvent, minTokenAmount: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          placeholder="100"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isPOAP"
                    checked={newEvent.isPOAP}
                    onChange={(e) => setNewEvent({ ...newEvent, isPOAP: e.target.checked })}
                    className="rounded border-gray-300 text-yellow-600"
                  />
                  <label htmlFor="isPOAP" className="text-sm text-gray-700">
                    Issue POAP to Attendees
                  </label>
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    onClick={createEvent}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  >
                    Create Event
                  </button>
                  <button
                    onClick={() => setIsCreating(false)}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

