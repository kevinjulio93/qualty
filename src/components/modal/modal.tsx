import * as React from 'react';
import './modal.scss';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import { forwardRef, useImperativeHandle } from 'react';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

export interface DialogTitleProps {
    id: string;
    children?: React.ReactNode;
    onClose: () => void;
}

function ModalHeader(props: DialogTitleProps) {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle sx={{ m: 0, p: 2 }} {...other} className='modal-header'>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
}

const Modal = forwardRef((props:any, ref) => {
    const [open, setOpen] = React.useState(false);

    useImperativeHandle(ref, () =>{
        return {
            handleClickOpen,
        }
    })

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        props.modalClose();
        setOpen(false);
    };

    const handleSave = () => {
        props.saveMethod();
        setOpen(false);
    }

    return (
        <div>
            <Button variant="outlined" className="btn-create" onClick={handleClickOpen}>
                {props.buttonText}
            </Button>
            <BootstrapDialog className='modal-dialog'
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <ModalHeader
                id="customized-dialog-title" onClose={handleClose}>
                    {props.title}
                </ModalHeader>
                <DialogContent dividers>
                    {props.children}
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button autoFocus onClick={handleSave}>
                        Guardar
                    </Button>
                </DialogActions>
            </BootstrapDialog>
        </div>
    );
});

export default Modal;