
'use client';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CreditCard } from 'lucide-react';
import { CheckoutForm } from '@/components/CheckoutForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-16 flex items-center justify-center">
        <div className="w-full max-w-2xl space-y-12">
          <section className="text-center">
            <h1 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-400 to-green-400 animate-gradient-shift bg-[200%_auto] mb-4">
              Assignment Solution 2025
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-xl mx-auto">
              Get your high-quality assignment solutions delivered quickly and efficiently.
            </p>
          </section>

          <section className="w-full transition-all duration-500 ease-in-out">
            <Card className="bg-secondary/20 border-primary/20 shadow-xl shadow-primary/10 animate-aura-pulse">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 font-headline text-2xl text-primary">
                  <CreditCard className="h-6 w-6" />
                  <span>Place Your Order (Base Price: ₹200)</span>
                </CardTitle>
                 <p className="pt-2 text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-400 to-green-400">
                  Fill out the details and upload your payment screenshot to confirm your order.
                </p>
              </CardHeader>
              <CardContent>
                <CheckoutForm />
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
