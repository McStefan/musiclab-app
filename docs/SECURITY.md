# MusicLab Security Guide

## Overview

Security is a critical aspect of MusicLab, given the handling of user authentication, payment data, and personal information. This document outlines security measures, best practices, and implementation guidelines.

## Data Classification

### Highly Sensitive Data
- **Authentication tokens** (JWT, refresh tokens, OAuth tokens)
- **Payment information** (card details, payment tokens)
- **Biometric data** (future feature)
- **Personal identifiers** (email addresses, phone numbers)

### Sensitive Data
- **User preferences** (listening history, likes, playlists)
- **Device information** (device IDs, IP addresses)
- **Usage analytics** (with PII)
- **Subscription details**

### Internal Data
- **App configuration** (API endpoints, feature flags)
- **Content metadata** (track info, playlists)
- **Public user data** (display names, public playlists)

## Authentication & Authorization

### JWT Token Management

```typescript
interface TokenStorage {
  // Store tokens securely
  storeTokens(accessToken: string, refreshToken: string): Promise<void>;
  getAccessToken(): Promise<string | null>;
  getRefreshToken(): Promise<string | null>;
  clearTokens(): Promise<void>;
}

// Secure implementation using MMKV with encryption
class SecureTokenStorage implements TokenStorage {
  private storage = new MMKV({
    id: 'secure-tokens',
    encryptionKey: this.getEncryptionKey(),
  });

  private getEncryptionKey(): string {
    // In production: retrieve from Keychain/Keystore
    // Never hardcode encryption keys
    return Keychain.getEncryptionKey();
  }

  async storeTokens(accessToken: string, refreshToken: string) {
    this.storage.set('access_token', accessToken);
    this.storage.set('refresh_token', refreshToken);
    
    // Log security event
    Analytics.track('token_stored', { 
      timestamp: Date.now(),
      method: 'mmkv_encrypted' 
    });
  }
}
```

### OAuth Security

```typescript
// Secure OAuth configuration
const oauthConfig = {
  google: {
    clientId: Constants.expoConfig?.extra?.googleClientId,
    scopes: ['openid', 'profile', 'email'],
    redirectUri: AuthSession.makeRedirectUri({
      scheme: 'musiclab',
      path: 'auth/callback',
    }),
    // Additional security parameters
    additionalParameters: {
      state: generateSecureRandomString(32),
      nonce: generateSecureRandomString(32),
    },
    // PKCE for additional security
    usePKCE: true,
  },
};

// Secure OAuth flow
class OAuthService {
  async initiateGoogleAuth() {
    const state = generateSecureRandomString(32);
    const nonce = generateSecureRandomString(32);
    
    // Store state and nonce for validation
    await this.storeAuthState(state, nonce);
    
    const result = await AuthSession.startAsync({
      authUrl: this.buildAuthUrl(state, nonce),
      returnUrl: this.redirectUri,
    });
    
    // Validate state and nonce
    if (!this.validateAuthResponse(result, state, nonce)) {
      throw new Error('OAuth validation failed');
    }
    
    return result;
  }
}
```

### Session Management

```typescript
interface SessionSecurity {
  // Session timeout configuration
  readonly SESSION_TIMEOUT = 30 * 24 * 60 * 60 * 1000; // 30 days
  readonly IDLE_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours
  
  // Session validation
  validateSession(): boolean;
  refreshSession(): Promise<boolean>;
  terminateSession(): Promise<void>;
}

class SessionManager implements SessionSecurity {
  private lastActivity = Date.now();
  
  validateSession(): boolean {
    const now = Date.now();
    const timeSinceActivity = now - this.lastActivity;
    
    // Check for idle timeout
    if (timeSinceActivity > this.IDLE_TIMEOUT) {
      this.terminateSession();
      return false;
    }
    
    // Validate token expiration
    const token = this.getStoredToken();
    if (!token || this.isTokenExpired(token)) {
      return false;
    }
    
    this.updateLastActivity();
    return true;
  }
  
  private updateLastActivity() {
    this.lastActivity = Date.now();
  }
}
```

## Data Storage Security

### Encryption Strategy

