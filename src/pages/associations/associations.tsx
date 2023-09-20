import { useEffect, useRef, useState } from "react";
import { Pagination, Stack, Typography } from "@mui/material";
import Modal from "../../components/modal/modal";
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
import { useDispatch } from "react-redux";
import Search from "../../components/search/search";
import Toast from "../../components/toast/toast";
import { ERROR_MESSAGES } from "../../constants/errorMessageDictionary";
import { SEVERITY_TOAST } from "../../constants/severityToast";
import AssociationForm from "../../components/associationForm/associationForm";

function Associations() {
  const associationRef = useRef(null);
  const dispatch = useDispatch();
  const modalRef = useRef(null);
  const [associations, setAssociations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentAssociation, setCurrentAssociation] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [dataLastSearch, setDataLastSearch] = useState("");

  const [toastGetAssociationsError, setToastGetAssociationsError] =
    useState(false);

  useEffect(() => {
    getAssociations();
  }, []);

  const getAssociations = async () => {
    setIsLoading(true);
    try {
      const { result } = await getUserList();
      const { data: associationList, totalPages } = result;
      setAssociations(associationList);
      setTotalPages(totalPages);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const saveData = async () => {
    if (associationRef.current !== null) {
      const association = (associationRef.current as any).getUser();
      await createUser(association);
      setIsLoading(true);
      getAssociations();
    }
    setCurrentAssociation(null);
  };

  const updateData = async () => {
    if (associationRef.current !== null) {
      const association = (associationRef.current as any).getUser();
      await updateUser(association);
      setIsLoading(true);
      getAssociations();
    }
    setCurrentAssociation(null);
  };

  const onCloseModal = () => {
    setCurrentAssociation(null);
  };

  const handleEditAction = (association) => {
    setCurrentAssociation(association);
    (modalRef as any).current.handleClickOpen();
  };

  const handleDeleteAction = (association) => {
    setCurrentAssociation(association);
    setOpenDialog(true);
  };

  const confirmDelete = async () => {
    setIsLoading(true);
    setOpenDialog(false);
    await deleteUser((currentAssociation as any)._id);
    setCurrentAssociation(null);
    getAssociations();
  };

  const cancelDelete = () => {
    setCurrentAssociation(null);
    setOpenDialog(false);
  };

  return (
    <div className="users-container">
      <div className="users-container__actions">
        <div className="content-page-title">
          <Typography variant="h5" className="page-header">
            Administrar asociaciones
          </Typography>
          <span className="page-subtitle">
            Aqui podras gestionar las asociaciones del sistema.
          </span>
        </div>
        <Modal
          className="btn-create"
          buttonText="Crear Asociacion"
          title="Crear asociacion"
          ref={modalRef}
          modalClose={onCloseModal}
          saveMethod={currentAssociation ? updateData : saveData}
        >
          <AssociationForm
            currentAssociation={currentAssociation}
            ref={associationRef}
          ></AssociationForm>
        </Modal>
      </div>
      <div className="main-center-container">
        <div className="panel-heading">
          Listado de asociaciones
          <Search
            label="Buscar asociacion"
            searchFunction={async (data: string) => {
              try {
                const { result } = await getUserList(data);
                setDataLastSearch(data);
                const { data: associations } = result;
                setAssociations(associations);
              } catch (err) {
                setToastGetAssociationsError(true);
              }
            }}
            voidInputFunction={getAssociations}
          />
          <Toast
            open={toastGetAssociationsError}
            message={ERROR_MESSAGES.GET_ASSOCIATIONS_ERROR}
            severity={SEVERITY_TOAST.ERROR}
            handleClose={() => setToastGetAssociationsError(false)}
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
              {associations.length > 0 &&
                associations.map((association: any, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell>{association.name}</TableCell>
                      <TableCell>{association.email}</TableCell>
                      <TableCell>{association.role.role}</TableCell>
                      <TableCell>
                        <Stack
                          className="actions-cell"
                          direction="row"
                          spacing={2}
                        >
                          <EditIcon
                            className="action-item-icon action-item-icon-edit"
                            onClick={() => handleEditAction(association)}
                          ></EditIcon>
                          <ClearIcon
                            className="action-item-icon action-item-icon-delete"
                            onClick={() => handleDeleteAction(association)}
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
                  const { data: associations, totalPages } = result;
                  setAssociations(associations);
                  setTotalPages(totalPages);
                } catch (err) {
                  setToastGetAssociationsError(true);
                }
              }}
            />
          </>
        )}
      </div>

      {openDialog && (
        <SimpleDialog
          title="Eliminar asociacion"
          bodyContent="¿Está seguro que desea eliminar esta asociacion?"
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

export default Associations;
