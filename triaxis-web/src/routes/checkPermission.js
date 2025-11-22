import { usePermissions } from "./usePermissions";

export const checkPermission = (role, permissions, requiredPermissions = [], allowedRoles) => {
  const { hasPermission, isRole } = usePermissions();
  const isRoleAllowed = allowedRoles.length === 0
    ? true
    : allowedRoles.some(check => isRole(role, check));

  const isPermissionAllowed = requiredPermissions.length === 0
    ? true
    : requiredPermissions.every(perm => hasPermission(permissions, perm));
  return {
    hasRole: isRoleAllowed,
    hasPermission: isPermissionAllowed
  }
}
// export const checkPerssion = ({ children, requiredPermissions = [], allowedRoles }) => {
//   const { hasPermission, isRole } = usePermissions();
//   const isRoleAllowed = allowedRoles.length === 0
//     ? true
//     : allowedRoles.some(role => isRole(role));

//   const isPermissionAllowed = requiredPermissions.length === 0
//     ? true
//     : requiredPermissions.every(perm => hasPermission(perm));
//   return {
//     hasRole: isRoleAllowed,
//     hasPermission: isPermissionAllowed
//   }
// }