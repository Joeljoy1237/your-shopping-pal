export type MessageType = 'text' | 'options' | 'product-results' | 'order-status' | 'quick-actions';

export interface ChatOption {
  id: string;
  label: string;
  value: string;
  icon?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  specs: string[];
}

export interface OrderStatus {
  orderId: string;
  status: 'processing' | 'shipped' | 'in-transit' | 'out-for-delivery' | 'delivered';
  estimatedDelivery: string;
  lastUpdate: string;
  location?: string;
}

export interface ChatMessage {
  id: string;
  type: MessageType;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  options?: ChatOption[];
  products?: Product[];
  orderStatus?: OrderStatus;
}

export type ConversationFlow = 
  | 'initial'
  | 'product-discovery'
  | 'product-category'
  | 'product-budget'
  | 'product-usage'
  | 'product-results'
  | 'order-tracking'
  | 'order-input'
  | 'delivery-info'
  | 'returns-info'
  | 'warranty-info'
  | 'human-support'
  | 'laptop'
  | 'phone'
  | 'under-500'
  | '500-1000'
  | '1000-1500'
  | 'over-1500'
  | 'student'
  | 'office'
  | 'gaming'
  | 'daily'
  | 'restart';

export interface ConversationState {
  flow: ConversationFlow;
  productCategory?: string;
  productBudget?: string;
  productUsage?: string;
}
