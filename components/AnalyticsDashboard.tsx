import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { BarChart3, TrendingUp, TrendingDown, Users, Eye, Heart, MessageSquare, Share2, DollarSign, Clock, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface AnalyticsMetric {
  label: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
}

interface ContentPerformance {
  id: string;
  title: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  engagement: number;
  revenue: string;
}

const mockMetrics: AnalyticsMetric[] = [
  {
    label: 'Total Views',
    value: '125,430',
    change: 12.5,
    trend: 'up',
    icon: <Eye className="h-5 w-5" />,
  },
  {
    label: 'Total Likes',
    value: '8,942',
    change: 8.3,
    trend: 'up',
    icon: <Heart className="h-5 w-5" />,
  },
  {
    label: 'Total Comments',
    value: '1,234',
    change: -2.1,
    trend: 'down',
    icon: <MessageSquare className="h-5 w-5" />,
  },
  {
    label: 'Total Shares',
    value: '567',
    change: 15.7,
    trend: 'up',
    icon: <Share2 className="h-5 w-5" />,
  },
  {
    label: 'Followers',
    value: '5,678',
    change: 5.2,
    trend: 'up',
    icon: <Users className="h-5 w-5" />,
  },
  {
    label: 'Total Revenue',
    value: '$2,450',
    change: 22.4,
    trend: 'up',
    icon: <DollarSign className="h-5 w-5" />,
  },
];

const mockPerformanceData = [
  { date: 'Jan', views: 4000, likes: 2400, comments: 240 },
  { date: 'Feb', views: 3000, likes: 1398, comments: 180 },
  { date: 'Mar', views: 5000, likes: 2800, comments: 320 },
  { date: 'Apr', views: 4500, likes: 2500, comments: 280 },
  { date: 'May', views: 6000, likes: 3800, comments: 450 },
  { date: 'Jun', views: 5500, likes: 3200, comments: 380 },
  { date: 'Jul', views: 7000, likes: 4200, comments: 520 },
];

const mockTopContent: ContentPerformance[] = [
  {
    id: 'content_001',
    title: 'Building on Base: Complete Guide',
    views: 15000,
    likes: 1250,
    comments: 89,
    shares: 45,
    engagement: 9.2,
    revenue: '$125.50',
  },
  {
    id: 'content_002',
    title: 'Web3 Social Media Revolution',
    views: 12000,
    likes: 980,
    comments: 67,
    shares: 32,
    engagement: 8.9,
    revenue: '$98.20',
  },
  {
    id: 'content_003',
    title: 'NFT Marketplace Deep Dive',
    views: 8500,
    likes: 650,
    comments: 45,
    shares: 18,
    engagement: 8.4,
    revenue: '$65.00',
  },
];

const mockAudienceData = [
  { name: '18-24', value: 25 },
  { name: '25-34', value: 40 },
  { name: '35-44', value: 20 },
  { name: '45+', value: 15 },
];

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];

const AnalyticsDashboard: React.FC = () => {
  const { address, isConnected } = useAccount();
  const [metrics, setMetrics] = useState<AnalyticsMetric[]>(mockMetrics);
  const [timeRange, setTimeRange] = useState('30d');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isConnected && address) {
      fetchAnalytics(address);
    }
  }, [address, isConnected, timeRange]);

  const fetchAnalytics = async (userAddress: string) => {
    setLoading(true);
    // In a real application, this would fetch analytics from backend or indexer
    console.log(`Fetching analytics for ${userAddress} (${timeRange})...`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
  };

  if (!isConnected) {
    return (
      <Alert className="bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300">
        <Info className="h-4 w-4" />
        <AlertTitle>Wallet Not Connected</AlertTitle>
        <AlertDescription>Connect your wallet to view your analytics dashboard.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <BarChart3 className="h-8 w-8 mr-3 text-primary" /> Analytics Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your content performance and audience insights
          </p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
              <div className="text-muted-foreground">
                {metric.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{metric.value}</div>
              <div className="flex items-center gap-1 text-xs mt-1">
                {metric.trend === 'up' ? (
                  <TrendingUp className="h-3 w-3 text-green-600" />
                ) : metric.trend === 'down' ? (
                  <TrendingDown className="h-3 w-3 text-red-600" />
                ) : null}
                <span className={metric.trend === 'up' ? 'text-green-600' : metric.trend === 'down' ? 'text-red-600' : 'text-muted-foreground'}>
                  {metric.change > 0 ? '+' : ''}{metric.change}% from last period
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="content">Content Performance</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Over Time</CardTitle>
              <CardDescription>Views, likes, and comments trend</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="views" stroke="#8884d8" strokeWidth={2} name="Views" />
                  <Line type="monotone" dataKey="likes" stroke="#82ca9d" strokeWidth={2} name="Likes" />
                  <Line type="monotone" dataKey="comments" stroke="#ffc658" strokeWidth={2} name="Comments" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Engagement Breakdown</CardTitle>
              <CardDescription>Distribution of engagement types</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={mockPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="likes" fill="#8884d8" name="Likes" />
                  <Bar dataKey="comments" fill="#82ca9d" name="Comments" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Content</CardTitle>
              <CardDescription>Your best performing posts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockTopContent.map((content, index) => (
                  <div key={content.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 font-bold">
                        #{index + 1}
                      </div>
                      <div>
                        <p className="font-semibold">{content.title}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" /> {content.views.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="h-3 w-3" /> {content.likes.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" /> {content.comments}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{content.engagement}%</p>
                      <p className="text-sm text-muted-foreground">Engagement</p>
                      <p className="font-semibold text-green-600 mt-1">{content.revenue}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audience" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Audience Demographics</CardTitle>
              <CardDescription>Age distribution of your audience</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={mockAudienceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {mockAudienceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Peak Activity Times</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {['Monday 2-4 PM', 'Wednesday 10-12 AM', 'Friday 6-8 PM'].map((time, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                      <span className="text-sm">{time}</span>
                      <Badge variant="outline">High</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Content Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { category: 'Tutorials', percentage: 35 },
                    { category: 'News', percentage: 25 },
                    { category: 'Opinions', percentage: 20 },
                    { category: 'Other', percentage: 20 },
                  ].map((item, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{item.category}</span>
                        <span className="font-medium">{item.percentage}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;

