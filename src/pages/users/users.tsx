import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import Modal from '../../components/modal/modal';
import { Button, Typography } from '@mui/material';
import { useState } from 'react';
import './users.scss'

const rows: GridRowsProp = [
  { id: 1, col1: 'Andres Bobadilla', col2: 'Sura EPS' },
  { id: 2, col1: 'Kevin Julio', col2: 'Comeva EPS' },
  { id: 3, col1: 'Keiner Pajaro', col2: 'Salud Total' },
  { id: 4, col1: 'Hernando Ariza', col2: 'Sura EPS' },

];

const columns: GridColDef[] = [
  { field: 'col1', headerName: 'Nombre', width: 150 },
  { field: 'col2', headerName: 'EPS', width: 150 },
];

function Users() {
  const emails = ['username@gmail.com', 'user02@gmail.com'];
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(emails[1]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value: string) => {
    setOpen(false);
    setSelectedValue(value);
  };

  return (
    <div className='users-container'>
      <div className='users-container__actions'>
      <Typography variant="h5">Listado de usuarios</Typography>
        <Button variant="outlined" onClick={handleClickOpen}>
          Create User
        </Button>
      </div>
      <DataGrid rows={rows} columns={columns} />
      <Modal
        selectedValue={selectedValue}
        open={open}
        onClose={handleClose}
      />
    </div>
  );
}

export default Users;