import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Platform } from 'react-native';
import { BillingStore, IBillingProvider, BillingProvider } from '../types';
import { stripeBillingProvider } from '../providers/StripeBillingProvider';
import { googlePlayBillingProvider } from '../providers/GooglePlayBillingProvider';
import { mmkvStorage } from '../../../store/mmkvStorage';

// Provider factory
function createBillingProvider(): { provider: IBillingProvider; type: BillingProvider } {
  if (Platform.OS === 'web') {
    return { provider: stripeBillingProvider, type: 'stripe' };
  } else if (Platform.OS === 'android') {
    // In production, would check if Google Play Services are available
    return { provider: googlePlayBillingProvider, type: 'google_play' };
  } else {
    // iOS would use App Store, but we'll use Stripe for now
    return { provider: stripeBillingProvider, type: 'stripe' };
  }
}

const { provider: billingProvider, type: providerType } = createBillingProvider();

export const useBillingStore = create<BillingStore>()(
  persist(
    (set, get) => ({
      // Initial state
      currentSubscription: null,
      availablePlans: [],
      paymentMethods: [],
      invoices: [],
      trialEligible: true,
      availableOffers: [],
      isLoading: false,
      isProcessingPayment: false,
      error: null,
      provider: providerType,

      // Actions
      loadPlans: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const plans = await billingProvider.getAvailablePlans();
          set({ availablePlans: plans, isLoading: false });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to load plans' 
          });
        }
      },

      subscribe: async (planId: string, paymentMethodId?: string) => {
        set({ isProcessingPayment: true, error: null });
        
        try {
          const subscription = await billingProvider.createSubscription(planId, paymentMethodId);
          set({ 
            currentSubscription: subscription,
            isProcessingPayment: false,
            trialEligible: false // Used trial
          });
        } catch (error) {
          set({ 
            isProcessingPayment: false, 
            error: error instanceof Error ? error.message : 'Subscription failed' 
          });
          throw error;
        }
      },

      changePlan: async (newPlanId: string) => {
        const currentSub = get().currentSubscription;
        if (!currentSub) {
          throw new Error('No active subscription to change');
        }

        set({ isProcessingPayment: true, error: null });
        
        try {
          const updatedSubscription = await billingProvider.updateSubscription(currentSub.id, newPlanId);
          set({ 
            currentSubscription: updatedSubscription,
            isProcessingPayment: false 
          });
        } catch (error) {
          set({ 
            isProcessingPayment: false, 
            error: error instanceof Error ? error.message : 'Plan change failed' 
          });
          throw error;
        }
      },

      cancelSubscription: async () => {
        const currentSub = get().currentSubscription;
        if (!currentSub) {
          throw new Error('No active subscription to cancel');
        }

        set({ isProcessingPayment: true, error: null });
        
        try {
          await billingProvider.cancelSubscription(currentSub.id);
          set({ 
            currentSubscription: {
              ...currentSub,
              cancelAtPeriodEnd: true,
              updatedAt: new Date().toISOString(),
            },
            isProcessingPayment: false 
          });
        } catch (error) {
          set({ 
            isProcessingPayment: false, 
            error: error instanceof Error ? error.message : 'Cancellation failed' 
          });
          throw error;
        }
      },

      reactivateSubscription: async () => {
        const currentSub = get().currentSubscription;
        if (!currentSub || !currentSub.cancelAtPeriodEnd) {
          throw new Error('No cancelled subscription to reactivate');
        }

        set({ isProcessingPayment: true, error: null });
        
        try {
          // Mock reactivation - in real implementation would call API
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          set({ 
            currentSubscription: {
              ...currentSub,
              cancelAtPeriodEnd: false,
              updatedAt: new Date().toISOString(),
            },
            isProcessingPayment: false 
          });
        } catch (error) {
          set({ 
            isProcessingPayment: false, 
            error: error instanceof Error ? error.message : 'Reactivation failed' 
          });
          throw error;
        }
      },

      loadPaymentMethods: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const paymentMethods = await billingProvider.getPaymentMethods();
          set({ paymentMethods, isLoading: false });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to load payment methods' 
          });
        }
      },

      addPaymentMethod: async (paymentMethod) => {
        set({ isProcessingPayment: true, error: null });
        
        try {
          const newPaymentMethod = await billingProvider.addPaymentMethod(paymentMethod);
          const currentMethods = get().paymentMethods;
          set({ 
            paymentMethods: [newPaymentMethod, ...currentMethods],
            isProcessingPayment: false 
          });
        } catch (error) {
          set({ 
            isProcessingPayment: false, 
            error: error instanceof Error ? error.message : 'Failed to add payment method' 
          });
          throw error;
        }
      },

      removePaymentMethod: async (paymentMethodId: string) => {
        set({ isProcessingPayment: true, error: null });
        
        try {
          await billingProvider.removePaymentMethod(paymentMethodId);
          const currentMethods = get().paymentMethods;
          const updatedMethods = currentMethods.filter(pm => pm.id !== paymentMethodId);
          set({ 
            paymentMethods: updatedMethods,
            isProcessingPayment: false 
          });
        } catch (error) {
          set({ 
            isProcessingPayment: false, 
            error: error instanceof Error ? error.message : 'Failed to remove payment method' 
          });
          throw error;
        }
      },

      setDefaultPaymentMethod: async (paymentMethodId: string) => {
        set({ isProcessingPayment: true, error: null });
        
        try {
          // Mock setting default payment method
          await new Promise(resolve => setTimeout(resolve, 800));
          
          const currentMethods = get().paymentMethods;
          const updatedMethods = currentMethods.map(pm => ({
            ...pm,
            isDefault: pm.id === paymentMethodId,
          }));
          
          set({ 
            paymentMethods: updatedMethods,
            isProcessingPayment: false 
          });
        } catch (error) {
          set({ 
            isProcessingPayment: false, 
            error: error instanceof Error ? error.message : 'Failed to set default payment method' 
          });
          throw error;
        }
      },

      loadInvoices: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const invoices = await billingProvider.getInvoices();
          set({ invoices, isLoading: false });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to load invoices' 
          });
        }
      },

      downloadInvoice: async (invoiceId: string) => {
        const invoice = get().invoices.find(inv => inv.id === invoiceId);
        if (!invoice?.downloadUrl) {
          throw new Error('Invoice download not available');
        }
        
        try {
          // In real implementation, would handle file download
          return invoice.downloadUrl;
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Download failed' });
          throw error;
        }
      },

      startTrial: async (planId: string) => {
        if (!get().trialEligible) {
          throw new Error('Trial not available');
        }

        await get().subscribe(planId);
      },

      redeemOffer: async (offerId: string) => {
        set({ isProcessingPayment: true, error: null });
        
        try {
          // Mock offer redemption
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          const offers = get().availableOffers;
          const updatedOffers = offers.filter(offer => offer.id !== offerId);
          
          set({ 
            availableOffers: updatedOffers,
            isProcessingPayment: false 
          });
        } catch (error) {
          set({ 
            isProcessingPayment: false, 
            error: error instanceof Error ? error.message : 'Failed to redeem offer' 
          });
          throw error;
        }
      },

      pauseSubscription: async () => {
        // Mock pause functionality
        set({ isProcessingPayment: true, error: null });
        
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const currentSub = get().currentSubscription;
          if (currentSub) {
            set({ 
              currentSubscription: {
                ...currentSub,
                status: 'past_due', // Mock paused state
                updatedAt: new Date().toISOString(),
              },
              isProcessingPayment: false 
            });
          }
        } catch (error) {
          set({ 
            isProcessingPayment: false, 
            error: error instanceof Error ? error.message : 'Failed to pause subscription' 
          });
          throw error;
        }
      },

      resumeSubscription: async () => {
        set({ isProcessingPayment: true, error: null });
        
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const currentSub = get().currentSubscription;
          if (currentSub) {
            set({ 
              currentSubscription: {
                ...currentSub,
                status: 'active',
                updatedAt: new Date().toISOString(),
              },
              isProcessingPayment: false 
            });
          }
        } catch (error) {
          set({ 
            isProcessingPayment: false, 
            error: error instanceof Error ? error.message : 'Failed to resume subscription' 
          });
          throw error;
        }
      },

      updateBillingAddress: async (address) => {
        set({ isProcessingPayment: true, error: null });
        
        try {
          // Mock address update
          await new Promise(resolve => setTimeout(resolve, 800));
          set({ isProcessingPayment: false });
        } catch (error) {
          set({ 
            isProcessingPayment: false, 
            error: error instanceof Error ? error.message : 'Failed to update billing address' 
          });
          throw error;
        }
      },

      restorePurchases: async () => {
        if (!billingProvider.restorePurchases) {
          throw new Error('Restore purchases not supported on this platform');
        }

        set({ isLoading: true, error: null });
        
        try {
          await billingProvider.restorePurchases();
          
          // Reload current subscription after restore
          const subscription = await billingProvider.getCurrentSubscription();
          set({ 
            currentSubscription: subscription,
            isLoading: false 
          });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to restore purchases' 
          });
          throw error;
        }
      },

      setError: (error) => {
        set({ error });
      },

      clearError: () => {
        set({ error: null });
      },

      // Initialize billing
      initialize: async () => {
        set({ isLoading: true });
        
        try {
          await billingProvider.initialize();
          
          // Load initial data
          await Promise.all([
            get().loadPlans(),
            billingProvider.getCurrentSubscription().then(sub => 
              set({ currentSubscription: sub })
            ),
          ]);
          
          set({ isLoading: false });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to initialize billing' 
          });
        }
      },
    }),
    {
      name: 'billing-store',
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (state) => ({
        // Only persist non-sensitive data
        trialEligible: state.trialEligible,
        provider: state.provider,
      }),
    }
  )
);
