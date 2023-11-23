import { useEffect, useState } from "react";
import { Button, Card, FormControl, FormLabel, Grid, InputLabel, MenuItem, Paper, Select, Stack, TextField, Typography } from "@mui/material";
import LoadingComponent from "../../components/loading/loading";
import { Table, TableCell, TableRow } from "../../components/table/table";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Search from "../../components/search/search";
import "./ratings.scss";
import { getBeneficiariesList } from "../../services/beneficiaries.service";
import { useNavigate, useParams } from "react-router-dom";
import { createRatings, getRatingsById, updateCurrentRating } from "../../services/rating.service";
import { ROUTES } from "../../constants/routes";
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { getAllItems } from "../../services/inventory.service";
import SaveCancelControls from "../../components/saveActionComponent/saveCancelControls";
import userImage from '../../assets/user.png'


function Ratings () {
    const { ratingId } = useParams();
    const [bens, setBens] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedRating, setSelectedRating] = useState("");
    const [selectedBen, setSelectedBen] = useState(null);
    const [notes, setNotes] = useState("");
    const [diagnosticNote, setDiagnostic] = useState("");
    const [counters, setCounters] = useState([]);
    const [itemList, setItemList] = useState([]);
    const [forceRender, setForceRender] = useState(+ new Date());
    const [updatedItems, setUpdatedItems] = useState([]);
    const [currentRating, setCurrentRating] = useState({});
    const [disabledBtn, setDisabledBtn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (ratingId) {
            getCurrentRating();
        }
        getItems();
        getBens();
    }, [])

    useEffect(() => {
        if (ratingId) {
            setCurrentCounters();
        }
    }, [itemList, updatedItems])

    

    const getCurrentRating = async () => {
        const current = await getRatingsById(ratingId);
        const { rating_type, observations, attendee, diagnostic, suggested_items } = current.result.data;
        setCurrentRating(current.result.data);
        setSelectedRating(rating_type);
        setSelectedBen(attendee);
        setNotes(observations);
        setDiagnostic(diagnostic);
        setUpdatedItems(suggested_items);
    }

    const getItems = async() => {
        try {
            const response = await getAllItems();
            const list = response?.result?.data?.data?.filter(el => !el.isDefault && !el.associationItem);
            const newCounts = new Array(list.length).fill(0);
            setCounters(newCounts);
            setItemList(list);
        } catch (error) {
              console.error(error);
        }
    }

    const setCurrentCounters = () => {
        itemList.forEach((item, i) => {
            if (updatedItems.map(item => item._id).includes(item._id) && counters[i] === 0) {
                const counts = counters;
                counts[i]++;
                setCounters(counters);
            }
        });
        setForceRender(+ new Date());
    }

    const getBens = async () => {
        setIsLoading(true);
        try {
          const response = await getBeneficiariesList();
          const benList = response.result.data;
          setBens(benList);
          setIsLoading(false);
        } catch (error) {
            console.error(error);
            setIsLoading(false);
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

    const handleAddAction = async(item) => {
        setSelectedBen(item);
    }

    const onSelectRating = (e) => {
        setSelectedRating(e.target.value);
    }

    const handleText = (e) => {
        setNotes(e.target.value);
    }

    const handleDiagnostic = (e) => {
        setDiagnostic(e.target.value);
    }

    const saveRatings = async () => {
        setDisabledBtn(true);
        const rating = {
            rating_type: selectedRating,
            observations: notes,
            attendee: selectedBen._id,
            diagnostic: diagnosticNote,
            suggested_items: getFinalItemList()
        }
        await createRatings(rating);
        navigate(`${ROUTES.DASHBOARD}/${ROUTES.RATING_LIST}`);
    }

    const updateRatings = async () => {
        const rating = {
            ...currentRating,
            rating_type: selectedRating,
            observations: notes,
            attendee: selectedBen._id,
            diagnostic: diagnosticNote,
            suggested_items: getFinalItemList()
        }
        await updateCurrentRating(rating);
        navigate(`${ROUTES.DASHBOARD}/${ROUTES.RATING_LIST}`);
    }

    const getFinalItemList = () => {
        const finalList = [];
        itemList.forEach((item, i) => {
            if (counters[i] > 0) finalList.push(item._id);
        });
        return finalList;
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
            <section className='ratings-container'>
                <header className="ratings-container__actions">
                    <div className="content-page-title">
                        <Typography variant="h5" className="page-header">Generar valoración</Typography>
                        <span className="page-subtitle">Generar valoración a un beneficiario.</span>
                    </div>
                </header>

                <Paper elevation={1} className="ratings-container__form-section">
                    <Stack direction="row" spacing={4}>
                        <FormControl sx={{width: 300}}>
                            <InputLabel id="demo-simple-select-label">Valoración</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="Valoración a realizar"
                                onChange={(e) => onSelectRating(e)}
                                value={selectedRating}
                            >
                                {}
                                <MenuItem key={"fisio"} value="Fisioterapia">
                                    Fisioterapia
                                </MenuItem>
                                <MenuItem key={"psico"} value="Psicología">
                                    Psicología
                                </MenuItem>
                                <MenuItem key={"opto"} value="Optometría">
                                    Optometría
                                </MenuItem>
                                <MenuItem key={"odonto"} value="Odontología">
                                    Odontología
                                </MenuItem>
                                <MenuItem key={"fono"} value="Fonoaudiología">
                                    Fonoaudiología
                                </MenuItem>
                                <MenuItem key={"anam"} value="Anamnesis">
                                    Anamnesis
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
                    {selectedRating &&
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
                                        src={beneficiary.photo_url?beneficiary.photo_url:userImage}
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
                            <Stack direction="row" spacing={4}>
                                <TextField
                                    id="filled-multiline-static"
                                    label="Observaciones"
                                    multiline
                                    rows={10}
                                    variant="filled"
                                    sx={{width: 400}}
                                    onChange={(e) => handleText(e)}
                                    value={notes}
                                />
                                <TextField
                                    id="filled-multiline-static"
                                    label="Diagnostico"
                                    multiline
                                    rows={10}
                                    variant="filled"
                                    sx={{width: 250}}
                                    onChange={(e) => handleDiagnostic(e)}
                                    value={diagnosticNote}
                                />
                                <div className="ratings-container__form-section__info">
                                    <div className="panel-heading"> 
                                        Artículos sugeridos
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
                            </Stack>
                        </div>
                    }
                </Paper>
            </section>
            <SaveCancelControls
                saveText="Guardar"
                disabled={disabledBtn}
                handleSave={() => ratingId ? updateRatings() : saveRatings() }
            />
        </>
    );
}

export default Ratings;