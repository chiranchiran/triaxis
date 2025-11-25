import { checkPermission } from "./checkPermission";

export const withPermission = (WrappedComponent, allowedRoles = [], requiredPermissions = [],) => {
  // 返回新组件
  return (props) => {
    const { hasRole, hasPermission } = checkPermission(requiredPermissions, allowedRoles)
    // 权限校验逻辑（统一处理）
    if (!hasRole || !hasPermission) {
      return <div>无权限访问</div>; // 无权限提示（统一UI）
    }

    // 有权限则渲染原组件，并传递props
    return <WrappedComponent {...props} />;
  };
};