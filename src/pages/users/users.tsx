import { useEffect, useRef, useState } from 'react';
import { Stack, Typography } from '@mui/material';
import './users.scss'
import Modal from '../../components/modal/modal';
import UserForm from '../../components/userForm/userForm';
import { createUser, getUserList } from '../../services/user.service';
import { Table, TableRow, TableCell } from '../../components/table/table';
import EditIcon from '@mui/icons-material/Edit';
import ClearIcon from '@mui/icons-material/Clear';
import LoadingComponent from '../../components/loading/loading';


function Users() {
  const userRef = useRef(null)
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    getUsers();
  }, [])


  const getUsers = async () => {
    const response = await getUserList();
    const userList = response.result.data;
    setUsers(userList);
    setIsLoading(false);
  }

  const saveData = async () => {
    if (userRef.current !== null) {
      const user = (userRef.current as any).getUser();
      await createUser(user);
      setIsLoading(true);
      getUsers();
    }
  }

  return (
    isLoading ?
    <LoadingComponent></LoadingComponent>
    : <div className='users-container'>
      <div className='users-container__actions'>
        <Typography variant="h5">Listado de usuarios</Typography>
        <Modal buttonText="Crear Usuarios" saveUser={saveData}>
          <UserForm ref={userRef} ></UserForm>
        </Modal>
      </div>
      <Table>
        <TableRow header>
          <TableCell>Nombre</TableCell>
          <TableCell>Email</TableCell>
          <TableCell>Role</TableCell>
          <TableCell>Acciones</TableCell>
        </TableRow>
        {users.length > 0 && users.map((user: any, index) => {
          return (
            <TableRow key={index}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role.role}</TableCell>
              <TableCell>
                <Stack className='actions-cell' direction="row" spacing={2}>
                  <EditIcon></EditIcon>
                  <ClearIcon></ClearIcon>
                </Stack>
              </TableCell>
            </TableRow>
          );
        })}
      </Table>
    </div>
  );
}

export default Users;