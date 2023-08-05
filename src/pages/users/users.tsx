import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import { Typography } from '@mui/material';
import './users.scss'
import Modal from '../../components/modal/modal';
import UserForm from '../../components/userForm/userForm';
import { useEffect, useRef, useState } from 'react';
import { createUser, getUserList } from '../../services/user.service';

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
  const userRef = useRef(null)
  // const [rows, setRows] = useState([]);

  useEffect(()=>{
    getUsers();
  },[])

  const getUsers = async () => {
    const users = await getUserList();
    console.log(users);
    
  }

  const saveData = async () => {
    if (userRef.current !== null) {
      const user = (userRef.current as any).getUser()
      await createUser(user)
    }
  }

  return (
    <div className='users-container'>
      <div className='users-container__actions'>
        <Typography variant="h5">Listado de usuarios</Typography>
        <Modal saveUser={saveData}>
          <UserForm ref={userRef} ></UserForm>
        </Modal>
      </div>
      <DataGrid rows={rows} columns={columns} />
    </div>
  );
}

export default Users;