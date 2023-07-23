import { Navigate, Outlet } from "react-router-dom";

export const AuthGuard = () => {
    const authenticated = JSON.parse(localStorage.getItem('logged') as string);
    return authenticated ? <Outlet/> : <Navigate replace to={'/login'}/>
}

export default AuthGuard
