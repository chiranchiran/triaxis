import { Navigate } from "react-router-dom";
import { checkPermission } from "./checkPermission";
import { usePermissions } from "./usePermissions";

export function AuthProtect({
  children,
  allowedRoles = [],
  requiredPermissions = [],
}) {
  const { hasRole, hasPermission } = checkPermission(requiredPermissions, allowedRoles)
  return (hasRole && hasPermission) ? children : <Navigate to={"/403"} replace />;
}
