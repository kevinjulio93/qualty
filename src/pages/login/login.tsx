// import React from 'react';
import './login.scss'
import { Button, Card, TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux'
import { setUser, setPassword, setLogged } from '../../features/auth/authSlice';
import { RootState } from '../../app/store';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';


function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const password = useSelector((state: RootState) => state.auth.password);
  
  const login = () => {
    if (user !== '' && password !== '') {
        dispatch(setLogged(true));
    }
    navigate('/dashboard');
  }
  return (
    <div className='login-container'>
      <Card className='login-container__form-container'>
        <img src={logo} alt="Logo" style={{ width: '50px' }} />
        <h3>Bienvenido de vuelta a Qualty Senior</h3>
        <TextField className='login-container__form-container__field' id="user" label="User" variant="outlined" onBlur={(e) => dispatch(setUser(e.target.value))} />
        <TextField className='login-container__form-container__field' id="pass" label="Password" variant="outlined" onBlur={(e) => dispatch(setPassword(e.target.value))} />
        <Button variant="contained" onClick={login}>Ingresar</Button>
      </Card>
    </div>
  )
}

export default Login