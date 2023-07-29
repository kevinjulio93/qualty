import './login.scss'
import { Button, Card, TextField } from '@mui/material';
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { useState } from 'react';
import {  } from "module";
// import { FecthRequestModel } from '../../models/request.model';
import { setUser } from '../../features/auth/authSlice';
import { ROUTES } from '../../constants/routes';


function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const loginRequest = FecthRequestModel.getInstance();
  const [credentials, setCredentials] = useState({email:'', password: ''});


  const formHanlder = (target: 'email'| 'password', e:any) => {
    setCredentials({...credentials, [target]:e.target.value});
  }

  const login = async (e:any)=> {
    e.preventDefault()
    // const response = await loginRequest.post('/users/login', credentials, true);
    dispatch(setUser({
      rol: 'admin',
      name: 'kevin',
      email: credentials.email,
      id: '123456'
    }))
    navigate(ROUTES.DASHBOARD);
  }

  return (
    <div className='login-container'>
      <Card className='login-container__card'>
        <img src={logo} alt="Logo" style={{ width: '50px' }} />
        
        <h3>Bienvenido de vuelta a Qualty Senior</h3>

        <form className="login-container__card__form-container"  onSubmit={login}>
          <TextField
            className='login-container__form-container__field'
            id="user"
            name='email'
            label="User"
            variant="outlined"
            onChange={(e)=>formHanlder('email', e)}
            />

          <TextField
            className='login-container__form-container__field'
            id="pass"
            name='password'
            label="Password"
            variant="outlined"
            onChange={(e)=>formHanlder('password', e)}
            />

          <Button variant="contained" type='submit'>Ingresar</Button>
        </form>
      </Card>
    </div>
  )
}

export default Login