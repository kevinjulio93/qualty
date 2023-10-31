import { useEffect, useState } from "react";
import { Box, Button, Card, CardContent, CardMedia, FormControl, InputLabel, MenuItem, Paper, Select, Stack, TextField, Typography } from "@mui/material";
import LoadingComponent from "../../components/loading/loading";
import { Table, TableCell, TableRow } from "../../components/table/table";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Search from "../../components/search/search";
import "./ratings.scss";
import { getBeneficiariesList } from "../../services/beneficiaries.service";
import { useNavigate, useParams } from "react-router-dom";
import { createRatings, getRatingsById } from "../../services/rating.service";
import { ROUTES } from "../../constants/routes";


function Ratings () {
    const { ratingId } = useParams();
    const [bens, setBens] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedRating, setSelectedRating] = useState(null);
    const [selectedBen, setSelectedBen] = useState(null);
    const [notes, setNotes] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (ratingId) {
            getCurrentRating();
        }
        getBens();
    }, [])

    const getCurrentRating = async () => {
        const currentRating = await getRatingsById(ratingId);
        const { rating_type, observations, attendee } = currentRating.result.data;
        setSelectedRating(rating_type);
        setSelectedBen(attendee);
        setNotes(observations);
    }

    const getBens = async () => {
        setIsLoading(true);
        try {
          const response = await getBeneficiariesList();
          const benList = response.result.data;
          setBens(benList);
          setIsLoading(false);
        } catch (error) {
            console.log(error);
            setIsLoading(false);
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

    const handleAddAction = async(item) => {
        setSelectedBen(item);
    }

    const onSelectRating = (e) => {
        setSelectedRating(e.target.value);
    }

    const handleText = (e) => {
        setNotes(e.target.value);
    }

    const saveRatings = async () => {
        const rating = {
            rating_type: selectedRating,
            observations: notes,
            attendee: selectedBen._id,
        }
        await createRatings(rating);
        navigate(`${ROUTES.DASHBOARD}/${ROUTES.RATING_LIST}`);
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
                                <MenuItem key={"fisio"} value="Fisioterapia">
                                    Fisioterapia
                                </MenuItem>
                                <MenuItem key={"psico"} value="Psicología">
                                    Psicología
                                </MenuItem>
                                <MenuItem key={"opto"} value="Optometría">
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
                                <TextField
                                    id="filled-multiline-static"
                                    label="Observaciones"
                                    multiline
                                    rows={6}
                                    variant="filled"
                                    sx={{width: 1000}}
                                    onChange={(e) => handleText(e)}
                                    value={notes}
                                />
                            </Stack>
                        </div>
                    }
                    <Button
                    className="btn-save-ratings"
                    onClick={() => saveRatings()}
                    >
                    Generar asistencia
                    </Button>
                </Paper>
            </section>
        </>
    );
}

export default Ratings;