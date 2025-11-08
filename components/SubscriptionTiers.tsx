import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { CheckCircle, Crown, Zap, Star, Info, CreditCard, Calendar } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { format, parseISO, addMonths } from 'date-fns';

interface SubscriptionTier {
  id: string;
  name: string;
  price: string;
  currency: 'ETH' | 'USDC' | 'NOTE';
  period: 'monthly' | 'yearly';
  features: string[];
  popular?: boolean;
  icon: React.ReactNode;
  color: string;
}

interface UserSubscription {
  tier: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'cancelled';
  autoRenew: boolean;
  paymentMethod: string;
}

const subscriptionTiers: SubscriptionTier[] = [
  {
    id: 'free',
    name: 'Free',
    price: '0',
    currency: 'ETH',
    period: 'monthly',
    features: [
      'Basic note posting',
      'Up to 100 followers',
      'Standard analytics',
      'Community access',
      'Basic support',
    ],
    icon: <Star className="h-6 w-6" />,
    color: 'from-gray-400 to-gray-600',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '0.01',
    currency: 'ETH',
    period: 'monthly',
    features: [
      'Everything in Free',
      'Unlimited followers',
      'Advanced analytics',
      'Priority support',
      'Custom themes',
      'Ad-free experience',
      'Early feature access',
    ],
    popular: true,
    icon: <Zap className="h-6 w-6" />,
    color: 'from-blue-400 to-blue-600',
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '0.05',
    currency: 'ETH',
    period: 'monthly',
    features: [
      'Everything in Pro',
      'NFT profile pictures',
      'Exclusive badges',
      'Revenue sharing',
      'VIP community access',
      '1-on-1 support',
      'Custom domain',
      'API access',
    ],
    icon: <Crown className="h-6 w-6" />,
    color: 'from-yellow-400 to-yellow-600',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '0.2',
    currency: 'ETH',
    period: 'monthly',
    features: [
      'Everything in Premium',
      'White-label solution',
      'Dedicated account manager',
      'Custom integrations',
      'Advanced security',
      'Team collaboration tools',
      'Analytics dashboard',
      'Priority support 24/7',
    ],
    icon: <Crown className="h-6 w-6" />,
    color: 'from-purple-400 to-purple-600',
  },
];

