// This file is no longer used for storing orders, 
// as they are now managed in Firestore.
// It is kept to prevent breaking imports in other files that are not yet updated.

import type { Order } from './types';

export const orders: Order[] = [];
