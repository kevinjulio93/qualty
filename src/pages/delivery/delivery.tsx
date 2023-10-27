import { useEffect, useState } from "react";
import { getAllActivities } from "../../services/activities.service";
import { Autocomplete, Box, Button, Card, CardContent, CardMedia, Paper, Stack, TextField, Typography } from "@mui/material";
import LoadingComponent from "../../components/loading/loading";
import { Table, TableCell, TableRow } from "../../components/table/table";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Search from "../../components/search/search";
import { getBeneficiariesList } from "../../services/beneficiaries.service";
import { createWorkshop } from "../../services/workshop.service";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/routes";


function Delivery () {
    const [activities, setActivities] = useState([]);
    const [actArray, setActArray] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [bens, setBens] = useState([]);
    const [selectedAct, setSelectedAct] = useState(null);
    const [selectedBen, setSelectedBen] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        getEvents();
        getBens();
    }, [])

    
    const getEvents = async () => {
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
        setSelectedBen(item);
    }

    const saveWorkshop = async () => {
        const rating = {
            rating_type: selectedAct,
            beneficiary: selectedBen._id,
        }
        await createWorkshop(rating);
        navigate(`${ROUTES.DASHBOARD}/${ROUTES.RATING_LIST}`);
    }

    return isLoading ? (
        <LoadingComponent></LoadingComponent>
      ) : (
        <>
            <section className='assistance-container'>
                <header className="assistance-container__actions">
                    <div className="content-page-title">
                        <Typography variant="h5" className="page-header">Entrega de bienes</Typography>
                        <span className="page-subtitle">Generar entrega de bienes a beneficiario.</span>
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
                        />
                        <Search
                            label="Buscar beneficiario"
                            buttonText="Buscar"
                            searchFunction={(data: any) => searchBeneficiaries(data)}
                            width={450}
                            voidInputFunction={getBens}
                        />
                    </Stack>
                    {selectedAct &&
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
                    {selectedBen &&
                        <div className="ratings-container__form-section__info">
                            <div className="panel-heading"> 
                                Información del beneficiario
                            </div>
                            <Stack direction="row" spacing={4}>
                                <Card sx={{ display: 'flex' }}>
                                    <CardMedia
                                        component="img"
                                        sx={{ width: 151 }}
                                        image={selectedBen.photo_url}
                                        alt=""
                                    />
                                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                        <CardContent sx={{ flex: '1 0 auto' }}>
                                            <Typography component="div" variant="h5">
                                                {selectedBen.first_name} {selectedBen.first_last_name} {selectedBen.second_last_name}
                                            </Typography>
                                            <Typography variant="subtitle1" color="text.secondary" component="div">
                                                C.C. {selectedBen.identification}
                                            </Typography>
                                        </CardContent>
                                    </Box>
                                </Card>
                            </Stack>
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

export default Delivery;