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
import AssistWalkerIcon from "@mui/icons-material/AssistWalker";
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
import { RootState } from "../../app/store";
import { setCurrentSection } from "../../features/generalSlice";

function SideMenu(props) {
    const abilities = useSelector((state: any) => state.auth.user.abilities);
    const currentSection = useSelector((state: RootState) => state.general.currentSection);
    console.log(currentSection);
    const availableSections = sectionList.filter(section => checkPermissions(section.permission, abilities)).sort((a,b) => (a.key > b.key) ? 1 : ((b.key > a.key) ? -1 : 0));
    const [selectedSection, setSelectedSection] = useState(currentSection || availableSections[0].key);
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();

  const handleSectionChange = (section: string) => {
    dispatch(setCurrentSection(section));
    setSelectedSection(section);
  };

  const handleClick = () => {
    setOpen(!open);
  };

  const iconList = {
    person: <PersonIcon />,
    book: <LibraryBooksIcon />,
    draft: <DraftsIcon />,
    assist: <AssistWalkerIcon />,
    eye: <RemoveRedEyeIcon />,
    smile: <InsertEmoticonIcon />,
    beneficiaries: <EmojiPeople />,
    checklist: <Checklist />,
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
          className="content-menu__logout-btn btn-create"
          variant="contained"
          onClick={props.logoutF}
        >
          <span>Logout</span>
          <LogoutIcon></LogoutIcon>
        </Button>
      </Paper>
    </>
  );
}

export default SideMenu;
