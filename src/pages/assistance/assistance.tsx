import { useEffect, useState } from "react";
import { getAllActivities } from "../../services/activities.service";
import { Autocomplete, Button, FormControl, InputLabel, MenuItem, Paper, Select, Stack, TextField, Typography } from "@mui/material";
import LoadingComponent from "../../components/loading/loading";
import { Table, TableCell, TableRow } from "../../components/table/table";
import ClearIcon from "@mui/icons-material/Clear";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Search from "../../components/search/search";
import "./assistance.scss";
import { getBeneficiariesList } from "../../services/beneficiaries.service";
import { createWorkshop, getWorkshopById } from "../../services/workshop.service";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "../../constants/routes";


function Assistance () {
    const { workshopId } = useParams();
    const [activities, setActivities] = useState([]);
    const [actArray, setActArray] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [bens, setBens] = useState([]);
    const [selectedAct, setSelectedAct] = useState(null);
    const [selectedWork, setSelectedWork] = useState(null);
    const [assistList, setAssistList] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (workshopId) {
            getCurrentWorkshop();
        }
        getActivities();
        getBens();
    }, [])

    const getCurrentWorkshop = async () => {
        const currentWork = await getWorkshopById(workshopId);
        const { name, activity, attendees } = currentWork.result.data;
        setSelectedWork(name);
        setSelectedAct(activity);
        setAssistList(attendees);
    }

    
    const getActivities = async () => {
        setIsLoading(true);
        try {
            const response = await getAllActivities();
            if (response.status === 200) {
                const dataList = response.result.data.map((item) => item.name);
                setActivities(dataList);
                setActArray(response.result.data);
            }
        } catch (error) {
          console.error(error);
        }
        setIsLoading(false);
    }

    const getBens = async () => {
        try {
          const response = await getBeneficiariesList();
          const benList = response.result.data;
          setBens(benList);
        } catch (error) {
            console.log(error);
        }
    };

    const searchBeneficiaries = async (data) => {
        try {
            const { result } = await getBeneficiariesList(data);
            const { data: beneficiaries } = result;
            setBens(beneficiaries);
        } catch (err) {
            console.log(err);
        }
    }

    const onSelectActivity = (_, selected) => {
        const currentAct = actArray.find(item => item.name === selected);
        setSelectedAct(currentAct);
    }

    const handleAddAction = async(item) => {
        const exist = assistList.length ? assistList.some(ben => ben._id === item._id) : false;
        if (exist) return;
        setAssistList([...assistList, item]);
    }

    const handleRemoveAction = async(index) => {
        const tempArr = assistList;
        tempArr.splice(index, 1);
        setAssistList([...tempArr]);
    }

    const onSelectedWorkshop = (e) => {
        setSelectedWork(e.target.value);
    }

    const saveWorkshop = async() => {
        const workshop = {
            name: selectedWork,
            activity: selectedAct._id,
            attendees: assistList.map(item => item._id)
        }
        await createWorkshop(workshop);
        navigate(`${ROUTES.DASHBOARD}/${ROUTES.WORKSHOP}`);
    }

    return isLoading ? (
        <LoadingComponent></LoadingComponent>
      ) : (
        <>
            <section className='assistance-container'>
                <header className="assistance-container__actions">
                    <div className="content-page-title">
                        <Typography variant="h5" className="page-header">Asistencia a talleres</Typography>
                        <span className="page-subtitle">Generar asistencia de beneficiarios a los talleres.</span>
                    </div>
                </header>

                <Paper elevation={1} className="assistance-container__form-section">
                    <Stack direction="row" spacing={4}>
                        <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            options={activities}
                            sx={{ width: 300 }}
                            renderInput={(params) => <TextField {...params} label="Actividad" />}
                            onChange={onSelectActivity}
                            value={(selectedAct as any)?.name || ''}
                        />
                        <FormControl sx={{width: 300}}>
                            <InputLabel id="demo-simple-select-label">Taller</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="Taller a realizar"
                                value={selectedWork}
                                onChange={(e) => onSelectedWorkshop(e)}
                            >
                                <MenuItem key={"taller_no_1"} value="Taller de cuidado personal">
                                    Taller de cuidado personal
                                </MenuItem>
                                <MenuItem key={"taller_no_2"} value="Taller de salud oral">
                                    Taller de salud oral
                                </MenuItem>
                            </Select>
                        </FormControl>
                        <Search
                            label="Buscar beneficiario"
                            buttonText="Buscar"
                            searchFunction={(data: any) => searchBeneficiaries(data)}
                            width={450}
                            voidInputFunction={getBens}
                        />
                    </Stack>
                    {selectedAct && selectedWork &&
                    <div className="assistance-container__form-section__table">
                        <div className="panel-heading"> 
                            Resultados de la busqueda
                        </div>
                        <Table>
                            <TableRow header>
                                <TableCell>Foto</TableCell>
                                <TableCell>Nombre</TableCell>
                                <TableCell>Cedula</TableCell>
                                <TableCell>Asociación</TableCell>
                                <TableCell>Acciones</TableCell>
                            </TableRow>
                            {bens.length > 0 ?
                            bens.map((beneficiary: any, index) => {
                                return (
                                <TableRow key={index}>
                                    <TableCell>
                                        <img
                                        className="ben-foto"
                                        src={beneficiary.photo_url}
                                        alt="foto"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {beneficiary?.first_name} {beneficiary.second_name}{" "}
                                        {beneficiary.first_last_name} {beneficiary.second_last_name}
                                    </TableCell>
                                    <TableCell>{beneficiary?.identification}</TableCell>
                                    <TableCell>{beneficiary?.association?.name}</TableCell>
                                    <TableCell>
                                    <Stack className="actions-cell" direction="row" spacing={2}>
                                        <AddCircleIcon
                                        className="action-item-icon action-item-icon-add"
                                        onClick={() => handleAddAction(beneficiary)}
                                        ></AddCircleIcon>
                                    </Stack>
                                    </TableCell>
                                </TableRow>
                                );
                            }) : <TableRow>
                                    <TableCell>No hay registros disponible</TableCell>
                                </TableRow>}
                        </Table>
                    </div>
                    }
                    {selectedAct && selectedWork &&
                    <div className="assistance-container__form-section__table">
                        <div className="panel-heading"> 
                            Listado de asistencia
                        </div>
                        <Table>
                            <TableRow header>
                                <TableCell>Foto</TableCell>
                                <TableCell>Nombre</TableCell>
                                <TableCell>Cedula</TableCell>
                                <TableCell>Asociación</TableCell>
                                <TableCell>Acciones</TableCell>
                            </TableRow>
                            {
                            assistList.map((beneficiary: any, index) => {
                                return (
                                <TableRow key={index}>
                                    <TableCell>
                                        <img
                                        className="ben-foto"
                                        src={beneficiary.photo_url}
                                        alt="foto"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {beneficiary?.first_name} {beneficiary.second_name}{" "}
                                        {beneficiary.first_last_name} {beneficiary.second_last_name}
                                    </TableCell>
                                    <TableCell>{beneficiary?.identification}</TableCell>
                                    <TableCell>{beneficiary?.association?.name}</TableCell>
                                    <TableCell>
                                    <Stack className="actions-cell" direction="row" spacing={2}>
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
                    }
                    <Button
                    className="btn-save-workshop"
                    onClick={() => saveWorkshop()}
                    >
                    Generar asistencia
                    </Button>
                </Paper>
            </section>
        </>
    );
}

export default Assistance;