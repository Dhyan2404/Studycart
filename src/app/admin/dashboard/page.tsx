
'use client';

import { useState } from 'react';
import { SalesSummary } from '@/components/admin/SalesSummary';
import { OrderTable } from '@/components/admin/OrderTable';
import { Button } from '@/components/ui/button';
import { AddOrderForm } from '@/components/admin/AddOrderForm';
import { PlusCircle } from 'lucide-react';

export default function DashboardPage() {
  const [isAddOrderOpen, setIsAddOrderOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
         <div>
            <h1 className="text-3xl font-bold font-headline tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
            An overview of your sales and customer orders.
            </p>
        </div>
        <AddOrderForm open={isAddOrderOpen} onOpenChange={setIsAddOrderOpen}>
            <Button onClick={() => setIsAddOrderOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Order
            </Button>
        </AddOrderForm>
      </div>
      <SalesSummary />
      <OrderTable />
    </div>
  );
}
