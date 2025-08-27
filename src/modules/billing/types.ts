export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  trialEnd?: string;
  createdAt: string;
  updatedAt: string;
  lastPaymentDate?: string;
  nextPaymentDate?: string;
  paymentMethod?: PaymentMethod;
  discounts: Discount[];
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  features: PlanFeature[];
  pricing: PlanPricing[];
  trialDays: number;
  maxDevices: number;
  audioQuality: AudioQuality[];
  downloadLimit: number; // -1 for unlimited
  skipLimit: number; // -1 for unlimited
  adsEnabled: boolean;
  isPopular: boolean;
  sortOrder: number;
}

export interface PlanPricing {
  id: string;
  interval: BillingInterval;
  amount: number;
  currency: string;
  discountPercentage?: number;
  originalAmount?: number;
}

export interface PlanFeature {
  id: string;
  name: string;
  description: string;
  included: boolean;
  limit?: number;
  icon?: string;
}

export type SubscriptionStatus = 
  | 'active'
  | 'trialing'
  | 'past_due'
  | 'canceled'
  | 'unpaid'
  | 'incomplete'
  | 'incomplete_expired';

export type BillingInterval = 'month' | 'year';
export type AudioQuality = 'low' | 'medium' | 'high' | 'lossless';

export interface PaymentMethod {
  id: string;
  type: PaymentMethodType;
  card?: CardDetails;
  googlePay?: GooglePayDetails;
  applePay?: ApplePayDetails;
  isDefault: boolean;
  createdAt: string;
}

export type PaymentMethodType = 'card' | 'google_pay' | 'apple_pay' | 'paypal';

export interface CardDetails {
  last4: string;
  brand: string;
  expMonth: number;
  expYear: number;
  country?: string;
}

export interface GooglePayDetails {
  email: string;
}

export interface ApplePayDetails {
  deviceAccountId: string;
}

export interface Discount {
  id: string;
  type: DiscountType;
  value: number; // percentage or fixed amount
  description: string;
  validUntil?: string;
  appliedAt: string;
}

export type DiscountType = 'percentage' | 'fixed_amount';

export interface BillingState {
  // Subscription
  currentSubscription: Subscription | null;
  availablePlans: SubscriptionPlan[];
  
  // Payment methods
  paymentMethods: PaymentMethod[];
  
  // Billing history
  invoices: Invoice[];
  
  // Trial & offers
  trialEligible: boolean;
  availableOffers: Offer[];
  
  // UI state
  isLoading: boolean;
  isProcessingPayment: boolean;
  error: string | null;
  
  // Platform-specific
  provider: BillingProvider;
}

export interface Invoice {
  id: string;
  subscriptionId: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  date: string;
  paidAt?: string;
  dueDate?: string;
  description: string;
  downloadUrl?: string;
}

export type InvoiceStatus = 'draft' | 'open' | 'paid' | 'void' | 'uncollectible';

export interface Offer {
  id: string;
  title: string;
  description: string;
  planId: string;
  discountPercentage: number;
  validUntil: string;
  termsAndConditions: string;
  isLimitedTime: boolean;
  maxRedemptions?: number;
  currentRedemptions: number;
}

export type BillingProvider = 'stripe' | 'google_play' | 'app_store';

export interface BillingActions {
  // Plans & subscription
  loadPlans: () => Promise<void>;
  subscribe: (planId: string, paymentMethodId?: string) => Promise<void>;
  changePlan: (newPlanId: string) => Promise<void>;
  cancelSubscription: () => Promise<void>;
  reactivateSubscription: () => Promise<void>;
  
  // Payment methods
  loadPaymentMethods: () => Promise<void>;
  addPaymentMethod: (paymentMethod: Partial<PaymentMethod>) => Promise<void>;
  removePaymentMethod: (paymentMethodId: string) => Promise<void>;
  setDefaultPaymentMethod: (paymentMethodId: string) => Promise<void>;
  
  // Billing history
  loadInvoices: () => Promise<void>;
  downloadInvoice: (invoiceId: string) => Promise<string>;
  
  // Trial & offers
  startTrial: (planId: string) => Promise<void>;
  redeemOffer: (offerId: string) => Promise<void>;
  
  // Subscription management
  pauseSubscription: () => Promise<void>;
  resumeSubscription: () => Promise<void>;
  updateBillingAddress: (address: BillingAddress) => Promise<void>;
  
  // Platform-specific
  restorePurchases: () => Promise<void>; // For mobile
  
  // Error handling
  setError: (error: string | null) => void;
  clearError: () => void;
}

export type BillingStore = BillingState & BillingActions;

export interface BillingAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

// Abstract billing provider interface
export interface IBillingProvider {
  initialize(): Promise<void>;
  getAvailablePlans(): Promise<SubscriptionPlan[]>;
  createSubscription(planId: string, paymentMethodId?: string): Promise<Subscription>;
  cancelSubscription(subscriptionId: string): Promise<void>;
  updateSubscription(subscriptionId: string, newPlanId: string): Promise<Subscription>;
  getCurrentSubscription(): Promise<Subscription | null>;
  getPaymentMethods(): Promise<PaymentMethod[]>;
  addPaymentMethod(paymentMethod: Partial<PaymentMethod>): Promise<PaymentMethod>;
  removePaymentMethod(paymentMethodId: string): Promise<void>;
  getInvoices(): Promise<Invoice[]>;
  restorePurchases?(): Promise<void>;
}

// Purchase events
export interface PurchaseEvent {
  type: 'subscription_created' | 'subscription_updated' | 'subscription_cancelled' | 'payment_failed' | 'payment_succeeded';
  subscriptionId: string;
  planId: string;
  amount?: number;
  currency?: string;
  timestamp: string;
}

// Error types
export interface BillingError {
  code: BillingErrorCode;
  message: string;
  details?: Record<string, any>;
  recoverable: boolean;
}

export type BillingErrorCode = 
  | 'PAYMENT_FAILED'
  | 'CARD_DECLINED' 
  | 'INSUFFICIENT_FUNDS'
  | 'NETWORK_ERROR'
  | 'INVALID_PAYMENT_METHOD'
  | 'SUBSCRIPTION_NOT_FOUND'
  | 'PLAN_NOT_AVAILABLE'
  | 'USER_CANCELLED'
  | 'UNKNOWN_ERROR';

// Constants
export const PLAN_IDS = {
  TRIAL: 'trial',
  STANDARD: 'standard',
  PREMIUM: 'premium',
  FAMILY: 'family',
} as const;

export const BILLING_INTERVALS = {
  MONTHLY: 'month' as BillingInterval,
  YEARLY: 'year' as BillingInterval,
} as const;

export const SUBSCRIPTION_STATUSES = {
  ACTIVE: 'active' as SubscriptionStatus,
  TRIALING: 'trialing' as SubscriptionStatus,
  PAST_DUE: 'past_due' as SubscriptionStatus,
  CANCELED: 'canceled' as SubscriptionStatus,
  UNPAID: 'unpaid' as SubscriptionStatus,
} as const;
