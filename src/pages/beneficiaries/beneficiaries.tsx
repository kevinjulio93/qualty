// import { Avatar, Button, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Stack, TextField, Typography } from "@mui/material";
import tony from '../../assets/tony.jpg';
// import firma from '../../assets/firma.jpeg';
// import huella from '../../assets/huella.jpeg';
import { Button, Paper, Typography } from '@mui/material';
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
                    <div className='beneficiaries-container__form-section__form'>

                    </div>
                </Paper>
            </section>
        </>
    );
}

export default Beneficiaries;
