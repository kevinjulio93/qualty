import { useEffect, useRef, useState } from "react";
import { Dialog, Stack, Typography } from "@mui/material";
import "./users.scss";
import Modal from "../../components/modal/modal";
import UserForm from "../../components/userForm/userForm";
import {
  createUser,
  deleteUser,
  getUserList,
  updateUser,
} from "../../services/user.service";
import { Table, TableRow, TableCell } from "../../components/table/table";
import EditIcon from "@mui/icons-material/Edit";
import ClearIcon from "@mui/icons-material/Clear";
import LoadingComponent from "../../components/loading/loading";
import { SimpleDialog } from "../../components/dialog/dialog";
import { getReferences } from "../../services/references.service";
import { setReference } from "../../features/referencesSlice";
import { useDispatch } from "react-redux";

function Users() {
  const userRef = useRef(null);
  const dispatch = useDispatch();
  const modalRef = useRef(null);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    getUsers();
    getAllReferences()
  }, []);

  const getUsers = async () => {
    const response = await getUserList();
    const userList = response.result.data;
    setUsers(userList);
    setIsLoading(false);
  };

  const getAllReferences = async () => {
    const response = await getReferences()
    if (response.status === 200) {
      const references = response.result;
      dispatch(setReference({...references}));
    } else {
    }
  }

  const saveData = async () => {
    if (userRef.current !== null) {
      const user = (userRef.current as any).getUser();
      await createUser(user);
      setIsLoading(true);
      getUsers();
    }
    setCurrentUser(null);
  };

  const updateData = async () => {
    if (userRef.current !== null) {
      const user = (userRef.current as any).getUser();
      await updateUser(user);
      setIsLoading(true);
      getUsers();
    }
    setCurrentUser(null);
  };

  const onCloseModal = () => {
    setCurrentUser(null);
  };

  const handleEditAction = (user) => {
    setCurrentUser(user);
    (modalRef as any).current.handleClickOpen();
  };

  const handleDeleteAction = (user) => {
    setCurrentUser(user);
    setOpenDialog(true);
  };

  const confirmDelete = async () => {
    setIsLoading(true);
    setOpenDialog(false);
    await deleteUser((currentUser as any)._id);
    getUsers();
  };

  const cancelDelete = () => {
    setCurrentUser(null);
    setOpenDialog(false);
  }

  return isLoading ? (
    <LoadingComponent></LoadingComponent>
  ) : (
    <div className="users-container">
      <div className="users-container__actions">
        <div className="content-page-title">
          <Typography variant="h5" className="page-header">Administrar usuarios</Typography>
          <span className="page-subtitle">Aqui podras gestionar los usuarios del sistema.</span>
        </div>
      </div>
      <div className="main-center-container">
        <div className="panel-heading"> Listado de usuarios

          <Modal className="btn-create"
            buttonText="Crear Usuarios"
            ref={modalRef}
            modalClose={onCloseModal}
            saveUser={currentUser ? updateData : saveData}
          >
            <UserForm currentUser={currentUser} ref={userRef}></UserForm>
          </Modal>
        </div>
        <Table>
          <TableRow header>
            <TableCell>Nombre</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
          {users.length > 0 &&
            users.map((user: any, index) => {
              return (
                <TableRow key={index}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role.role}</TableCell>
                  <TableCell>
                    <Stack className="actions-cell" direction="row" spacing={2}>
                      <EditIcon
                        className="action-item-icon action-item-icon-edit"
                        onClick={() => handleEditAction(user)}
                      ></EditIcon>
                      <ClearIcon
                        className="action-item-icon action-item-icon-delete"
                        onClick={() => handleDeleteAction(user)}
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

export default Users;

