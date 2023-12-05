import {
  Button,
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
} from "@mui/material";
import { sectionList } from "../../constants/section-list";
import PersonIcon from "@mui/icons-material/Person";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import DraftsIcon from "@mui/icons-material/Drafts";
import EmojiPeople from "@mui/icons-material/EmojiPeople";
import { useState } from "react";
import { Checklist, ExpandLess, ExpandMore } from "@mui/icons-material";
import { Link } from "react-router-dom";
import "./sideMenu.scss";
import { useDispatch, useSelector } from "react-redux";
import { checkPermissions } from "../../helpers/checkPermissions";
import LogoutIcon from "@mui/icons-material/Logout";
import { setCurrentSection } from "../../features/generalSlice";
import Diversity3Icon from '@mui/icons-material/Diversity3';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import PsychologyIcon from '@mui/icons-material/Psychology';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import RepartitionIcon from '@mui/icons-material/Repartition';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import RuleIcon from '@mui/icons-material/Rule';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import CategoryIcon from '@mui/icons-material/Category';
import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded';
import HistoryIcon from '@mui/icons-material/History';
import FileOpenIcon from '@mui/icons-material/FileOpen';


function SideMenu(props) {
  const abilities = useSelector((state: any) => state.auth.user.abilities);
  const availableSections = sectionList
    .filter((section) => checkPermissions(section.permission, abilities))
    .sort((a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0));
  const [selectedSection, setSelectedSection] = useState(availableSections[0].key);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const handleSectionChange = (section: string) => {
    dispatch(setCurrentSection(section));
    setSelectedSection(section);
    const closeMenu = new CustomEvent("closeMenu", {});
    document.dispatchEvent(closeMenu);
  };

  const handleClick = () => {
    setOpen(!open);
  };

  const iconList = {
    person: <PersonIcon />,
    book: <LibraryBooksIcon />,
    draft: <DraftsIcon />,
    assist: <RuleIcon />,
    eye: <RemoveRedEyeIcon />,
    smile: <InsertEmoticonIcon />,
    beneficiaries: <EmojiPeople />,
    checklist: <Checklist />,
    groups: <Diversity3Icon />,
    activity: <VolunteerActivismIcon />,
    role: <PsychologyIcon />,
    event: <EmojiEventsIcon />,
    storage: <WarehouseIcon />,
    deliver: <RepartitionIcon />,
    stats: < EqualizerIcon />,
    repres: <AssignmentIndIcon />,
    items: <CategoryIcon />,
    pdf: <PictureAsPdfRoundedIcon />,
    history: <HistoryIcon></HistoryIcon>,
    opened: <FileOpenIcon />,
  };

  const getIcon = (icon: string) => {
    switch (icon) {
      case "person":
        return iconList.person;
      case "draft":
        return iconList.draft;
      case "book":
        return iconList.book;
      case "eye":
        return iconList.eye;
      case "assist":
        return iconList.assist;
      case "smile":
        return iconList.smile;
      case "beneficiaries":
        return iconList.beneficiaries;
      case "checklist":
        return iconList.checklist;
      case "groups":
        return iconList.groups;
      case "activity":
        return iconList.activity;
      case "role":
        return iconList.role;
      case "event":
        return iconList.event;
      case "storage":
        return iconList.storage;
      case "deliver":
        return iconList.deliver;
      case "stats":
          return iconList.stats;
      case "repres":
        return iconList.repres;
      case "items":
        return iconList.items;
      case "pdf":
        return iconList.pdf;
      case "history":
        return iconList.history;
      case "opened":
        return iconList.opened;
      default:
        return iconList.draft;
    }
  };
  return (
    <>
      <Paper elevation={2} className="content-menu">
        <List style={{ width: "100%" }}>
          {availableSections.map((section: any, index) => {
            return (
              <div style={{ width: "100%" }} key={index}>
                {!section.hasChilds ? (
                  <Link
                    key={index}
                    className={
                      selectedSection === section.key
                        ? "menu-item__selected"
                        : "menu-item"
                    }
                    to={section.path}
                  >
                    <ListItemButton
                      key={section?.key}
                      onClick={
                        section.hasChilds
                          ? handleClick
                          : () => handleSectionChange(section?.key)
                      }
                    >
                      <ListItemIcon className="menu-item__icon">
                        {getIcon(section.icon)}
                      </ListItemIcon>
                      <ListItemText
                        className="menu-item__text"
                        primary={section.name}
                      />
                    </ListItemButton>
                  </Link>
                ) : (
                  <ListItemButton
                    key={section?.key}
                    onClick={
                      section.hasChilds
                        ? handleClick
                        : () => handleSectionChange(section?.key)
                    }
                  >
                    <ListItemIcon>{getIcon(section.icon)}</ListItemIcon>
                    <ListItemText primary={section.name} />
                    {open ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                )}
                {section.hasChilds && (
                  <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {section.childrens?.map((child: any) => {
                        return (
                          <Link className="menu-item" to={child.path}>
                            <ListItemButton
                              sx={{ pl: 4 }}
                              key={child?.key}
                              onClick={() => handleSectionChange(child?.key)}
                            >
                              <ListItemIcon>{getIcon(child.icon)}</ListItemIcon>
                              <ListItemText primary={child.name} />
                            </ListItemButton>
                          </Link>
                        );
                      })}
                    </List>
                  </Collapse>
                )}
              </div>
            );
          })}
        </List>

        <Button
          className="content-menu__logout-btn"
          variant="contained"
          onClick={props.logoutF}
        >
          <span>Salir</span>
          <LogoutIcon sx={{ fontSize: 16 }}></LogoutIcon>
        </Button>
      </Paper>
    </>
  );
}

export default SideMenu;
