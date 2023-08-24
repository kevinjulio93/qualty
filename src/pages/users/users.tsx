import { useEffect, useRef, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Typography } from '@mui/material';
import './users.scss'
import Modal from '../../components/modal/modal';
import UserForm from '../../components/userForm/userForm';
import { createUser, getUserList } from '../../services/user.service';

const columns: GridColDef[] = [
  { field: 'nombre', headerName: 'Nombre', width: 300 },
  { field: 'email', headerName: 'Email', width: 300 },
  { field: 'role', headerName: 'Role', width: 300 },
  { field: 'actions', headerName: 'Acciones', width: 300 }
];

function Users() {
  const userRef = useRef(null)
  const [users, setUsers] = useState([]);
  const [rows, setRows] = useState([]);


  useEffect(() => {
    getUsers();
  }, [])

  function createGridRows(userList: any[]) {
    const rowsList: Array<any> = [];
    userList.forEach((user: any, index: number) => {
      rowsList.push({
        id: index,
        nombre: user.name,
        email: user.email,
        role: user.role,
        actions: 'Editar - Eliminar'
      });
    });
    setRows(rowsList);
  }

  const getUsers = async () => {
    const response = await getUserList();
    const userList = response.result.data;
    createGridRows(userList);
    setUsers(userList);
  }

  const saveData = async () => {
    if (userRef.current !== null) {
      const user = (userRef.current as any).getUser()
      await createUser(user)
    }
  }

  return (
    rows &&
    <div className='users-container'>
      <div className='users-container__actions'>
        <Typography variant="h5">Listado de usuarios</Typography>
        <Modal saveUser={saveData}>
          <UserForm ref={userRef} ></UserForm>
        </Modal>
      </div>
      <DataGrid rows={rows} columns={columns} />
      {/* <TableComponent></TableComponent> */}
    </div>
  );
}

export default Users;