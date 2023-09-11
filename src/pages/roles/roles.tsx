
import { useEffect, useRef, useState } from 'react';
import './roles.scss';
import { createRole, deleteRole, getAllroles, updateRole } from '../../services/roles.service';
import { Stack, Typography } from '@mui/material';
import Modal from '../../components/modal/modal';
import { Table, TableCell, TableRow } from '../../components/table/table';
import EditIcon from '@mui/icons-material/Edit';
import ClearIcon from '@mui/icons-material/Clear';
import LoadingComponent from '../../components/loading/loading';
import RoleForm from '../../components/roleForm/roleForm';
import { SimpleDialog } from '../../components/dialog/dialog';

function Roles() {
    const roleRef = useRef(null)
    const [roles, setRoles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentRole, setCurrentRole] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const modalRef = useRef(null);

    useEffect(() => {
        getRoles()
    }, [])

    const getRoles = async () => {
      setIsLoading(true);
        try {
            const response = await getAllroles();
            if (response.status === 200) {
                setRoles(response.result.data);
            }
        } catch (error) {
          console.error(error);
        }
        setIsLoading(false);
    }

    const onCloseModal = () => {
      setCurrentRole(null);
    };

    const updateData = async () => {
      if (roleRef.current !== null) {
        const role = (roleRef.current as any).getRole();
        await updateRole(role);
        setIsLoading(true);
        getRoles();
      }
      setCurrentRole(null);
    };

    const saveData = async () => {
      if (roleRef.current !== null) {
        const role = (roleRef.current as any).getRole();
        console.log(role);
        await createRole(role);
        setIsLoading(true);
        getRoles();
      }
      setCurrentRole(null);
    };

    const handleEditAction = (role) => {
      setCurrentRole(role);
      (modalRef as any).current.handleClickOpen();
    };
  
    const handleDeleteAction = (role) => {
      setCurrentRole(role);
      setOpenDialog(true);
    };
  
    const confirmDelete = async () => {
      setIsLoading(true);
      setOpenDialog(false);
      await deleteRole((currentRole as any)._id);
      getRoles();
    };
  
    const cancelDelete = () => {
      setCurrentRole(null);
      setOpenDialog(false);
    }

    return isLoading ? (
      <LoadingComponent></LoadingComponent>
    ) : (
      <div className="roles-container">
        <div className="roles-container__actions">
          <div className="content-page-title">
            <Typography variant="h5" className="page-header">Administrar Roles</Typography>
            <span className="page-subtitle">Aqui podras gestionar los roles de usuarios del sistema.</span>
          </div>
        </div>
        <div className="main-center-container">
          <div className="panel-heading"> Listado de roles
  
            <Modal className="btn-create"
              buttonText="Crear Roles"
              title="Crear role"
              ref={modalRef}
              modalClose={onCloseModal}
              saveMethod={currentRole ? updateData : saveData}
            >
              <RoleForm currentRole={currentRole} ref={roleRef}></RoleForm>
            </Modal>
          </div>
          <Table>
            <TableRow header>
              <TableCell>Role</TableCell>
              <TableCell>Permisos</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
            {roles.length > 0 &&
              roles.map((role: any, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell>{role.role}</TableCell>
                    <TableCell>{role.permissions.map(per => per.section).toString()}</TableCell>
                    <TableCell>
                      <Stack className="actions-cell" direction="row" spacing={2}>
                        <EditIcon
                          className="action-item-icon action-item-icon-edit"
                          onClick={() => handleEditAction(role)}
                        ></EditIcon>
                        <ClearIcon
                          className="action-item-icon action-item-icon-delete"
                          onClick={() => handleDeleteAction(role)}
                        ></ClearIcon>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
          </Table>
        </div>
  
  
        {openDialog && <SimpleDialog
          title="Eliminar usuaro"
          bodyContent="¿Está seguro que desea eliminar este usuario?"
          mainBtnText="Confirmar"
          secondBtnText="Cancelar"
          mainBtnHandler={confirmDelete}
          secondBtnHandler={cancelDelete}
          open={openDialog}
        ></SimpleDialog>}
      </div>
    );
}

export default Roles