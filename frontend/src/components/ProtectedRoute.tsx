/**
 * Protected Route Component
 * Wraps routes that require authentication
 * Redirects unauthenticated users to login page
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
  const { isAuthenticated, user } = useAuth();

  // Check authentication
  if (!isAuthenticated || !user) {
    // Redirect to login if not authenticated
    navigate({ to: "/login" });
    return null;
  }

  // Check role if specified
  if (requiredRole && user.role.toLowerCase() !== requiredRole) {
    // Redirect to dashboard if wrong role
    navigate({ to: "/dashboard" });
    return null;
  }

  return <>{children}</>;
}