```typescript
// Encryption utility
class EncryptionService {
  private static algorithm = 'AES-256-GCM';
  
  // Generate secure encryption key
  static async generateKey(): Promise<string> {
    if (Platform.OS === 'ios') {
      return await Keychain.getEncryptionKey();
    } else {
      return await Keystore.getEncryptionKey();
    }
  }
  
  // Encrypt sensitive data
  static async encrypt(data: string, key: string): Promise<string> {
    const cipher = crypto.createCipher(this.algorithm, key);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }
  
  // Decrypt sensitive data
  static async decrypt(encryptedData: string, key: string): Promise<string> {
    const decipher = crypto.createDecipher(this.algorithm, key);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}
```

### Storage Implementation

```typescript
// Secure storage abstraction
interface SecureStorage {
  set(key: string, value: string): Promise<void>;
  get(key: string): Promise<string | null>;
  remove(key: string): Promise<void>;
  clear(): Promise<void>;
}

class MMKVSecureStorage implements SecureStorage {
  private storage: MMKV;
  
  constructor(storageId: string) {
    this.storage = new MMKV({
      id: storageId,
      encryptionKey: EncryptionService.generateKey(),
    });
  }
  
  async set(key: string, value: string): Promise<void> {
    // Additional encryption for highly sensitive data
    if (this.isHighlySensitive(key)) {
      const encryptedValue = await EncryptionService.encrypt(
        value, 
        await this.getKeySpecificKey(key)
      );
      this.storage.set(key, encryptedValue);
    } else {
      this.storage.set(key, value);
    }
  }
  
  private isHighlySensitive(key: string): boolean {
    const sensitiveKeys = [
      'access_token',
      'refresh_token', 
      'payment_methods',
      'biometric_data'
    ];
    return sensitiveKeys.includes(key);
  }
}
```

## Network Security

### API Communication

```typescript
// Secure API client configuration
class SecureApiClient {
  private client: AxiosInstance;
  
  constructor() {
    this.client = axios.create({
      baseURL: Constants.expoConfig?.extra?.apiBaseUrl,
      timeout: 10000,
      
      // Security headers
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'MusicLab-Mobile',
        'X-App-Version': Constants.expoConfig?.version,
      },
    });
    
    this.setupInterceptors();
  }
  
  private setupInterceptors() {
    // Request interceptor - add auth tokens
    this.client.interceptors.request.use(
      async (config) => {
        const token = await TokenStorage.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Add request signature for critical endpoints
        if (this.isCriticalEndpoint(config.url)) {
          config.headers['X-Request-Signature'] = await this.signRequest(config);
        }
        
        return config;
      },
      (error) => Promise.reject(error)
    );
    
    // Response interceptor - handle token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          const refreshed = await this.refreshToken();
          if (refreshed) {
            // Retry original request
            return this.client.request(error.config);
          } else {
            // Redirect to login
            AuthService.logout();
          }
        }
        return Promise.reject(error);
      }
    );
  }
  
  private async signRequest(config: any): Promise<string> {
    const payload = JSON.stringify({
      method: config.method,
      url: config.url,
      data: config.data,
      timestamp: Date.now(),
    });
    
    const signature = await crypto.subtle.sign(
      'HMAC',
      await this.getSigningKey(),
      new TextEncoder().encode(payload)
    );
    
    return Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }
}
```

### Certificate Pinning

```typescript
// Certificate pinning for production
class CertificatePinner {
  private static readonly PINNED_CERTIFICATES = [
    'sha256/YLh1dUR9y6Kja30RrAn7JKnbQG/uEtLMkBgFF2Fuihg=', // Primary
    'sha256/C5+lpZ7tcVwmwQIMcRtPbsQtWLABXhQzejna0wHFr8M=', // Backup
  ];
  
  static validateCertificate(serverCertificate: string): boolean {
    const certificateHash = this.computeSHA256(serverCertificate);
    return this.PINNED_CERTIFICATES.includes(`sha256/${certificateHash}`);
  }
  
  private static computeSHA256(certificate: string): string {
    return crypto.createHash('sha256')
      .update(certificate, 'base64')
      .digest('base64');
  }
}
```

## Payment Security

### PCI DSS Compliance

```typescript
// Secure payment processing
class PaymentSecurity {
  // Never store card details locally
  private static readonly FORBIDDEN_STORAGE = [
    'card_number',
    'cvv',
    'expiry_date',
    'cardholder_name'
  ];
  
  static async processPayment(paymentData: PaymentData): Promise<PaymentResult> {
    // Validate payment data doesn't contain forbidden fields
    this.validatePaymentData(paymentData);
    
    // Use Stripe's secure tokenization
    const token = await Stripe.createToken(paymentData);
    
    // Send only token to backend
    return await ApiClient.post('/payments/process', {
      payment_token: token.id,
      amount: paymentData.amount,
      currency: paymentData.currency,
    });
  }
  
  private static validatePaymentData(data: PaymentData): void {
    const keys = Object.keys(data);
    const forbiddenKeys = keys.filter(key => 
      this.FORBIDDEN_STORAGE.includes(key)
    );
    
    if (forbiddenKeys.length > 0) {
      throw new Error(`Forbidden payment data: ${forbiddenKeys.join(', ')}`);
    }
  }
}
```

