import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "../app/store";
import { ROUTES } from "../constants/routes";
import { checkPermissions } from "../helpers/checkPermissions";

export const PermissionGuard = (props: any) => {
    const abilities = useSelector((state: RootState) => state.auth.user.abilities);

    return checkPermissions(props.permissions, abilities) ? <Outlet/> : <Navigate replace to={`${ROUTES.DASHBOARD}/${ROUTES.UNAUTHORIZED}`}/>
}

export default PermissionGuard