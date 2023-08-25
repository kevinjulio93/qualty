import './activities.scss'
import { useEffect, useRef, useState } from 'react';
import { createRole, getAllroles } from '../../services/roles.service';
import { Stack, Typography } from '@mui/material';
import Modal from '../../components/modal/modal';
import UserForm from '../../components/userForm/userForm';
import { Table, TableCell, TableRow } from '../../components/table/table';
import EditIcon from '@mui/icons-material/Edit';
import ClearIcon from '@mui/icons-material/Clear';

function Activities() {
    const userRef = useRef(null)
    const [roles, setRoles] = useState([{name: 'admin', email:'email', role:'role'}]);

    useEffect(() => {
        getRoles()
    }, [])

    const getRoles = async () => {
        try {
            const response = await getAllroles();
            if (response.status === 200) {
                setRoles(response.result);
            }
        } catch (error) {

        }
    }

    const saveData = async () => {
        if (userRef.current !== null) {
          const user = (userRef.current as any).getUser()
          await createRole(user)
        }
      }

    return (
        <div className='users-container'>
      <div className='users-container__actions'>
        <Typography variant="h5">Listado de Talleres</Typography>
        <Modal buttonText="Crear Talleres" saveUser={saveData}>
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
        {Boolean(roles.length) && roles.map((user: any) => {
          return (
            <TableRow>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <Stack direction="row" spacing={2}>
                  <EditIcon></EditIcon>
                  <ClearIcon></ClearIcon>
                </Stack>
              </TableCell>
            </TableRow>
          );
        })}
      </Table>
    </div>
    )
}

export default Activities