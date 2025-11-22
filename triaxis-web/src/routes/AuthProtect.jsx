import { Navigate } from "react-router-dom";
import { checkPermission } from "./checkPermission";
import { usePermissions } from "./usePermissions";

export function AuthProtect({
  children,
  role,
  permissions,
  allowedRoles = [],
  requiredPermissions = [],
}) {
  const { hasRole, hasPermission } = checkPermission(role, permissions, requiredPermissions, allowedRoles)
  return (hasRole && hasPermission) ? children : <Navigate to={"/403"} replace />;
}
