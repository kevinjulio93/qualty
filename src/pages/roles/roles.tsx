
import { useEffect, useRef, useState } from 'react';
import './roles.scss';
import { createRole, getAllroles } from '../../services/roles.service';
import { Stack, Typography } from '@mui/material';
import Modal from '../../components/modal/modal';
import UserForm from '../../components/userForm/userForm';
import { Table, TableCell, TableRow } from '../../components/table/table';
import EditIcon from '@mui/icons-material/Edit';
import ClearIcon from '@mui/icons-material/Clear';

function Roles() {
    const userRef = useRef(null)
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        getRoles()
    }, [])

    const getRoles = async () => {
        try {
            const response = await getAllroles();
            if (response.status === 200) {
                setRoles(response.result.data);
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
        <Typography variant="h5">Listado de Roles</Typography>
        <Modal buttonText="Crear Roles" saveUser={saveData}>
          <UserForm ref={userRef} ></UserForm>
        </Modal>
      </div>
      <Table>
        <TableRow header>
          <TableCell>Role</TableCell>
          <TableCell>Email</TableCell>
          <TableCell>Role</TableCell>
          <TableCell>Acciones</TableCell>
        </TableRow>
        {Boolean(roles.length) && roles.map((role: any) => {
          return (
            <TableRow>
              <TableCell>{role.role}</TableCell>
              <TableCell>{role.email}</TableCell>
              <TableCell>{role.role}</TableCell>
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

export default Roles