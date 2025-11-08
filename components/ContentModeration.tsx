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
import { Flag, AlertTriangle, CheckCircle, XCircle, Clock, Shield, Eye, Ban, MessageSquare, User, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { format, parseISO } from 'date-fns';
import { Checkbox } from './ui/checkbox';

interface Report {
  id: string;
  reportedBy: string;
  reportedContent: {
    id: string;
    type: 'note' | 'comment' | 'profile' | 'community';
    content: string;
    author: string;
  };
  reason: 'spam' | 'harassment' | 'inappropriate' | 'misinformation' | 'copyright' | 'other';
  description: string;
  status: 'pending' | 'reviewing' | 'resolved' | 'dismissed';
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  action?: 'warning' | 'content_removed' | 'user_banned' | 'no_action';
  severity: 'low' | 'medium' | 'high' | 'critical';
}

interface ModerationAction {
  id: string;
  type: 'warning' | 'content_removal' | 'temporary_ban' | 'permanent_ban';
  targetUser: string;
  targetContent?: string;
  reason: string;
  performedBy: string;
  performedAt: string;
  duration?: string; // For temporary bans
}

const mockReports: Report[] = [
  {
    id: 'rep_001',
    reportedBy: '0xReporter1',
    reportedContent: {
      id: 'note_123',
      type: 'note',
      content: 'This is spam content promoting a scam token. Click here to get rich quick!',
      author: '0xScammer',
    },
    reason: 'spam',
    description: 'This post is promoting a known scam token and trying to trick users.',
    status: 'pending',
    createdAt: '2024-07-22T10:00:00Z',
    severity: 'high',
  },
  {
    id: 'rep_002',
    reportedBy: '0xReporter2',
    reportedContent: {
      id: 'comment_456',
      type: 'comment',
      content: 'Inappropriate and harassing comment targeting another user.',
      author: '0xTroll',
    },
    reason: 'harassment',
    description: 'User is repeatedly harassing and bullying another community member.',
    status: 'reviewing',
    createdAt: '2024-07-21T14:30:00Z',
    severity: 'critical',
  },
  {
    id: 'rep_003',
    reportedBy: '0xReporter3',
    reportedContent: {
      id: 'note_789',
      type: 'note',
      content: 'False information about the Base blockchain and DeFi protocols.',
      author: '0xMisinformer',
    },
    reason: 'misinformation',
    description: 'This post contains deliberately false information that could mislead users.',
    status: 'resolved',
    createdAt: '2024-07-20T09:00:00Z',
    reviewedAt: '2024-07-21T10:00:00Z',
    reviewedBy: '0xModerator',
    action: 'content_removed',
    severity: 'medium',
  },
  {
    id: 'rep_004',
    reportedBy: '0xReporter4',
    reportedContent: {
      id: 'profile_101',
      type: 'profile',
      content: 'Profile impersonating a well-known Web3 figure.',
      author: '0xFakeAccount',
    },
    reason: 'other',
    description: 'This account is impersonating Vitalik Buterin and trying to scam users.',
    status: 'pending',
    createdAt: '2024-07-22T16:00:00Z',
    severity: 'critical',
  },
  {
    id: 'rep_005',
    reportedBy: '0xReporter5',
    reportedContent: {
      id: 'note_202',
      type: 'note',
      content: 'Minor inappropriate content that violates community guidelines.',
      author: '0xViolator',
    },
    reason: 'inappropriate',
    description: 'Content contains mildly inappropriate material.',
    status: 'dismissed',
    createdAt: '2024-07-19T11:00:00Z',
    reviewedAt: '2024-07-20T12:00:00Z',
    reviewedBy: '0xModerator',
    action: 'no_action',
    severity: 'low',
  },
];

const mockModerationActions: ModerationAction[] = [
  {
    id: 'act_001',
    type: 'content_removal',
    targetUser: '0xMisinformer',
    targetContent: 'note_789',
    reason: 'Spreading misinformation about Base blockchain',
    performedBy: '0xModerator',
    performedAt: '2024-07-21T10:00:00Z',
  },
  {
    id: 'act_002',
    type: 'temporary_ban',
    targetUser: '0xSpammer123',
    reason: 'Repeated spam violations',
    performedBy: '0xModerator',
    performedAt: '2024-07-20T15:00:00Z',
    duration: '7 days',
  },
  {
    id: 'act_003',
    type: 'warning',
    targetUser: '0xViolator',
    targetContent: 'note_202',
    reason: 'Minor community guideline violation',
    performedBy: '0xModerator',
    performedAt: '2024-07-20T12:00:00Z',
  },
];

const ContentModeration: React.FC = () => {
  const { address, isConnected } = useAccount();
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [moderationActions, setModerationActions] = useState<ModerationAction[]>(mockModerationActions);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isModerator, setIsModerator] = useState(false);
  const [newReport, setNewReport] = useState<Partial<Report>>({
    reason: 'spam',
    description: '',
  });

  useEffect(() => {
    if (isConnected && address) {
      checkModeratorStatus(address);
    }
  }, [address, isConnected]);

  const checkModeratorStatus = async (userAddress: string) => {
    // In a real application, this would check if the user has moderator role
    // Could be via smart contract role, DAO governance, or backend API
    console.log(`Checking moderator status for ${userAddress}...`);
    // Simulate check
    const isModRole = userAddress.toLowerCase().includes('mod'); // Mock logic
    setIsModerator(isModRole || Math.random() > 0.7); // Random for demo
  };

  const handleReportClick = (report: Report) => {
    setSelectedReport(report);
    setIsDetailModalOpen(true);
  };

  const handleSubmitReport = async () => {
    if (!newReport.reason || !newReport.description) {
      alert('Please fill in all required fields.');
      return;
    }
    if (!isConnected) {
      alert('Please connect your wallet to submit a report.');
      return;
    }

    const reportToSubmit: Report = {
      id: `rep_${Date.now()}`,
      reportedBy: address!,
      reportedContent: {
        id: 'content_' + Date.now(),
        type: 'note',
        content: 'Sample reported content',
        author: '0xReportedUser',
      },
      reason: newReport.reason as Report['reason'],
      description: newReport.description!,
      status: 'pending',
      createdAt: new Date().toISOString(),
      severity: 'medium',
    };

    console.log('Submitting report:', reportToSubmit);
    // Simulate blockchain transaction or backend API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setReports(prev => [reportToSubmit, ...prev]);
    setIsReportModalOpen(false);
    setNewReport({ reason: 'spam', description: '' });
    alert('Report submitted successfully! Our team will review it shortly.');
  };

  const handleReviewReport = async (reportId: string, action: Report['action']) => {
    if (!isModerator) {
      alert('Only moderators can review reports.');
      return;
    }

    console.log(`Reviewing report ${reportId} with action: ${action}`);
    // Simulate moderation action
    await new Promise(resolve => setTimeout(resolve, 1500));

    setReports(prev => prev.map(r => {
      if (r.id === reportId) {
        return {
          ...r,
          status: 'resolved',
          reviewedAt: new Date().toISOString(),
          reviewedBy: address!,
          action,
        };
      }
      return r;
    }));

    // Log moderation action
    const newAction: ModerationAction = {
      id: `act_${Date.now()}`,
      type: action === 'content_removed' ? 'content_removal' : action === 'user_banned' ? 'permanent_ban' : 'warning',
      targetUser: selectedReport?.reportedContent.author || '0xUnknown',
      targetContent: selectedReport?.reportedContent.id,
      reason: selectedReport?.description || '',
      performedBy: address!,
      performedAt: new Date().toISOString(),
    };
    setModerationActions(prev => [newAction, ...prev]);

    setIsDetailModalOpen(false);
    alert(`Report reviewed and ${action} action taken.`);
  };

  const getStatusBadge = (status: Report['status']) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Pending</Badge>;
      case 'reviewing':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">Reviewing</Badge>;
      case 'resolved':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Resolved</Badge>;
      case 'dismissed':
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">Dismissed</Badge>;
      default:
        return null;
    }
  };

  const getSeverityBadge = (severity: Report['severity']) => {
    switch (severity) {
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>;
      case 'high':
        return <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Medium</Badge>;
      case 'low':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">Low</Badge>;
      default:
        return null;
    }
  };

  const getReasonLabel = (reason: Report['reason']) => {
    const labels = {
      spam: 'Spam',
      harassment: 'Harassment',
      inappropriate: 'Inappropriate Content',
      misinformation: 'Misinformation',
      copyright: 'Copyright Violation',
      other: 'Other',
    };
    return labels[reason];
  };

  const getContentTypeIcon = (type: Report['reportedContent']['type']) => {
    switch (type) {
      case 'note': return <MessageSquare className="h-4 w-4" />;
      case 'comment': return <MessageSquare className="h-4 w-4" />;
      case 'profile': return <User className="h-4 w-4" />;
      case 'community': return <Users className="h-4 w-4" />;
      default: return <Flag className="h-4 w-4" />;
    }
  };

  if (!isConnected) {
    return (
      <Alert className="bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300">
        <Info className="h-4 w-4" />
        <AlertTitle>Wallet Not Connected</AlertTitle>
        <AlertDescription>Connect your wallet to report content or view moderation status.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Shield className="h-8 w-8 mr-3 text-primary" /> Content Moderation
          </h1>
          <p className="text-muted-foreground mt-1">
            Report inappropriate content and help keep the community safe
          </p>
        </div>
        <Button onClick={() => setIsReportModalOpen(true)}>
          <Flag className="h-4 w-4 mr-2" /> Report Content
        </Button>
      </div>

      {isModerator && (
        <Alert className="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
          <Shield className="h-4 w-4" />
          <AlertTitle>Moderator Access</AlertTitle>
          <AlertDescription>You have moderator privileges and can review reports.</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="reports" className="w-full">
        <TabsList>
          <TabsTrigger value="reports">Reports ({reports.length})</TabsTrigger>
          {isModerator && (
            <>
              <TabsTrigger value="pending">Pending ({reports.filter(r => r.status === 'pending').length})</TabsTrigger>
              <TabsTrigger value="actions">Moderation Actions ({moderationActions.length})</TabsTrigger>
            </>
          )}
        </TabsList>

        <TabsContent value="reports" className="space-y-4 mt-6">
          {reports.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-64">
                <Flag className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No reports to display.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {reports.map((report) => (
                <Card
                  key={report.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleReportClick(report)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getStatusBadge(report.status)}
                          {getSeverityBadge(report.severity)}
                          <Badge variant="outline" className="flex items-center gap-1">
                            {getContentTypeIcon(report.reportedContent.type)}
                            {report.reportedContent.type}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg">
                          {getReasonLabel(report.reason)} - {report.reportedContent.type}
                        </CardTitle>
                        <CardDescription className="mt-2">{report.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="p-3 bg-muted rounded-md mb-3">
                      <p className="text-sm text-muted-foreground mb-1">Reported Content:</p>
                      <p className="text-sm line-clamp-2">{report.reportedContent.content}</p>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Reported by: {report.reportedBy.slice(0, 10)}...</span>
                      <span>•</span>
                      <span>{format(parseISO(report.createdAt), 'PPP')}</span>
                    </div>
                  </CardContent>
                  {isModerator && report.status === 'pending' && (
                    <CardFooter className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReviewReport(report.id, 'content_removed');
                        }}
                      >
                        Remove Content
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReviewReport(report.id, 'user_banned');
                        }}
                      >
                        Ban User
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReviewReport(report.id, 'warning');
                        }}
                      >
                        Send Warning
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {isModerator && (
          <>
            <TabsContent value="pending" className="space-y-4 mt-6">
              <div className="space-y-4">
                {reports.filter(r => r.status === 'pending' || r.status === 'reviewing').map((report) => (
                  <Card
                    key={report.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-l-orange-500"
                    onClick={() => handleReportClick(report)}
                  >
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusBadge(report.status)}
                        {getSeverityBadge(report.severity)}
                      </div>
                      <CardTitle className="text-lg">
                        {getReasonLabel(report.reason)} - {report.reportedContent.type}
                      </CardTitle>
                      <CardDescription>{report.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="p-3 bg-muted rounded-md">
                        <p className="text-sm line-clamp-2">{report.reportedContent.content}</p>
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReviewReport(report.id, 'content_removed');
                        }}
                      >
                        Remove Content
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReviewReport(report.id, 'user_banned');
                        }}
                      >
                        Ban User
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReviewReport(report.id, 'no_action');
                        }}
                      >
                        Dismiss
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="actions" className="space-y-4 mt-6">
              <div className="space-y-4">
                {moderationActions.map((action) => (
                  <Card key={action.id}>
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={action.type === 'permanent_ban' ? 'destructive' : 'secondary'}>
                          {action.type.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">Action against {action.targetUser.slice(0, 10)}...</CardTitle>
                      <CardDescription>{action.reason}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>By: {action.performedBy.slice(0, 10)}...</span>
                        <span>•</span>
                        <span>{format(parseISO(action.performedAt), 'PPP p')}</span>
                        {action.duration && (
                          <>
                            <span>•</span>
                            <span>Duration: {action.duration}</span>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </>
        )}
      </Tabs>

      {/* Report Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          {selectedReport && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 mb-2">
                  {getStatusBadge(selectedReport.status)}
                  {getSeverityBadge(selectedReport.severity)}
                </div>
                <DialogTitle>{getReasonLabel(selectedReport.reason)} Report</DialogTitle>
                <DialogDescription>
                  Reported {format(parseISO(selectedReport.createdAt), 'PPP')} by {selectedReport.reportedBy.slice(0, 10)}...
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <h4 className="font-semibold mb-2">Report Description</h4>
                  <p className="text-sm text-muted-foreground">{selectedReport.description}</p>
                </div>
                <Separator />
                <div>
                  <h4 className="font-semibold mb-2">Reported Content</h4>
                  <div className="p-4 bg-muted rounded-md">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">
                        {selectedReport.reportedContent.type}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        by {selectedReport.reportedContent.author.slice(0, 10)}...
                      </span>
                    </div>
                    <p className="text-sm">{selectedReport.reportedContent.content}</p>
                  </div>
                </div>
                {selectedReport.status === 'resolved' && selectedReport.action && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-semibold mb-2">Resolution</h4>
                      <Alert className="bg-green-50 dark:bg-green-950">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800 dark:text-green-300">
                          <strong>Action taken:</strong> {selectedReport.action.replace('_', ' ')}
                          <br />
                          <strong>Reviewed by:</strong> {selectedReport.reviewedBy?.slice(0, 10)}...
                          <br />
                          <strong>Date:</strong> {selectedReport.reviewedAt && format(parseISO(selectedReport.reviewedAt), 'PPP')}
                        </AlertDescription>
                      </Alert>
                    </div>
                  </>
                )}
              </div>
              {isModerator && selectedReport.status === 'pending' && (
                <DialogFooter className="flex gap-2">
                  <Button onClick={() => handleReviewReport(selectedReport.id, 'content_removed')}>
                    Remove Content
                  </Button>
                  <Button variant="destructive" onClick={() => handleReviewReport(selectedReport.id, 'user_banned')}>
                    Ban User
                  </Button>
                  <Button variant="outline" onClick={() => handleReviewReport(selectedReport.id, 'warning')}>
                    Send Warning
                  </Button>
                </DialogFooter>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Report Content Modal */}
      <Dialog open={isReportModalOpen} onOpenChange={setIsReportModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Report Content</DialogTitle>
            <DialogDescription>
              Help us maintain a safe community by reporting inappropriate content.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reason" className="text-right">Reason</Label>
              <Select
                value={newReport.reason}
                onValueChange={(value: Report['reason']) => setNewReport(prev => ({ ...prev, reason: value }))}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="spam">Spam</SelectItem>
                  <SelectItem value="harassment">Harassment</SelectItem>
                  <SelectItem value="inappropriate">Inappropriate Content</SelectItem>
                  <SelectItem value="misinformation">Misinformation</SelectItem>
                  <SelectItem value="copyright">Copyright Violation</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">Details</Label>
              <Textarea
                id="description"
                value={newReport.description}
                onChange={(e) => setNewReport(prev => ({ ...prev, description: e.target.value }))}
                className="col-span-3"
                rows={5}
                placeholder="Please provide details about why you're reporting this content..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSubmitReport}>Submit Report</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContentModeration;

