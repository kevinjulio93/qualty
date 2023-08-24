import { ReactNode } from 'react';
import { Paper } from '@mui/material';
import './dialog.scss';


export interface SimpleDialogProps {
  coords: number[];
  children: ReactNode;
}

const SimpleDialog = (props: SimpleDialogProps) => {
  const { children, coords } = props;
  const dialogStyles = {
    top: coords[1] + 'px',
    left: coords[0] - 100 + 'px',
  };


  return (
    <Paper elevation={3} className='float-simple-dialog' style={dialogStyles}>
      {children}
    </Paper>
  );
}

export { SimpleDialog };