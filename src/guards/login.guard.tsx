import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "../app/store";
import { ROUTES } from "../constants/routes";
import { sectionList } from "../constants/section-list";

export const LoginGuard = () => {
    const authenticated = useSelector((state: RootState) => state.auth.user.token);
    const currentSection = useSelector((state: RootState) => state.general.currentSection);
    const listSection = sectionList.filter(item => item.key === currentSection);
    return authenticated ? <Navigate replace to={`${ROUTES.DASHBOARD}/${listSection[0].path}`}/> : <Outlet/> 
}

export default LoginGuard
