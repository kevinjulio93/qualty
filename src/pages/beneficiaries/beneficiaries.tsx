import { Avatar, Button, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Stack, TextField, Typography } from "@mui/material";
import tony from '../../assets/tony.jpg';
import firma from '../../assets/firma.jpeg';
import huella from '../../assets/huella.jpeg';
import './beneficiaries.scss';


function Beneficiaries() {
  return (
    <>
      <Paper elevation={2} sx={{ width: "100%", height: "100%" }}>
        <div className="beneficiaries-info-container">
            <Grid container spacing={2}>
                <Grid item xs={4}>
                    <div className="grid-item">
                        <div className="grid-item__content">
                            <Avatar className="profile-img" alt="Remy Sharp" src={tony} />
                            <Stack className="btn-actions" direction="row" spacing={2}>
                                <Button variant="outlined" color="success">
                                    Capturar
                                </Button>
                                <Button variant="outlined" color="warning">
                                    Eliminar
                                </Button>
                            </Stack>
                        </div>
                    </div>
                </Grid>
                <Grid item xs={8}>
                    <div className="grid-item">
                        <div className="grid-item__content">
                            <Typography variant="h4">Datos básicos</Typography>
                            <Stack direction="row" spacing={2}>
                                <TextField className="beneficiaries-info-container__detail__item" id="standard-basic" label="Nombres" variant="standard" />
                                <TextField className="beneficiaries-info-container__detail__item" id="standard-basic" label="Apellidos" variant="standard" />
                                <FormControl variant="standard" sx={{width: 150}}>
                                    <InputLabel id="demo-simple-select-label">Tipo de documento</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        label="Tipo de documento"
                                    >
                                        <MenuItem value={10}>Cédula de ciudadania</MenuItem>
                                        <MenuItem value={20}>Cédula de extranjería</MenuItem>
                                        <MenuItem value={30}>Pasaporte</MenuItem>
                                    </Select>
                                </FormControl>
                                <TextField className="beneficiaries-info-container__detail__item" id="standard-basic" label="Documento" variant="standard" />
                            </Stack>
                            <Stack className="grid-item__content__item" direction="row" spacing={2}>
                                <FormControl sx={{width: 200}} variant="standard">
                                    <InputLabel id="demo-simple-select-label">Municipio</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        label="Tipo de documento"
                                    >
                                        <MenuItem value={10}>Cucuta</MenuItem>
                                        <MenuItem value={20}>Ocaña</MenuItem>
                                        <MenuItem value={30}>Pamplona</MenuItem>
                                        <MenuItem value={30}>Ragonvalia</MenuItem>
                                        <MenuItem value={30}>Herran</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl sx={{width: 200}} variant="standard">
                                    <InputLabel id="demo-simple-select-label">Comuna</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        label="Tipo de documento"
                                    >
                                        <MenuItem value={10}>Comuna 1</MenuItem>
                                        <MenuItem value={20}>Comuna 2</MenuItem>
                                        <MenuItem value={30}>Comuna 3</MenuItem>
                                        <MenuItem value={30}>Comuna 4</MenuItem>
                                        <MenuItem value={30}>Comuna 5</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl sx={{width: 200}} variant="standard">
                                    <InputLabel id="demo-simple-select-label">Asociación</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        label="Tipo de documento"
                                    >
                                        <MenuItem value={10}>Viejitos felices</MenuItem>
                                        <MenuItem value={20}>Viejitos parolos</MenuItem>
                                        <MenuItem value={30}>Huevos muertos</MenuItem>
                                        <MenuItem value={30}>Los cuchos</MenuItem>
                                        <MenuItem value={30}>Los culieteticos</MenuItem>
                                    </Select>
                                </FormControl>
                            </Stack>
                            <Stack className="grid-item__content__item" direction="row" spacing={2}>
                                <FormControl sx={{width: 200}} variant="standard">
                                    <InputLabel id="demo-simple-select-label">EPS</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        label="Tipo de documento"
                                    >
                                        <MenuItem value={10}>SURA</MenuItem>
                                        <MenuItem value={20}>Salud Total</MenuItem>
                                        <MenuItem value={30}>Coomeva</MenuItem>
                                        <MenuItem value={30}>Coosalud</MenuItem>
                                        <MenuItem value={30}>Mutual Ser</MenuItem>
                                    </Select>
                                </FormControl>
                                <TextField className="beneficiaries-info-container__detail__item" id="standard-basic" label="Puntaje SISBEN" variant="standard" />
                            </Stack>
                        </div>
                    </div>
                </Grid>
                <Grid item xs={6}>
                    <div className="grid-item">
                        <div className="grid-item__content">
                            <Typography variant="h4">Información complementaria</Typography>
                            <Stack direction="row" spacing={2}>
                                <TextField className="beneficiaries-info-container__detail__item" id="standard-basic" label="Dirección" variant="standard" />
                                <TextField className="beneficiaries-info-container__detail__item" id="standard-basic" label="Telefono" variant="standard" />
                                <TextField className="beneficiaries-info-container__detail__item" id="standard-basic" label="Documento" variant="standard" />
                            </Stack>
                            <Stack className="grid-item__content__item" direction="row" spacing={2}>
                                <TextField className="beneficiaries-info-container__detail__item" id="standard-basic" label="Dirección" variant="standard" />
                                <TextField className="beneficiaries-info-container__detail__item" id="standard-basic" label="Telefono" variant="standard" />
                                <TextField className="beneficiaries-info-container__detail__item" id="standard-basic" label="Documento" variant="standard" />
                            </Stack>
                            <Stack className="grid-item__content__item" direction="row" spacing={2}>
                                <TextField className="beneficiaries-info-container__detail__item" id="standard-basic" label="Dirección" variant="standard" />
                                <TextField className="beneficiaries-info-container__detail__item" id="standard-basic" label="Telefono" variant="standard" />
                                <TextField className="beneficiaries-info-container__detail__item" id="standard-basic" label="Documento" variant="standard" />
                            </Stack>
                        </div>
                    </div>
                </Grid>
                <Grid item xs={6}>
                    <div className="grid-item">
                        <div className="grid-item__content">
                            <Typography variant="h4">Soportes</Typography>
                            <Stack direction="row" spacing={3}>
                                <img
                                    className="firma-img"
                                    src={firma}
                                    alt="firma_digital"
                                />
                                <img
                                    className="huella-img"
                                    src={huella}
                                    alt="firma_digital"
                                />
                            </Stack>
                        </div>
                    </div>
                </Grid>
            </Grid>
        </div>
      </Paper>
    </>
  );
}

export default Beneficiaries;
