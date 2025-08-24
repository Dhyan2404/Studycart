
'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy, doc, updateDoc, Timestamp } from 'firebase/firestore';
import type { Order } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ExternalLink, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


function OrderRow({ order }: { order: Order }) {
  const { toast } = useToast();
  
  const markAsPaid = async () => {
    try {
      const orderRef = doc(db, 'User', order.id);
      await updateDoc(orderRef, { Paid: true });
      toast({ title: 'Success', description: `Order marked as Paid.` });
    } catch (error) {
      console.error("Error updating order status: ", error);
      toast({ title: 'Error', description: 'Could not update order status.', variant: 'destructive' });
    }
  };

  const getPaymentBadgeVariant = (isPaid: boolean) => {
    return isPaid ? 'default' : 'destructive';
  };

  return (
    <TableRow>
      <TableCell>
        <div className="font-medium">{order.Name}</div>
        <div className="text-sm text-muted-foreground">{order.email}</div>
        <div className="text-sm text-muted-foreground">{order.number}</div>
        <div className="text-xs text-muted-foreground pt-1">
          {order.createdAt ? format(order.createdAt as Date, 'PPP p') : 'N/A'}
        </div>
      </TableCell>
      <TableCell>
        <div className="font-bold">₹{order.price}</div>
        <Badge variant={getPaymentBadgeVariant(order.Paid)}>
          {order.Paid ? 'Paid' : 'Pending'}
        </Badge>
        {order.screenshotUrl && (
          <Button asChild variant="link" className="p-0 h-auto text-xs mt-1">
            <a href={order.screenshotUrl} target="_blank" rel="noopener noreferrer">
              View Screenshot <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          </Button>
        )}
      </TableCell>
      <TableCell className="text-right">
        {!order.Paid && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={markAsPaid}>
                <CreditCard className="mr-2 h-4 w-4" />
                Mark as Paid
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </TableCell>
    </TableRow>
  );
}


export function OrderTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const q = query(collection(db, 'User'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const ordersData: Order[] = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        const createdAt = data.createdAt instanceof Timestamp 
          ? data.createdAt.toDate() 
          : (data.createdAt && new Date(data.createdAt)) || null;

        return {
          id: doc.id,
          ...data,
          createdAt: createdAt,
        } as Order;
      });
      
      setOrders(ordersData);
      setLoading(false);
    }, (error) => {
        console.error("Error fetching orders:", error);
        toast({ title: 'Error Fetching Orders', description: 'Could not load order data. Please check Firestore rules and configuration.', variant: 'destructive' });
        setLoading(false);
    });

    return () => unsubscribe();
  }, [toast]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
        <CardDescription>
          A live view of all submitted orders.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer & Date</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="text-right">Manage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={3}>
                      <Skeleton className="h-12 w-full" />
                    </TableCell>
                  </TableRow>
                ))
              ) : orders.length > 0 ? (
                orders.map((order) => <OrderRow key={order.id} order={order} />)
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground py-10">
                    No orders found yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
