import { Avatar, Dialog, DialogTitle, List, ListItem, ListItemAvatar, ListItemButton, ListItemText } from "@mui/material"
import AddIcon from '@mui/icons-material/Add';
import PersonIcon from '@mui/icons-material/Person';
import { blue } from '@mui/material/colors';


export interface SimpleDialogProps {
    open: boolean;
    selectedValue: string;
    onClose: (value: string) => void;
}

const emails = ['username@gmail.com', 'user02@gmail.com'];


function Modal(props: SimpleDialogProps) {

    const { onClose, selectedValue, open } = props;

    const handleClose = () => {
        onClose(selectedValue);
    };

    const handleListItemClick = (value: string) => {
        onClose(value);
    };
    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>Set backup account</DialogTitle>
            <slot name="modal-content">
                <List sx={{ pt: 0 }}>
                    {emails.map((email) => (
                        <ListItem disableGutters>
                            <ListItemButton onClick={() => handleListItemClick(email)} key={email}>
                                <ListItemAvatar>
                                    <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                                        <PersonIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={email} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                    <ListItem disableGutters>
                        <ListItemButton
                            autoFocus
                            onClick={() => handleListItemClick('addAccount')}
                        >
                            <ListItemAvatar>
                                <Avatar>
                                    <AddIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="Add account" />
                        </ListItemButton>
                    </ListItem>
                </List>
            </slot>
        </Dialog>
    )
}

export default Modal