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
import { useDispatch, useSelector } from "react-redux";
import Search from "../../components/search/search";
import Toast from "../../components/toast/toast";
import { ERROR_MESSAGES } from "../../constants/errorMessageDictionary";
import { SEVERITY_TOAST } from "../../constants/severityToast";
import { SECTIONS } from "../../constants/sections";
import { PERMISSIONS } from "../../constants/permissions";
import { checkPermissions } from "../../helpers/checkPermissions";
import SyncIcon from "@mui/icons-material/Sync";

function Users() {
  const userRef = useRef(null);
  const modalRef = useRef(null);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [dataLastSearch, setDataLastSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const abilities = useSelector((state: any) => state.auth.user.abilities);
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

  const handleEditAction = (user: any) => {
    setCurrentUser(user);
    (modalRef as any).current.handleClickOpen();
  };

  const handleDeleteAction = (user: any) => {
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

  const getPermission = (key) => {
    switch (key) {
      case "edit":
        return {
          subject: SECTIONS.USER,
          action: [PERMISSIONS.UPDATE],
        };
      case "delete":
        return {
          subject: SECTIONS.USER,
          action: [PERMISSIONS.DELETE],
        };
      case "create":
        return {
          subject: SECTIONS.USER,
          action: [PERMISSIONS.CREATE],
        };
    }
  };

  return (
    <div className="users-container">
      <div className="users-container__actions">
        <div className="content-page-title">
          <Typography variant="h5" className="page-header">
            Administrar usuarios
          </Typography>
          <span className="page-subtitle">
            Aquí podras gestionar los usuarios del sistema.
          </span>
        </div>
        {checkPermissions(getPermission("create"), abilities) && (
          <div className="create-button-section">
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
            <SyncIcon
              className="action-item-icon action-item-icon-edit"
              onClick={() => getUsers()}
            />
          </div>
        )}
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
                const { data: users, totalPages } = result;
                setTotalPages(totalPages);
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
                <TableCell>Usuario</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
              {users.length > 0 &&
                users.map((user: any, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.user_name}</TableCell>
                      <TableCell>{user.role.role}</TableCell>
                      <TableCell>
                        <Stack
                          className="actions-cell"
                          direction="row"
                          spacing={2}
                        >
                          {checkPermissions(
                            getPermission("edit"),
                            abilities
                          ) && (
                            <EditIcon
                              className="action-item-icon action-item-icon-edit"
                              onClick={() => handleEditAction(user)}
                            ></EditIcon>
                          )}
                          {checkPermissions(
                            getPermission("delete"),
                            abilities
                          ) && (
                            <ClearIcon
                              className="action-item-icon action-item-icon-delete"
                              onClick={() => handleDeleteAction(user)}
                            ></ClearIcon>
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </Table>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={async (_, page) => {
                try {
                  const { result } = await getUserList(dataLastSearch, page);
                  const { data: users, currentPage, totalPages } = result;
                  setCurrentPage(currentPage);
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
