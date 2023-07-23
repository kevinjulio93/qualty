import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.scss';
import Login from './pages/login/login';
import Dashboard from './pages/dashboard/dashboard';
import AuthGuard from './guards/auth.guard';


function App() {

  return (
    <div className='App'>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Navigate to='/login' />}></Route>
          <Route path='*' element={<> Not Found </>}></Route>
          <Route path='/login' element={<Login />}></Route>
          <Route element={<AuthGuard />}>
            <Route path='/dashboard' element={<Dashboard />}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
