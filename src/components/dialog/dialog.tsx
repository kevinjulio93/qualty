import { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import './dialog.scss';


export interface SimpleDialogProps {
  title: string;
  bodyContent: string;
  mainBtnText: string;
  secondBtnText: string;
  mainBtnHandler: () => void;
  secondBtnHandler?: () => void;
  open: boolean;
}

const SimpleDialog = (props: SimpleDialogProps) => {
  const [open, setOpen] = useState(true);

  const handleMainBtn = () => {
    props.mainBtnHandler();
    setOpen(false);
  };

  const handleSecondBtn = () => {
    props.secondBtnHandler && props.secondBtnHandler();
    setOpen(false);
  };


  return (
    <Dialog
        open={open}
        onClose={handleSecondBtn}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {props.title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {props.bodyContent}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSecondBtn}>{props.secondBtnText}</Button>
          <Button onClick={handleMainBtn} autoFocus>{props.mainBtnText}</Button>
        </DialogActions>
      </Dialog>
  );
}

export { SimpleDialog };