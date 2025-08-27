import { Platform } from 'react-native';
import { 
  IBillingProvider, 
  SubscriptionPlan, 
  Subscription, 
  PaymentMethod, 
  Invoice,
  BillingInterval,
  PLAN_IDS,
  AudioQuality
} from '../types';

export class StripeBillingProvider implements IBillingProvider {
  private publishableKey: string;
  private apiUrl: string;
  private initialized = false;

  constructor() {
    this.publishableKey = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_mock';
    this.apiUrl = 'https://api.musiclab.app'; // Mock API endpoint
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // In real implementation, would initialize Stripe SDK
      console.log('Initializing Stripe with key:', this.publishableKey);
      this.initialized = true;
    } catch (error) {
      throw new Error('Failed to initialize Stripe');
    }
  }

  async getAvailablePlans(): Promise<SubscriptionPlan[]> {
    await this.ensureInitialized();
    
    // Mock plans data
    return [
      {
        id: PLAN_IDS.TRIAL,
        name: 'Free Trial',
        description: '7 days free, then $4.99/month',
        features: [
          { id: 'f1', name: 'Ad-free listening', description: 'No interruptions', included: true },
          { id: 'f2', name: 'High quality audio', description: '320 kbps', included: true },
          { id: 'f3', name: 'Unlimited skips', description: 'Skip any track', included: true },
          { id: 'f4', name: 'Offline downloads', description: 'Up to 1,000 tracks', included: true, limit: 1000 },
        ],
        pricing: [
          {
            id: 'price_trial_monthly',
            interval: 'month',
            amount: 499, // $4.99
            currency: 'usd',
          }
        ],
        trialDays: 7,
        maxDevices: 1,
        audioQuality: ['low', 'medium', 'high'],
        downloadLimit: 1000,
        skipLimit: -1,
        adsEnabled: false,
        isPopular: false,
        sortOrder: 1,
      },
      {
        id: PLAN_IDS.STANDARD,
        name: 'Standard',
        description: 'Everything you need for great music',
        features: [
          { id: 'f1', name: 'Ad-free listening', description: 'No interruptions', included: true },
          { id: 'f2', name: 'High quality audio', description: '320 kbps', included: true },
          { id: 'f3', name: 'Unlimited skips', description: 'Skip any track', included: true },
          { id: 'f4', name: 'Offline downloads', description: 'Up to 10,000 tracks', included: true, limit: 10000 },
          { id: 'f5', name: 'Connect anywhere', description: 'Use on any device', included: true },
        ],
        pricing: [
          {
            id: 'price_standard_monthly',
            interval: 'month',
            amount: 999, // $9.99
            currency: 'usd',
          },
          {
            id: 'price_standard_yearly',
            interval: 'year',
            amount: 9999, // $99.99 (2 months free)
            currency: 'usd',
            discountPercentage: 17,
            originalAmount: 11988, // $119.88
          }
        ],
        trialDays: 0,
        maxDevices: 5,
        audioQuality: ['low', 'medium', 'high'],
        downloadLimit: 10000,
        skipLimit: -1,
        adsEnabled: false,
        isPopular: true,
        sortOrder: 2,
      },
      {
        id: PLAN_IDS.PREMIUM,
        name: 'Premium',
        description: 'The ultimate music experience',
        features: [
          { id: 'f1', name: 'Ad-free listening', description: 'No interruptions', included: true },
          { id: 'f2', name: 'Lossless audio', description: 'CD quality & Hi-Res', included: true },
          { id: 'f3', name: 'Unlimited skips', description: 'Skip any track', included: true },
          { id: 'f4', name: 'Unlimited downloads', description: 'Download everything', included: true, limit: -1 },
          { id: 'f5', name: 'Connect anywhere', description: 'Use on any device', included: true },
          { id: 'f6', name: 'Early access', description: 'New features first', included: true },
          { id: 'f7', name: 'Lyrics & visualizer', description: 'See what you hear', included: true },
        ],
        pricing: [
          {
            id: 'price_premium_monthly',
            interval: 'month',
            amount: 1499, // $14.99
            currency: 'usd',
          },
          {
            id: 'price_premium_yearly',
            interval: 'year',
            amount: 14999, // $149.99 (2.5 months free)
            currency: 'usd',
            discountPercentage: 17,
            originalAmount: 17988, // $179.88
          }
        ],
        trialDays: 0,
        maxDevices: -1,
        audioQuality: ['low', 'medium', 'high', 'lossless'],
        downloadLimit: -1,
        skipLimit: -1,
        adsEnabled: false,
        isPopular: false,
        sortOrder: 3,
      },
      {
        id: PLAN_IDS.FAMILY,
        name: 'Family',
        description: 'Premium for up to 6 family members',
        features: [
          { id: 'f1', name: 'Ad-free listening', description: 'For everyone', included: true },
          { id: 'f2', name: 'Lossless audio', description: 'CD quality & Hi-Res', included: true },
          { id: 'f3', name: 'Unlimited skips', description: 'Skip any track', included: true },
          { id: 'f4', name: 'Unlimited downloads', description: 'Download everything', included: true, limit: -1 },
          { id: 'f5', name: '6 Premium accounts', description: 'For family members', included: true, limit: 6 },
          { id: 'f6', name: 'Individual profiles', description: 'Personal recommendations', included: true },
          { id: 'f7', name: 'Parental controls', description: 'Safe listening for kids', included: true },
        ],
        pricing: [
          {
            id: 'price_family_monthly',
            interval: 'month',
            amount: 1999, // $19.99
            currency: 'usd',
          },
          {
            id: 'price_family_yearly',
            interval: 'year',
            amount: 19999, // $199.99 (2.5 months free)
            currency: 'usd',
            discountPercentage: 17,
            originalAmount: 23988, // $239.88
          }
        ],
        trialDays: 0,
        maxDevices: -1,
        audioQuality: ['low', 'medium', 'high', 'lossless'],
        downloadLimit: -1,
        skipLimit: -1,
        adsEnabled: false,
        isPopular: false,
        sortOrder: 4,
      },
    ];
  }

  async createSubscription(planId: string, paymentMethodId?: string): Promise<Subscription> {
    await this.ensureInitialized();
    
    // Mock subscription creation
    await this.delay(2000);
    
    const plans = await this.getAvailablePlans();
    const plan = plans.find(p => p.id === planId);
    
    if (!plan) {
      throw new Error('Plan not found');
    }

    const subscription: Subscription = {
      id: `sub_${Date.now()}`,
      userId: 'current_user',
      planId,
      plan,
      status: plan.trialDays > 0 ? 'trialing' : 'active',
      currentPeriodStart: new Date().toISOString(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      cancelAtPeriodEnd: false,
      trialEnd: plan.trialDays > 0 ? new Date(Date.now() + plan.trialDays * 24 * 60 * 60 * 1000).toISOString() : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      discounts: [],
    };

    if (paymentMethodId) {
      subscription.paymentMethod = {
        id: paymentMethodId,
        type: 'card',
        card: {
          last4: '4242',
          brand: 'visa',
          expMonth: 12,
          expYear: 2025,
        },
        isDefault: true,
        createdAt: new Date().toISOString(),
      };
    }

    return subscription;
  }

  async cancelSubscription(subscriptionId: string): Promise<void> {
    await this.ensureInitialized();
    await this.delay(1000);
    console.log(`Cancelled subscription: ${subscriptionId}`);
  }

  async updateSubscription(subscriptionId: string, newPlanId: string): Promise<Subscription> {
    await this.ensureInitialized();
    await this.delay(1500);
    
    const plans = await this.getAvailablePlans();
    const newPlan = plans.find(p => p.id === newPlanId);
    
    if (!newPlan) {
      throw new Error('New plan not found');
    }

    // Mock updated subscription
    const subscription: Subscription = {
      id: subscriptionId,
      userId: 'current_user',
      planId: newPlanId,
      plan: newPlan,
      status: 'active',
      currentPeriodStart: new Date().toISOString(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      cancelAtPeriodEnd: false,
      createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      updatedAt: new Date().toISOString(),
      nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      discounts: [],
    };

    return subscription;
  }

  async getCurrentSubscription(): Promise<Subscription | null> {
    await this.ensureInitialized();
    await this.delay(800);
    
    // Mock current subscription
    const plans = await this.getAvailablePlans();
    const standardPlan = plans.find(p => p.id === PLAN_IDS.STANDARD);
    
    if (!standardPlan) return null;

    return {
      id: 'sub_current_123',
      userId: 'current_user',
      planId: PLAN_IDS.STANDARD,
      plan: standardPlan,
      status: 'active',
      currentPeriodStart: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      currentPeriodEnd: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      cancelAtPeriodEnd: false,
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      lastPaymentDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      nextPaymentDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      paymentMethod: {
        id: 'pm_123',
        type: 'card',
        card: {
          last4: '4242',
          brand: 'visa',
          expMonth: 12,
          expYear: 2025,
        },
        isDefault: true,
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      },
      discounts: [],
    };
  }

  async getPaymentMethods(): Promise<PaymentMethod[]> {
    await this.ensureInitialized();
    await this.delay(600);
    
    return [
      {
        id: 'pm_123',
        type: 'card',
        card: {
          last4: '4242',
          brand: 'visa',
          expMonth: 12,
          expYear: 2025,
          country: 'US',
        },
        isDefault: true,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: 'pm_456',
        type: 'card',
        card: {
          last4: '5555',
          brand: 'mastercard',
          expMonth: 8,
          expYear: 2026,
          country: 'US',
        },
        isDefault: false,
        createdAt: new Date(Date.now() - 172800000).toISOString(),
      },
    ];
  }

  async addPaymentMethod(paymentMethod: Partial<PaymentMethod>): Promise<PaymentMethod> {
    await this.ensureInitialized();
    await this.delay(1500);
    
    const newPaymentMethod: PaymentMethod = {
      id: `pm_${Date.now()}`,
      type: paymentMethod.type || 'card',
      card: paymentMethod.card || {
        last4: '0000',
        brand: 'unknown',
        expMonth: 1,
        expYear: 2030,
      },
      isDefault: paymentMethod.isDefault || false,
      createdAt: new Date().toISOString(),
    };

    return newPaymentMethod;
  }

  async removePaymentMethod(paymentMethodId: string): Promise<void> {
    await this.ensureInitialized();
    await this.delay(800);
    console.log(`Removed payment method: ${paymentMethodId}`);
  }

  async getInvoices(): Promise<Invoice[]> {
    await this.ensureInitialized();
    await this.delay(1000);
    
    return [
      {
        id: 'inv_123',
        subscriptionId: 'sub_current_123',
        amount: 999,
        currency: 'usd',
        status: 'paid',
        date: new Date(Date.now() - 86400000).toISOString(),
        paidAt: new Date(Date.now() - 86400000).toISOString(),
        description: 'Music Lab Standard - Monthly',
        downloadUrl: 'https://invoice.stripe.com/invoice_123.pdf',
      },
      {
        id: 'inv_124',
        subscriptionId: 'sub_current_123',
        amount: 999,
        currency: 'usd',
        status: 'paid',
        date: new Date(Date.now() - 30 * 86400000).toISOString(),
        paidAt: new Date(Date.now() - 30 * 86400000).toISOString(),
        description: 'Music Lab Standard - Monthly',
        downloadUrl: 'https://invoice.stripe.com/invoice_124.pdf',
      },
    ];
  }

  private async ensureInitialized(): Promise<void> {
    if (!this.initialized) {
      await this.initialize();
    }
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const stripeBillingProvider = new StripeBillingProvider();
