
'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, Timestamp } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IndianRupee, ShoppingBag, TrendingUp, Wallet } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { SalesSummary as SalesSummaryType } from '@/lib/types';
import CountUp from 'react-countup';

const PROFIT_MARGIN_PER_SALE = 0;

export function SalesSummary() {
  const [summary, setSummary] = useState<SalesSummaryType>({
    daily: { total: 0, count: 0, profit: 0 },
    monthly: { total: 0, count: 0, profit: 0 },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const q = query(
        collection(db, 'User') // CORRECTED: Was 'SalesData', now correctly 'User'
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let dailyTotal = 0;
      let dailyCount = 0;
      let monthlyTotal = 0;
      let monthlyCount = 0;

      querySnapshot.forEach((doc) => {
        const order = doc.data();
        // Ensure createdAt exists and is a Timestamp before converting
        if (order.createdAt && order.createdAt instanceof Timestamp) {
            const createdAt = order.createdAt.toDate();

            // Monthly calculation
            if (createdAt >= startOfMonth) {
              monthlyTotal += order.price || 0;
              monthlyCount++;
            }

            // Daily calculation
            if (createdAt >= startOfToday) {
                dailyTotal += order.price || 0;
                dailyCount++;
            }
        }
      });
      
      setSummary({
          daily: { total: dailyTotal, count: dailyCount, profit: dailyTotal - (dailyCount * PROFIT_MARGIN_PER_SALE) },
          monthly: { total: monthlyTotal, count: monthlyCount, profit: monthlyTotal - (monthlyCount * PROFIT_MARGIN_PER_SALE) },
      });
      setLoading(false);
    }, (error) => {
        console.error("Error fetching sales summary:", error);
        setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
        </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Today's Turnover</CardTitle>
          <IndianRupee className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <CountUp prefix="₹" end={summary.daily.total} duration={1.5} />
          </div>
          <p className="text-xs text-muted-foreground">from {summary.daily.count} sales</p>
        </CardContent>
      </Card>
       <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Today's Profit</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <CountUp prefix="₹" end={summary.daily.profit} duration={1.5} />
          </div>
           <p className="text-xs text-muted-foreground">({summary.daily.count} sales)</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">This Month's Turnover</CardTitle>
          <ShoppingBag className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
             <CountUp prefix="₹" end={summary.monthly.total} duration={1.5} />
          </div>
          <p className="text-xs text-muted-foreground">from {summary.monthly.count} sales</p>
        </CardContent>
      </Card>
       <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">This Month's Profit</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <CountUp prefix="₹" end={summary.monthly.profit} duration={1.5} />
          </div>
          <p className="text-xs text-muted-foreground">from {summary.monthly.count} sales</p>
        </CardContent>
      </Card>
    </div>
  );
}
