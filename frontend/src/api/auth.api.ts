/**
 * Authentication API functions
 * Reusable functions for login, register, logout, and token refresh
 */

import { apiClient } from "./axios";
import { ENDPOINTS } from "./endpoints";
import type { LoginCredentials, RegisterCredentials, AuthResponse, User } from "@/types/auth.types";

/**
 * Login user with email and password
 */
export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>(ENDPOINTS.AUTH.LOGIN, credentials);
  return response.data;
};

/**
 * Register new user
 */
export const registerUser = async (data: RegisterCredentials): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>(ENDPOINTS.AUTH.REGISTER, data);
  return response.data;
};

/**
 * Logout user (notify backend)
 */
export const logoutUser = async (): Promise<void> => {
  try {
    await apiClient.post(ENDPOINTS.AUTH.LOGOUT);
  } catch (error) {
    // Logout on frontend even if backend call fails
    console.error("Logout error:", error);
  }
};

/**
 * Get current authenticated user
 */
export const getCurrentUser = async (): Promise<User> => {
  const response = await apiClient.get<User>(ENDPOINTS.AUTH.ME);
  return response.data;
};

/**
 * Refresh access token using refresh token
 */
export const refreshAccessToken = async (refreshToken: string): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>(ENDPOINTS.AUTH.REFRESH_TOKEN, {
    refreshToken,
  });
  return response.data;
};
