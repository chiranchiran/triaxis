import { createContext, useContext } from "react";
import { useSelector } from "react-redux";

// 权限上下文
const PermissionsContext = createContext();


export function PermissionsProvider({ children }) {
  // const [loading, setLoading] = useState(true);
  const { role = null, permissions = [] } = useSelector(state => state.auth)
  console.log("当前用户角色为", role)

  // 权限检查方法：是否拥有某个权限
  const hasPermission = (permission) => {
    return permissions?.includes(permission) || false;
  };

  // 角色检查方法：是否为某个角色
  const isRole = (allowRole) => {
    return role === allowRole;
  };

  return (
    <PermissionsContext.Provider
      value={{
        role,
        permissions,
        hasPermission,
        isRole,
      }}
    >
      {children}
    </PermissionsContext.Provider>
  );
}

// 权限钩子：供组件内部使用
export function usePermissions() {
  const context = useContext(PermissionsContext);
  if (!context) {
    throw new Error("usePermissions 必须在 PermissionsProvider 内部使用");
  }
  return context;
}