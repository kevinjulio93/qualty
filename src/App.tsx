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


function App() {

  return (
    <div className='App'>
      <ThemeProvider theme={APP_THEME}>
        <BrowserRouter>
          <Routes>
            <Route path={ROUTES.DEFAULT} element={<Navigate to={ROUTES.DASHBOARD} />}></Route>
            <Route path={'*'} element={<> Not Found </>}></Route>
            <Route element={<AuthLayout/>}>
              <Route path={ROUTES.LOGIN} element={<Login />}></Route>
            </Route>
            <Route element={<AuthGuard />}>
              <Route path={ROUTES.DASHBOARD} element={<DashboardLayout/>}>
                <Route path='index' element={<Dashboard />}></Route>
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </div>
  )
}

export default App
