import { Platform } from 'react-native';
import { 
  IBillingProvider, 
  SubscriptionPlan, 
  Subscription, 
  PaymentMethod, 
  Invoice,
  PLAN_IDS
} from '../types';

export class GooglePlayBillingProvider implements IBillingProvider {
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;

    if (Platform.OS !== 'android') {
      throw new Error('Google Play Billing is only available on Android');
    }

    try {
      // In real implementation, would initialize Google Play Billing
      console.log('Initializing Google Play Billing...');
      this.initialized = true;
    } catch (error) {
      throw new Error('Failed to initialize Google Play Billing');
    }
  }

  async getAvailablePlans(): Promise<SubscriptionPlan[]> {
    await this.ensureInitialized();
    
    // Mock plans for Google Play
    return [
      {
        id: PLAN_IDS.STANDARD,
        name: 'Standard',
        description: 'Everything you need for great music',
        features: [
          { id: 'f1', name: 'Ad-free listening', description: 'No interruptions', included: true },
          { id: 'f2', name: 'High quality audio', description: '320 kbps', included: true },
          { id: 'f3', name: 'Unlimited skips', description: 'Skip any track', included: true },
          { id: 'f4', name: 'Offline downloads', description: 'Up to 10,000 tracks', included: true, limit: 10000 },
        ],
        pricing: [
          {
            id: 'android.test.purchased', // Google Play test SKU
            interval: 'month',
            amount: 999,
            currency: 'usd',
          },
        ],
        trialDays: 7,
        maxDevices: 5,
        audioQuality: ['low', 'medium', 'high'],
        downloadLimit: 10000,
        skipLimit: -1,
        adsEnabled: false,
        isPopular: true,
        sortOrder: 1,
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
        ],
        pricing: [
          {
            id: 'premium_monthly_android',
            interval: 'month',
            amount: 1499,
            currency: 'usd',
          },
        ],
        trialDays: 7,
        maxDevices: -1,
        audioQuality: ['low', 'medium', 'high', 'lossless'],
        downloadLimit: -1,
        skipLimit: -1,
        adsEnabled: false,
        isPopular: false,
        sortOrder: 2,
      },
    ];
  }

  async createSubscription(planId: string): Promise<Subscription> {
    await this.ensureInitialized();
    
    // Mock subscription creation for Google Play
    await this.delay(2000);
    
    const plans = await this.getAvailablePlans();
    const plan = plans.find(p => p.id === planId);
    
    if (!plan) {
      throw new Error('Plan not found');
    }

    const subscription: Subscription = {
      id: `gp_sub_${Date.now()}`,
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
      paymentMethod: {
        id: 'google_play',
        type: 'google_pay',
        googlePay: {
          email: 'user@gmail.com',
        },
        isDefault: true,
        createdAt: new Date().toISOString(),
      },
    };

    return subscription;
  }

  async cancelSubscription(subscriptionId: string): Promise<void> {
    await this.ensureInitialized();
    await this.delay(1000);
    console.log(`Cancelled Google Play subscription: ${subscriptionId}`);
  }

  async updateSubscription(subscriptionId: string, newPlanId: string): Promise<Subscription> {
    await this.ensureInitialized();
    await this.delay(1500);
    
    // Mock subscription update
    const subscription = await this.createSubscription(newPlanId);
    subscription.id = subscriptionId;
    subscription.updatedAt = new Date().toISOString();
    
    return subscription;
  }

  async getCurrentSubscription(): Promise<Subscription | null> {
    await this.ensureInitialized();
    await this.delay(800);
    
    // Return null for mock - no active subscription
    return null;
  }

  async getPaymentMethods(): Promise<PaymentMethod[]> {
    await this.ensureInitialized();
    await this.delay(400);
    
    // Google Play manages payment methods
    return [
      {
        id: 'google_play_default',
        type: 'google_pay',
        googlePay: {
          email: 'user@gmail.com',
        },
        isDefault: true,
        createdAt: new Date().toISOString(),
      },
    ];
  }

  async addPaymentMethod(): Promise<PaymentMethod> {
    throw new Error('Payment methods are managed by Google Play Store');
  }

  async removePaymentMethod(): Promise<void> {
    throw new Error('Payment methods are managed by Google Play Store');
  }

  async getInvoices(): Promise<Invoice[]> {
    await this.ensureInitialized();
    await this.delay(600);
    
    // Google Play doesn't provide detailed invoice access
    return [];
  }

  async restorePurchases(): Promise<void> {
    await this.ensureInitialized();
    await this.delay(1000);
    
    // Mock restore purchases
    console.log('Restoring Google Play purchases...');
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

export const googlePlayBillingProvider = new GooglePlayBillingProvider();
