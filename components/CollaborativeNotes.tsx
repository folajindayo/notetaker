import React, { useState, useEffect, useRef } from 'react';
import { useAccount } from 'wagmi';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Users, Edit, Eye, Lock, Unlock, Plus Circle, Share2, Save, Clock, UserPlus, Info, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Label } from './ui/label';
import { format, parseISO } from 'date-fns';

interface CollaborativeNote {
  id: string;
  title: string;
  content: string;
  owner: string;
  collaborators: Collaborator[];
  permissions: 'view' | 'edit' | 'admin';
  lastEdited: string;
  lastEditedBy: string;
  version: number;
  isPublic: boolean;
  locked: boolean;
}

interface Collaborator {
  address: string;
  username?: string;
  avatar?: string;
  permission: 'view' | 'edit' | 'admin';
  addedAt: string;
  isActive: boolean;
}

interface EditHistory {
  id: string;
  editor: string;
  action: 'created' | 'edited' | 'shared' | 'locked';
  changes: string;
  timestamp: string;
}

const mockCollaborativeNotes: CollaborativeNote[] = [
  {
    id: 'collab_001',
    title: 'Web3 Project Roadmap Q3-Q4',
    content: 'This is a collaborative roadmap for our Web3 project...\n\n## Q3 Goals\n- Launch NFT marketplace\n- Implement staking mechanism\n\n## Q4 Goals\n- Mobile app development\n- Cross-chain bridge',
    owner: '0xAlice',
    collaborators: [
      { address: '0xBob', username: 'Bob', permission: 'edit', addedAt: '2024-07-20T10:00:00Z', isActive: true },
      { address: '0xCharlie', username: 'Charlie', permission: 'view', addedAt: '2024-07-21T14:00:00Z', isActive: false },
    ],
    permissions: 'edit',
    lastEdited: '2024-07-22T15:30:00Z',
    lastEditedBy: '0xBob',
    version: 5,
    isPublic: false,
    locked: false,
  },
  {
    id: 'collab_002',
    title: 'Community Meeting Notes - July 2024',
    content: 'Meeting held on July 22, 2024\n\nAttendees:\n- Alice\n- Bob\n- Charlie\n\nAgenda Items:\n1. Treasury allocation\n2. Marketing strategy\n3. Developer grants',
    owner: '0xYou',
    collaborators: [
      { address: '0xAlice', permission: 'edit', addedAt: '2024-07-22T09:00:00Z', isActive: true },
      { address: '0xDave', permission: 'edit', addedAt: '2024-07-22T09:05:00Z', isActive: true },
    ],
    permissions: 'admin',
    lastEdited: '2024-07-22T16:00:00Z',
    lastEditedBy: '0xYou',
    version: 3,
    isPublic: true,
    locked: false,
  },
];

const mockEditHistory: EditHistory[] = [
  {
    id: 'hist_001',
    editor: '0xBob',
    action: 'edited',
    changes: 'Added Q4 goals section',
    timestamp: '2024-07-22T15:30:00Z',
  },
  {
    id: 'hist_002',
    editor: '0xAlice',
    action: 'edited',
    changes: 'Updated Q3 goals with completed items',
    timestamp: '2024-07-22T14:15:00Z',
  },
  {
    id: 'hist_003',
    editor: '0xYou',
    action: 'shared',
    changes: 'Invited Charlie as viewer',
    timestamp: '2024-07-21T14:00:00Z',
  },
];

