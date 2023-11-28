import { useNavigate } from "react-router-dom";
import "./events.scss";
import { ROUTES } from "../../constants/routes";
import { useEffect, useState } from "react";
import { ERROR_MESSAGES } from "../../constants/errorMessageDictionary";
import { SEVERITY_TOAST } from "../../constants/severityToast";
import { deleteEvent, getAllEvents } from "../../services/events.service";
import ListView from "../../components/list-view/list-view";
import dayjs from "dayjs";
import { SimpleDialog } from "../../components/dialog/dialog";
import { checkPermissions } from "../../helpers/checkPermissions";
import { useSelector } from "react-redux";
import { SECTIONS } from "../../constants/sections";
import { PERMISSIONS } from "../../constants/permissions";

function EventList() {
  const columnAndRowkeys = [
    { label: "Nombre", rowKey: "name" },
    { label: "Fecha de ejecución", rowKey: "execution_date" },
    { label: "Asistencia estimada", rowKey: "estimate_attendance" },
  ];
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentEvn, setCurrentEvn] = useState(null);
  const [toastGetBeneficiariesError, setToastGetBeneficiariesError] =
    useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [dataLastSearch, setDataLastSearch] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const abilities = useSelector((state: any) => state.auth.user.abilities);

  const navigate = useNavigate();

  useEffect(() => {
    getEvents();
  }, []);

  const getEvents = async (search?: string, page: number = 1) => {
    setIsLoading(true);
    try {
      const { result } = await getAllEvents(search, page);
      setDataLastSearch(search);
      const { data: events } = result;
      const { data: eventList, currentPage, totalPages } = events;
      setCurrentPage(currentPage)
      const mappedList = eventList.map((event) => {
        return {
          ...event,
          execution_date: dayjs(event.execution_date).format("L"),
        };
      });
      setEvents(mappedList);
      setTotalPages(totalPages);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
    }
  };

  const handleClickOpen = (event?: any) => {
    const id = event?._id ?? undefined;
    const redirectTo = id
      ? `${ROUTES.DASHBOARD}/${ROUTES.EVENTS}/${id}`
      : `${ROUTES.DASHBOARD}/${ROUTES.EVENTS}`;
    navigate(redirectTo);
  };

  const deleteBeneficiaryFromList = async (id: string) => {
    try {
      const response = await deleteEvent(id);
      if (response.status === 200) {
        getEvents();
      }
    } catch (error) {
      throw new Error("the beneficieary doesn't exist");
    }
  };

  const deleteFromlist = async (act: string) => {
    setCurrentEvn(act);
    setOpenDialog(true);
  };

  const confirmDelete = async () => {
    setOpenDialog(false);
    await deleteBeneficiaryFromList((currentEvn as any)._id);
    setCurrentEvn(null);
    getEvents()
  };

  const cancelDelete = () => {
    setCurrentEvn(null);
    setOpenDialog(false);
  };

  const openStatsView = (item) => {
    const redirectTo = `${ROUTES.DASHBOARD}/${ROUTES.STATS}/${item._id}`;
    navigate(redirectTo);
  }

  const getPermission = (key) => {
    switch(key) {
      case 'edit':
        return {
          subject: SECTIONS.EVENTS,
          action: [PERMISSIONS.UPDATE],
        };
      case 'delete':
        return {
          subject: SECTIONS.EVENTS,
          action: [PERMISSIONS.DELETE],
        };
      case 'stats':
        return {
          subject: SECTIONS.EVENTS,
          action: [PERMISSIONS.READ],
        };
      case 'create':
        return {
          subject: SECTIONS.EVENTS,
          action: [PERMISSIONS.CREATE],
        };
    }
  }


  return (
    <>
      <ListView
        sectionTitle="Administrar Eventos"
        sectionDescription="Aquí podras gestionar los eventos del sistema."
        createButtonText="Crear evento"
        listTitle="Listado de Eventos"
        openToast={false}
        toastMessage={ERROR_MESSAGES.GET_EVENTS_ERROR}
        toastSeverity={SEVERITY_TOAST.ERROR}
        isLoading={isLoading}
        columnHeaders={columnAndRowkeys}
        listContent={events}
        totalPages={totalPages}
        currentPage={currentPage}
        handleCreatebutton={() => handleClickOpen()}
        hanldeSearchFunction={(data) => getEvents(data)}
        hanldeVoidInputFunction={() => getEvents()}
        handleCloseToast={() => setToastGetBeneficiariesError(false)}
        handleEdit={(event) => handleClickOpen(event)}
        handleDelete={(param) => deleteFromlist(param)}
        handlePaginationChange={(data) => getEvents("", data)}
        handleStats={(param) => openStatsView(param)}
        hasEdit={checkPermissions(getPermission('edit'), abilities)}
        hasDelete={checkPermissions(getPermission('delete'), abilities)}
        hasStats={checkPermissions(getPermission('stats'), abilities)}
        hasCreate={checkPermissions(getPermission('create'), abilities)}
        refreshFn={()=> getEvents()}
      />

      {openDialog && (
        <SimpleDialog
          title="Eliminar asociacion"
          bodyContent="¿Está seguro que desea eliminar este Evento ?"
          mainBtnText="Confirmar"
          secondBtnText="Cancelar"
          mainBtnHandler={confirmDelete}
          secondBtnHandler={cancelDelete}
          open={openDialog}
        ></SimpleDialog>
      )}
    </>
  );
}

export default EventList;
