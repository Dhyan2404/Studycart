
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
        <Card className="w-full max-w-md bg-secondary/20 border-primary/20 shadow-lg shadow-primary/10">
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-3xl">Contact Us</CardTitle>
            <CardDescription>
              Have questions? We&apos;re here to help!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <Button asChild className="w-full py-6 text-lg">
                <Link href="mailto:support@solutioncart.com">
                    <Mail className="mr-2 h-5 w-5" />
                    Send us an Email
                </Link>
             </Button>
             <Button asChild variant="secondary" className="w-full py-6 text-lg">
                <Link href="https://wa.me/918160365250" target="_blank">
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Chat on WhatsApp
                </Link>
             </Button>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
