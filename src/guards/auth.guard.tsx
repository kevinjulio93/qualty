import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "../app/store";
import { ROUTES } from "../constants/routes";

export const AuthGuard = () => {
    const authenticated = useSelector((state: RootState) => state.auth.user.token);
    return authenticated ? <Outlet/> : <Navigate replace to={ROUTES.LOGIN}/>
}

export default AuthGuard
