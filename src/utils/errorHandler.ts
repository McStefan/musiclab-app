import { ErrorUtils } from 'react-native';
import { analyticsService } from '../modules/analytics/services/AnalyticsService';

export interface GlobalError {
  message: string;
  stack?: string;
  jsEngine?: string;
  rawStack?: string;
  type: 'unhandled_promise_rejection' | 'global_error' | 'native_error';
}

class GlobalErrorHandler {
  private static instance: GlobalErrorHandler;
  private originalErrorHandler: any = null;
  private isInitialized = false;

  static getInstance(): GlobalErrorHandler {
    if (!GlobalErrorHandler.instance) {
      GlobalErrorHandler.instance = new GlobalErrorHandler();
    }
    return GlobalErrorHandler.instance;
  }

  /**
   * Initialize global error handling
   */
  initialize(): void {
    if (this.isInitialized) {
      return;
    }

    // Store original error handler
    this.originalErrorHandler = ErrorUtils.getGlobalHandler();

    // Set up global error handler
    ErrorUtils.setGlobalHandler(this.handleGlobalError.bind(this));

    // Handle unhandled promise rejections
    if (global.HermesInternal) {
      // Hermes engine
      global.HermesInternal.enablePromiseRejectionTracker &&
        global.HermesInternal.enablePromiseRejectionTracker({
          allRejections: true,
          onUnhandled: this.handleUnhandledPromiseRejection.bind(this),
          onHandled: () => {
            // Promise rejection was handled after initial rejection
          },
        });
    } else {
      // Other JS engines
      global.addEventListener?.('unhandledrejection', (event) => {
        this.handleUnhandledPromiseRejection(
          event.promise,
          event.reason
        );
      });
    }

    this.isInitialized = true;
  }

  /**
   * Handle global JavaScript errors
   */
  private handleGlobalError(error: any, isFatal: boolean): void {
    const globalError: GlobalError = {
      message: error.message || 'Unknown global error',
      stack: error.stack,
      type: 'global_error',
    };

    this.logError(globalError, { isFatal });

    // Call original handler to maintain default behavior
    if (this.originalErrorHandler) {
      this.originalErrorHandler(error, isFatal);
    }
  }

  /**
   * Handle unhandled promise rejections
   */
  private handleUnhandledPromiseRejection(promise: Promise<any>, reason: any): void {
    const globalError: GlobalError = {
      message: reason?.message || reason?.toString() || 'Unhandled promise rejection',
      stack: reason?.stack,
      type: 'unhandled_promise_rejection',
    };

    this.logError(globalError, { promise: promise.toString() });
  }

  /**
   * Manually report an error
   */
  reportError(error: Error, context?: string, additionalInfo?: any): void {
    const globalError: GlobalError = {
      message: error.message,
      stack: error.stack,
      type: 'global_error',
    };

    this.logError(globalError, {
      context,
      ...additionalInfo,
    });
  }

  /**
   * Log error to analytics and console
   */
  private logError(error: GlobalError, additionalInfo?: any): void {
    // Log to analytics
    analyticsService.trackError(error.message, 'GlobalErrorHandler', {
      type: error.type,
      stack: error.stack,
      ...additionalInfo,
    });

    // Log to console in development
    if (__DEV__) {
      console.error('Global Error:', {
        message: error.message,
        type: error.type,
        stack: error.stack,
        additionalInfo,
      });
    }

    // TODO: Send to crash reporting service (Crashlytics, Sentry, etc.)
    // this.sendToCrashReporting(error, additionalInfo);
  }

  /**
   * Send error to external crash reporting service
   * This would typically integrate with services like Crashlytics or Sentry
   */
  private sendToCrashReporting(error: GlobalError, additionalInfo?: any): void {
    // Example integration with crash reporting service
    // crashlytics().recordError(new Error(error.message));
    // Sentry.captureException(new Error(error.message));
  }

  /**
   * Get error statistics for debugging
   */
  getErrorStats(): any {
    // This could return statistics about error frequency, types, etc.
    return {
      initialized: this.isInitialized,
      hasOriginalHandler: !!this.originalErrorHandler,
    };
  }
}

export const globalErrorHandler = GlobalErrorHandler.getInstance();
