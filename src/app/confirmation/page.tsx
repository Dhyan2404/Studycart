
import Link from 'next/link';
import { cookies } from 'next/headers';
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import type { Order } from '@/lib/types';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Clock, AlertTriangle, MessageCircle, KeyRound } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const Confetti = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {Array.from({ length: 100 }).map((_, i) => (
      <div
        key={i}
        className="confetti"
        style={{
          left: `${Math.random() * 100}%`,
          animationDuration: `${Math.random() * 3 + 2}s`,
          animationDelay: `${Math.random() * 5}s`,
          backgroundColor: `hsl(${Math.random() * 360}, 100%, 50%)`,
        }}
      />
    ))}
  </div>
);

async function getOrderDetails(): Promise<Order | null> {
  const cookieStore = cookies();
  const visitorId = cookieStore.get('visitorId')?.value;

  if (!visitorId) {
    return null;
  }

  try {
    const q = query(
      collection(db, 'User'),
      where('visitorId', '==', visitorId),
      orderBy('createdAt', 'desc'),
      limit(1)
    );
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
        const latestOrderDoc = querySnapshot.docs[0];
        return {
            id: latestOrderDoc.id,
            ...latestOrderDoc.data(),
        } as Order;
    }

    return null;
  } catch (error) {
    console.error("Error fetching order details for confirmation:", error);
    return null;
  }
}

export default async function ConfirmationPage() {
  const order = await getOrderDetails();

  const whatsAppMessage = order
    ? `Hello! I have placed an order and I'm sending my payment screenshot. My Name Is : ${order.Name}`
    : `Hello! I have placed an order and I'm sending my payment screenshot.`;
  
  const whatsappUrl = `https://wa.me/918140404243?text=${encodeURIComponent(whatsAppMessage)}`;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
        <Card className="w-full max-w-lg text-center bg-secondary/20 border-primary/20 shadow-lg shadow-primary/10 relative overflow-hidden">
          <Confetti />
          <CardHeader>
            <CardTitle className="flex flex-col items-center gap-4 text-2xl font-headline relative z-10">
              <Clock className="h-16 w-16 text-primary" />
              <span>Order Received! Check Your WhatsApp.</span>
            </CardTitle>
             <CardDescription className="text-lg text-muted-foreground pt-2">
              Your order details have been saved.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 relative z-10">
            <div className="bg-primary/10 p-6 rounded-lg border-2 border-primary/30">
              <h3 className="font-bold text-primary text-2xl flex items-center justify-center gap-2"><KeyRound /> What Happens Next?</h3>
              <p className="text-muted-foreground mt-4 text-lg">
                After you send your payment screenshot, we will verify it within <strong>6 hours</strong>. Once verified, you will receive a <strong>website link and a unique code</strong> on WhatsApp.
              </p>
               <p className="text-muted-foreground mt-2 font-semibold text-lg">
                Go to the website and enter the code to unlock your PDF!
              </p>
              <Button asChild className="mt-6 text-lg py-6">
                  <Link href={whatsappUrl} target="_blank">
                      <MessageCircle className="mr-2 h-5 w-5" />
                      Send Screenshot on WhatsApp
                  </Link>
              </Button>
            </div>

            <div className="bg-destructive/10 border-l-4 border-destructive text-destructive-foreground p-4 text-left rounded-r-lg">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-6 w-6" />
                  <p className="font-bold">Important Notice</p>
                </div>
                <p className="text-sm mt-1">Once placed, orders cannot be cancelled under any circumstances.</p>
            </div>
            
            <Button asChild variant="outline">
              <Link href="/">Back to Homepage</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
