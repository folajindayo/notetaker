import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Calendar, PlusCircle, MapPin, Clock, Users, Video, ExternalLink, Info, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { format, parseISO, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface Event {
  id: string;
  title: string;
  description: string;
  organizer: string;
  organizerAvatar?: string;
  organizerUsername?: string;
  startTime: string;
  endTime: string;
  location: string;
  type: 'virtual' | 'in-person' | 'hybrid';
  category: 'meetup' | 'workshop' | 'conference' | 'hackathon' | 'social' | 'other';
  attendees: number;
  maxAttendees?: number;
  registered: boolean;
  registrationRequired: boolean;
  link?: string;
  image?: string;
}

const mockEvents: Event[] = [
  {
    id: 'event_001',
    title: 'Base Builders Meetup',
    description: 'Monthly meetup for Base blockchain developers and enthusiasts.',
    organizer: '0xOrganizer',
    organizerAvatar: 'https://picsum.photos/seed/organizer/100/100',
    organizerUsername: 'BaseCommunity',
    startTime: '2024-07-25T18:00:00Z',
    endTime: '2024-07-25T20:00:00Z',
    location: 'Virtual (Zoom)',
    type: 'virtual',
    category: 'meetup',
    attendees: 45,
    maxAttendees: 100,
    registered: true,
    registrationRequired: true,
    link: 'https://zoom.us/meeting/123',
    image: 'https://picsum.photos/seed/event1/640/360',
  },
  {
    id: 'event_002',
    title: 'Web3 Development Workshop',
    description: 'Learn how to build dApps on Base with hands-on coding sessions.',
    organizer: '0xWorkshop',
    organizerUsername: 'Web3Academy',
    startTime: '2024-07-28T14:00:00Z',
    endTime: '2024-07-28T17:00:00Z',
    location: 'Online',
    type: 'virtual',
    category: 'workshop',
    attendees: 120,
    maxAttendees: 200,
    registered: false,
    registrationRequired: true,
    image: 'https://picsum.photos/seed/event2/640/360',
  },
  {
    id: 'event_003',
    title: 'DAO Governance Summit',
    description: 'Annual summit discussing the future of decentralized governance.',
    organizer: '0xDAO',
    organizerUsername: 'DAOSummit',
    startTime: '2024-08-05T10:00:00Z',
    endTime: '2024-08-05T18:00:00Z',
    location: 'San Francisco, CA',
    type: 'in-person',
    category: 'conference',
    attendees: 350,
    maxAttendees: 500,
    registered: false,
    registrationRequired: true,
    image: 'https://picsum.photos/seed/event3/640/360',
  },
];

const EventCalendar: React.FC = () => {
  const { address, isConnected } = useAccount();
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('list');
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    location: '',
    type: 'virtual' as Event['type'],
    category: 'meetup' as Event['category'],
    registrationRequired: true,
    maxAttendees: '',
  });

  useEffect(() => {
    if (isConnected && address) {
      fetchEvents(address);
    }
  }, [address, isConnected]);

  const fetchEvents = async (userAddress: string) => {
    // In a real application, this would fetch from blockchain or backend
    console.log(`Fetching events for ${userAddress}...`);
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const handleRegister = async (eventId: string) => {
    if (!isConnected) {
      alert('Please connect your wallet to register.');
      return;
    }

    setIsRegistering(true);
    console.log(`Registering for event ${eventId}...`);

    try {
      // In a real application, this would call a smart contract
      await new Promise(resolve => setTimeout(resolve, 1500));

      setEvents(prev => prev.map(e => 
        e.id === eventId 
          ? { ...e, registered: true, attendees: e.attendees + 1 }
          : e
      ));

      if (selectedEvent?.id === eventId) {
        setSelectedEvent(prev => prev ? { ...prev, registered: true, attendees: prev.attendees + 1 } : null);
      }

      alert('Successfully registered for the event!');
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Failed to register. Please try again.');
    } finally {
      setIsRegistering(false);
    }
  };

  const handleCreateEvent = async () => {
    if (!newEvent.title || !newEvent.description || !newEvent.startTime) {
      alert('Please fill in all required fields.');
      return;
    }
    if (!isConnected) {
      alert('Please connect your wallet to create an event.');
      return;
    }

    console.log('Creating event:', newEvent);
    await new Promise(resolve => setTimeout(resolve, 2000));

    const event: Event = {
      id: `event_${Date.now()}`,
      title: newEvent.title,
      description: newEvent.description,
      organizer: address!,
      startTime: newEvent.startTime,
      endTime: newEvent.endTime || newEvent.startTime,
      location: newEvent.location,
      type: newEvent.type,
      category: newEvent.category,
      attendees: 0,
      maxAttendees: newEvent.maxAttendees ? parseInt(newEvent.maxAttendees) : undefined,
      registered: false,
      registrationRequired: newEvent.registrationRequired,
    };

    setEvents(prev => [event, ...prev]);
    setIsCreateModalOpen(false);
    setNewEvent({
      title: '',
      description: '',
      startTime: '',
      endTime: '',
      location: '',
      type: 'virtual',
      category: 'meetup',
      registrationRequired: true,
      maxAttendees: '',
    });
    alert('Event created successfully!');
  };

  const getTypeBadge = (type: Event['type']) => {
    switch (type) {
      case 'virtual':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"><Video className="h-3 w-3 mr-1" />Virtual</Badge>;
      case 'in-person':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"><MapPin className="h-3 w-3 mr-1" />In-Person</Badge>;
      case 'hybrid':
        return <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">Hybrid</Badge>;
      default:
        return null;
    }
  };

  const getCategoryBadge = (category: Event['category']) => {
    return <Badge variant="outline" className="capitalize">{category}</Badge>;
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(parseISO(event.startTime), date));
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  if (!isConnected) {
    return (
      <Alert className="bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300">
        <Info className="h-4 w-4" />
        <AlertTitle>Wallet Not Connected</AlertTitle>
        <AlertDescription>Connect your wallet to view and create events.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Calendar className="h-8 w-8 mr-3 text-primary" /> Event Calendar
          </h1>
          <p className="text-muted-foreground mt-1">
            Discover and organize community events
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <PlusCircle className="h-4 w-4 mr-2" /> Create Event
        </Button>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="myEvents">My Events</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4 mt-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map(event => (
              <Card
                key={event.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedEvent(event)}
              >
                {event.image && (
                  <div className="h-48 overflow-hidden">
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    {getTypeBadge(event.type)}
                    {getCategoryBadge(event.category)}
                  </div>
                  <CardTitle className="text-xl">{event.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{event.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {format(parseISO(event.startTime), 'PPp')}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {event.location}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      {event.attendees}{event.maxAttendees ? ` / ${event.maxAttendees}` : ''} attendees
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  {event.registered ? (
                    <Badge className="w-full justify-center bg-green-500">
                      <CheckCircle className="h-4 w-4 mr-2" /> Registered
                    </Badge>
                  ) : (
                    <Button
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRegister(event.id);
                      }}
                      disabled={isRegistering || (event.maxAttendees && event.attendees >= event.maxAttendees)}
                    >
                      Register
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="myEvents" className="space-y-4 mt-6">
          <div className="grid md:grid-cols-2 gap-6">
            {events.filter(e => e.organizer === address || e.registered).map(event => (
              <Card key={event.id}>
                <CardHeader>
                  <CardTitle>{event.title}</CardTitle>
                  <CardDescription>{event.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {format(parseISO(event.startTime), 'PPp')}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{format(currentDate, 'MMMM yyyy')}</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                    Today
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}>
                    Next
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center font-semibold text-sm p-2">
                    {day}
                  </div>
                ))}
                {daysInMonth.map(day => {
                  const dayEvents = getEventsForDate(day);
                  return (
                    <div
                      key={day.toISOString()}
                      className={`min-h-24 p-2 border rounded-lg ${
                        isSameDay(day, new Date()) ? 'bg-primary/10 border-primary' : ''
                      } ${!isSameMonth(day, currentDate) ? 'opacity-30' : ''}`}
                    >
                      <div className="text-sm font-medium mb-1">{format(day, 'd')}</div>
                      {dayEvents.map(event => (
                        <div
                          key={event.id}
                          className="text-xs p-1 bg-blue-100 dark:bg-blue-900 rounded mb-1 truncate cursor-pointer"
                          onClick={() => setSelectedEvent(event)}
                        >
                          {event.title}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <div className="flex items-center gap-2 mb-2">
                {getTypeBadge(selectedEvent.type)}
                {getCategoryBadge(selectedEvent.category)}
              </div>
              <DialogTitle>{selectedEvent.title}</DialogTitle>
              <DialogDescription>{selectedEvent.description}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {format(parseISO(selectedEvent.startTime), 'PPp')} - {format(parseISO(selectedEvent.endTime), 'p')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{selectedEvent.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {selectedEvent.attendees}{selectedEvent.maxAttendees ? ` / ${selectedEvent.maxAttendees}` : ''} attendees
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={selectedEvent.organizerAvatar} />
                    <AvatarFallback>{selectedEvent.organizerUsername?.[0] || selectedEvent.organizer.slice(2, 4).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">
                    Organized by {selectedEvent.organizerUsername || selectedEvent.organizer.slice(0, 10) + '...'}
                  </span>
                </div>
              </div>
            </div>
            <DialogFooter>
              {selectedEvent.link && (
                <Button variant="outline" asChild>
                  <a href={selectedEvent.link} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" /> Event Link
                  </a>
                </Button>
              )}
              {!selectedEvent.registered && selectedEvent.registrationRequired && (
                <Button onClick={() => handleRegister(selectedEvent.id)} disabled={isRegistering}>
                  {isRegistering ? 'Registering...' : 'Register'}
                </Button>
              )}
              {selectedEvent.registered && (
                <Badge className="bg-green-500">
                  <CheckCircle className="h-4 w-4 mr-2" /> Registered
                </Badge>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Create Event Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
            <DialogDescription>Organize a community event</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title *</Label>
              <Input
                id="title"
                value={newEvent.title}
                onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter event title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={newEvent.description}
                onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your event"
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time *</Label>
                <Input
                  id="startTime"
                  type="datetime-local"
                  value={newEvent.startTime}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, startTime: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="datetime-local"
                  value={newEvent.endTime}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, endTime: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={newEvent.location}
                onChange={(e) => setNewEvent(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Virtual or physical location"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Event Type</Label>
                <Select
                  value={newEvent.type}
                  onValueChange={(value: Event['type']) => setNewEvent(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="virtual">Virtual</SelectItem>
                    <SelectItem value="in-person">In-Person</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={newEvent.category}
                  onValueChange={(value: Event['category']) => setNewEvent(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="meetup">Meetup</SelectItem>
                    <SelectItem value="workshop">Workshop</SelectItem>
                    <SelectItem value="conference">Conference</SelectItem>
                    <SelectItem value="hackathon">Hackathon</SelectItem>
                    <SelectItem value="social">Social</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxAttendees">Max Attendees (Optional)</Label>
              <Input
                id="maxAttendees"
                type="number"
                value={newEvent.maxAttendees}
                onChange={(e) => setNewEvent(prev => ({ ...prev, maxAttendees: e.target.value }))}
                placeholder="Leave empty for unlimited"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleCreateEvent}>Create Event</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventCalendar;