const CollaborativeNotes: React.FC = () => {
  const { address, isConnected } = useAccount();
  const [notes, setNotes] = useState<CollaborativeNote[]>(mockCollaborativeNotes);
  const [selectedNote, setSelectedNote] = useState<CollaborativeNote | null>(null);
  const [editHistory, setEditHistory] = useState<EditHistory[]>(mockEditHistory);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [editedTitle, setEditedTitle] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [newCollaboratorAddress, setNewCollaboratorAddress] = useState('');
  const [newCollaboratorPermission, setNewCollaboratorPermission] = useState<'view' | 'edit'>('view');
  const [newNote, setNewNote] = useState({ title: '', content: '', isPublic: false });
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (selectedNote && isEditing) {
      setEditedTitle(selectedNote.title);
      setEditedContent(selectedNote.content);
    }
  }, [selectedNote, isEditing]);

  const handleNoteClick = (note: CollaborativeNote) => {
    setSelectedNote(note);
    setIsEditing(false);
  };

  const handleStartEdit = () => {
    if (!selectedNote) return;
    if (selectedNote.permissions === 'view') {
      alert('You only have view permissions for this note.');
      return;
    }
    if (selectedNote.locked) {
      alert('This note is locked and cannot be edited.');
      return;
    }
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedNote || !isConnected) return;

    console.log('Saving edits to note:', selectedNote.id);
    // In a real application, this would involve:
    // 1. Sync changes to decentralized storage (IPFS, Arweave)
    // 2. Update version on blockchain
    // 3. Notify other collaborators via WebSocket/PubSub
    // 4. Create edit history entry
    await new Promise(resolve => setTimeout(resolve, 1000));

    const updatedNote: CollaborativeNote = {
      ...selectedNote,
      title: editedTitle,
      content: editedContent,
      lastEdited: new Date().toISOString(),
      lastEditedBy: address!,
      version: selectedNote.version + 1,
    };

    setNotes(prev => prev.map(n => n.id === selectedNote.id ? updatedNote : n));
    setSelectedNote(updatedNote);
    setIsEditing(false);

    const historyEntry: EditHistory = {
      id: `hist_${Date.now()}`,
      editor: address!,
      action: 'edited',
      changes: 'Updated note content',
      timestamp: new Date().toISOString(),
    };
    setEditHistory(prev => [historyEntry, ...prev]);

    alert('Note saved successfully!');
  };

  const handleCreateNote = async () => {
    if (!newNote.title || !newNote.content) {
      alert('Please fill in all fields.');
      return;
    }
    if (!isConnected) {
      alert('Please connect your wallet to create a note.');
      return;
    }

    console.log('Creating collaborative note...');
    await new Promise(resolve => setTimeout(resolve, 1000));

    const note: CollaborativeNote = {
      id: `collab_${Date.now()}`,
      title: newNote.title,
      content: newNote.content,
      owner: address!,
      collaborators: [],
      permissions: 'admin',
      lastEdited: new Date().toISOString(),
      lastEditedBy: address!,
      version: 1,
      isPublic: newNote.isPublic,
      locked: false,
    };

    setNotes(prev => [note, ...prev]);
    setIsCreateModalOpen(false);
    setNewNote({ title: '', content: '', isPublic: false });
    setSelectedNote(note);
    alert('Collaborative note created!');
  };

  const handleAddCollaborator = async () => {
    if (!newCollaboratorAddress || !selectedNote) {
      alert('Please enter a valid address.');
      return;
    }
    if (selectedNote.permissions !== 'admin') {
      alert('Only admins can add collaborators.');
      return;
    }

    console.log(`Adding collaborator ${newCollaboratorAddress} with ${newCollaboratorPermission} permission...`);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const collaborator: Collaborator = {
      address: newCollaboratorAddress,
      permission: newCollaboratorPermission,
      addedAt: new Date().toISOString(),
      isActive: false,
    };

    const updatedNote = {
      ...selectedNote,
      collaborators: [...selectedNote.collaborators, collaborator],
    };

    setNotes(prev => prev.map(n => n.id === selectedNote.id ? updatedNote : n));
    setSelectedNote(updatedNote);
    setIsShareModalOpen(false);
    setNewCollaboratorAddress('');
    alert('Collaborator invited successfully!');
  };

  const getPermissionBadge = (permission: 'view' | 'edit' | 'admin') => {
    const colors = {
      admin: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      edit: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      view: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    };
    return <Badge className={colors[permission]}>{permission}</Badge>;
  };

  if (!isConnected) {
    return (
      <Alert className="bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300">
        <Info className="h-4 w-4" />
        <AlertTitle>Wallet Not Connected</AlertTitle>
        <AlertDescription>Connect your wallet to create and collaborate on notes.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Users className="h-8 w-8 mr-3 text-primary" /> Collaborative Notes
          </h1>
          <p className="text-muted-foreground mt-1">
            Work together on notes in real-time with Web3 security
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <PlusCircle className="h-4 w-4 mr-2" /> New Collaborative Note
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Notes List */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your Collaborative Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {notes.map(note => (
                <div
                  key={note.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedNote?.id === note.id
                      ? 'bg-primary/10 border-2 border-primary'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                  onClick={() => handleNoteClick(note)}
                >
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-semibold text-sm line-clamp-1">{note.title}</h3>
                    {note.locked ? <Lock className="h-4 w-4 text-muted-foreground" /> : <Unlock className="h-4 w-4 text-muted-foreground" />}
                  </div>
                  <div className="flex items-center gap-2">
                    {getPermissionBadge(note.permissions)}
                    <Badge variant="outline" className="text-xs">
                      <Users className="h-3 w-3 mr-1" />
                      {note.collaborators.length + 1}
                    </Badge>
                    {note.isPublic && <Badge variant="outline" className="text-xs">Public</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    v{note.version} • {format(parseISO(note.lastEdited), 'PP')}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Note Content */}
        <div className="lg:col-span-2 space-y-4">
          {selectedNote ? (
            <>
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {isEditing ? (
                        <Input
                          value={editedTitle}
                          onChange={(e) => setEditedTitle(e.target.value)}
                          className="text-2xl font-bold mb-2"
                        />
                      ) : (
                        <CardTitle className="text-2xl">{selectedNote.title}</CardTitle>
                      )}
                      <CardDescription>
                        Last edited by {selectedNote.lastEditedBy.slice(0, 10)}... • {format(parseISO(selectedNote.lastEdited), 'PPp')} • Version {selectedNote.version}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {getPermissionBadge(selectedNote.permissions)}
                      {selectedNote.locked && <Lock className="h-5 w-5 text-muted-foreground" />}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <Textarea
                      ref={textareaRef}
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      className="min-h-[400px] font-mono text-sm"
                      placeholder="Start typing..."
                    />
                  ) : (
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <pre className="whitespace-pre-wrap font-sans">{selectedNote.content}</pre>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  {isEditing ? (
                    <>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSaveEdit}>
                        <Save className="h-4 w-4 mr-2" /> Save Changes
                      </Button>
                    </>
                  ) : (
                    <>
                      {selectedNote.permissions === 'admin' && (
                        <Button variant="outline" onClick={() => setIsShareModalOpen(true)}>
                          <Share2 className="h-4 w-4 mr-2" /> Share
                        </Button>
                      )}
                      {(selectedNote.permissions === 'edit' || selectedNote.permissions === 'admin') && !selectedNote.locked && (
                        <Button onClick={handleStartEdit}>
                          <Edit className="h-4 w-4 mr-2" /> Edit
                        </Button>
                      )}
                      {selectedNote.permissions === 'view' && (
                        <Badge variant="outline">
                          <Eye className="h-3 w-3 mr-1" /> View Only
                        </Badge>
                      )}
                    </>
                  )}
                </CardFooter>
              </Card>

              <Tabs defaultValue="collaborators" className="w-full">
                <TabsList>
                  <TabsTrigger value="collaborators">Collaborators ({selectedNote.collaborators.length + 1})</TabsTrigger>
                  <TabsTrigger value="history">Edit History</TabsTrigger>
                </TabsList>

                <TabsContent value="collaborators" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Collaborators</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {/* Owner */}
                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>{selectedNote.owner.slice(2, 4).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{selectedNote.owner.slice(0, 10)}... (Owner)</p>
                            <p className="text-xs text-muted-foreground">Created the note</p>
                          </div>
                        </div>
                        {getPermissionBadge('admin')}
                      </div>

                      {/* Collaborators */}
                      {selectedNote.collaborators.map(collab => (
                        <div key={collab.address} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={collab.avatar} />
                              <AvatarFallback>{collab.address.slice(2, 4).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">
                                {collab.username || `${collab.address.slice(0, 10)}...`}
                                {collab.isActive && <Badge className="ml-2 bg-green-500 text-white text-xs">Online</Badge>}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Added {format(parseISO(collab.addedAt), 'PP')}
                              </p>
                            </div>
                          </div>
                          {getPermissionBadge(collab.permission)}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="history" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Edit History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {editHistory.map(entry => (
                          <div key={entry.id} className="flex items-start gap-3 p-3 border rounded-lg">
                            <div className="mt-1">
                              {entry.action === 'edited' && <Edit className="h-4 w-4 text-blue-500" />}
                              {entry.action === 'shared' && <Share2 className="h-4 w-4 text-green-500" />}
                              {entry.action === 'locked' && <Lock className="h-4 w-4 text-orange-500" />}
                              {entry.action === 'created' && <CheckCircle className="h-4 w-4 text-purple-500" />}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium capitalize">{entry.action}</p>
                              <p className="text-sm text-muted-foreground">{entry.changes}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                By {entry.editor.slice(0, 10)}... • {format(parseISO(entry.timestamp), 'PPp')}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-96">
                <Users className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Select a note to view and edit</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Create Note Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create Collaborative Note</DialogTitle>
            <DialogDescription>Start a new note that you can share with others</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="newTitle">Title *</Label>
              <Input
                id="newTitle"
                value={newNote.title}
                onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter note title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newContent">Content *</Label>
              <Textarea
                id="newContent"
                value={newNote.content}
                onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Start writing..."
                rows={8}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPublic"
                checked={newNote.isPublic}
                onChange={(e) => setNewNote(prev => ({ ...prev, isPublic: e.target.checked }))}
              />
              <Label htmlFor="isPublic">Make this note publicly viewable</Label>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleCreateNote}>Create Note</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share Modal */}
      <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Share Note</DialogTitle>
            <DialogDescription>Invite collaborators to work on this note</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="collaboratorAddress">Wallet Address</Label>
              <Input
                id="collaboratorAddress"
                value={newCollaboratorAddress}
                onChange={(e) => setNewCollaboratorAddress(e.target.value)}
                placeholder="0x..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="permission">Permission Level</Label>
              <Select value={newCollaboratorPermission} onValueChange={(value: 'view' | 'edit') => setNewCollaboratorPermission(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="view">View Only</SelectItem>
                  <SelectItem value="edit">Can Edit</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddCollaborator}>
              <UserPlus className="h-4 w-4 mr-2" /> Add Collaborator
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Alert className="bg-blue-50 dark:bg-blue-950">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-800 dark:text-blue-300">Decentralized Collaboration</AlertTitle>
        <AlertDescription className="text-blue-800 dark:text-blue-300">
          All notes are stored on decentralized networks with version control. Changes are synced in real-time across all collaborators.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default CollaborativeNotes;

