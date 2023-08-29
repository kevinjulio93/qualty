import { useState } from 'react';
import PersonIcon from '@mui/icons-material/Person';
import AssistWalkerIcon from '@mui/icons-material/AssistWalker';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import DraftsIcon from '@mui/icons-material/Drafts';
import './dashboard-layout.scss';
import avatar from '../../assets/avatar01.png'
import { Outlet, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { setLogout } from '../../features/auth/authSlice';
import { useDispatch } from 'react-redux';
import { AppUser } from '../../models/user.model';
import SideMenu from '../../components/sideMenu/sideMenu';
import TopBar from '../../components/topBar/topBar';

const DashboardLayout = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const iconList = {
    person: <PersonIcon />,
    book: <LibraryBooksIcon />,
    draft: <DraftsIcon />,
    assist: <AssistWalkerIcon />,
    eye: <RemoveRedEyeIcon />,
    smile: <InsertEmoticonIcon />
  };

  const logoutFunction = () => {
    localStorage.removeItem('user');
    const user = new AppUser();
    dispatch(setLogout({ ...user }))
    navigate(ROUTES.DASHBOARD)
  }

  return (
    <div className="dashboard-layout">

      <div className="dashboard-layout__page-view">
        <div className="dashboard-layout__page-view__menu">
          <a href='#'>Qualty</a>
          <div className='dashboard-layout__page-view__menu__logo'> <img src={avatar} alt="" /></div>
          <div className='dashboard-layout__page-view__menu__info-user'>
            <h5>Jhon Snow</h5>
            <p>Administrator</p>
          </div>
          <SideMenu />
        </div>
        <main className="dashboard-layout__page-view__body-content">
          <TopBar></TopBar>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;