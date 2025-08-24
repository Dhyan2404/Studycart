
'use server';

import type { Timestamp } from 'firebase/firestore';

export type Order = {
  id: string; 
  Name: string; 
  email: string;
  number: string;
  price: number; 
  Paid: boolean; 
  screenshotUrl?: string;
  orderStatus: 'Pending' | 'Delivered';
  paymentType: 'Online' | 'Booking' | 'Admin';
  createdAt: Timestamp | Date | null;
  visitorId?: string | null;
  quantity?: number;
};

export type DiscountCode = {
  id: string;
  code: string;
  orderId: string;
  used: boolean;
  createdAt: Timestamp | Date;
  usedAt?: Timestamp | Date;
}

export type SalesSummary = {
  daily: {
    total: number;
    count: number;
    profit: number;
  };
  monthly: {
    total: number;
    count: number;
    profit: number;
  };
};
