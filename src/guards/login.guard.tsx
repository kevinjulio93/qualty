import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "../app/store";
import { ROUTES } from "../constants/routes";

export const LoginGuard = () => {
    const authenticated = useSelector((state: RootState) => state.auth.user.id);
    return authenticated ? <Navigate replace to={ROUTES.DASHBOARD}/> : <Outlet/> 
}

export default LoginGuard
