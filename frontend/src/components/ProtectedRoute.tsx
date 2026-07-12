/**
 * Protected Route Component
 * Wraps routes that require authentication
 * Redirects unauthenticated users to login page
 * Redirects authenticated-but-unverified users to verify-email page
 */

import { ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: "student" | "tutor" | "school";
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const navigate = useNavigate();
  const { isAuthenticated, isVerified, user } = useAuth();

  // Check authentication
  if (!isAuthenticated || !user) {
    navigate({ to: "/login" });
    return null;
  }

  // Enforce email verification before any protected content
  if (!isVerified) {
    navigate({ to: "/verify-email" });
    return null;
  }

  // Check role if specified
  if (requiredRole && user.role.toLowerCase() !== requiredRole) {
    navigate({ to: "/dashboard" });
    return null;
  }

  return <>{children}</>;
}
