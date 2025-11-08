import { apiClient } from './client';
import { User, AuthTokens, LoginCredentials, RegisterData, ApiResponse } from '../../types';

interface LoginResponse {
  user: User;
  tokens: AuthTokens;
}

interface RegisterResponse {
  user: User;
  tokens: AuthTokens;
}

interface RefreshResponse {
  tokens: AuthTokens;
}

export const authApi = {
  // Login user
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>('/auth/login/', credentials);
  },

  // Register new user
  async register(data: RegisterData): Promise<RegisterResponse> {
    return apiClient.post<RegisterResponse>('/auth/register/', data);
  },

  // Refresh access token
  async refreshToken(refreshToken: string): Promise<RefreshResponse> {
    return apiClient.post<RefreshResponse>('/auth/refresh/', {
      refresh: refreshToken,
    });
  },

  // Get current user profile
  async getProfile(): Promise<User> {
    return apiClient.get<User>('/auth/profile/');
  },

  // Update user profile
  async updateProfile(data: Partial<User>): Promise<User> {
    return apiClient.patch<User>('/auth/profile/', data);
  },

  // Change password
  async changePassword(data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<ApiResponse> {
    return apiClient.post<ApiResponse>('/auth/change-password/', data);
  },

  // Request password reset
  async requestPasswordReset(email: string): Promise<ApiResponse> {
    return apiClient.post<ApiResponse>('/auth/password-reset/', { email });
  },

  // Confirm password reset
  async confirmPasswordReset(data: {
    token: string;
    newPassword: string;
  }): Promise<ApiResponse> {
    return apiClient.post<ApiResponse>('/auth/password-reset/confirm/', data);
  },

  // Verify email
  async verifyEmail(token: string): Promise<ApiResponse> {
    return apiClient.post<ApiResponse>('/auth/verify-email/', { token });
  },

  // Resend email verification
  async resendEmailVerification(): Promise<ApiResponse> {
    return apiClient.post<ApiResponse>('/auth/resend-verification/');
  },

  // Logout (optional - for server-side token invalidation)
  async logout(): Promise<ApiResponse> {
    return apiClient.post<ApiResponse>('/auth/logout/');
  },
}; 