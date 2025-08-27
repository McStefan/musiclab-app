import { globalErrorHandler } from '../utils/errorHandler';
import { authStorage } from '../modules/auth/storage/authStorage';

export interface RealtimeEvent {
  type: string;
  data: any;
  timestamp: number;
}

export interface RealtimeSubscription {
  id: string;
  channel: string;
  callback: (event: RealtimeEvent) => void;
}

class RealtimeService {
  private static instance: RealtimeService;
  private ws: WebSocket | null = null;
  private subscriptions: Map<string, RealtimeSubscription> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private isConnecting = false;

  static getInstance(): RealtimeService {
    if (!RealtimeService.instance) {
      RealtimeService.instance = new RealtimeService();
    }
    return RealtimeService.instance;
  }

  /**
   * Connect to WebSocket server
   */
  async connect(): Promise<void> {
    if (this.ws?.readyState === WebSocket.OPEN || this.isConnecting) {
      return;
    }

    this.isConnecting = true;

    try {
      const tokens = await authStorage.getTokens();
      const wsUrl = process.env.EXPO_PUBLIC_WS_URL || 'wss://ws.musiclab.app';
      const url = tokens?.accessToken 
        ? `${wsUrl}?token=${tokens.accessToken}`
        : wsUrl;

      this.ws = new WebSocket(url);
      this.setupEventListeners();

      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('WebSocket connection timeout'));
        }, 10000);

        this.ws!.onopen = () => {
          clearTimeout(timeout);
          this.isConnecting = false;
          this.reconnectAttempts = 0;
          this.startHeartbeat();
          resolve();
        };

        this.ws!.onerror = (error) => {
          clearTimeout(timeout);
          this.isConnecting = false;
          reject(error);
        };
      });
    } catch (error) {
      this.isConnecting = false;
      globalErrorHandler.reportError(
        new Error('Failed to connect to WebSocket'),
        'RealtimeService',
        { error }
      );
      throw error;
    }
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect(): void {
    this.stopHeartbeat();
    
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    
    this.subscriptions.clear();
    this.reconnectAttempts = 0;
  }

  /**
   * Subscribe to a channel
   */
  subscribe(channel: string, callback: (event: RealtimeEvent) => void): string {
    const subscriptionId = `${channel}_${Date.now()}_${Math.random()}`;
    
    const subscription: RealtimeSubscription = {
      id: subscriptionId,
      channel,
      callback,
    };

    this.subscriptions.set(subscriptionId, subscription);

    // Send subscription message if connected
    if (this.isConnected()) {
      this.send({
        type: 'subscribe',
        channel,
        subscriptionId,
      });
    }

    return subscriptionId;
  }

  /**
   * Unsubscribe from a channel
   */
  unsubscribe(subscriptionId: string): void {
    const subscription = this.subscriptions.get(subscriptionId);
    if (!subscription) return;

    this.subscriptions.delete(subscriptionId);

    // Send unsubscription message if connected
    if (this.isConnected()) {
      this.send({
        type: 'unsubscribe',
        channel: subscription.channel,
        subscriptionId,
      });
    }
  }

  /**
   * Send message to server
   */
  send(message: any): void {
    if (!this.isConnected()) {
      globalErrorHandler.reportError(
        new Error('WebSocket not connected'),
        'RealtimeService'
      );
      return;
    }

    try {
      this.ws!.send(JSON.stringify(message));
    } catch (error) {
      globalErrorHandler.reportError(
        new Error('Failed to send WebSocket message'),
        'RealtimeService',
        { message, error }
      );
    }
  }

  /**
   * Check if WebSocket is connected
   */
  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  /**
   * Get connection status
   */
  getStatus(): string {
    if (!this.ws) return 'disconnected';
    
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING:
        return 'connecting';
      case WebSocket.OPEN:
        return 'connected';
      case WebSocket.CLOSING:
        return 'closing';
      case WebSocket.CLOSED:
        return 'closed';
      default:
        return 'unknown';
    }
  }

  /**
   * Setup WebSocket event listeners
   */
  private setupEventListeners(): void {
    if (!this.ws) return;

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      
      // Resubscribe to all channels
      this.subscriptions.forEach((subscription) => {
        this.send({
          type: 'subscribe',
          channel: subscription.channel,
          subscriptionId: subscription.id,
        });
      });
    };

    this.ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        this.handleMessage(message);
      } catch (error) {
        globalErrorHandler.reportError(
          new Error('Failed to parse WebSocket message'),
          'RealtimeService',
          { event: event.data, error }
        );
      }
    };

    this.ws.onclose = (event) => {
      console.log('WebSocket disconnected', event.code, event.reason);
      this.stopHeartbeat();
      
      if (!event.wasClean && this.reconnectAttempts < this.maxReconnectAttempts) {
        this.attemptReconnect();
      }
    };

    this.ws.onerror = (error) => {
      globalErrorHandler.reportError(
        new Error('WebSocket error'),
        'RealtimeService',
        { error }
      );
    };
  }

  /**
   * Handle incoming messages
   */
  private handleMessage(message: any): void {
    switch (message.type) {
      case 'event':
        this.handleEvent(message);
        break;
      case 'heartbeat':
        this.handleHeartbeat(message);
        break;
      case 'error':
        this.handleError(message);
        break;
      default:
        console.log('Unknown message type:', message.type);
    }
  }

  /**
   * Handle realtime events
   */
  private handleEvent(message: any): void {
    const { channel, data } = message;
    
    const realtimeEvent: RealtimeEvent = {
      type: data.type,
      data: data.payload,
      timestamp: data.timestamp || Date.now(),
    };

    // Notify all subscribers to this channel
    this.subscriptions.forEach((subscription) => {
      if (subscription.channel === channel) {
        subscription.callback(realtimeEvent);
      }
    });
  }

  /**
   * Handle heartbeat messages
   */
  private handleHeartbeat(message: any): void {
    // Respond to server heartbeat
    this.send({
      type: 'heartbeat_response',
      timestamp: Date.now(),
    });
  }

  /**
   * Handle error messages
   */
  private handleError(message: any): void {
    globalErrorHandler.reportError(
      new Error(`WebSocket server error: ${message.error}`),
      'RealtimeService',
      { message }
    );
  }

  /**
   * Start heartbeat to keep connection alive
   */
  private startHeartbeat(): void {
    this.stopHeartbeat();
    
    this.heartbeatInterval = setInterval(() => {
      if (this.isConnected()) {
        this.send({
          type: 'heartbeat',
          timestamp: Date.now(),
        });
      }
    }, 30000); // Send heartbeat every 30 seconds
  }

  /**
   * Stop heartbeat
   */
  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  /**
   * Attempt to reconnect with exponential backoff
   */
  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Max reconnection attempts reached');
      return;
    }

    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts);
    this.reconnectAttempts++;

    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);

    setTimeout(() => {
      this.connect().catch((error) => {
        console.error('Reconnection failed:', error);
      });
    }, delay);
  }
}

export const realtimeService = RealtimeService.getInstance();
