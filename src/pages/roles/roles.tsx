import { useEffect, useRef, useState } from "react";
import "./roles.scss";
import {
  createRole,
  deleteRole,
  getAllroles,
  updateRole,
} from "../../services/roles.service";
import { Pagination, Stack, Typography } from "@mui/material";
import Modal from "../../components/modal/modal";
import { Table, TableCell, TableRow } from "../../components/table/table";
import EditIcon from "@mui/icons-material/Edit";
import ClearIcon from "@mui/icons-material/Clear";
import LoadingComponent from "../../components/loading/loading";
import RoleForm from "../../components/roleForm/roleForm";
import { SimpleDialog } from "../../components/dialog/dialog";
import Search from "../../components/search/search";
import Toast from "../../components/toast/toast";
import { ERROR_MESSAGES } from "../../constants/errorMessageDictionary";
import { SEVERITY_TOAST } from "../../constants/severityToast";
import { SECTIONS } from "../../constants/sections";
import { PERMISSIONS } from "../../constants/permissions";
import { useSelector } from "react-redux";
import { checkPermissions } from "../../helpers/checkPermissions";
import SyncIcon from "@mui/icons-material/Sync";

function Roles() {
  const roleRef = useRef(null);
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentRole, setCurrentRole] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [toastGetRolesError, setToastGetRolesError] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [dataLastSearch, setDataLastSearch] = useState("");
  const abilities = useSelector((state: any) => state.auth.user.abilities);
  const modalRef = useRef(null);

  useEffect(() => {
    getRoles();
  }, []);

  const getRoles = async () => {
    setIsLoading(true);
    try {
      const { result } = await getAllroles();
      const { data: rolList, totalPages } = result;
      setRoles(rolList);
      setTotalPages(totalPages);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const onCloseModal = () => {
    setCurrentRole(null);
  };

  const updateData = async () => {
    if (roleRef.current !== null) {
      await updateRole(currentRole);
      setIsLoading(true);
      getRoles();
    }
    setCurrentRole(null);
  };

  const saveData = async () => {
    if (roleRef.current !== null) {
      const role = (roleRef.current as any).getRole();
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
    setCurrentRole(null);
    getRoles();
  };

  const cancelDelete = () => {
    setCurrentRole(null);
    setOpenDialog(false);
  };

  const getPermission = (key) => {
    switch (key) {
      case "edit":
        return {
          subject: SECTIONS.ROLE,
          action: [PERMISSIONS.UPDATE],
        };
      case "delete":
        return {
          subject: SECTIONS.ROLE,
          action: [PERMISSIONS.DELETE],
        };
      case "create":
        return {
          subject: SECTIONS.ROLE,
          action: [PERMISSIONS.CREATE],
        };
    }
  };

  return (
    <div className="roles-container">
      <div className="roles-container__actions">
        <div className="content-page-title">
          <Typography variant="h5" className="page-header">
            Administrar Roles
          </Typography>
          <span className="page-subtitle">
            Aquí podras gestionar los roles de usuarios del sistema.
          </span>
        </div>
        {checkPermissions(getPermission("create"), abilities) && (
          <div className="create-button-section">
            <Modal
              className="btn-create"
              buttonText="Crear Roles"
              title="Crear role"
              ref={modalRef}
              modalClose={onCloseModal}
              saveMethod={currentRole ? updateData : saveData}
            >
              <RoleForm currentRole={currentRole} ref={roleRef}></RoleForm>
            </Modal>
            <SyncIcon
              className="action-item-icon action-item-icon-edit"
              onClick={() => getRoles()}
            />
          </div>
        )}
      </div>
      <div className="main-center-container">
        <div className="panel-heading">
          Listado de roles
          <Search
            label="Buscar rol"
            searchFunction={async (data: string) => {
              try {
                const { result } = await getAllroles(data);
                setDataLastSearch(data);
                const { data: roles, totalPages } = result;
                setTotalPages(totalPages);
                setRoles(roles);
              } catch (err) {
                setToastGetRolesError(true);
              }
            }}
            voidInputFunction={getRoles}
          />
          <Toast
            open={toastGetRolesError}
            message={ERROR_MESSAGES.GET_ROLES_ERROR}
            severity={SEVERITY_TOAST.ERROR}
            handleClose={() => setToastGetRolesError(false)}
          />
        </div>
        {isLoading ? (
          <LoadingComponent></LoadingComponent>
        ) : (
          <>
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
                      <TableCell>
                        {role.permissions.map((per) => per.section).toString()}
                      </TableCell>
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
                              onClick={() => handleEditAction(role)}
                            ></EditIcon>
                          )}
                          {checkPermissions(
                            getPermission("delete"),
                            abilities
                          ) && (
                            <ClearIcon
                              className="action-item-icon action-item-icon-delete"
                              onClick={() => handleDeleteAction(role)}
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
              onChange={async (_, page) => {
                try {
                  const { result } = await getAllroles(dataLastSearch, page);
                  const { data: roles, totalPages } = result;
                  setRoles(roles);
                  setTotalPages(totalPages);
                } catch (err) {
                  setToastGetRolesError(true);
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

export default Roles;
