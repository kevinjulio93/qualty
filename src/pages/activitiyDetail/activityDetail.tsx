import { useParams } from 'react-router-dom';
import './activityDetail.scss';
import { useEffect, useState } from 'react';
import { Paper, Typography } from '@mui/material';


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
                        <Typography variant="h5" className="page-header">{title} Taller</Typography>
                        <span className="page-subtitle">Aqui podras gestionar los usuarios del sistema.</span>
                    </div>
                </header>

                <Paper elevation={1} className="activities-container__form-section">
                    <div className='activities-container__form-section__resources'>
                    </div>
                    <div className='activities-container__form-section__beneficiarie'>

                    </div>
                </Paper>
            </section>
        </>
    );
}

export default ActivityDetail