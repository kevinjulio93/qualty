import { useNavigate } from "react-router-dom";
import "./events.scss";
import { ROUTES } from "../../constants/routes";;
import { useEffect, useState } from "react";
import { ERROR_MESSAGES } from "../../constants/errorMessageDictionary";
import { SEVERITY_TOAST } from "../../constants/severityToast";
import { deleteEvent, getAllEvents } from "../../services/events.service";
import ListView from "../../components/list-view/list-view";

function EventList() {
  const columnAndRowkeys = [
    { label: 'Nombre', rowKey: 'name' }, 
    { label: 'Fecha de ejecución', rowKey: 'execution_date' }, 
    { label: 'Asistencia estimada', rowKey: 'estimate_attendance' }
  ]
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toastGetBeneficiariesError, setToastGetBeneficiariesError] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [dataLastSearch, setDataLastSearch] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    getEvents();
  }, []);


  const getEvents = async (search?: string, page:number = 1) => {
    setIsLoading(true);
    try {
      const { result } = await getAllEvents(search, page );
      setDataLastSearch(search);
      const { data: events } = result;
      const { data: eventList, totalPages } = events
      setEvents(eventList);
      setTotalPages(totalPages);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
    }
  };

  const handleClickOpen = (event?: any) => {
    const id = event?._id  ?? undefined;
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
      }
    } catch (error) {
      throw new Error("the beneficieary doesn't exist");
    }
  };

  return (
    <ListView
      sectionTitle="Administrar Eventos"
      sectionDescription="Aqui podras gestionar los eventos del sistema."
      createButtonText="Crear evento"
      listTitle="Listado de Eventos"
      openToast={false}
      toastMessage={ERROR_MESSAGES.GET_EVENTS_ERROR}
      toastSeverity={SEVERITY_TOAST.ERROR}
      isLoading={isLoading}
      columnHeaders={columnAndRowkeys}
      listContent={events}
      totalPages={totalPages}
      handleCreatebutton={() => handleClickOpen()}
      hanldeSearchFunction={(data) => getEvents(data)}
      hanldeVoidInputFunction={() => getEvents()}
      handleCloseToast={() => setToastGetBeneficiariesError(false)}
      handleEdit={(event) => handleClickOpen(event)}
      handleDelete={(param) => deleteBeneficiaryFromList(param?._id)}
      handlePaginationChange={(data) => getEvents('', data)}
    />
  );
}

export default EventList;