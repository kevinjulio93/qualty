import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Pagination,
  Stack,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { Table, TableCell, TableRow } from "../../components/table/table";
import EditIcon from "@mui/icons-material/Edit";
import ClearIcon from "@mui/icons-material/Clear";
import { useEffect, useState } from "react";
import LoadingComponent from "../../components/loading/loading";
import {
  deleteWorkshop,
  getAllWorkshops,
  getFilePdfAttendeesWorkshop,
} from "../../services/workshop.service";
import Search from "../../components/search/search";
import { SimpleDialog } from "../../components/dialog/dialog";
import PictureAsPdfRoundedIcon from "@mui/icons-material/PictureAsPdfRounded";
import { SECTIONS } from "../../constants/sections";
import { PERMISSIONS } from "../../constants/permissions";
import { useSelector } from "react-redux";
import { checkPermissions } from "../../helpers/checkPermissions";
import SyncIcon from "@mui/icons-material/Sync";
import dayjs from "dayjs";

function WorkshopsList() {
  const [workshops, setWorkshops] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [dataLastSearch, setDataLastSearch] = useState("");
  const [currentWorkshop, setCurrentWorkshop] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogMessage, setOpenDialogMessage] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const abilities = useSelector((state: any) => state.auth.user.abilities);

  useEffect(() => {
    getWorkshopsList();
  }, []);

  const getWorkshopsList = async () => {
    setIsLoading(true);
    try {
      const { result } = await getAllWorkshops();
      const { data: dataList, totalPages } = result;
      const mappedList = dataList.map((event) => {
        return {
          ...event,
          execution_date: dayjs(event.execution_date).format("L"),
        };
      });
      setWorkshops(mappedList);
      setTotalPages(totalPages);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
    }
  };

  const handleClickOpen = (id?: string) => {
    const redirectTo = id
      ? `${ROUTES.DASHBOARD}/${ROUTES.ASSISTANCE}/${id}`
      : `${ROUTES.DASHBOARD}/${ROUTES.ASSISTANCE}`;
    navigate(redirectTo);
  };

  const deleteFromlist = async (work: string) => {
    setCurrentWorkshop(work);
    setOpenDialog(true);
  };

  const confirmDelete = async () => {
    setIsLoading(true);
    setOpenDialog(false);
    await deleteWorkshop((currentWorkshop as any)._id);
    setCurrentWorkshop(null);
    getWorkshopsList();
  };

  const cancelDelete = () => {
    setCurrentWorkshop(null);
    setOpenDialog(false);
  };

  const handlerOpenDialogMessage = () => {
    setOpenDialogMessage(!openDialogMessage);
  };

  const getFilePdfAttendees = async (workshop: any) => {
    try {
      const responsePdf = await getFilePdfAttendeesWorkshop(workshop._id);
      const blobPdf = responsePdf.result;
      blobPdf.name = workshop.name + "__" + Date.now() + ".pdf";
      const url = window.URL.createObjectURL(blobPdf);
      const a = document.createElement("a");
      a.href = url;
      a.download = blobPdf.name;
      a.style.display = "none";

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      window.URL.revokeObjectURL(url);
    } catch (error) {
      handlerOpenDialogMessage();
    }
  };

  const getPermission = (key) => {
    switch (key) {
      case "edit":
        return {
          subject: SECTIONS.ASSISTANCE,
          action: [PERMISSIONS.UPDATE],
        };
      case "delete":
        return {
          subject: SECTIONS.ASSISTANCE,
          action: [PERMISSIONS.DELETE],
        };
      case "create":
        return {
          subject: SECTIONS.ASSISTANCE,
          action: [PERMISSIONS.CREATE],
        };
    }
  };

  return (
    <div className="users-container">
      <div className="users-container__actions">
        <div className="content-page-title">
          <Typography variant="h5" className="page-header">
            Administrar Talleres
          </Typography>
          <span className="page-subtitle">
            Aquí podras gestionar los talleres realizados.
          </span>
        </div>
        {checkPermissions(getPermission("create"), abilities) && (
          <div className="create-button-section">
            <Button className="btn-create" onClick={() => handleClickOpen()}>
              Generar asistencia
            </Button>
            <SyncIcon
              className="action-item-icon action-item-icon-edit"
              onClick={() => getWorkshopsList()}
            />
          </div>
        )}
      </div>

      <div className="main-center-container">
        <div className="panel-heading">
          Listado de talleres realizados
          <Search
            label="Buscar beneficiario"
            searchFunction={async (data: string) => {
              try {
                const { result } = await getAllWorkshops(data);
                setDataLastSearch(data);
                const { data: works, totalPages } = result;
                setTotalPages(totalPages);
                setWorkshops(works);
              } catch (err) {
                console.error(err);
              }
            }}
            voidInputFunction={getWorkshopsList}
          />
        </div>
        {isLoading ? (
          <LoadingComponent></LoadingComponent>
        ) : (
          <>
            <Table>
              <TableRow header>
                <TableCell>Nombre</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Actividad</TableCell>
                <TableCell>Autor</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
              {workshops.map((workshop: any) => {
                return (
                  <TableRow key={workshop._id}>
                    <TableCell>{workshop?.name}</TableCell>
                    <TableCell>{workshop?.execution_date}</TableCell>
                    <TableCell>{workshop?.activity?.name}</TableCell>
                    <TableCell>{workshop?.author?.name}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={2}>
                        {checkPermissions(getPermission("edit"), abilities) && (
                          <EditIcon
                            onClick={() => handleClickOpen(workshop?._id)}
                            className="action-item-icon action-item-icon-edit"
                          ></EditIcon>
                        )}
                        {checkPermissions(
                          getPermission("delete"),
                          abilities
                        ) && (
                          <ClearIcon
                            onClick={() => deleteFromlist(workshop)}
                            className="action-item-icon action-item-icon-delete"
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
                  const { result } = await getAllWorkshops(
                    dataLastSearch,
                    page
                  );
                  const { data: benfs, currentPage, totalPages } = result;
                  setCurrentPage(currentPage);
                  setWorkshops(benfs);
                  setTotalPages(totalPages);
                } catch (err) {
                  console.error(err);
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

      <Dialog open={openDialogMessage}>
        <DialogTitle>Mensaje</DialogTitle>
        <DialogContent>
          <DialogContentText>Este taller no tiene asistentes</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handlerOpenDialogMessage()} color="primary">
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default WorkshopsList;
