import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "../app/store";
import { ROUTES } from "../constants/routes";

export const RolesGuard = () => {
    //const authenticated = useSelector((state: RootState) => state.auth.isLogged);
   // console.log(authenticated);
    //return authenticated ? <Outlet/> : <Navigate replace to={ROUTES.LOGIN}/>
}

export default RolesGuard
