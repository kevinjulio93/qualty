import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "../app/store";
import { ROUTES } from "../constants/routes";

export const PermissionGuard = (props) => {
    const authUser = useSelector((state: RootState) => state.auth.user);
    console.log(authUser);
    console.log(props);
    return authUser ? <Outlet/> : <Navigate replace to={`${ROUTES.DASHBOARD}`}/>
}

export default PermissionGuard