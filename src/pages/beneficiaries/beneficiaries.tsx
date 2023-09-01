// import { Avatar, Button, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Stack, TextField, Typography } from "@mui/material";
import tony from '../../assets/tony.jpg';
// import firma from '../../assets/firma.jpeg';
// import huella from '../../assets/huella.jpeg';
import { Button, Paper, TextField, Typography } from '@mui/material';
import './beneficiaries.scss';


function Beneficiaries() {
    return (
        <>
            <section className='beneficiaries-container'>
                <header className="beneficiaries-container__actions">
                    <div className="content-page-title">
                        <Typography variant="h5" className="page-header">Administrar beneficiarios</Typography>
                        <span className="page-subtitle">Aqui podras gestionar los usuarios del sistema.</span>
                    </div>
                </header>

                <Paper elevation={1} className="beneficiaries-container__form-section">
                    <div className='beneficiaries-container__form-section__resources'>
                        <div className='beneficiaries-container__form-section__resources__foto'>
                            <div className='beneficiaries-container__form-section__resources__foto__image'>
                                <img src={tony} alt="" />
                            </div>
                            <Button className='btn-image--capture'>Capturar imagen</Button>
                            <Button className='btn-image--delete'>Borrar imagen</Button>
                        </div>
                    </div>
                    <div className='beneficiaries-container__form-section__beneficiarie'>

                        <form className="beneficiaries-container__form-section__beneficiarie__form">
                            <TextField
                                className='beneficiaries-container__form-section__beneficiarie__form__input'
                                id="tipodoc"
                                name='tipodoc'
                                placeholder='C.C'
                                type='text'
                                label="Tipo de documento"
                            //onChange={(e) => formHanlder('name', e)}
                            //value={user.name || ''}
                            />
                            <TextField
                                className='beneficiaries-container__form-section__beneficiarie__form__input'
                                id="noidentificacion"
                                name='noidentificacion'
                                placeholder='1122334455'
                                type='number'
                                label="No Identificacion"
                            //onChange={(e) => formHanlder('name', e)}
                            //value={user.name || ''}
                            />
                            <TextField
                                className='beneficiaries-container__form-section__beneficiarie__form__input'
                                id="primerap"
                                name='primerap'
                                placeholder='Zapata'
                                type='text'
                                label="Primer Apellido"
                            //onChange={(e) => formHanlder('name', e)}
                            //value={user.name || ''}
                            />

                            <TextField
                                className='beneficiaries-container__form-section__beneficiarie__form__input'
                                id="segundoap"
                                name='segundoap'
                                placeholder='Rodriguez'
                                type='text'
                                label="Segundo Apellido"
                            //onChange={(e) => formHanlder('name', e)}
                            //value={user.name || ''}
                            />
                            <TextField
                                className='beneficiaries-container__form-section__beneficiarie__form__input'
                                id="primernom"
                                name='primernom'
                                placeholder='Juanito'
                                type='text'
                                label="Primer Nombre"
                            //onChange={(e) => formHanlder('name', e)}
                            //value={user.name || ''}
                            />
                            <TextField
                                className='beneficiaries-container__form-section__beneficiarie__form__input'
                                id="segundonom"
                                name='segundonom'
                                placeholder='Andres'
                                type='text'
                                label="Segundo Nombre"
                            //onChange={(e) => formHanlder('name', e)}
                            //value={user.name || ''}
                            />

                            <TextField
                                className='beneficiaries-container__form-section__beneficiarie__form__input'
                                id="sexo"
                                name='sexo'
                                placeholder='M'
                                type='text'
                                label="Sexo"
                            //onChange={(e) => formHanlder('name', e)}
                            //value={user.name || ''}
                            />
                            <TextField
                                className='beneficiaries-container__form-section__beneficiarie__form__input'
                                id="fechanacimiento"
                                name='fechanacimiento'
                                placeholder='01-02-2023'
                                type='text'
                                label="Fecha de Nacimiento"
                            //onChange={(e) => formHanlder('name', e)}
                            //value={user.name || ''}
                            />
                            <TextField
                                className='beneficiaries-container__form-section__beneficiarie__form__input'
                                id="tiposangre"
                                name='tiposangre'
                                placeholder='O+'
                                type='text'
                                label="Tipo de Sangre"
                            //onChange={(e) => formHanlder('name', e)}
                            //value={user.name || ''}
                            />

                            <TextField
                                className='beneficiaries-container__form-section__beneficiarie__form__input'
                                id="municipio"
                                name='municipio'
                                placeholder='Ocaña'
                                type='text'
                                label="Municipio"
                            //onChange={(e) => formHanlder('name', e)}
                            //value={user.name || ''}
                            />
                            <TextField
                                className='beneficiaries-container__form-section__beneficiarie__form__input'
                                id="comuna"
                                name='comuna'
                                placeholder='Comuna 13'
                                type='text'
                                label="Comuna"
                            //onChange={(e) => formHanlder('name', e)}
                            //value={user.name || ''}
                            />
                            <TextField
                                className='beneficiaries-container__form-section__beneficiarie__form__input'
                                id="asociacion"
                                name='asociacion'
                                placeholder='Viejitos unidos'
                                type='text'
                                label="Asociación"
                            //onChange={(e) => formHanlder('name', e)}
                            //value={user.name || ''}
                            />

                            <TextField
                                className='beneficiaries-container__form-section__beneficiarie__form__input'
                                id="eps"
                                name='eps'
                                placeholder='Sura'
                                type='text'
                                label="EPS"
                            //onChange={(e) => formHanlder('name', e)}
                            //value={user.name || ''}
                            />
                            <TextField
                                className='beneficiaries-container__form-section__beneficiarie__form__input'
                                id="puntajesisben"
                                name='puntajesisben'
                                placeholder='12'
                                type='text'
                                label="Puntaje SISBEN"
                            //onChange={(e) => formHanlder('name', e)}
                            //value={user.name || ''}
                            />
                        </form>

                    </div>
                </Paper>
            </section>
        </>
    );
}

export default Beneficiaries;
