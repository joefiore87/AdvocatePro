'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { getUserSubscription, SubscriptionData } from '@/lib/firestore';
import { getRemainingDays } from '@/lib/subscription';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarClock } from 'lucide-react';

export function SubscriptionStatus() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSubscription() {
      if (!user?.email) return;
      
      try {
        const subscriptionData = await getUserSubscription(user.email);
        setSubscription(subscriptionData);
      } catch (error) {
        console.error('Error fetching subscription:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchSubscription();
  }, [user]);

  if (loading) {
    return <div>Loading subscription details...</div>;
  }

  if (!subscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarClock className="h-5 w-5" />
            Subscription Status
          </CardTitle>
          <CardDescription>
            You don't have an active subscription
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => window.location.href = "/purchase"}>
            Purchase Access
          </Button>
        </CardContent>
      </Card>
    );
  }

  const remainingDays = getRemainingDays(subscription.expirationDate);
  const expirationDate = new Date(subscription.expirationDate).toLocaleDateString();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarClock className="h-5 w-5" />
          Subscription Status
        </CardTitle>
        <CardDescription>
          Your toolkit access details
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Access expires on: <span className="font-medium text-foreground">{expirationDate}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Days remaining: <span className="font-medium text-foreground">{remainingDays}</span>
          </p>
          {remainingDays < 30 && (
            <div className="mt-4">
              <Button onClick={() => window.location.href = "/purchase"}>
                Renew Access
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}