### Billing Provider Security

```typescript
// Secure billing abstraction
abstract class SecureBillingProvider {
  abstract async processPayment(amount: number, currency: string): Promise<PaymentResult>;
  
  // Security event logging
  protected logSecurityEvent(event: string, data?: any): void {
    Analytics.track('security_event', {
      event,
      provider: this.getProviderName(),
      timestamp: Date.now(),
      // Don't log sensitive payment data
      metadata: this.sanitizeLogData(data),
    });
  }
  
  private sanitizeLogData(data: any): any {
    if (!data) return {};
    
    const sanitized = { ...data };
    
    // Remove sensitive fields
    delete sanitized.card_number;
    delete sanitized.cvv;
    delete sanitized.payment_method_id;
    
    return sanitized;
  }
}
```

## Privacy Protection

### PII Handling

```typescript
// PII detection and protection
class PIIProtector {
  private static readonly PII_PATTERNS = {
    email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
    phone: /(\+\d{1,3}[- ]?)?\d{10}/g,
    creditCard: /\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/g,
  };
  
  // Hash PII for analytics
  static hashPII(data: string): string {
    return crypto.createHash('sha256')
      .update(data + this.getSalt())
      .digest('hex');
  }
  
  // Sanitize logs
  static sanitizeLogs(logData: any): any {
    let sanitized = JSON.stringify(logData);
    
    Object.entries(this.PII_PATTERNS).forEach(([type, pattern]) => {
      sanitized = sanitized.replace(pattern, `[${type.toUpperCase()}_REDACTED]`);
    });
    
    return JSON.parse(sanitized);
  }
  
  private static getSalt(): string {
    // App-specific salt for PII hashing
    return Constants.expoConfig?.extra?.piiSalt || 'default-salt';
  }
}
```

### Data Minimization

```typescript
// Only collect necessary data
interface DataCollectionPolicy {
  // Define what data is necessary for each feature
  readonly REQUIRED_DATA = {
    authentication: ['email', 'password_hash'],
    personalization: ['listening_history', 'likes'],
    analytics: ['user_id_hash', 'session_data'],
    payments: ['subscription_status', 'payment_token'],
  };
  
  // Automatic data cleanup
  readonly DATA_RETENTION = {
    session_logs: 30, // days
    analytics_events: 365 * 2, // 2 years
    user_preferences: 0, // keep until account deletion
  };
}

class DataGovernance {
  static async cleanupExpiredData(): Promise<void> {
    const policies = new DataCollectionPolicy();
    
    Object.entries(policies.DATA_RETENTION).forEach(async ([dataType, retentionDays]) => {
      if (retentionDays > 0) {
        await this.removeDataOlderThan(dataType, retentionDays);
      }
    });
  }
  
  private static async removeDataOlderThan(dataType: string, days: number): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    // Implementation would depend on storage mechanism
    await StorageManager.removeWhere(dataType, {
      created_at: { $lt: cutoffDate },
    });
  }
}
```

## Input Validation & Sanitization

### API Input Validation

```typescript
// Input validation schemas
const validationSchemas = {
  email: z.string().email().max(254),
  password: z.string().min(8).max(128).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
  playlist_name: z.string().min(1).max(100).regex(/^[a-zA-Z0-9\s\-_]+$/),
  search_query: z.string().min(1).max(200),
};

// Secure input handler
class InputValidator {
  static validate<T>(schema: z.ZodSchema<T>, input: unknown): T {
    try {
      return schema.parse(input);
    } catch (error) {
      // Log potential security event
      Analytics.track('input_validation_failed', {
        error: error.message,
        input_type: typeof input,
        timestamp: Date.now(),
      });
      
      throw new ValidationError('Invalid input format');
    }
  }
  
  // Sanitize user input
  static sanitizeInput(input: string): string {
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML
      .replace(/javascript:/gi, '') // Remove JavaScript URLs
      .replace(/on\w+=/gi, ''); // Remove event handlers
  }
}
```

