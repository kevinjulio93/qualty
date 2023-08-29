import { Avatar, Paper } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

import avatar from '../../assets/avatar.jpg'
import './topBar.scss'
import { useDispatch } from 'react-redux';
import { setLogout } from '../../features/auth/authSlice';
import { AppUser } from '../../models/user.model';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

function TopBar() {

    const dispatch = useDispatch();
    const navigate = useNavigate()

    const logoutFunction = () => {
        localStorage.removeItem('user');
        const user = new AppUser();
        dispatch(setLogout({...user}))
        navigate(ROUTES.DASHBOARD)
      }

    return (
        <>
            <Paper className='topbar-conintaer'>
                <div className='topbar-conintaer__profile'>
                    <Avatar alt="Remy Sharp" src={avatar} />
                    <LogoutIcon onClick={logoutFunction} />
                </div>
            </Paper>
        </>
    )
}

export default TopBar