import { Collapse, List, ListItemButton, ListItemIcon, ListItemText, Paper } from '@mui/material'
import { sectionList } from '../../constants/section-list';
import PersonIcon from '@mui/icons-material/Person';
import AssistWalkerIcon from '@mui/icons-material/AssistWalker';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import DraftsIcon from '@mui/icons-material/Drafts';
import EmojiPeople from '@mui/icons-material/EmojiPeople';
import { useState } from 'react';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import  './sideMenu.scss'



function SideMenu() {
    const [selectedSection, setSelectedSection] = useState(sectionList[0].key);
    const [open, setOpen] = useState(false);

    const handleSectionChange = (section: string) => {
        setSelectedSection(section);
    };

    const handleClick = () => {
        console.log("llegooo");
        setOpen(!open);
    };

    const iconList = {
        person: <PersonIcon />,
        book: <LibraryBooksIcon />,
        draft: <DraftsIcon />,
        assist: <AssistWalkerIcon />,
        eye: <RemoveRedEyeIcon />,
        smile: <InsertEmoticonIcon />,
        beneficiaries: <EmojiPeople />
    };

    const getIcon = (icon: string) => {
        switch (icon) {
            case 'person': return iconList.person;
            case 'draft': return iconList.draft;
            case 'book': return iconList.book;
            case 'eye': return iconList.eye;
            case 'assist': return iconList.assist;
            case 'smile': return iconList.smile;
            case 'beneficiaries': return iconList.beneficiaries
            default: return iconList.draft;
        }
    }
    return (
        <>
            <Paper elevation={2} sx={{ width: '100%', height: '100%', maxWidth: 360 }}>
                <List>
                    {sectionList.map((section: any) => {
                        return <>
                            {!section.hasChilds ?
                                <Link className='menu-item' to={section.path}>
                                    <ListItemButton key={section?.key} onClick={section.hasChilds ? handleClick : () => handleSectionChange(section?.key)}>
                                        <ListItemIcon>
                                            {getIcon(section.icon)}
                                        </ListItemIcon>
                                        <ListItemText primary={section.name} />
                                    </ListItemButton>
                                </Link> :
                                <ListItemButton key={section?.key} onClick={section.hasChilds ? handleClick : () => handleSectionChange(section?.key)}>
                                    <ListItemIcon>
                                        {getIcon(section.icon)}
                                    </ListItemIcon>
                                    <ListItemText primary={section.name} />
                                    {open ? <ExpandLess /> : <ExpandMore />}
                                </ListItemButton>}
                            {section.hasChilds &&
                                <Collapse in={open} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        {section.childrens?.map((child: any) => {
                                            return (
                                                <Link className='menu-item' to={child.path}>
                                                    <ListItemButton sx={{ pl: 4 }} key={child?.key} onClick={() => handleSectionChange(child?.key)}>
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
            </Paper>
        </>
    )
}

export default SideMenu