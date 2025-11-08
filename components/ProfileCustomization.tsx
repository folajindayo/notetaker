import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { User, Palette, Image, Link as LinkIcon, Save, Upload, Info, X, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Separator } from './ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';

interface ProfileData {
  username: string;
  displayName: string;
  bio: string;
  avatar: string;
  banner: string;
  location: string;
  website: string;
  twitter: string;
  theme: 'light' | 'dark' | 'auto';
  nftAvatar?: {
    tokenId: string;
    contractAddress: string;
    image: string;
  };
  customColors: {
    primary: string;
    accent: string;
  };
  badges: string[];
  verified: boolean;
}

const ProfileCustomization: React.FC = () => {
  const { address, isConnected } = useAccount();
  const [profile, setProfile] = useState<ProfileData>({
    username: 'noteboard_user',
    displayName: 'NoteBoard User',
    bio: 'Web3 enthusiast and content creator',
    avatar: '',
    banner: '',
    location: '',
    website: '',
    twitter: '',
    theme: 'auto',
    customColors: {
      primary: '#3b82f6',
      accent: '#8b5cf6',
    },
    badges: [],
    verified: false,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [bannerPreview, setBannerPreview] = useState<string>('');

  useEffect(() => {
    if (isConnected && address) {
      fetchProfileData(address);
    }
  }, [address, isConnected]);

  const fetchProfileData = async (userAddress: string) => {
    // In a real application, this would fetch from IPFS or blockchain
    console.log(`Fetching profile for ${userAddress}...`);
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const handleInputChange = (field: keyof ProfileData, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleColorChange = (colorType: 'primary' | 'accent', value: string) => {
    setProfile(prev => ({
      ...prev,
      customColors: {
        ...prev.customColors,
        [colorType]: value,
      },
    }));
  };

  const handleImageUpload = (type: 'avatar' | 'banner', file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      if (type === 'avatar') {
        setAvatarPreview(result);
        handleInputChange('avatar', result);
      } else {
        setBannerPreview(result);
        handleInputChange('banner', result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setIsSaving(true);
    console.log('Saving profile:', profile);

    try {
      // In a real application, this would:
      // 1. Upload images to IPFS
      // 2. Store profile metadata on-chain or IPFS
      // 3. Update profile contract
      await new Promise(resolve => setTimeout(resolve, 2000));

      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to save profile:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isConnected) {
    return (
      <Alert className="bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300">
        <Info className="h-4 w-4" />
        <AlertTitle>Wallet Not Connected</AlertTitle>
        <AlertDescription>Connect your wallet to customize your profile.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center">
          <User className="h-8 w-8 mr-3 text-primary" /> Profile Customization
        </h1>
        <p className="text-muted-foreground mt-1">
          Personalize your profile with custom settings and appearance
        </p>
      </div>

      {/* Profile Preview */}
      <Card className="overflow-hidden">
        <div 
          className="h-48 bg-gradient-to-r from-blue-500 to-purple-500 relative"
          style={{
            background: profile.banner || `linear-gradient(to right, ${profile.customColors.primary}, ${profile.customColors.accent})`,
          }}
        >
          {bannerPreview && (
            <img src={bannerPreview} alt="Banner" className="w-full h-full object-cover" />
          )}
        </div>
        <CardContent className="pt-20 pb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="relative -mt-16">
                <Avatar className="h-32 w-32 border-4 border-background">
                  <AvatarImage src={avatarPreview || profile.avatar} />
                  <AvatarFallback className="text-3xl">
                    {profile.displayName[0] || profile.username[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
                {profile.verified && (
                  <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1 border-2 border-background">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  {profile.displayName || profile.username}
                  {profile.verified && <Badge className="bg-blue-500">Verified</Badge>}
                </h2>
                <p className="text-muted-foreground">@{profile.username}</p>
                {profile.bio && <p className="mt-2">{profile.bio}</p>}
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  {profile.location && <span>📍 {profile.location}</span>}
                  {profile.website && (
                    <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:underline">
                      <LinkIcon className="h-4 w-4" /> Website
                    </a>
                  )}
                  {profile.twitter && (
                    <a href={`https://twitter.com/${profile.twitter}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:underline">
                      🐦 Twitter
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList>
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="social">Social Links</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Update your profile details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={profile.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  placeholder="username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  value={profile.displayName}
                  onChange={(e) => handleInputChange('displayName', e.target.value)}
                  placeholder="Your display name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Tell us about yourself"
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={profile.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="City, Country"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="avatar">Profile Picture</Label>
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={avatarPreview || profile.avatar} />
                    <AvatarFallback>{profile.displayName[0] || 'U'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <Input
                      id="avatar"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload('avatar', file);
                      }}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById('avatar')?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" /> Upload Avatar
                    </Button>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="banner">Banner Image</Label>
                <div className="flex items-center gap-4">
                  <div className="h-24 w-48 bg-muted rounded-md overflow-hidden">
                    {bannerPreview && (
                      <img src={bannerPreview} alt="Banner" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div>
                    <Input
                      id="banner"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload('banner', file);
                      }}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById('banner')?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" /> Upload Banner
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>Customize your profile's look and feel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Select
                  value={profile.theme}
                  onValueChange={(value: 'light' | 'dark' | 'auto') => handleInputChange('theme', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="auto">Auto (System)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="space-y-4">
                <Label>Custom Colors</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primaryColor">Primary Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="primaryColor"
                        type="color"
                        value={profile.customColors.primary}
                        onChange={(e) => handleColorChange('primary', e.target.value)}
                        className="w-20 h-10"
                      />
                      <Input
                        value={profile.customColors.primary}
                        onChange={(e) => handleColorChange('primary', e.target.value)}
                        placeholder="#3b82f6"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accentColor">Accent Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="accentColor"
                        type="color"
                        value={profile.customColors.accent}
                        onChange={(e) => handleColorChange('accent', e.target.value)}
                        className="w-20 h-10"
                      />
                      <Input
                        value={profile.customColors.accent}
                        onChange={(e) => handleColorChange('accent', e.target.value)}
                        placeholder="#8b5cf6"
                      />
                    </div>
                  </div>
                </div>
                <div 
                  className="p-4 rounded-lg border"
                  style={{
                    background: `linear-gradient(to right, ${profile.customColors.primary}, ${profile.customColors.accent})`,
                  }}
                >
                  <p className="text-white font-medium">Preview</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Social Links</CardTitle>
              <CardDescription>Connect your social media profiles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={profile.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="https://yourwebsite.com"
                  type="url"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter/X</Label>
                <Input
                  id="twitter"
                  value={profile.twitter}
                  onChange={(e) => handleInputChange('twitter', e.target.value)}
                  placeholder="@username"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardFooter className="flex justify-end">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Save className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProfileCustomization;

