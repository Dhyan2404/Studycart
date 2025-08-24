
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import CountUp from 'react-countup';
import Cookies from 'js-cookie';

import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const OrderSchema = z.object({
  surname: z.string().trim().min(1, 'Surname is required.'),
  name: z.string().trim().min(1, 'Name is required.'),
  fatherName: z.string().trim().min(1, "Father's name is required."),
  email: z.string().email('Invalid email address.'),
  whatsapp: z.string().regex(/^\d{10}$/, 'WhatsApp number must be 10 digits.'),
});

type OrderFormData = z.infer<typeof OrderSchema>;

export function CheckoutForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OrderFormData>({
    resolver: zodResolver(OrderSchema),
  });

  const onSubmit: SubmitHandler<OrderFormData> = async (data) => {
    setIsSubmitting(true);
    const visitorId = Cookies.get('visitorId') || null;

    try {
      const orderData = {
        Name: `${data.surname} ${data.name} ${data.fatherName}`.trim(),
        email: data.email,
        number: data.whatsapp,
        price: 200,
        Paid: false,
        orderStatus: 'Pending',
        paymentType: 'Online',
        screenshotUrl: null,
        createdAt: serverTimestamp(),
        visitorId: visitorId, // Save visitorId directly in the order
        quantity: 1,
      };

      await addDoc(collection(db, 'User'), orderData);

      router.push('/confirmation?status=manual_verification');

    } catch (error) {
      console.error("Error creating order:", error);
      toast({
        title: "Error",
        description: "There was a problem submitting your order. Please try again or contact us.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="surname">Surname</Label>
          <Input id="surname" {...register('surname')} type="text" placeholder="e.g. Patel" />
          {errors.surname && <p className="mt-2 text-sm text-destructive">{errors.surname.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...register('name')} type="text" placeholder="e.g. Rohan" />
          {errors.name && <p className="mt-2 text-sm text-destructive">{errors.name.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="fatherName">Father's Name</Label>
          <Input id="fatherName" {...register('fatherName')} type="text" placeholder="e.g. Kumar" />
          {errors.fatherName && <p className="mt-2 text-sm text-destructive">{errors.fatherName.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input id="email" {...register('email')} type="email" placeholder="john.doe@example.com" />
        {errors.email && <p className="mt-2 text-sm text-destructive">{errors.email.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="whatsapp">WhatsApp Number</Label>
        <Input id="whatsapp" {...register('whatsapp')} type="tel" placeholder="10-digit number" />
        {errors.whatsapp && <p className="mt-2 text-sm text-destructive">{errors.whatsapp.message}</p>}
      </div>
      
      <div className="text-center bg-background/50 rounded-lg p-4 border border-border">
        <p className="text-muted-foreground font-medium">TOTAL PRICE</p>
        <div className="font-headline text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-400 to-green-400 animate-gradient-shift bg-[200%_auto]">
          {isClient ? <CountUp start={0} end={200} prefix="₹" duration={0.5} /> : '₹200'}
        </div>
      </div>

      <div className="space-y-3 text-center bg-secondary/20 rounded-lg p-4 border border-primary/20">
        <p className="font-headline text-lg font-semibold text-primary">Online Payment Details</p>
        <p className="text-muted-foreground text-sm">Please pay the total amount using the details below. After payment, submit your details here. You will be asked to send the screenshot on the next page.</p>
        <div className="font-mono text-foreground text-base space-y-1 pt-2 bg-background/50 rounded-md py-3">
          <p><strong>UPI ID:</strong> dhyan20190@oksbi</p>
          <p><strong>Phone Number:</strong> 8160365250</p>
        </div>
      </div>
      
      <Button type="submit" className="w-full text-lg font-bold py-6" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CheckCircle className="mr-2 h-5 w-5" />
            Submit Details
          </>
        )}
      </Button>
    </form>
  );
}
