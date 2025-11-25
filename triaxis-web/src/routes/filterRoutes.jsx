import { AuthProtect } from "./AuthProtect";

// 动态路由生成函数（根据当前 role 过滤）
export const filterRoutes = (routes, parentAllowedRoles = []) => {
  return routes.map(route => {
    const allowedRoles = route.allowedRoles || parentAllowedRoles;
    // 处理子路由（递归）
    const children = route.children
      ? { children: filterRoutes(route.children, allowedRoles) }
      : {};
    // 公开路由直接返回
    if (route.public) return { ...route, ...children };

    // // 非公开路由：检查当前角色是否在允许列表中
    // const isAllowed = route.allowedRoles?.includes(currentRole) || false;
    // if (!isAllowed) return null; // 无权限的路由过滤掉

    // 有权限的路由：套上守卫组件
    return {
      ...route,
      ...children,
      element: (
        <AuthProtect
          allowedRoles={allowedRoles || []}
          requiredPermissions={route.requiredPermissions || []}
        >
          {route.element}
        </AuthProtect>
      )
    };
  }).filter(Boolean);
}