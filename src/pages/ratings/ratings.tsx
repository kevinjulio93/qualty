import { useEffect, useState } from "react";
import { getAllActivities, updateAttendance } from "../../services/activities.service";
import { Autocomplete, FormControl, InputLabel, MenuItem, Paper, Select, Stack, TextField, Typography } from "@mui/material";
import LoadingComponent from "../../components/loading/loading";
import { Table, TableCell, TableRow } from "../../components/table/table";
import ClearIcon from "@mui/icons-material/Clear";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Search from "../../components/search/search";
import "./ratings.scss";
import { getBeneficiariesList } from "../../services/beneficiaries.service";


function Ratings () {
    const [activities, setActivities] = useState([]);
    const [actArray, setActArray] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [bens, setBens] = useState([]);
    const [selectedAct, setSelectedAct] = useState(null);

    useEffect(() => {
        getActivities();
        getBens();
    }, [])

    
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
        const actId = selectedAct._id;
        const assisList = item._id;
        await updateAttendance(actId, {...selectedAct, attendees: [...selectedAct.attendees, assisList]});
    }

    const handleRemoveAction = async(item) => {
        const actId = item._id;
        const assisList = selectedAct.attendees.filter(element => element._id !== actId);
        console.log(assisList);
        await updateAttendance(actId, {...selectedAct, attendees: assisList});
    }

    const onSelectedWorkshop = () => {
        console.log("seleccionado");
    }

    return isLoading ? (
        <LoadingComponent></LoadingComponent>
      ) : (
        <>
            <section className='ratings-container'>
                <header className="ratings-container__actions">
                    <div className="content-page-title">
                        <Typography variant="h5" className="page-header">Asistencia a valoraciones</Typography>
                        <span className="page-subtitle">Generar asistencia de beneficiarios a las valoraciones.</span>
                    </div>
                </header>

                <Paper elevation={1} className="ratings-container__form-section">
                    <Stack direction="row" spacing={4}>
                        <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            options={activities}
                            sx={{ width: 300 }}
                            renderInput={(params) => <TextField {...params} label="Actividad" />}
                            onChange={onSelectActivity}
                        />
                        <FormControl sx={{width: 300}}>
                            <InputLabel id="demo-simple-select-label">Valoración</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="Valoración a realizar"
                                onChange={(e) => onSelectedWorkshop()}
                            >
                                <MenuItem key={"taller_no_1"} value="Fisioterapia">
                                    Fisioterapia
                                </MenuItem>
                                <MenuItem key={"taller_no_2"} value="Psicología">
                                    Psicología
                                </MenuItem>
                                <MenuItem key={"taller_no_2"} value="Optometría">
                                    Optometría
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
                    {selectedAct &&
                    <div className="ratings-container__form-section__table">
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
                    {selectedAct &&
                    <div className="ratings-container__form-section__table">
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
                            { selectedAct && (selectedAct as any).attendees.length > 0 &&
                            (selectedAct as any).attendees.map((beneficiary: any, index) => {
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
                                        onClick={() => handleRemoveAction(beneficiary)}
                                        ></ClearIcon>
                                    </Stack>
                                    </TableCell>
                                </TableRow>
                                );
                            })}
                        </Table>
                    </div>
                    }
                </Paper>
            </section>
        </>
    );
}

export default Ratings;