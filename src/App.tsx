import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.scss';
import Login from './pages/login/login';
import Dashboard from './pages/dashboard/dashboard';
import AuthGuard from './guards/auth.guard';
import AuthLayout from './layout/authLayout';
import { ThemeProvider } from '@mui/material';
import { APP_THEME } from './constants/theme';


function App() {

  return (
    <div className='App'>
      <ThemeProvider theme={APP_THEME}>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Navigate to='/login' />}></Route>
            <Route path='*' element={<> Not Found </>}></Route>
            <Route element={<AuthLayout/>}>
              <Route path='login' element={<Login />}></Route>
            </Route>
            <Route element={<AuthGuard />}>
              <Route path='/dashboard' element={<Dashboard />}></Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </div>
  )
}

export default App
