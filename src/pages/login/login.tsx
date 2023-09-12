import './login.scss'
import { TextField, Typography } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import loginImg from '../../assets/login-img.jpg';
import { useState } from 'react';
import { setUser } from '../../features/auth/authSlice';
import { ROUTES } from '../../constants/routes';
import { userLogin } from '../../services/login.service';
import { AppUser } from '../../models/user.model';
import { getReferences } from '../../services/references.service';
import { setReference } from '../../features/referencesSlice';


function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);


  const formHanlder = (target: 'email' | 'password', e: any) => {
    const value = target === 'email' ? (e.target.value as string).trim() : e.target.value;
    setCredentials({ ...credentials, [target]: value });
  }

  const login = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    const response = await userLogin(credentials);
    if (response.status === 200) {
      setLoading(false)
      const user = new AppUser(response.result.user);
      getAllReferences()
      dispatch(setUser({...user}));
      navigate(`${ROUTES.DASHBOARD}/${ROUTES.USERS}`);
    } else {
      setLoading(false)
    }
  }

  const validCredentials = ():boolean => {
    return credentials.email === '' || credentials.password === '';
  }

  const getAllReferences = async () => {
    const response = await getReferences()
    if (response.status === 200) {
      const references = response.result;
      dispatch(setReference({...references}));
    }
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

            <LoadingButton loading={loading} variant="contained" type='submit' disabled={validCredentials()}>Ingresar</LoadingButton>
          </form>
        </div>

      </div>
    </div>
  )
}

export default Login