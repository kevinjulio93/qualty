import { Box, Button, FormControl, FormControlLabel, FormGroup, FormLabel, Paper, Switch, TextField, Typography } from "@mui/material";
import { arrayPermissions, arraySections } from "../../constants/resources";
import "./permissions.scss";
import { useState } from "react";




function Permissions() {
    const [role, setRole] = useState({});

    const createRol = () => {
        console.log("yaaaaa");
    }

    const formHanlder = (target: string, e: any) => {
        const value = e.target.value;
        setRole({ ...role, [target]: value });
        
    }

    return (
        <>
            <section className='roles-container'>
                <header className="roles-container__actions">
                    <div className="content-page-title">
                        <Typography variant="h5" className="page-header">Crear nuevos roles</Typography>
                        <span className="page-subtitle">Aqui podras gestionar los permisos para los roles de usuarios.</span>
                    </div>
                </header>

                <Paper elevation={1} className="roles-container__form-section">
                    <div className='roles-container__form-section__resources'>
                        <div className="roles-container__form-section__role__form__field">
                            <TextField
                                id="role"
                                className="roles-container__form-section__role__form__field__input"
                                name='role'
                                placeholder='Role'
                                type='text'
                                label="Nombre del role"
                                onChange={(e) => formHanlder('role', e)}
                            />
                    </div>
                    </div>
                    <div className='roles-container__form-section__role'>
                        <Box sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: 224 }}>
                            <FormControl component="fieldset">
                                {arraySections.map((section) => {
                                    return (
                                        <>
                                        <FormLabel component="legend">{section.value}</FormLabel>
                                        <FormGroup aria-label="position" row>
                                            {arrayPermissions.map((permission) => {
                                                return (
                                                    <FormControlLabel
                                                        value={permission.key}
                                                        control={<Switch color="primary" />}
                                                        label={permission.value}
                                                        labelPlacement="start"
                                                    />
                                                );
                                            })}
                                        </FormGroup>
                                        </>
                                    );
                                })}
                            </FormControl>
                        </Box>
                        <Button className='btn-save-role' onClick={() => createRol()}>Crear Role</Button>
                    </div>
                </Paper>
            </section>
        </>
    );
}

export default Permissions;