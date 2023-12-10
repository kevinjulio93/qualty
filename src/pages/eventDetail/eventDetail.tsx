import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./eventDetail.scss";
import { useEffect, useState } from "react";
import { Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { Table, TableCell, TableRow } from "../../components/table/table";
import SelectDropdown from "../../components/select";
import {
  getAssociationsByCommunity,
  getComunaByMunicipie,
  getDepartments,
  getMunicipies,
} from "../../services/activities.service";
import ClearIcon from "@mui/icons-material/Clear";
import { ROUTES } from "../../constants/routes";
import { getAllWineries } from "../../services/winerie.service";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { NORTE_DE_SANTANDER } from "../../constants/defaultReferences";
import {
  createEvent,
  getEventById,
  updateEvent,
} from "../../services/events.service";
import SaveCancelControls from "../../components/saveActionComponent/saveCancelControls";

function EventDetail() {
  const { eventId } = useParams();
  const [title, setTitle] = useState("Crear");
  const [event, setEvent] = useState({});
  const [departmentsList, setDepartmentsList] = useState([]);
  const [storages, setStorages] = useState([]);
  const [municipiesList, setMunicipiesList] = useState([]);
  const [communityList, setCommunityList] = useState([]);
  const [associationsList, setAssociations] = useState([]);
  const [eventsAssociations, seteventsAssociations] = useState<any[]>([]);
  const [selectedAssociations, setSelectedAssociations] = useState<any[]>([]);
  const [selectedDep, setSelectedDep] = useState(NORTE_DE_SANTANDER);
  const [selectedMun, setSelectedMun] = useState(null);
  const [selectedCom, setSelectedCom] = useState(null);
  const [selectedAso, setSelectedAso] = useState(null);
  const [selectedBog, setselectedBog] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getAllStorages();
    getDepartamentsList();
    getMunicipiesList(selectedDep, {});
    if (eventId) {
      setTitle("Editar");
      getCurrentEvent();
    }
  }, []);

  const getCurrentEvent = async () => {
    const currentEvent = await getEventById(eventId);
    setEvent(currentEvent.result.data);
    const currentWinerie = getCurrentWinerie(currentEvent.result.data.associated_winery);
    setselectedBog(currentWinerie);
    seteventsAssociations(currentEvent.result.data.participatingAssociations);
  };

  const getCurrentWinerie = (id) => {
    const index = storages.findIndex(store => store._id === id);
    return index !== -1 ? storages[index] : {};
  }

  const formHanlder = (target: string, e: any) => {
    const value = e.target ? e.target.value : e;
    if (target === "participatingAssociations") {
      const updateSelectedAssciotions = [...selectedAssociations];
      updateSelectedAssciotions.push(value as any);
      setSelectedAssociations([...updateSelectedAssciotions]);
    } else {
      setEvent({ ...event, [target]: value });
    }
  };

  const getDepartamentsList = async () => {
    try {
      const response = await getDepartments();
      if (response && response.length > 0) {
        setDepartmentsList(response);
      }
    } catch (error) {
      setDepartmentsList([]);
    }
  };

  const getMunicipiesList = async (department, ev) => {
    try {
      setSelectedDep(department);
      const response = await getMunicipies(department?.id);
      if (response && response.length > 0) {
        setMunicipiesList(response);
        setSelectedMun(null);
        setSelectedCom(null);
        setSelectedAso(null);
      }
    } catch (error) {
      setDepartmentsList([]);
    }
  };

  const getCommunities = async (municipality: any, ev) => {
    try {
      setSelectedMun(municipality);
      const response = await getComunaByMunicipie(municipality?.id);
      if (response.status === 200) {
        setCommunityList(response.result.data);
        setSelectedCom(null);
        setSelectedAso(null);
      }
    } catch (error) {
      setDepartmentsList([]);
    }
  };

  const getAssociations = async (community: any, ev) => {
    try {
      setSelectedCom(community);
      const response = await getAssociationsByCommunity(community?._id);
      if (response.status === 200) {
        setAssociations(response.result.data);
        setSelectedAso(null);
      }
    } catch (error) {
      setDepartmentsList([]);
    }
  };

  const cleanReferences = () => {
    setSelectedAso(null);
    setSelectedCom(null);
    setSelectedMun(null);
    setSelectedDep(NORTE_DE_SANTANDER);
  };

  const addAssociationToEvent = () => {
    const exist = eventsAssociations.length
      ? eventsAssociations.some((asso) => selectedAso._id === asso._id)
      : false;
    if (exist) return;
    const associations = [...eventsAssociations];
    associations.push(selectedAso);
    seteventsAssociations(associations);
    cleanReferences();
  };

  const removeSelectedAssociation = (association: any) => {
    const updateAssociations = eventsAssociations.filter(
      (asso) => association._id !== asso._id
    );
    seteventsAssociations(updateAssociations);
  };

  const saveEvent = (payload) => {
    const saveWhen = {
      create: async () => await createEvent(payload),
      edit: async () => await updateEvent(eventId as string, payload),
    };

    return eventId ? saveWhen.edit() : saveWhen.create();
  };

  const getAllStorages = async () => {
    const { result } = await getAllWineries();
    const storageList = result?.data?.data;
    setStorages(storageList.filter(item => item.type === "Secundaria"));
  };

  const createUpdateEvent = async () => {
    const payload = {
      name: (event as any)?.name,
      description: (event as any)?.description,
      execution_date: (event as any)?.execution_date,
      associated_winery: selectedBog._id,
      estimate_attendance: (event as any)?.estimate_attendance,
      participatingAssociations: eventsAssociations.map(
        (asso) => asso?.association?.id ?? asso._id
      ),
    };

    try {
      const response = await saveEvent(payload);
      navigate(`${ROUTES.DASHBOARD}/${ROUTES.EVENTS_LIST}`);
    } catch (error) {
      console.log("no se creó la asociacion");
    }
  };

  const disableAssociationTable = () => {
    return (
      (!(event as any)?.name || (event as any)?.name === "") ||
      (!(event as any)?.execution_date || (event as any)?.execution_date === "") ||
      (!(event as any)?.description || (event as any)?.description === "") ||
      (!(event as any)?.estimate_attendance || (event as any)?.estimate_attendance === "") ||
      !selectedBog?._id
    );
  };

  return (
    <>
      <section className="activities-container">
        <header className="activities-container__actions">
          <div className="content-page-title">
            <Typography variant="h5" className="page-header">
              {title} Evento
            </Typography>
            <span className="page-subtitle">
              Aquí podras gestionar los eventos del sistema.
            </span>
          </div>
        </header>

        <Paper elevation={1} className="activities-container__form-section">
          <div className="activities-container__form-section__form-1">
            <TextField
              className="activities-container__form-section__form-1__field"
              id="actiivtyName"
              name="actiivtyName"
              placeholder="Nombre del evento"
              type="text"
              onChange={(e) => formHanlder("name", e)}
              label="Nombre del Evento"
              value={(event as any)?.name || ""}
            />
            <TextField
              className="activities-container__form-section__form-1__field"
              id="description"
              name="description"
              placeholder="Esta es un evento"
              type="text"
              onChange={(e) => formHanlder("description", e)}
              label="Descripción"
              value={(event as any)?.description || ""}
            />

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                onChange={(newDate: Dayjs) =>
                  formHanlder("execution_date", newDate.format())
                }
                value={
                  (event as any)?.execution_date
                    ? dayjs((event as any)?.execution_date)
                    : null
                }
                label="Fecha de realización"
              />
            </LocalizationProvider>

            <TextField
              className="activities-container__form-section__form-1__field"
              id="estimate_attendance"
              name="estimate_attendance"
              placeholder="100"
              type="number"
              onChange={(e) => formHanlder("estimate_attendance", e)}
              label="Aforo estimado"
              value={(event as any)?.estimate_attendance || ""}
            />

            <div className="activities-container__form-section__form-1__field">
              <SelectDropdown
                selectValue={selectedBog?._id}
                label="Bodegas"
                options={storages}
                keyLabel="name"
                keyValue="_id"
                targetKey="storages"
                handleValue={(value, ev) => setselectedBog(value)}
              />
            </div>
          </div>
          <div
            className={`activities-container__form-section__assitants ${
              disableAssociationTable() ? "disabled" : ""
            }`}
          >
            <Typography
              className="activities-container__form-section__assitants__title"
              variant="h6"
            >
              Agregar asociaciones asistentes
            </Typography>

            <form className="activities-container__form-section__assitants__form-2">
              <div className="activities-container__form-section__assitants__form-2__field">
                <SelectDropdown
                  selectValue={(selectedDep as any)?.id}
                  label="Departamento"
                  options={departmentsList}
                  keyLabel="name"
                  keyValue="id"
                  targetKey="department"
                  handleValue={(value, e) => getMunicipiesList(value, e)}
                />
              </div>
              <div className="activities-container__form-section__assitants__form-2__field">
                <SelectDropdown
                  selectValue={selectedMun?.id}
                  label="Municipio"
                  options={municipiesList}
                  keyLabel="name"
                  keyValue="id"
                  targetKey="municipality"
                  handleValue={(value, e) => getCommunities(value, e)}
                />
              </div>

              <div className="activities-container__form-section__assitants__form-2__field">
                <SelectDropdown
                  selectValue={selectedCom?._id}
                  label="Comuna"
                  options={communityList}
                  keyLabel="name"
                  keyValue="_id"
                  targetKey="community"
                  handleValue={(value, e) => getAssociations(value, e)}
                />
              </div>

              <div className="activities-container__form-section__assitants__form-2__field">
                <SelectDropdown
                  selectValue={selectedAso?._id}
                  label="Asociacion"
                  options={associationsList}
                  keyLabel="name"
                  keyValue="_id"
                  targetKey="association"
                  handleValue={(value) => setSelectedAso(value)}
                />
              </div>

              <Button
                className="btn-save"
                onClick={() => addAssociationToEvent()}
              >
                Agregar
              </Button>
            </form>

            <section className="activities-container__form-section__assitants__table">
              <Table>
                <TableRow header>
                  <TableCell>Departamento</TableCell>
                  <TableCell>Municipio</TableCell>
                  <TableCell>Comuna</TableCell>
                  <TableCell>Nombre de Asociación</TableCell>
                </TableRow>
                {eventsAssociations.length > 0 &&
                  eventsAssociations.map((asso: any, index) => {
                    return (
                      <TableRow key={index}>
                        <TableCell>
                          {asso?.department?.label ?? asso?.department}
                        </TableCell>
                        <TableCell>
                          {asso?.municipality?.label ?? asso?.municipality}
                        </TableCell>
                        <TableCell>
                          {asso?.community?.label ?? asso?.community?.name}
                        </TableCell>
                        <TableCell>
                          {asso?.association?.label ?? asso?.name}
                        </TableCell>
                        <TableCell>
                          <Stack
                            className="actions-cell"
                            direction="row"
                            spacing={2}
                          >
                            <ClearIcon
                              className="action-item-icon action-item-icon-delete"
                              onClick={() => removeSelectedAssociation(asso)}
                            ></ClearIcon>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </Table>
              {eventsAssociations.length === 0 && (
                <div className="activities-container__form-section__assitants__table__empty">
                  <span>No hay asociaciones agregadas a este evento</span>
                </div>
              )}

              {/* <Button onClick={createUpdateEvent} className="btn-save-activity">
                Guardar evento
              </Button> */}
            </section>
          </div>
        </Paper>
      </section>

      <SaveCancelControls
        saveText="Guardar"
        handleSave={(e) => createUpdateEvent() }
      />
    </>
  );
}

export default EventDetail;
