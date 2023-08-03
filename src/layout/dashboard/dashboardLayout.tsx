import { useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItemText, ListItemButton, ListSubheader, ListItemIcon, Collapse } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import PersonIcon from '@mui/icons-material/Person';
import AssistWalkerIcon from '@mui/icons-material/AssistWalker';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import DraftsIcon from '@mui/icons-material/Drafts';
import './dashboard-layout.scss';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { sectionList } from '../../constants/section-list';
import logo from '../../assets/logo.png';
import { ROUTES } from '../../constants/routes';
import { setLogout } from '../../features/auth/authSlice';
import { useDispatch } from 'react-redux';
import { AppUser } from '../../models/user.model';

const DashboardLayout = () => {
  const [selectedSection, setSelectedSection] = useState(sectionList[0].key);
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

  const handleClick = () => {
    console.log("llegooo");
    setOpen(!open);
  };

  const handleSectionChange = (section: string) => {
    setSelectedSection(section);
  };

  const getIcon = (icon: string) => {
    switch (icon) {
      case 'person': return iconList.person;
      case 'draft': return iconList.draft;
      case 'book': return iconList.book;
      case 'eye': return iconList.eye;
      case 'assist': return iconList.assist;
      case 'smile': return iconList.smile;
      default: return iconList.draft;
    }
  }

  const logoutFunction = () => {
    localStorage.removeItem('user');
    const user = new AppUser();
    dispatch(setLogout({...user}))
    navigate(ROUTES.DASHBOARD)
  }

  return (
    <div className="dashboard-layout">
      <AppBar position="fixed" className="dashboard-layout__side-bar-container">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            {selectedSection}
          </Typography>
          <IconButton color="inherit">
            <AccountCircleIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        anchor="left"
        className="dashboard-layout__drawer"
      >
        <List
          sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
          component="nav"
          aria-labelledby="nested-list-subheader"
          className='dashboard-layout__drawer__list'
          subheader={
            <ListSubheader component="div" id="nested-list-subheader">
              Secciones
            </ListSubheader>
          }
        >
          {sectionList.map((section) => {
            return <>
              {!section.hasChilds ?
                <Link to={section.path}>
                  <ListItemButton key={section.key} onClick={section.hasChilds ? handleClick : () => handleSectionChange(section.key)}>
                    <ListItemIcon>
                      {getIcon(section.icon)}
                    </ListItemIcon>
                    <ListItemText primary={section.name} />
                  </ListItemButton>
                </Link> :
                <ListItemButton key={section.key} onClick={section.hasChilds ? handleClick : () => handleSectionChange(section.key)}>
                  <ListItemIcon>
                    {getIcon(section.icon)}
                  </ListItemIcon>
                  <ListItemText primary={section.name} />
                  {open ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>}
              {section.hasChilds &&
                <Collapse in={open} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {section.childrens?.map((child) => {
                      return (
                        <Link to={child.path}>
                          <ListItemButton sx={{ pl: 4 }} key={child.key} onClick={() => handleSectionChange(child.key)}>
                            <ListItemIcon>
                              {getIcon(child.icon)}
                            </ListItemIcon>
                            <ListItemText primary={child.name} />
                          </ListItemButton>
                        </Link>
                      )
                    })}
                  </List>
                </Collapse>
              }
            </>
          })}
        </List>
      </Drawer>
      <AppBar position="fixed" className='dashboard-layout__top-bar-container' color="default" style={{height: '65px'}}>
        <Toolbar className='dashboard-layout__top-bar-container__tool-bar'>
          <IconButton color="inherit">
            <img src={logo} className='dashboard-layout__top-bar-container__tool-bar__image' />
          </IconButton>
          <div>
            <IconButton color="inherit">
              <AccountCircleIcon />
            </IconButton>
            <IconButton color="inherit" onClick={() => logoutFunction()}>
              <ExitToAppIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      <main className="dashboard-layout__body-content">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;