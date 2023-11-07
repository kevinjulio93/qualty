import { useNavigate } from 'react-router-dom';
import "./activities.scss";
import { ROUTES } from '../../constants/routes';
import { useEffect, useState } from 'react';
import { deleteActivities, getAllActivities } from '../../services/activities.service';
import { SimpleDialog } from '../../components/dialog/dialog';
import { ERROR_MESSAGES } from '../../constants/errorMessageDictionary';
import { SEVERITY_TOAST } from '../../constants/severityToast';
import ListView from '../../components/list-view/list-view';
import dayjs, { Dayjs } from "dayjs";


function ActivityList() {
  const columnAndRowkeys = [
    { label: 'Nombre', rowKey: 'name' }, 
    { label: 'Fecha de ejecución', rowKey: 'execution_date' }, 
    { label: 'Asistencia estimada', rowKey: 'estimate_attendance' }
  ];
  const [actitivies, setActivities] = useState([]);
  const [currentAct, setCurrentAct] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [dataLastSearch, setDataLastSearch] = useState("");
  const [toastGetBeneficiariesError, setToastGetBeneficiariesError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getActivitiesList();
  }, [])

  const getActivitiesList = async (search?: string, page: number = 1) => {
    setIsLoading(true);
    try {
      const response = await getAllActivities(search, page);
      if (response.status === 200) {
        setDataLastSearch(search);
      const { data: dataList, currentPage,  totalPages } = response.result;
      setCurrentPage(currentPage)
      const mappedList = dataList.map((event) => {
        return {
          ...event,
          execution_date: dayjs(event.execution_date).format("L"),
        };
      });
        setActivities(mappedList);
        setTotalPages(totalPages || 1);
        setIsLoading(false);
      } else {
        setActivities([]);
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const handleClickOpen = (activity?: any) => {
    const redirectTo = activity?._id ? `${ROUTES.DASHBOARD}/${ROUTES.ACTIVITIES}/${activity?._id}` : `${ROUTES.DASHBOARD}/${ROUTES.ACTIVITIES}`
    navigate(redirectTo);
  };

  const deleteFromlist = async (act: string) => {
    setCurrentAct(act);
    setOpenDialog(true);
  };

  const confirmDelete = async () => {
    setOpenDialog(false);
    await deleteActivities((currentAct as any)._id);
    setCurrentAct(null);
    getActivitiesList();
  };

  const cancelDelete = () => {
    setCurrentAct(null);
    setOpenDialog(false);
  };

  return (
    <>
    <ListView
      sectionTitle="Administrar Actividades"
      sectionDescription="Aquí podras gestionar las actividades del sistema."
      createButtonText="Crear actividad"
      listTitle="Listado de Actividades"
      openToast={false}
      toastMessage={ERROR_MESSAGES.GET_ACTIVITIES_ERROR}
      toastSeverity={SEVERITY_TOAST.ERROR}
      isLoading={isLoading}
      columnHeaders={columnAndRowkeys}
      listContent={actitivies}
      totalPages={totalPages}
      handleCreatebutton={() => handleClickOpen()}
      hanldeSearchFunction={(data) => getActivitiesList(data)}
      hanldeVoidInputFunction={() => getActivitiesList()}
      handleCloseToast={() => setToastGetBeneficiariesError(false)}
      handleEdit={(event) => handleClickOpen(event)}
      handleDelete={(param) => deleteFromlist(param)}
      handlePaginationChange={(data) => getActivitiesList('', data)}
      currentPage={currentPage}
    />
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
    </>
  );
}

export default ActivityList;