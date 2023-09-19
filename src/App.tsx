import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.scss';
import Login from './pages/login/login';
import Dashboard from './pages/dashboard/dashboard';
import AuthGuard from './guards/auth.guard';
import AuthLayout from './layout/auth/authLayout';
import { ThemeProvider } from '@mui/material';
import { APP_THEME } from './constants/theme';
import DashboardLayout from './layout/dashboard/dashboardLayout';
import { ROUTES } from './constants/routes';
import LoginGuard from './guards/login.guard';
import Users from './pages/users/users';
import Inventory from './pages/inventario/inventory';
import BeneficiariesList from './pages/beneficiariesList/beneficiariesList';
import Beneficiaries from './pages/beneficiaries/beneficiaries';
import Roles from './pages/roles/roles';
import Activities from './pages/activities/activities';
import PermissionGuard from './guards/permission.guard';
import Unauthorized from './pages/unauthorized/unauthorized';
import { SECTIONS } from './constants/sections';
import { PERMISSIONS } from './constants/permissions';
import Permissions from './pages/permissions/permissions';
import ActivityDetail from './pages/activitiyDetail/activityDetail';


function App() {

  return (
    <div className='App'>
      <ThemeProvider theme={APP_THEME}>
        <BrowserRouter>
          <Routes>
            <Route path={ROUTES.DEFAULT} element={<Navigate to={ROUTES.DASHBOARD} />}></Route>
            <Route path={'*'} element={<> Not Found </>}></Route>
            <Route element={<AuthLayout />}>
              <Route element={<LoginGuard />}>
                <Route path={ROUTES.LOGIN} element={<Login />}></Route>
              </Route>
            </Route>
            <Route element={<AuthGuard />}>
              <Route path={ROUTES.DASHBOARD} element={<DashboardLayout />}>
                <Route path='index' element={<Dashboard />}></Route>
                <Route path={ROUTES.UNAUTHORIZED} element={<Unauthorized />}></Route>
                <Route element={<PermissionGuard permissions={{ subject: SECTIONS.USER, action: [PERMISSIONS.READ] }} />}>
                  <Route path={ROUTES.USERS} element={<Users />} />
                </Route>
                <Route element={<PermissionGuard permissions={{ subject: SECTIONS.ACTIVITY, action: [PERMISSIONS.READ] }} />}>
                  <Route path={ROUTES.ACTIVITIES_LIST} element={<Activities />} />
                </Route>
                <Route element={<PermissionGuard permissions={{ subject: SECTIONS.ACTIVITY, action: [PERMISSIONS.CREATE] }} />}>
                  <Route path={ROUTES.ACTIVITIES} element={<ActivityDetail />}>
                    <Route path=':activityId' element={<Beneficiaries />} />
                  </Route>
                </Route>
                <Route element={<PermissionGuard permissions={{ subject: SECTIONS.ROLE, action: [PERMISSIONS.READ] }} />}>
                  <Route path={ROUTES.INVENTORY} element={<Inventory />} />
                </Route>
                <Route element={<PermissionGuard permissions={{ subject: SECTIONS.BENEFICIARY, action: [PERMISSIONS.READ] }} />}>
                  <Route path={ROUTES.BEN_LIST} element={<BeneficiariesList />} />
                </Route>
                <Route element={<PermissionGuard permissions={{ subject: SECTIONS.BENEFICIARY, action: [PERMISSIONS.CREATE] }} />}>
                  <Route path={ROUTES.BENEFICIARIES} element={<Beneficiaries />}>
                    <Route path=':beneficiarieId' element={<Beneficiaries />} />
                  </Route>
                </Route>
                <Route element={<PermissionGuard permissions={{ subject: SECTIONS.ROLE, action: [PERMISSIONS.READ] }} />}>
                  <Route path={ROUTES.ROLES} element={<Roles />} />
                </Route>
                <Route element={<PermissionGuard permissions={{ subject: SECTIONS.ROLE, action: [PERMISSIONS.CREATE] }} />}>
                  <Route path={ROUTES.PERMISSIONS} element={<Permissions />} />
                </Route>
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </div>
  )
}

export default App
