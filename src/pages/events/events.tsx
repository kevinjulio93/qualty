import { Button, Pagination, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./events.scss";
import { ROUTES } from "../../constants/routes";
import { Table, TableCell, TableRow } from "../../components/table/table";
import EditIcon from "@mui/icons-material/Edit";
import ClearIcon from "@mui/icons-material/Clear";
import { useEffect, useState } from "react";
// import {
//   deleteBeneficiary,
//   getBeneficiariesList,
// } from "../../services/beneficiaries.service";
import LoadingComponent from "../../components/loading/loading";
import Search from "../../components/search/search";
import Toast from "../../components/toast/toast";
import { ERROR_MESSAGES } from "../../constants/errorMessageDictionary";
import { SEVERITY_TOAST } from "../../constants/severityToast";
import { deleteEvent, getAllEvents } from "../../services/events.service";

function EventList() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toastGetBeneficiariesError, setToastGetBeneficiariesError] =
    useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [dataLastSearch, setDataLastSearch] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    getEvents();
  }, []);

  const getEvents = async () => {
    setIsLoading(true);
    try {
      const { result } = await getAllEvents();
      const { data: events } = result;
      const {data:eventList, totalPages} = events
      setEvents(eventList);
      setTotalPages(totalPages);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
    }
  };

  const handleClickOpen = (id?: string) => {
    const redirectTo = id
      ? `${ROUTES.DASHBOARD}/${ROUTES.BENEFICIARIES}/${id}`
      : `${ROUTES.DASHBOARD}/${ROUTES.BENEFICIARIES}`;
    navigate(redirectTo);
  };

  const deleteBeneficiaryFromList = async (id: string) => {
    try {
      const response = await deleteEvent(id);
      if (response.status === 200) {
        getEvents();
        console.log("deleted successfully");
      }
    } catch (error) {
      throw new Error("the beneficieary doesn't exist");
    }
  };

  return (
    <div className="users-container">
      <div className="users-container__actions">
        <div className="content-page-title">
          <Typography variant="h5" className="page-header">
            Administrar Eventos
          </Typography>
          <span className="page-subtitle">
            Aqui podras gestionar los eventos del sistema.
          </span>
        </div>
        <Button className="btn-create" onClick={() => handleClickOpen()}>
          Crear Evento
        </Button>
      </div>

      <div className="main-center-container">
        <div className="panel-heading">
          Listado de Eventos
          <Search
            label="Buscar Eventos"
            searchFunction={async (data: string) => {
              try {
                const { result } = await getAllEvents(data);
                setDataLastSearch(data);
                const { data: events } = result;
                const {data:eventList} = events
                setEvents(eventList);
              } catch (err) {
                setToastGetBeneficiariesError(true);
              }
            }}
            voidInputFunction={getEvents}
          />
          <Toast
            open={toastGetBeneficiariesError}
            message={ERROR_MESSAGES.GET_BENEFICIARIES_ERROR}
            severity={SEVERITY_TOAST.ERROR}
            handleClose={() => setToastGetBeneficiariesError(false)}
          />
        </div>
        {isLoading ? (
          <LoadingComponent></LoadingComponent>
        ) : (
          <>
            <Table>
              <TableRow header>
                <TableCell>Nombre</TableCell>
                <TableCell>Fecha de ejecución</TableCell>
                <TableCell>Asistencia Estimada</TableCell>
              </TableRow>
              {events.map((beneficiary: any) => {
                return (
                  <TableRow key={beneficiary._id}>
                    <TableCell>{beneficiary?.name}</TableCell>
                    <TableCell>{beneficiary?.execution_date}</TableCell>
                    <TableCell>{beneficiary?.estimate_attendance}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={2}>
                        <EditIcon
                          onClick={() => handleClickOpen(beneficiary?._id)}
                          className="action-item-icon action-item-icon-edit"
                        ></EditIcon>

                        <ClearIcon
                          onClick={() =>
                            deleteBeneficiaryFromList(beneficiary?._id)
                          }
                          className="action-item-icon action-item-icon-delete"
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
                  const { result } = await getBeneficiariesList(
                    dataLastSearch,
                    page
                  );
                  const { data: benfs, totalPages } = result;
                  setEvents(benfs);
                  setTotalPages(totalPages);
                } catch (err) {
                  setToastGetBeneficiariesError(true);
                }
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default EventList;