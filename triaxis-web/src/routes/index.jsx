import { useRoutes, useNavigate, Navigate } from "react-router-dom";
import { Button, Result } from "antd";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import React, { Suspense, useEffect, useMemo, useState } from "react";
import { ROLE } from "../utils/constant/role.js";
import { filterRoutes } from "./filterRoutes.jsx";
import { PermissionsProvider } from "./usePermissions.jsx";
import routesConfig from "./routesConfig.jsx";
import Loading from "../pages/Loading/index.jsx"
import { isEqual } from "lodash";
//路由配置
const Element = React.memo(() => {
  const { role = null, permissions = [] } = useSelector(state => state.auth);

  const filteredRoutes = useMemo(() => {
    console.log("只有 role/permissions 变化时，才重新计算路由表");
    return filterRoutes(routesConfig);
  }, [role, JSON.stringify(permissions)]);

  return useRoutes(filteredRoutes);
});

const MyRoutes = () => {
  console.log(11111111)

  return (
    <PermissionsProvider>
      <Suspense fallback={<Loading />}>
        <Element />
      </Suspense>
    </PermissionsProvider>
  )
}
export default MyRoutes