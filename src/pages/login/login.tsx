import './login.scss'
import { Button, TextField, Typography } from '@mui/material';
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import loginImg from '../../assets/login-img.jpg';
import { useState } from 'react';
import { } from "module";
// import { FecthRequestModel } from '../../models/request.model';
import { setUser } from '../../features/auth/authSlice';
import { ROUTES } from '../../constants/routes';


function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const loginRequest = FecthRequestModel.getInstance();
  const [credentials, setCredentials] = useState({ email: '', password: '' });


  const formHanlder = (target: 'email' | 'password', e: any) => {
    const value = target === 'email' ? (e.target.value as string).trim() : e.target.value;
    setCredentials({ ...credentials, [target]: value });
  }

  const login = async (e: any) => {
    e.preventDefault()
    // const response = await loginRequest.post('/users/login', credentials, true);
    dispatch(setUser({
      rol: 'admin',
      name: 'kevin',
      email: credentials.email,
      id: '123456'
    }))
    navigate(`${ROUTES.DASHBOARD}/${ROUTES.USERS}`);
  }

  const validCredentials = ():boolean => {
    return credentials.email === '' || credentials.password === '';
  }

  return (
    <div className='login-view'>
      <div className='login-view__image-container'>
        <img src={loginImg} alt='Logo' />
      </div>

      <div className='login-view__login-form'>
        <div className='login-view__login-form__card'>
          <img className='login-view__login-form__card__logo' src={logo} alt="Logo" />
          <Typography variant="h4">Bienvenido a Qualty</Typography>
          <form className="login-view__login-form__card__form-container" onSubmit={login}>
            <TextField
              className='login-view__login-form__form-container__input'
              id="user"
              name='email'
              onChange={(e) => formHanlder('email', e)}
              placeholder='Email'
            />


            <TextField
              className='login-view__login-form__form-container__input'
              id="pass"
              name='password'
              placeholder='Contraseña'
              type='password'
              onChange={(e) => formHanlder('password', e)}
            />

            <Button variant="contained" type='submit' disabled={validCredentials()}>Ingresar</Button>
          </form>
        </div>

      </div>
    </div>
  )
}

export default Login