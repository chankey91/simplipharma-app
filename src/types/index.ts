// Medicine Types
export interface Medicine {
  id: string;
  code?: string; // Product Code/SKU
  name: string;
  category: string;
  unit?: string; // PCS, TAB, POW, etc.
  stock: number;
  currentStock?: number; // Current available stock
  
  // Pricing fields
  price: number; // Main selling price
  costPrice?: number;
  mrp?: number; // Maximum Retail Price
  purchasePrice?: number;
  salesPrice?: number;
  
  // Scheme fields
  salesSchemeDeal?: number;
  salesSchemeFree?: number;
  purchaseSchemeDeal?: number;
  purchaseSchemeFree?: number;
  
  // Value field
  value?: number;
  
  // Company and manufacturer
  manufacturer: string;
  company?: string;
  
  // Additional details
  description?: string;
  imageUrl?: string;
  dosage?: string;
  sideEffects?: string;
  composition?: string;
}

// Cart Item Types
export interface CartItem {
  medicine: Medicine;
  quantity: number;
}

// Order Types
export type OrderStatus = 'Pending' | 'Dispatched' | 'Delivered' | 'Cancelled';

export interface OrderMedicine {
  medicineId: string;
  name: string;
  price: number;
  quantity: number;
}

export type PaymentStatus = 'Paid' | 'Unpaid' | 'Partial';
export type PaymentMethod = 'Cash' | 'Card' | 'UPI' | 'Bank Transfer' | 'Cheque';

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  paymentDate: Date | any;
  paymentMethod: PaymentMethod;
  notes?: string;
  collectedBy?: string;
}

export interface Order {
  id: string;
  retailerId: string;
  retailerEmail?: string;
  medicines: OrderMedicine[];
  totalAmount: number;
  status: OrderStatus;
  orderDate: Date | any; // Firestore Timestamp
  deliveryAddress?: string;
  trackingLocation?: {
    latitude: number;
    longitude: number;
  };
  estimatedDelivery?: string;
  cancelReason?: string;
  cancelledAt?: Date | any;
  // Payment fields
  paymentStatus?: PaymentStatus;
  paidAmount?: number;
  dueAmount?: number;
  payments?: Payment[];
}

// User Types
export interface User {
  uid: string;
  email: string;
  role?: 'retailer' | 'admin';
  displayName?: string;
  phoneNumber?: string;
  address?: string;
  shopName?: string;
}

// Favorites
export interface Favorite {
  userId: string;
  medicineId: string;
  addedAt: Date | any;
}

// Search History
export interface SearchHistoryItem {
  query: string;
  timestamp: Date | any;
}

// Banner Types
export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  color: string;
  icon: string;
  isActive: boolean;
  order: number;
  linkTo?: string;
  createdAt: Date | any;
  updatedAt?: Date | any;
}

// Navigation Types
export type RootStackParamList = {
  Login: undefined;
  MainTabs: undefined;
  OrderConfirmation: {
    cartItems: CartItem[];
    totalAmount: number;
  };
  MedicineDetails: {
    medicine: Medicine;
  };
  OrderTracking: {
    order: Order;
  };
  Profile: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  MedicineList: undefined;
  Cart: undefined;
  Orders: undefined;
  AdminOrders: undefined;
  AdminUsers: undefined;
  AdminProducts: undefined;
  AdminAccounting: undefined;
  AdminBanners: undefined;
  Favorites: undefined;
};

