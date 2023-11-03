import { useEffect, useState } from "react";
import { Autocomplete, Button, Card, FormLabel, Grid, Paper, Stack, TextField, Typography } from "@mui/material";
import LoadingComponent from "../../components/loading/loading";
import { Table, TableCell, TableRow } from "../../components/table/table";
import './delivery.scss';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Search from "../../components/search/search";
import { getBeneficiariesList } from "../../services/beneficiaries.service";
//import { useNavigate } from "react-router-dom";
//import { ROUTES } from "../../constants/routes";
import { getAllEvents } from "../../services/events.service";
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';

function Delivery () {
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [bens, setBens] = useState([]);
    const [selectedBen, setSelectedBen] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [eventArray, setEventArray] = useState([]);
    const [itemList, setItemList] = useState([]);
    const [counters, setCounters] = useState([]);
    const [forceRender, setForceRender] = useState(+ new Date());
    //const navigate = useNavigate();

    useEffect(() => {
        getEvents();
        getBens();
    }, [])

    
    const getEvents = async () => {
        setIsLoading(true);
        try {
            const response = await getAllEvents();
            if (response.status === 200) {
                const dataList = response.result.data.data.map((item) => item.name);
                setEvents(dataList);
                setEventArray(response.result.data.data);
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
            console.error(error);
        }
    };

    const searchBeneficiaries = async (data) => {
        try {
            const { result } = await getBeneficiariesList(data);
            const { data: beneficiaries } = result;
            setBens(beneficiaries);
        } catch (err) {
            console.error(err);
        }
    }

    const onSelectEvent = (_, selected) => {
        const currentEvent = eventArray.find(item => item.name === selected);
        setSelectedEvent(currentEvent);
        console.log(currentEvent);
        const inventory = currentEvent.associated_winery?.inventory;
        setItemList(inventory);
        const newCounts = new Array(inventory.length).fill(0);
        setCounters(newCounts);
    }

    const handleAddAction = async(item) => {
        setSelectedBen(item);
    }

    const getFinalItemList = () => {
        const finalList = [];
        itemList.forEach((item, i) => {
            if (counters[i] > 0) finalList.push({
                item: item._id,
                quantity: counters[i],
            });
        });
        return finalList;
    }

    const saveDelivery = async () => {
        const currentEvent = {
            beneficiary: selectedBen._id,
            event: selectedEvent._id,
            itemList: getFinalItemList(),
        };
        console.log(currentEvent);
    }

    const addCounter = (i) => {
        const counts = counters;
        counts[i]++;
        setCounters(counts);
        setForceRender(+ new Date());
    }

    const removeCounter = (i) => {
        const counts = counters;
        counts[i]--;
        setCounters(counters);
        setForceRender(+ new Date());
    }

    return isLoading ? (
        <LoadingComponent></LoadingComponent>
      ) : (
        <>
            <section className='delivery-container'>
                <header className="delivery-container__actions">
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
                            options={events}
                            sx={{ width: 300 }}
                            renderInput={(params) => <TextField {...params} label="Evento" />}
                            onChange={onSelectEvent}
                        />
                        <Search
                            label="Buscar beneficiario"
                            buttonText="Buscar"
                            searchFunction={(data: any) => searchBeneficiaries(data)}
                            width={450}
                            voidInputFunction={getBens}
                        />
                    </Stack>
                    {selectedEvent &&
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
                    <div className="assistance-container__form-section__table">
                        <div className="panel-heading"> 
                            Beneficiario seleccionado
                        </div>
                        <Table>
                            <TableRow header>
                                <TableCell>Foto</TableCell>
                                <TableCell>Nombre</TableCell>
                                <TableCell>Cedula</TableCell>
                                <TableCell>Asociación</TableCell>
                            </TableRow>
                            <TableRow key={selectedBen.id}>
                                    <TableCell>
                                        <img
                                        className="ben-foto-info"
                                        src={selectedBen.photo_url}
                                        alt="foto"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {selectedBen?.first_name} {selectedBen.second_name}{" "}
                                        {selectedBen.first_last_name} {selectedBen.second_last_name}
                                    </TableCell>
                                    <TableCell>{selectedBen?.identification}</TableCell>
                                    <TableCell>{selectedBen?.association?.name}</TableCell>
                                </TableRow>
                        </Table>
                    </div>
                    }
                    {selectedBen &&
                        <div className="ratings-container__form-section__info">
                            <div className="panel-heading"> 
                                Articulos a entregar
                            </div>
                                <Card sx={{ width: 500, padding: 2 }}>
                                    <Stack direction={"column"}>
                                        {itemList.map((item, i) => {
                                            return (
                                                <Grid container spacing={2} key={item.name + '_' + i}>
                                                    <Grid item xs={5}>
                                                        <FormLabel component="legend">{item.name}</FormLabel>
                                                    </Grid>
                                                    <Grid item xs={3}>
                                                        <Button
                                                            aria-label="reduce"
                                                            className="btn-counter-action"
                                                            onClick={() => removeCounter(i)}
                                                            disabled={counters[i] === 0}
                                                        >
                                                            <RemoveIcon fontSize="small" />
                                                        </Button>
                                                    </Grid>
                                                    <Grid item xs={1}>
                                                        <Typography variant="overline" display="block" gutterBottom>
                                                            {counters[i]}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={3}>
                                                        <Button
                                                            aria-label="increase"
                                                            className="btn-counter-action"
                                                            onClick={() => addCounter(i)}
                                                            disabled={counters[i] === 1}
                                                        >
                                                            <AddIcon fontSize="small" />
                                                        </Button>
                                                    </Grid>
                                              </Grid>
                                            );
                                        })}
                                    </Stack>
                                </Card>
                        </div>
                    }
                    {selectedBen && 
                        <Button
                            className="btn-save-delivery"
                            onClick={() => saveDelivery()}
                            >
                            Generar entrega
                        </Button>
                    }
                </Paper>
            </section>
        </>
    );
}

export default Delivery;