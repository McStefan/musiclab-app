import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { AuthTokens } from '../modules/auth/types';
import { authStorage } from '../modules/auth/storage/authStorage';
import { globalErrorHandler } from '../utils/errorHandler';

export interface ApiConfig {
  baseURL: string;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
}

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: any;
}

class ApiClient {
  private static instance: ApiClient;
  private client: AxiosInstance;
  private config: ApiConfig;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value: any) => void;
    reject: (error: any) => void;
  }> = [];

  constructor(config: ApiConfig) {
    this.config = config;
    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  static getInstance(config?: ApiConfig): ApiClient {
    if (!ApiClient.instance) {
      const defaultConfig: ApiConfig = {
        baseURL: process.env.EXPO_PUBLIC_API_BASE_URL || 'https://api.musiclab.app',
        timeout: 30000,
        retryAttempts: 3,
        retryDelay: 1000,
      };
      ApiClient.instance = new ApiClient(config || defaultConfig);
    }
    return ApiClient.instance;
  }

  private setupInterceptors(): void {
    // Request interceptor - add auth token
    this.client.interceptors.request.use(
      async (config) => {
        try {
          const tokens = await authStorage.getTokens();
          if (tokens?.accessToken) {
            config.headers.Authorization = `Bearer ${tokens.accessToken}`;
          }
        } catch (error) {
          console.warn('Failed to get auth token for request:', error);
        }
        return config;
      },
      (error) => {
        globalErrorHandler.reportError(error, 'API Request Interceptor');
        return Promise.reject(error);
      }
    );

    // Response interceptor - handle auth refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized - token expired
        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // Wait for ongoing refresh
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            })
              .then((token) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return this.client(originalRequest);
              })
              .catch((err) => {
                return Promise.reject(err);
              });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const tokens = await this.refreshToken();
            this.processQueue(null, tokens.accessToken);
            originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
            return this.client(originalRequest);
          } catch (refreshError) {
            this.processQueue(refreshError, null);
            // Redirect to login
            // NavigationService.navigate('Auth');
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        // Log API errors
        globalErrorHandler.reportError(
          new Error(`API Error: ${error.message}`),
          'API Response',
          {
            status: error.response?.status,
            url: error.config?.url,
            method: error.config?.method,
          }
        );

        return Promise.reject(this.formatError(error));
      }
    );
  }

  private async refreshToken(): Promise<AuthTokens> {
    try {
      const currentTokens = await authStorage.getTokens();
      if (!currentTokens?.refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await axios.post(
        `${this.config.baseURL}/auth/refresh`,
        {
          refreshToken: currentTokens.refreshToken,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const tokens: AuthTokens = response.data.data;
      await authStorage.storeTokens(tokens);
      return tokens;
    } catch (error) {
      await authStorage.clearAll();
      throw error;
    }
  }

  private processQueue(error: any, token: string | null): void {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(token);
      }
    });

    this.failedQueue = [];
  }

  private formatError(error: any): ApiError {
    if (error.response) {
      // Server responded with error status
      return {
        message: error.response.data?.message || 'Server error',
        code: error.response.data?.code,
        status: error.response.status,
        details: error.response.data,
      };
    } else if (error.request) {
      // Network error
      return {
        message: 'Network error. Please check your connection.',
        code: 'NETWORK_ERROR',
      };
    } else {
      // Other error
      return {
        message: error.message || 'Unknown error occurred',
        code: 'UNKNOWN_ERROR',
      };
    }
  }

  // HTTP Methods
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.get(url, config);
    return response.data;
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.post(url, data, config);
    return response.data;
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.put(url, data, config);
    return response.data;
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.patch(url, data, config);
    return response.data;
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.delete(url, config);
    return response.data;
  }

  // File upload
  async upload<T = any>(
    url: string,
    file: FormData,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.client.post(url, file, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config?.headers,
      },
    });
    return response.data;
  }

  // Streaming download
  async download(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    return this.client.get(url, {
      ...config,
      responseType: 'stream',
    });
  }

  // Set base URL
  setBaseURL(baseURL: string): void {
    this.client.defaults.baseURL = baseURL;
    this.config.baseURL = baseURL;
  }

  // Get current configuration
  getConfig(): ApiConfig {
    return { ...this.config };
  }
}

export const apiClient = ApiClient.getInstance();
