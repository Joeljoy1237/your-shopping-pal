import { OrderStatus } from '@/types/chat';

// Mock order database
const mockOrders: Record<string, OrderStatus> = {
  'ORD-12345': {
    orderId: 'ORD-12345',
    status: 'in-transit',
    estimatedDelivery: 'January 21, 2026',
    lastUpdate: 'January 18, 2026 at 2:30 PM',
    location: 'Distribution Center - Chicago, IL',
  },
  'ORD-67890': {
    orderId: 'ORD-67890',
    status: 'out-for-delivery',
    estimatedDelivery: 'Today by 6:00 PM',
    lastUpdate: 'January 19, 2026 at 8:15 AM',
    location: 'Local Delivery Hub - Your City',
  },
  'ORD-11111': {
    orderId: 'ORD-11111',
    status: 'processing',
    estimatedDelivery: 'January 24-26, 2026',
    lastUpdate: 'January 19, 2026 at 10:00 AM',
  },
  'ORD-22222': {
    orderId: 'ORD-22222',
    status: 'delivered',
    estimatedDelivery: 'Delivered on January 17, 2026',
    lastUpdate: 'January 17, 2026 at 3:45 PM',
  },
  'ORD-33333': {
    orderId: 'ORD-33333',
    status: 'shipped',
    estimatedDelivery: 'January 22-23, 2026',
    lastUpdate: 'January 18, 2026 at 11:00 AM',
    location: 'Departed from Warehouse - Los Angeles, CA',
  },
};

export const getOrderStatus = (orderId: string): OrderStatus | null => {
  const normalizedId = orderId.toUpperCase().trim();
  return mockOrders[normalizedId] || null;
};

export const getStatusColor = (status: OrderStatus['status']): string => {
  const colors = {
    processing: 'chat-warning',
    shipped: 'chat-info',
    'in-transit': 'chat-info',
    'out-for-delivery': 'primary',
    delivered: 'chat-success',
  };
  return colors[status] || 'muted';
};

export const getStatusLabel = (status: OrderStatus['status']): string => {
  const labels = {
    processing: 'Processing',
    shipped: 'Shipped',
    'in-transit': 'In Transit',
    'out-for-delivery': 'Out for Delivery',
    delivered: 'Delivered',
  };
  return labels[status] || status;
};
