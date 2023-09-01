import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "../app/store";
import { ROUTES } from "../constants/routes";

export const PermissionGuard = (props: any) => {
    const abilities = useSelector((state: RootState) => state.auth.user.abilities);
    const { subject, action } = props.permissions;

    const checkPermissions = (): boolean => {
        const index = abilities.findIndex((ability) => ability.subject === subject);
        return index === -1 ? false : action.every((current: string) => abilities[index].action.includes(current));
    }
    return checkPermissions() ? <Outlet/> : <Navigate replace to={`${ROUTES.DASHBOARD}/${ROUTES.UNAUTHORIZED}`}/>
}

export default PermissionGuard