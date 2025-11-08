import { getUser } from "../../api/modules/user";
import { useGet } from "../common/useData";

export const useGetUser = (options) => useGet(getUser, ['user', 'info'], null, options)