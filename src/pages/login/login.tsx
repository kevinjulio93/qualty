// import React from 'react';
import { useState } from 'react';
import './login.scss'
import { Button, Card, TextField } from '@mui/material';

function login() {
  const [isAuthenticated, setIsAuthenticaded] = useState(false);
  
  const login = () => {
    setIsAuthenticaded(true);
    localStorage.setItem('logged', JSON.stringify(isAuthenticated));
  }
  return (
    <div className='login-container'>
      <Card className='login-container__form-container'>
        <h3>Bienvenido de vuelta a Qualty</h3>
        <TextField className='login-container__form-container__field' id="user" label="User" variant="outlined" />
        <TextField className='login-container__form-container__field' id="pass" label="Password" variant="outlined" />
        <Button variant="contained" onClick={login}>Ingresar</Button>
      </Card>
    </div>
  )
}

export default login