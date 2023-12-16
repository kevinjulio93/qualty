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
import "./wineriesList.scss";
import { ROUTES } from "../../constants/routes";
import { Table, TableCell, TableRow } from "../../components/table/table";
import EditIcon from "@mui/icons-material/Edit";
import ClearIcon from "@mui/icons-material/Clear";
import { useEffect, useState } from "react";
import { getAllWineries, deleteWinerie, closeWinerie } from "../../services/winerie.service";
import LoadingComponent from "../../components/loading/loading";
import Search from "../../components/search/search";
import Toast from "../../components/toast/toast";
import { ERROR_MESSAGES } from "../../constants/errorMessageDictionary";
import { SEVERITY_TOAST } from "../../constants/severityToast";
import { SECTIONS } from "../../constants/sections";
import { PERMISSIONS } from "../../constants/permissions";
import { useSelector } from "react-redux";
import { checkPermissions } from "../../helpers/checkPermissions";
import SyncIcon from "@mui/icons-material/Sync";
import DoNotDisturbOffIcon from "@mui/icons-material/DoNotDisturbOff";


function WineriesList() {
  const [wineries, setWineries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toastGetWineriesError, setToastGetWineriesError] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [dataLastSearch, setDataLastSearch] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [winerieSelectedDelete, setWinerieSelectedDelete] = useState(null);
  const [messageDialog, setMessageDialog] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const abilities = useSelector((state: any) => state.auth.user.abilities);

  const navigate = useNavigate();

  useEffect(() => {
    getWineries();
  }, []);

  const handlerCloseDialog = () => {
    setOpenDialog(false);
  };

  const getWineries = async () => {
    setIsLoading(true);
    try {
      const { result } = await getAllWineries();
      const { data: wineriesList, totalPages } = result;
      setWineries(wineriesList.data);
      setTotalPages(totalPages);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
    }
  };

  const handleClickOpen = (id?: string) => {
    const redirectTo =
      id === null || id === undefined
        ? `${ROUTES.DASHBOARD}/${ROUTES.WINERIES}`
        : `${ROUTES.DASHBOARD}/${ROUTES.WINERIES}/${id}`;
    navigate(redirectTo);
  };

  const closeCurrentWinerie = (winerie: any) => {
    setWinerieSelectedDelete(winerie);
    setOpenDialog(true);
    if (winerie.type === "Secundaria") {
      setMessageDialog("¿ Seguro que desea eliminar esta bodega ?");
    } else {
      setMessageDialog(`¿ Seguro que desea eliminar esta bodega principal ? 
      Si elimina esta bodega se eliminaran todas las bodegas asociadas`);
    }
  };

  const deleteWinerieFromList = async (id: string) => {
    try {
      setOpenDialog(false);
      setIsLoading(true);
      await closeWinerie(id);
      setIsLoading(false);
      getWineries();
    } catch (error) {
      throw new Error("the winerie doesn't exist");
    }
  };

  const handleDeleteAction = () => {
    deleteWinerieFromList(winerieSelectedDelete._id);
  };

  const getPermission = (key) => {
    switch (key) {
      case "edit":
        return {
          subject: SECTIONS.WINERIES,
          action: [PERMISSIONS.UPDATE],
        };
      case "delete":
        return {
          subject: SECTIONS.WINERIES,
          action: [PERMISSIONS.DELETE],
        };
      case "create":
        return {
          subject: SECTIONS.WINERIES,
          action: [PERMISSIONS.CREATE],
        };
    }
  };

  return (
    <div className="users-container">
      <div className="users-container__actions">
        <div className="content-page-title">
          <Typography variant="h5" className="page-header">
            Administrar las bodegas
          </Typography>
          <span className="page-subtitle">
            Aquí podras gestionar las bodegas del sistema.
          </span>
        </div>
        {checkPermissions(getPermission("create"), abilities) && (
          <div className="create-button-section">
            <Button className="btn-create" onClick={() => handleClickOpen()}>
              Crear Bodega
            </Button>
            <SyncIcon
              className="action-item-icon action-item-icon-edit"
              onClick={() => getWineries()}
            />
          </div>
        )}
      </div>

      <div className="main-center-container">
        <div className="panel-heading">
          Listado de bodegas
          <Search
            label="Buscar bodega"
            searchFunction={async (data: string) => {
              try {
                const { result } = await getAllWineries(data);
                setDataLastSearch(data);
                const { data: wineries, totalPages } = result;
                setTotalPages(totalPages);
                setWineries(wineries.data);
              } catch (err) {
                setToastGetWineriesError(true);
              }
            }}
            voidInputFunction={getWineries}
          />
          <Toast
            open={toastGetWineriesError}
            message={ERROR_MESSAGES.GET_WINERIES_ERROR}
            severity={SEVERITY_TOAST.ERROR}
            handleClose={() => setToastGetWineriesError(false)}
          />
        </div>
        {isLoading ? (
          <LoadingComponent></LoadingComponent>
        ) : (
          <>
            <Table>
              <TableRow header>
                <TableCell>Nombre</TableCell>
                <TableCell>Tipo de bodega</TableCell>
                <TableCell>Bodega asociada</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
              {wineries.map((winerie: any) => {
                return (
                  <TableRow key={winerie._id}>
                    <TableCell>{winerie?.name}</TableCell>
                    <TableCell>{winerie?.type}</TableCell>
                    <TableCell>
                      {winerie?.associated_winery
                        ? winerie?.associated_winery.name
                        : "Ninguna"}
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={2}>
                        {checkPermissions(getPermission("edit"), abilities) && (
                          <EditIcon
                            onClick={() => handleClickOpen(winerie?._id)}
                            className="action-item-icon action-item-icon-edit"
                          ></EditIcon>
                        )}
                        {checkPermissions(
                          getPermission("delete"),
                          abilities
                        ) && (
                          <DoNotDisturbOffIcon
                            onClick={() => closeCurrentWinerie(winerie)}
                            className="action-item-icon action-item-icon-delete"
                          ></DoNotDisturbOffIcon>
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
                  const { result } = await getAllWineries(dataLastSearch, page);
                  const {
                    data: wineries,
                    currentPage,
                    totalPages,
                  } = result.data;
                  setCurrentPage(currentPage);
                  setWineries(wineries);
                  setTotalPages(totalPages);
                } catch (err) {
                  setToastGetWineriesError(true);
                }
              }}
            />
          </>
        )}
      </div>
      <Dialog open={openDialog}>
        <DialogTitle>Advertencia</DialogTitle>
        <DialogContent>
          <DialogContentText>{messageDialog}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handlerCloseDialog()} color="primary">
            Cancelar
          </Button>
          <Button onClick={() => handleDeleteAction()} color="primary">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default WineriesList;
