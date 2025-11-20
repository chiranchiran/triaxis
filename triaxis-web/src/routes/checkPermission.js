import { usePermissions } from "./usePermissions";

export const checkPermission = (requiredPermissions = [], allowedRoles) => {
  const { hasPermission, isRole } = usePermissions();
  const isRoleAllowed = allowedRoles.length === 0
    ? true
    : allowedRoles.some(role => isRole(role));

  const isPermissionAllowed = requiredPermissions.length === 0
    ? true
    : requiredPermissions.every(perm => hasPermission(perm));
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