import { Avatar, Paper } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import logo from '../../assets/logo.png'
import avatar from '../../assets/avatar.jpg'
import './topBar.scss'

function TopBar() {
    return (
        <>
            <Paper className='topbar-conintaer' sx={{ height: '60px', width: '100%', position: 'fixed' }}>
                <div className='topbar-conintaer__logo'> <img src={logo} alt="" /></div>
                <div className='topbar-conintaer__profile'>
                    <Avatar alt="Remy Sharp" src={avatar} />
                    <LogoutIcon></LogoutIcon>
                </div>
            </Paper>
        </>
    )
}

export default TopBar