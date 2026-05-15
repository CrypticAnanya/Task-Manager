import { Navigate, Outlet } from "react-router-dom";

import { Skeleton } from "../ui/Skeleton";
import { useAuth } from "../../store/auth";

export function ProtectedRoute({ adminOnly = false }: { adminOnly?: boolean }) {
  const { user, isLoading, isAdmin } = useAuth();

  if (isLoading) {
    return <div className="grid min-h-screen place-items-center"><Skeleton className="h-16 w-64" /></div>;
  }
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/dashboard" replace />;

  return <Outlet />;
}