const SubscriptionTiers: React.FC = () => {
  const { address, isConnected } = useAccount();
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier | null>(null);
  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  useEffect(() => {
    if (isConnected && address) {
      fetchUserSubscription(address);
    }
  }, [address, isConnected]);

  const fetchUserSubscription = async (userAddress: string) => {
    // In a real application, this would check on-chain subscription status
    console.log(`Fetching subscription for ${userAddress}...`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Mock: user has free tier
    setUserSubscription({
      tier: 'free',
      startDate: new Date().toISOString(),
      endDate: addMonths(new Date(), 1).toISOString(),
      status: 'active',
      autoRenew: false,
      paymentMethod: 'none',
    });
  };

  const handleSubscribe = async () => {
    if (!selectedTier || !isConnected) {
      alert('Please connect your wallet to subscribe.');
      return;
    }

    setIsSubscribing(true);
    console.log(`Subscribing to ${selectedTier.name} tier...`);

    try {
      // In a real application, this would involve:
      // 1. Approve token spending
      // 2. Call subscription contract
      // 3. Process payment
      // 4. Activate subscription
      await new Promise(resolve => setTimeout(resolve, 3000));

      const endDate = billingPeriod === 'monthly' 
        ? addMonths(new Date(), 1)
        : addMonths(new Date(), 12);

      setUserSubscription({
        tier: selectedTier.id,
        startDate: new Date().toISOString(),
        endDate: endDate.toISOString(),
        status: 'active',
        autoRenew: true,
        paymentMethod: 'crypto',
      });

      setIsSubscribeModalOpen(false);
      alert(`Successfully subscribed to ${selectedTier.name} tier!`);
    } catch (error) {
      console.error('Subscription failed:', error);
      alert('Subscription failed. Please try again.');
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!userSubscription) return;

    if (confirm('Are you sure you want to cancel your subscription?')) {
      console.log('Cancelling subscription...');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setUserSubscription({
        ...userSubscription,
        status: 'cancelled',
        autoRenew: false,
      });
      alert('Subscription cancelled. You will retain access until the end of your billing period.');
    }
  };

  const getCurrentTier = () => {
    if (!userSubscription) return null;
    return subscriptionTiers.find(t => t.id === userSubscription.tier);
  };

  const calculatePrice = (tier: SubscriptionTier) => {
    if (tier.id === 'free') return '0';
    const basePrice = parseFloat(tier.price);
    if (billingPeriod === 'yearly') {
      return (basePrice * 12 * 0.8).toFixed(3); // 20% discount for yearly
    }
    return tier.price;
  };

  const currentTier = getCurrentTier();

  if (!isConnected) {
    return (
      <Alert className="bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300">
        <Info className="h-4 w-4" />
        <AlertTitle>Wallet Not Connected</AlertTitle>
        <AlertDescription>Connect your wallet to view and manage your subscription.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center">
          <Crown className="h-8 w-8 mr-3 text-primary" /> Subscription Tiers
        </h1>
        <p className="text-muted-foreground mt-1">
          Choose a plan that fits your needs and unlock premium features
        </p>
      </div>

      {/* Current Subscription */}
      {userSubscription && currentTier && (
        <Card className={`bg-gradient-to-br ${currentTier.color} text-white`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  {currentTier.icon}
                  Current Plan: {currentTier.name}
                </CardTitle>
                <CardDescription className="text-white/80 mt-2">
                  {userSubscription.status === 'active' ? (
                    <>
                      Active until {format(parseISO(userSubscription.endDate), 'PPP')}
                      {userSubscription.autoRenew && ' • Auto-renewal enabled'}
                    </>
                  ) : (
                    'Subscription cancelled'
                  )}
                </CardDescription>
              </div>
              {userSubscription.status === 'active' && (
                <Button
                  variant="secondary"
                  onClick={handleCancelSubscription}
                >
                  Cancel Subscription
                </Button>
              )}
            </div>
          </CardHeader>
        </Card>
      )}

      {/* Billing Period Toggle */}
      <div className="flex justify-center gap-4">
        <Button
          variant={billingPeriod === 'monthly' ? 'default' : 'outline'}
          onClick={() => setBillingPeriod('monthly')}
        >
          Monthly
        </Button>
        <Button
          variant={billingPeriod === 'yearly' ? 'default' : 'outline'}
          onClick={() => setBillingPeriod('yearly')}
        >
          Yearly <Badge className="ml-2 bg-green-500">Save 20%</Badge>
        </Button>
      </div>

      {/* Subscription Tiers */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {subscriptionTiers.map(tier => {
          const isCurrentTier = userSubscription?.tier === tier.id;
          const price = calculatePrice(tier);
          const displayPrice = billingPeriod === 'yearly' && tier.id !== 'free' 
            ? `${price} ${tier.currency}/year`
            : `${price} ${tier.currency}/${tier.period === 'monthly' ? 'month' : 'year'}`;

          return (
            <Card
              key={tier.id}
              className={`relative ${tier.popular ? 'border-2 border-primary shadow-lg' : ''} ${
                isCurrentTier ? 'bg-primary/5' : ''
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                </div>
              )}
              {isCurrentTier && (
                <div className="absolute top-2 right-2">
                  <Badge className="bg-green-500 text-white">Current</Badge>
                </div>
              )}
              <CardHeader className={`bg-gradient-to-br ${tier.color} text-white rounded-t-lg`}>
                <div className="flex items-center justify-center mb-2">
                  <div className="p-3 bg-white/20 rounded-full">
                    {tier.icon}
                  </div>
                </div>
                <CardTitle className="text-2xl text-center">{tier.name}</CardTitle>
                <div className="text-center mt-2">
                  <span className="text-3xl font-bold">{price}</span>
                  <span className="text-sm opacity-80 ml-1">
                    {tier.id === 'free' ? '' : ` ${tier.currency}`}
                  </span>
                  {tier.id !== 'free' && (
                    <p className="text-xs opacity-80 mt-1">
                      {billingPeriod === 'yearly' ? 'per year' : 'per month'}
                    </p>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-3">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                {isCurrentTier ? (
                  <Button className="w-full" variant="outline" disabled>
                    Current Plan
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    onClick={() => {
                      setSelectedTier(tier);
                      setIsSubscribeModalOpen(true);
                    }}
                    variant={tier.popular ? 'default' : 'outline'}
                  >
                    {tier.id === 'free' ? 'Current Plan' : 'Subscribe'}
                  </Button>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Subscribe Modal */}
      <Dialog open={isSubscribeModalOpen} onOpenChange={setIsSubscribeModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          {selectedTier && (
            <>
              <DialogHeader>
                <DialogTitle>Subscribe to {selectedTier.name}</DialogTitle>
                <DialogDescription>
                  Confirm your subscription to unlock premium features
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Plan</span>
                    <span className="font-bold">{selectedTier.name}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Billing Period</span>
                    <span className="font-bold capitalize">{billingPeriod}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-2xl font-bold">
                      {calculatePrice(selectedTier)} {selectedTier.currency}
                      {billingPeriod === 'yearly' && (
                        <span className="text-sm text-muted-foreground ml-1">/year</span>
                      )}
                    </span>
                  </div>
                  {billingPeriod === 'yearly' && (
                    <p className="text-sm text-green-600 mt-2">
                      💰 You save 20% with yearly billing!
                    </p>
                  )}
                </div>
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Your subscription will auto-renew unless cancelled. You can cancel anytime.
                  {billingPeriod === 'yearly' && ' Yearly subscriptions are billed upfront.'}
                  </AlertDescription>
                </Alert>
              </div>
              <DialogFooter>
                <Button onClick={handleSubscribe} disabled={isSubscribing} className="w-full">
                  {isSubscribing ? (
                    <>
                      <CreditCard className="h-4 w-4 mr-2 animate-pulse" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Confirm Subscription
                    </>
                  )}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Alert className="bg-blue-50 dark:bg-blue-950">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-800 dark:text-blue-300">Flexible Subscriptions</AlertTitle>
        <AlertDescription className="text-blue-800 dark:text-blue-300">
          All subscriptions are managed on-chain for transparency. You can upgrade, downgrade, or cancel at any time. Payments are processed in crypto for instant activation.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default SubscriptionTiers;

