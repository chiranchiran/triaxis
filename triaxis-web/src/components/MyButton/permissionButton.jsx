import { useTranslation } from "react-i18next";
import { checkPermission } from "../../routes/checkPermission";
import { ROLE } from "../../utils/constant/role";
import { useNavigate } from "react-router-dom";
import { MyButton } from ".";
import {
  SearchOutlined, CrownOutlined, GlobalOutlined, UserOutlined, MoonOutlined, SunOutlined, SettingOutlined, BellOutlined, UploadOutlined, FolderOutlined, BookOutlined, StarOutlined, LogoutOutlined
} from '@ant-design/icons';

const { GUEST, USER, ADMIN } = ROLE

export const permissionButton = (WrappedComponent, allowedRoles = [USER, ADMIN], requiredPermissions = [],) => {
  // 返回新组件
  return (props) => {
    const { hasRole, hasPermission } = checkPermission(requiredPermissions, allowedRoles)
    console.log("检查按钮组件权限", hasRole)
    // 权限校验逻辑（统一处理）
    if (!hasRole || !hasPermission) {
      return <WrappedComponent {...props} disabled />; // 无权限提示（统一UI）
    }

    // 有权限则渲染原组件，并传递props
    return <WrappedComponent {...props} />;
  };
};

const upload = (props) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  return <MyButton
    type="blue"
    icon={<UploadOutlined />}
    styles="text-main"
    onClick={() => navigate("/upload")}
    {...props}
  >{t("upload")}</MyButton>
}
export const UploadButton = permissionButton(upload)