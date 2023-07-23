import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "../app/store";

export const AuthGuard = () => {
    const authenticated = useSelector((state: RootState) => state.auth.isLogged);
    console.log(authenticated);
    return authenticated ? <Outlet/> : <Navigate replace to={'/login'}/>
}

export default AuthGuard
