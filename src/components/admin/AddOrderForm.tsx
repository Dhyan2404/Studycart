
'use client';

import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const AdminOrderSchema = z.object({
    customerName: z.string().trim().min(1, "Customer name is required."),
    customerEmail: z.string().email("Invalid email address."),
    customerWhatsApp: z.string().regex(/^\d{10}$/, 'WhatsApp number must be 10 digits.'),
    quantity: z.coerce.number().int().min(1),
    paymentStatus: z.enum(['Pending', 'Paid']),
});

type AdminOrderFormData = z.infer<typeof AdminOrderSchema>;

interface AddOrderFormProps {
    children: React.ReactNode;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AddOrderForm({ children, open, onOpenChange }: AddOrderFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<AdminOrderFormData>({
    resolver: zodResolver(AdminOrderSchema),
    defaultValues: {
      quantity: 1,
      paymentStatus: 'Pending',
    }
  });

  const onSubmit = async (data: AdminOrderFormData) => {
    setIsSubmitting(true);
    const basePrice = 200;
    const totalPrice = basePrice * data.quantity;

    try {
        await addDoc(collection(db, 'User'), {
            Name: data.customerName,
            email: data.customerEmail,
            number: data.customerWhatsApp,
            quantity: data.quantity,
            price: totalPrice,
            Paid: data.paymentStatus === 'Paid',
            orderStatus: 'Pending',
            paymentType: 'Admin',
            screenshotUrl: null,
            createdAt: serverTimestamp(),
            visitorId: null,
        });
        
        toast({ title: "Success!", description: "Order created successfully!" });
        onOpenChange(false);
        reset();
    } catch (error) {
        console.error("Error creating admin order:", error);
        toast({ title: "Error", description: 'Database Error: Failed to create order.', variant: 'destructive' });
    } finally {
        setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
        onOpenChange(isOpen);
        if (!isOpen) {
            reset();
        }
    }}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Order</DialogTitle>
          <DialogDescription>
            Manually enter the details for a new order. Click create when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="customerName">Full Name</Label>
            <Input id="customerName" {...register("customerName")} placeholder="e.g. Patel Rohan Kumar" />
            {errors?.customerName && <p className="text-sm text-destructive">{errors.customerName.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="customerEmail">Email</Label>
            <Input id="customerEmail" {...register("customerEmail")} type="email" placeholder="e.g. user@example.com" />
            {errors?.customerEmail && <p className="text-sm text-destructive">{errors.customerEmail.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="customerWhatsApp">WhatsApp Number</Label>
            <Input id="customerWhatsApp" {...register("customerWhatsApp")} type="tel" placeholder="10-digit number" />
            {errors?.customerWhatsApp && <p className="text-sm text-destructive">{errors.customerWhatsApp.message}</p>}
          </div>
           <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input id="quantity" {...register("quantity")} type="number" min="1" />
               {errors?.quantity && <p className="text-sm text-destructive">{errors.quantity.message}</p>}
            </div>
            <div className="space-y-2">
                <Label>Payment Status</Label>
                 <RadioGroup defaultValue="Pending" onValueChange={(value) => setValue('paymentStatus', value as 'Pending' | 'Paid')}>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Pending" id="r-pending" />
                        <Label htmlFor="r-pending">Pending</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Paid" id="r-paid" />
                        <Label htmlFor="r-paid">Paid</Label>
                    </div>
                </RadioGroup>
                {errors?.paymentStatus && <p className="text-sm text-destructive">{errors.paymentStatus.message}</p>}
            </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? 'Creating...' : 'Create Order'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
