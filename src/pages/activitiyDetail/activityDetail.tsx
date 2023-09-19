import { useParams } from 'react-router-dom';
import './activityDetail.scss';
import { useEffect, useState } from 'react';
import { Paper, TextField, Typography } from '@mui/material';


function ActivityDetail() {
    const { activityId } = useParams();
    const [title, setTitle] = useState('Crear');

    useEffect(() => {
        if (activityId) setTitle('Editar')
    }, [])

    return (
        <>
            <section className='activities-container'>
                <header className="activities-container__actions">
                    <div className="content-page-title">
                        <Typography variant="h5" className="page-header">{title} Actividad</Typography>
                        <span className="page-subtitle">Aqui podras gestionar los usuarios del sistema.</span>
                    </div>
                </header>

                <Paper elevation={1} className="activities-container__form-section">
                    <div className='activities-container__form-section__resources'>
                        <div className="beneficiaries-container__form-section__beneficiarie__form__field">
                            <TextField
                                id="actiivtyName"
                                className="beneficiaries-container__form-section__beneficiarie__form__field__input"
                                name='actiivtyName'
                                placeholder='Nombre de la actividad'
                                type='text'
                                // onChange={(e) => formHanlder('identification', e)}
                                label="Nombre de la Actividad"
                            // value={(beneficiarie as any)?.identification || ''}
                            />
                        </div>
                        <div className="beneficiaries-container__form-section__beneficiarie__form__field">
                            <TextField
                                id="description"
                                className="beneficiaries-container__form-section__beneficiarie__form__field__input"
                                name='description'
                                placeholder='Esta es una activida'
                                type='text'
                                //onChange={(e) => formHanlder('identification', e)}
                                label="Descripción"
                            //value={(beneficiarie as any)?.identification || ''}
                            />
                        </div>
                        <div className="beneficiaries-container__form-section__beneficiarie__form__field">
                            <TextField
                                id="date"
                                className="beneficiaries-container__form-section__beneficiarie__form__field__input"
                                name='date'
                                placeholder='02-12-2023'
                                type='text'
                                //onChange={(e) => formHanlder('identification', e)}
                                label="Fecha de realización"
                            //value={(beneficiarie as any)?.identification || ''}
                            />
                        </div>
                        <div className="beneficiaries-container__form-section__beneficiarie__form__field">
                            <TextField
                                id="aforo"
                                className="beneficiaries-container__form-section__beneficiarie__form__field__input"
                                name='aforo'
                                placeholder='112233445'
                                type='number'
                                //onChange={(e) => formHanlder('identification', e)}
                                label="Aforo estimado"
                            //value={(beneficiarie as any)?.identification || ''}
                            />
                        </div>
                    </div>
                    <div className='activities-container__form-section__assitants'>
                        <Typography className='activities-container__form-section__assitants__title' variant="h6">Agregar asociaciones asistentes</Typography>
                        <div className='activities-container__form-section__assitants__form'>
                            <div className="activities-container__form-section__assitants__form__field">
                                <TextField
                                    id="actiivtyName"
                                    className="activities-container__form-section__beneficiarie__form__field__input"
                                    name='actiivtyName'
                                    placeholder='Nombre de la actividad'
                                    type='text'
                                    // onChange={(e) => formHanlder('identification', e)}
                                    label="Nombre de la Actividad"
                                // value={(beneficiarie as any)?.identification || ''}
                                />
                            </div>
                            <div className="activities-container__form-section__assitants__form__field">
                                <TextField
                                    id="description"
                                    className="activities-container__form-section__beneficiarie__form__field__input"
                                    name='description'
                                    placeholder='Esta es una activida'
                                    type='text'
                                    //onChange={(e) => formHanlder('identification', e)}
                                    label="Descripción"
                                //value={(beneficiarie as any)?.identification || ''}
                                />
                            </div>
                            <div className="activities-container__form-section__assitants__form__field">
                                <TextField
                                    id="date"
                                    className="activities-container__form-section__beneficiarie__form__field__input"
                                    name='date'
                                    placeholder='02-12-2023'
                                    type='text'
                                    //onChange={(e) => formHanlder('identification', e)}
                                    label="Fecha de realización"
                                //value={(beneficiarie as any)?.identification || ''}
                                />
                            </div>
                            <div className="activities-container__form-section__assitants__form__field">
                                <TextField
                                    id="aforo"
                                    className="activities-container__form-section__beneficiarie__form__field__input"
                                    name='aforo'
                                    placeholder='112233445'
                                    type='number'
                                    //onChange={(e) => formHanlder('identification', e)}
                                    label="Aforo estimado"
                                //value={(beneficiarie as any)?.identification || ''}
                                />
                            </div>
                        </div>
                    </div>
                </Paper>
            </section>
        </>
    );
}

export default ActivityDetail