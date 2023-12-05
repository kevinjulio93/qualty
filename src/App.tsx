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
import Ratings from './pages/ratings/ratings';
import Associations from './pages/associations/associations';
import ActivityDetail from './pages/activitiyDetail/activityDetail';
import WineriesList from './pages/wineriesList/wineriesList';
import Wineries from './pages/wineries/wineries';
import WorkshopsList from './pages/assistance/workshops';
import Assistance from './pages/assistance/assistance';
import RatingList from './pages/ratings/ratingList';
import Representatives from './pages/representatives/representatives';
import DeliveryList from './pages/delivery/deliveryList';
import PhysicalDeliveryList from './pages/physicalDelivery/physicalDeliveryList';
import PhysicalDelivery from './pages/physicalDelivery/physicalDelivery';
import Delivery from './pages/delivery/delivery';
import EventList from './pages/events/events';
import EventDetail from './pages/eventDetail/eventDetail';
import EventAssistance from './pages/event_assistance/eventAssistance';
import Stats from './pages/stats/stats';
import RepDeliveryList from './pages/repDeliveryList/repDeliveryList';
import RepDeliveryDetail from './pages/repDeliveryDetail/repDeliveryDetail';
import Reports from './pages/reports/reports';
import Resume from './pages/resume/resume';
import ListEventAssistance from './pages/event_assistance/lisEventAssistance';


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
                <Route element={<PermissionGuard permissions={{ subject: SECTIONS.INVENTORY, action: [PERMISSIONS.READ] }} />}>
                  <Route path={ROUTES.INVENTORY} element={<Inventory />} />
                </Route>

                <Route element={<PermissionGuard permissions={{ subject: SECTIONS.EVENTS, action: [PERMISSIONS.CREATE] }} />}>
                  <Route path={ROUTES.EVENTS_ASSISTANCE} element={<EventAssistance />} />
                </Route>

                <Route element={<PermissionGuard permissions={{ subject: SECTIONS.ROLE, action: [PERMISSIONS.READ] }} />}>
                  <Route path={ROUTES.WINERIES_LIST} element={<WineriesList/>} />
                </Route>
                <Route element={<PermissionGuard permissions={{ subject: SECTIONS.ROLE, action: [PERMISSIONS.READ] }} />}>
                  <Route path={ROUTES.WINERIES} element={<Wineries/>} />
                  <Route path='wineries/:winerieId' element={<Wineries />} />
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
                <Route element={<PermissionGuard permissions={{ subject: SECTIONS.ASSISTANCE, action: [PERMISSIONS.READ] }} />}>
                  <Route path={ROUTES.WORKSHOP} element={<WorkshopsList />} />
                </Route>
                <Route element={<PermissionGuard permissions={{ subject: SECTIONS.ASSISTANCE, action: [PERMISSIONS.CREATE] }} />}>
                  <Route path={ROUTES.ASSISTANCE} element={<Assistance />}>
                    <Route path=':workshopId' element={<Beneficiaries />} />
                  </Route>
                </Route>
                <Route element={<PermissionGuard permissions={{ subject: SECTIONS.RATINGS, action: [PERMISSIONS.READ] }} />}>
                  <Route path={ROUTES.RATING_LIST} element={<RatingList />} />
                </Route>
                <Route element={<PermissionGuard permissions={{ subject: SECTIONS.RATINGS, action: [PERMISSIONS.CREATE] }} />}>
                  <Route path={ROUTES.RATINGS} element={<Ratings />} >
                    <Route path=':ratingId' element={<Beneficiaries />} />
                  </Route>
                </Route>
                <Route element={<PermissionGuard permissions={{ subject: SECTIONS.ASSOCIATIONS, action: [PERMISSIONS.READ] }} />}>
                  <Route path={ROUTES.ASSOCIATIONS} element={<Associations />} />
                  <Route element={<PermissionGuard permissions={{ subject: SECTIONS.ASSOCIATIONS, action: [PERMISSIONS.CREATE] }} />}>
                    <Route path={ROUTES.ASSOCIATIONS} element={<Associations />} />
                  </Route>
                </Route>
                <Route element={<PermissionGuard permissions={{ subject: SECTIONS.EVENTS, action: [PERMISSIONS.READ] }} />}>
                  <Route path={ROUTES.EVENTS_LIST} element={<EventList />} />
                </Route>
                <Route element={<PermissionGuard permissions={{ subject: SECTIONS.EVENTS, action: [PERMISSIONS.READ] }} />}>
                  <Route path={ROUTES.EVENTS} element={<EventDetail/>} />
                  <Route path={ROUTES.EVENTS+'/:eventId'} element={<EventDetail />} />
                  <Route path={ROUTES.STATS+'/:eventId'} element={<Stats />} />
                  <Route path={ROUTES.ACTS} element={<ListEventAssistance />} />
                </Route>
                <Route element={<PermissionGuard permissions={{ subject: SECTIONS.DELIVERY, action: [PERMISSIONS.READ] }} />}>
                  <Route path={ROUTES.DELIVERY_LIST} element={<DeliveryList />} />
                </Route>
                <Route element={<PermissionGuard permissions={{ subject: SECTIONS.DELIVERY, action: [PERMISSIONS.CREATE] }} />}>
                  <Route path={ROUTES.DELIVERY} element={<Delivery />} />
                  <Route path={ROUTES.DELIVERY+'/:deliveryId'} element={<Delivery />} />
                </Route>

                <Route element={<PermissionGuard permissions={{ subject: SECTIONS.REPRESENTATIVE_DELIVERY, action: [PERMISSIONS.READ] }} />}>
                  <Route path={ROUTES.REPRESENTATIVE_DELIVERY_LIST} element={<RepDeliveryList />} />
                </Route>
                <Route element={<PermissionGuard permissions={{ subject: SECTIONS.REPRESENTATIVE_DELIVERY, action: [PERMISSIONS.CREATE] }} />}>
                  <Route path={ROUTES.REPRESENTATIVE_DELIVERY_DETAIL} element={<RepDeliveryDetail />} />
                  <Route path={ROUTES.REPRESENTATIVE_DELIVERY_DETAIL+'/:deliveryId'} element={<RepDeliveryDetail />} />
                </Route>

                <Route element={<PermissionGuard permissions={{ subject: SECTIONS.DELIVERY, action: [PERMISSIONS.READ] }} />}>
                  <Route path={ROUTES.PHYSICAL_DELIVERY_LIST} element={<PhysicalDeliveryList />} />
                </Route>
                <Route element={<PermissionGuard permissions={{ subject: SECTIONS.DELIVERY, action: [PERMISSIONS.CREATE] }} />}>
                  <Route path={ROUTES.PHYSICAL_DELIVERY} element={<PhysicalDelivery />} />
                  <Route path={`${ROUTES.PHYSICAL_DELIVERY}/:idDelivery`} element={<PhysicalDelivery />} />
                </Route>
                <Route element={<PermissionGuard permissions={{ subject: SECTIONS.REPRESENTATIVE, action: [PERMISSIONS.READ] }} />}>
                  <Route path={ROUTES.REPRESENTATIVES} element={<Representatives />} />
                </Route>
                <Route element={<PermissionGuard permissions={{ subject: SECTIONS.REPORTS, action: [PERMISSIONS.CREATE] }} />}>
                  <Route path={ROUTES.REPORTS} element={<Reports />} />
                </Route>
                <Route element={<PermissionGuard permissions={{ subject: SECTIONS.RESUMEN, action: [PERMISSIONS.READ] }} />}>
                  <Route path={ROUTES.RESUMEN} element={<Resume />} />
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
