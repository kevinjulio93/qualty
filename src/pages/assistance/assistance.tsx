import { useEffect, useState } from "react";
import { getAllActivities } from "../../services/activities.service";
import {
  Autocomplete,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import LoadingComponent from "../../components/loading/loading";
import { Table, TableCell, TableRow } from "../../components/table/table";
import ClearIcon from "@mui/icons-material/Clear";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Search from "../../components/search/search";
import "./assistance.scss";
import { getBeneficiaryByActivity } from "../../services/beneficiaries.service";
import {
  createWorkshop,
  getWorkshopById,
  updateWorkshop,
} from "../../services/workshop.service";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { workshops } from "../../constants/workshops";
import userImage from '../../assets/user.png'
import SaveCancelControls from "../../components/saveActionComponent/saveCancelControls";
import DoneIcon from '@mui/icons-material/Done';

function Assistance() {
  const { workshopId } = useParams();
  const [activities, setActivities] = useState([]);
  const [actArray, setActArray] = useState([]);
  const [bens, setBens] = useState([]);
  const [selectedAct, setSelectedAct] = useState(null);
  const [selectedWork, setSelectedWork] = useState(null);
  const [assistList, setAssistList] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [dataLastSearch, setDataLastSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    if (workshopId) {
      getCurrentWorkshop();
    }
    getActivities();
  }, []);

  useEffect(() => {
    if (selectedAct) {
      getBenfs();
    }
  }, [selectedAct]);

  const getCurrentWorkshop = async () => {
    const currentWork = await getWorkshopById(workshopId);
    const { name, activity, attendees } = currentWork.result.data;
    setSelectedWork(name);
    setSelectedAct(activity);
    setAssistList(attendees);
  };

  const getActivities = async () => {
    try {
      const response = await getAllActivities(null, 1, 200);
      if (response.status === 200) {
        const dataList = response.result.data.map((item) => item.name);
        setActivities(dataList);
        setActArray(response.result.data);
      }
    } catch (error) {
      console.error(error);
    }
  };


  const getBenfs = async () => {
    try {
      const { result } = await getBeneficiaryByActivity(selectedAct._id);
      const { data: benfsList, totalPages } = result.data;
      setBens(benfsList);
      setTotalPages(totalPages);
    } catch (err) {
      console.log(err);
    }
  };


  const onSelectActivity = (_, selected) => {
    const currentAct = actArray.find((item) => item.name === selected);
    setSelectedAct(currentAct);
  };

  const benExist = (item) => {
    return assistList.length
      ? assistList.some((ben) => ben._id === item._id)
      : false;
  }

  const handleAddAction = async (item) => {
    const exist = benExist(item);
    if (exist) return;
    setAssistList([...assistList, item]);
  };

  const handleRemoveAction = async (index) => {
    const tempArr = assistList;
    tempArr.splice(index, 1);
    setAssistList([...tempArr]);
  };

  const onSelectedWorkshop = (e) => {
    setSelectedWork(e.target.value);
  };

  const saveWorkshop = async () => {
    const workshop = {
      name: selectedWork,
      activity: selectedAct._id,
      attendees: assistList.map((item) => item._id),
    };
    workshopId
      ? await updateWorkshop(workshopId, workshop)
      : await createWorkshop(workshop);
    navigate(`${ROUTES.DASHBOARD}/${ROUTES.WORKSHOP}`);
  };

  return (
    <>
      <section className="assistance-container">
        <header className="assistance-container__actions">
          <div className="content-page-title">
            <Typography variant="h5" className="page-header">
              Asistencia a talleres
            </Typography>
            <span className="page-subtitle">
              Generar asistencia de beneficiarios a los talleres.
            </span>
          </div>
        </header>

        <Paper elevation={1} className="assistance-container__form-section">
          <Stack direction="row" spacing={4}>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={activities}
              sx={{ width: 300 }}
              renderInput={(params) => (
                <TextField {...params} label="Actividad" />
              )}
              onChange={onSelectActivity}
              value={(selectedAct as any)?.name || ""}
            />
            <FormControl sx={{ width: 300 }}>
              <InputLabel id="demo-simple-select-label">Taller</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Taller a realizar"
                value={selectedWork}
                onChange={(e) => onSelectedWorkshop(e)}
              >
                {workshops.map((item, index) => {
                  return (
                    <MenuItem
                  key={"taller_no_" + index}
                  value={item}
                >
                  {item}
                </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <Search
            label="Buscar beneficiario"
            searchFunction={async (data: string) => {
              try {
                console.log(data);
                const { result } = await getBeneficiaryByActivity(selectedAct._id, data);
                setDataLastSearch(data);
                const { data: beneficiaries, totalPages } = result.data;
                setTotalPages(totalPages);
                setBens(beneficiaries);
              } catch (err) {
                console.log(err);
              }
            }}
            voidInputFunction={getBenfs}
          />
          </Stack>
          {selectedAct && selectedWork &&  bens?.length > 0 && (
            <div className="assistance-container__form-section__table">
              <div className="panel-heading">Resultados de la busqueda</div>
              <Table>
                <TableRow header>
                  <TableCell>Foto</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Cedula</TableCell>
                  <TableCell>Asociación</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
                {bens.length > 0 ? (
                  bens.map((beneficiary: any, index) => {
                    return (
                      <TableRow key={index}>
                        <TableCell>
                          <img
                            className="ben-foto"
                            src={beneficiary.photo_url?beneficiary.photo_url:userImage}
                            alt="foto"
                          />
                        </TableCell>
                        <TableCell>
                          {beneficiary?.first_name} {beneficiary.second_name}{" "}
                          {beneficiary.first_last_name}{" "}
                          {beneficiary.second_last_name}
                        </TableCell>
                        <TableCell>{beneficiary?.identification}</TableCell>
                        <TableCell>{beneficiary?.association?.name}</TableCell>
                        <TableCell>
                          <Stack
                            className="actions-cell"
                            direction="row"
                            spacing={2}
                          >
                            { !benExist(beneficiary) && <AddCircleIcon
                              className="action-item-icon action-item-icon-add"
                              onClick={() => handleAddAction(beneficiary)}
                            ></AddCircleIcon>}
                            { benExist(beneficiary) && <DoneIcon
                              className="action-item-icon action-item-icon-edit"
                            ></DoneIcon>}
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell>No hay registros disponible</TableCell>
                  </TableRow>
                )}
              </Table>
              <Pagination
              count={totalPages}
              page={currentPage}
              onChange={async (_, page) => {
                try {
                  const { result } = await getBeneficiaryByActivity(
                    selectedAct._id,
                    dataLastSearch,
                    page
                  );
                  const { data: benfs, currentPage, totalPages } = result.data;
                  setBens(benfs);
                  setCurrentPage(currentPage);
                  setTotalPages(totalPages);
                } catch (err) {
                  console.log(err);
                }
              }}
            />
            </div>
          )}
          {selectedAct && selectedWork && (
            <div className="assistance-container__form-section__table">
              <div className="panel-heading">Listado de asistencia</div>
              <Table>
                <TableRow header>
                  <TableCell>Foto</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Cedula</TableCell>
                  <TableCell>Asociación</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
                {assistList.map((beneficiary: any, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell>
                        <img
                          className="ben-foto"
                          src={beneficiary.photo_url ? beneficiary.photo_url : userImage}
                          alt="foto"
                        />
                      </TableCell>
                      <TableCell>
                        {beneficiary?.first_name} {beneficiary.second_name}{" "}
                        {beneficiary.first_last_name}{" "}
                        {beneficiary.second_last_name}
                      </TableCell>
                      <TableCell>{beneficiary?.identification}</TableCell>
                      <TableCell>{beneficiary?.association?.name}</TableCell>
                      <TableCell>
                        <Stack
                          className="actions-cell"
                          direction="row"
                          spacing={2}
                        >
                          <ClearIcon
                            className="action-item-icon action-item-icon-delete"
                            onClick={() => handleRemoveAction(index)}
                          ></ClearIcon>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </Table>
            </div>
          )}
        </Paper>
      </section>
      <SaveCancelControls
        saveText="Guardar"
        handleSave={() => saveWorkshop() }
      />
    </>
  );
}

export default Assistance;
