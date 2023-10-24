import { useEffect, useRef, useState } from "react";
import { Pagination, Stack, Typography } from "@mui/material";
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
import Search from "../../components/search/search";
import Toast from "../../components/toast/toast";
import { ERROR_MESSAGES } from "../../constants/errorMessageDictionary";
import { SEVERITY_TOAST } from "../../constants/severityToast";

function Users() {
  const userRef = useRef(null);
  const modalRef = useRef(null);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [dataLastSearch, setDataLastSearch] = useState("");

  const [toastGetUsersError, setToastGetUsersError] = useState(false);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    setIsLoading(true);
    try {
      const { result } = await getUserList();
      const { data: userList, totalPages } = result;
      setUsers(userList);
      setTotalPages(totalPages);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

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

  const handleEditAction = (user:any) => {
    setCurrentUser(user);
    (modalRef as any).current.handleClickOpen();
  };

  const handleDeleteAction = (user:any) => {
    setCurrentUser(user);
    setOpenDialog(true);
  };

  const confirmDelete = async () => {
    setIsLoading(true);
    setOpenDialog(false);
    await deleteUser((currentUser as any)._id);
    setCurrentUser(null);
    getUsers();
  };

  const cancelDelete = () => {
    setCurrentUser(null);
    setOpenDialog(false);
  };

  return (
    <div className="users-container">
      <div className="users-container__actions">
        <div className="content-page-title">
          <Typography variant="h5" className="page-header">
            Administrar usuarios
          </Typography>
          <span className="page-subtitle">
            Aqui podras gestionar los usuarios del sistema.
          </span>
        </div>
        <Modal
          className="btn-create"
          buttonText="Crear Usuarios"
          title="Crear usuario"
          ref={modalRef}
          modalClose={onCloseModal}
          saveMethod={currentUser ? updateData : saveData}
        >
          <UserForm currentUser={currentUser} ref={userRef}></UserForm>
        </Modal>
      </div>
      <div className="main-center-container">
        <div className="panel-heading">
          Listado de usuarios
          <Search
            label="Buscar usuario"
            searchFunction={async (data: string) => {
              try {
                const { result } = await getUserList(data);
                setDataLastSearch(data);
                const { data: users } = result;
                setUsers(users);
              } catch (err) {
                setToastGetUsersError(true);
              }
            }}
            voidInputFunction={getUsers}
          />
          <Toast
            open={toastGetUsersError}
            message={ERROR_MESSAGES.GET_USERS_ERROR}
            severity={SEVERITY_TOAST.ERROR}
            handleClose={() => setToastGetUsersError(false)}
          />
        </div>
        {isLoading ? (
          <LoadingComponent></LoadingComponent>
        ) : (
          <>
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
                        <Stack
                          className="actions-cell"
                          direction="row"
                          spacing={2}
                        >
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
            <Pagination
              count={totalPages}
              onChange={async (_, page) => {
                try {
                  const { result } = await getUserList(dataLastSearch, page);
                  const { data: users, totalPages } = result;
                  setUsers(users);
                  setTotalPages(totalPages);
                } catch (err) {
                  setToastGetUsersError(true);
                }
              }}
            />
          </>
        )}
      </div>

      {openDialog && (
        <SimpleDialog
          title="Eliminar usuaro"
          bodyContent="¿Está seguro que desea eliminar este usuario?"
          mainBtnText="Confirmar"
          secondBtnText="Cancelar"
          mainBtnHandler={confirmDelete}
          secondBtnHandler={cancelDelete}
          open={openDialog}
        ></SimpleDialog>
      )}
    </div>
  );
}

export default Users;
