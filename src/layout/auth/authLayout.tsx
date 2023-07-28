import './auth-layout.scss';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import logo from '../../assets/logo.png';


const AuthLayout = () => {
  return (
    <Box>
        <img src={logo} alt="Logo" style={{ width: '60px', position: 'absolute', top: '50px', left: '30px' }} />
        <Outlet />
    </Box>
  );
};

export default AuthLayout;