### SQL Injection Prevention

```typescript
// Safe database queries (using prepared statements)
class DatabaseSecurity {
  static async safeQuery(query: string, params: any[]): Promise<any> {
    // Validate query doesn't contain dangerous patterns
    this.validateQuery(query);
    
    // Use parameterized queries only
    return await Database.execute(query, params);
  }
  
  private static validateQuery(query: string): void {
    const dangerousPatterns = [
      /;\s*(drop|delete|truncate|alter)\s+/i,
      /union\s+select/i,
      /\|\||&&|\-\-/,
    ];
    
    dangerousPatterns.forEach(pattern => {
      if (pattern.test(query)) {
        throw new Error('Potentially dangerous query detected');
      }
    });
  }
}
```

## Security Monitoring & Incident Response

### Security Event Detection

```typescript
// Security monitoring
class SecurityMonitor {
  private static readonly SUSPICIOUS_PATTERNS = {
    rapid_login_attempts: { threshold: 5, window: 300000 }, // 5 attempts in 5 minutes
    mass_data_access: { threshold: 100, window: 60000 }, // 100 requests in 1 minute
    unusual_download_volume: { threshold: 1000, window: 3600000 }, // 1GB in 1 hour
  };
  
  static monitorUserActivity(userId: string, activity: string): void {
    const activityCount = this.getActivityCount(userId, activity);
    const pattern = this.SUSPICIOUS_PATTERNS[activity];
    
    if (pattern && activityCount > pattern.threshold) {
      this.triggerSecurityAlert(userId, activity, activityCount);
    }
  }
  
  private static triggerSecurityAlert(userId: string, activity: string, count: number): void {
    // Log security incident
    Analytics.track('security_alert', {
      user_id: PIIProtector.hashPII(userId),
      activity,
      count,
      timestamp: Date.now(),
      severity: this.calculateSeverity(activity, count),
    });
    
    // Take protective action
    this.applySecurityMeasures(userId, activity);
  }
  
  private static applySecurityMeasures(userId: string, activity: string): void {
    switch (activity) {
      case 'rapid_login_attempts':
        AuthService.temporaryAccountLock(userId, 900000); // 15 minutes
        break;
      case 'mass_data_access':
        RateLimiter.throttleUser(userId, 60000); // 1 minute
        break;
      case 'unusual_download_volume':
        DownloadService.pauseDownloads(userId, 3600000); // 1 hour
        break;
    }
  }
}
```

### Incident Response Plan

```typescript
// Automated incident response
class IncidentResponse {
  static async handleSecurityIncident(incident: SecurityIncident): Promise<void> {
    // 1. Immediate containment
    await this.containThreat(incident);
    
    // 2. Assessment
    const severity = await this.assessIncident(incident);
    
    // 3. Notification
    if (severity >= Severity.HIGH) {
      await this.notifySecurityTeam(incident);
    }
    
    // 4. Documentation
    await this.documentIncident(incident);
    
    // 5. Recovery
    await this.initiateRecovery(incident);
  }
  
  private static async containThreat(incident: SecurityIncident): Promise<void> {
    switch (incident.type) {
      case 'account_compromise':
        await AuthService.revokeAllTokens(incident.userId);
        break;
      case 'data_breach':
        await DataService.enableEmergencyMode();
        break;
      case 'payment_fraud':
        await PaymentService.freezeAccount(incident.userId);
        break;
    }
  }
}
```

## Security Checklist

### Development Security Checklist

- [ ] All secrets stored in secure environment variables
- [ ] Authentication tokens encrypted in storage
- [ ] Input validation on all user inputs
- [ ] API endpoints protected with rate limiting
- [ ] Sensitive data never logged
- [ ] PII properly hashed/anonymized
- [ ] Certificate pinning implemented
- [ ] Security headers configured
- [ ] Dependency vulnerability scanning enabled
- [ ] Code security scanning in CI/CD

### Deployment Security Checklist

- [ ] Production environment uses HTTPS only
- [ ] Database encrypted at rest
- [ ] Backup encryption enabled
- [ ] Access logs monitored
- [ ] Security monitoring alerts configured
- [ ] Incident response plan documented
- [ ] Regular security audits scheduled
- [ ] Staff security training completed
- [ ] Third-party security assessments conducted
- [ ] Compliance requirements met (GDPR, PCI DSS)

This security framework provides comprehensive protection while maintaining usability and performance for MusicLab users.
