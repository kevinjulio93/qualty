import { useEffect, useRef, useState } from "react";
import { Pagination, Stack, Typography } from "@mui/material";
import Modal from "../../components/modal/modal";
import { Table, TableRow, TableCell } from "../../components/table/table";
import EditIcon from "@mui/icons-material/Edit";
import ClearIcon from "@mui/icons-material/Clear";
import LoadingComponent from "../../components/loading/loading";
import { SimpleDialog } from "../../components/dialog/dialog";
import { useDispatch, useSelector } from "react-redux";
import Search from "../../components/search/search";
import Toast from "../../components/toast/toast";
import { ERROR_MESSAGES } from "../../constants/errorMessageDictionary";
import { SEVERITY_TOAST } from "../../constants/severityToast";
import RepresentativeForm from "../../components/representativeForm/representativeForm";
import {
  createRepresentative,
  deleteRepresentative,
  getRepresentativesList,
  updateRepresentative,
} from "../../services/representative.service";
import { SECTIONS } from "../../constants/sections";
import { PERMISSIONS } from "../../constants/permissions";
import { checkPermissions } from "../../helpers/checkPermissions";
import SyncIcon from "@mui/icons-material/Sync";

function Representatives() {
  const representativeRef = useRef(null);
  const modalRef = useRef(null);
  const [representatives, setRepresentatives] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentRepresentative, setCurrentRepresentative] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [dataLastSearch, setDataLastSearch] = useState("");
  const abilities = useSelector((state: any) => state.auth.user.abilities);

  const [toastGetRepresentativesError, setToastGetRepresentativesError] =
    useState(false);

  useEffect(() => {
    getRepresentatives();
  }, []);

  const getRepresentatives = async () => {
    setIsLoading(true);
    try {
      const {
        result: { data },
      } = await getRepresentativesList();
      const { data: respresentativesList, totalPages } = data;
      setRepresentatives(respresentativesList);
      setTotalPages(totalPages);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const saveData = async () => {
    if (representativeRef.current !== null) {
      const representative = (
        representativeRef.current as any
      ).getRepresentative();
      await createRepresentative(representative);
      setIsLoading(true);
      getRepresentatives();
    }
    setCurrentRepresentative(null);
  };

  const updateData = async () => {
    if (representativeRef.current !== null) {
      let representative = (
        representativeRef.current as any
      ).getRepresentative();
      representative = {
        ...representative,
        identification_type: representative["identification-type"],
      };
      await updateRepresentative(representative);
      setIsLoading(true);
      getRepresentatives();
    }
    setCurrentRepresentative(null);
  };

  const onCloseModal = () => {
    setCurrentRepresentative(null);
  };

  const handleEditAction = (representative) => {
    setCurrentRepresentative(representative);
    (modalRef as any).current.handleClickOpen();
  };

  const handleDeleteAction = (representative) => {
    setCurrentRepresentative(representative);
    setOpenDialog(true);
  };

  const confirmDelete = async () => {
    setIsLoading(true);
    setOpenDialog(false);
    await deleteRepresentative((currentRepresentative as any)._id);
    setCurrentRepresentative(null);
    getRepresentatives();
  };

  const cancelDelete = () => {
    setCurrentRepresentative(null);
    setOpenDialog(false);
  };

  const getPermission = (key) => {
    switch (key) {
      case "edit":
        return {
          subject: SECTIONS.REPRESENTATIVE,
          action: [PERMISSIONS.UPDATE],
        };
      case "delete":
        return {
          subject: SECTIONS.REPRESENTATIVE,
          action: [PERMISSIONS.DELETE],
        };
      case "create":
        return {
          subject: SECTIONS.REPRESENTATIVE,
          action: [PERMISSIONS.CREATE],
        };
    }
  };

  return (
    <div className="users-container">
      <div className="users-container__actions">
        <div className="content-page-title">
          <Typography variant="h5" className="page-header">
            Administrar representantes
          </Typography>
          <span className="page-subtitle">
            Aquí podras gestionar los representantes del sistema.
          </span>
        </div>
        {checkPermissions(getPermission("create"), abilities) && (
          <div className="create-button-section">
            <Modal
              className="btn-create"
              buttonText="Crear Representante"
              title="Crear representante"
              ref={modalRef}
              modalClose={onCloseModal}
              saveMethod={currentRepresentative ? updateData : saveData}
            >
              <RepresentativeForm
                currentRepresentative={currentRepresentative}
                ref={representativeRef}
              ></RepresentativeForm>
            </Modal>
            <SyncIcon
              className="action-item-icon action-item-icon-edit"
              onClick={() => getRepresentatives()}
            />
          </div>
        )}
      </div>
      <div className="main-center-container">
        <div className="panel-heading">
          Listado de representantes
          <Search
            label="Buscar representante"
            searchFunction={async (data: string) => {
              try {
                const { result } = await getRepresentativesList(data);
                setDataLastSearch(data);
                const { data: representatives, totalPages } = result;
                setTotalPages(totalPages);
                setRepresentatives(representatives);
              } catch (err) {
                setToastGetRepresentativesError(true);
              }
            }}
            voidInputFunction={getRepresentatives}
          />
          <Toast
            open={toastGetRepresentativesError}
            message={ERROR_MESSAGES.GET_REPRESENTATIVES_ERROR}
            severity={SEVERITY_TOAST.ERROR}
            handleClose={() => setToastGetRepresentativesError(false)}
          />
        </div>
        {isLoading ? (
          <LoadingComponent></LoadingComponent>
        ) : (
          <>
            <Table>
              <TableRow header>
                <TableCell>Nombre</TableCell>
                <TableCell>Asociacion</TableCell>
                <TableCell>Telefono</TableCell>
                <TableCell>Direccion</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
              {representatives.length > 0 &&
                representatives.map((representative: any, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell>{representative.name}</TableCell>
                      <TableCell>{representative.association.name}</TableCell>
                      <TableCell>{representative.phone}</TableCell>
                      <TableCell>{representative.address}</TableCell>
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
                              onClick={() => handleEditAction(representative)}
                            ></EditIcon>
                          )}
                          {checkPermissions(
                            getPermission("delete"),
                            abilities
                          ) && (
                            <ClearIcon
                              className="action-item-icon action-item-icon-delete"
                              onClick={() => handleDeleteAction(representative)}
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
                  const { result } = await getRepresentativesList(
                    dataLastSearch,
                    page
                  );
                  const { data: representatives, totalPages } = result;
                  setRepresentatives(representatives);
                  setTotalPages(totalPages);
                } catch (err) {
                  setToastGetRepresentativesError(true);
                }
              }}
            />
          </>
        )}
      </div>

      {openDialog && (
        <SimpleDialog
          title="Eliminar representante"
          bodyContent="¿Está seguro que desea eliminar este representante?"
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

export default Representatives;
