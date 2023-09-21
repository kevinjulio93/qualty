import { useParams } from 'react-router-dom';
import './activityDetail.scss';
import { useEffect, useState } from 'react';
import { Button, Paper, Stack, TextField, Typography } from '@mui/material';
import { Table, TableCell, TableRow } from '../../components/table/table';
import SelectDropdown from '../../components/select';
import { createActivities, getAssociationsByCommunity, getComunaByMunicipie, getDepartments, getMunicipies } from '../../services/activities.service';
import ClearIcon from "@mui/icons-material/Clear";


function ActivityDetail() {
    const { activityId } = useParams();
    const [title, setTitle] = useState('Crear');
    const [activity, setActivity] = useState({});
    const [departments, setDepartments] = useState([]);
    const [municipies, setMunicipies] = useState([]);
    const [asociaciones, setAsociaciones] = useState([]);
    const [community, setCommunity] = useState([]);
    const [associations, setAssociations] = useState([]);

    useEffect(() => {
        if (activityId) setTitle('Editar');
        getDepartamentsList()
    }, [])

    const formHanlder = (target: string, e: any) => {
        const value = e.target.value;
        setActivity({ ...activity, [target]: value });

        if (target === 'department') {
            getMunicipiesList(value);
            ((activity as any).municipality) && formHanlder('municipality', '')
        }

        if (target === 'municipality') {
            getCommunities(value);
            ((activity as any).municipality) && formHanlder('community', '')
        }

        if (target === 'community') {
            getAssociations(value);
        }
    }

    const getDepartamentsList = async () => {
        try {
            const response = await getDepartments();
            if (response && response.length > 0) {
                setDepartments(response)
            }
        } catch (error) {
            setDepartments([]);

        }
    }

    const getMunicipiesList = async (departmentId: string) => {
        try {
            const response = await getMunicipies(departmentId);
            if (response && response.length > 0) {
                setMunicipies(response)
            }
        } catch (error) {
            setDepartments([]);

        }
    }

    const getCommunities = async (municipalityId: string) => {
        try {
            const response = await getComunaByMunicipie(municipalityId);
            if (response.status === 200) {
                setCommunity(response.result.data)
                console.log('community',community);
                
            }
        } catch (error) {
            setDepartments([]);

        }
    }

    const getAssociations = async (communityId: string) => {
        try {
            const response = await getAssociationsByCommunity(communityId);
            if (response.status === 200) {
                setAssociations(response.result.data)
                console.log('community',community);
                
            }
        } catch (error) {
            setDepartments([]);

        }
    }



    const createActivity = async () => {
        try {
            //const response = await createActivities(activity);
            console.log('actividad creada', activity);
        } catch (error) {
            console.log('no se creó la asociacion');
        }
    }

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
                    <div className='activities-container__form-section__form-1'>
                        <TextField
                            className='activities-container__form-section__form-1__field'
                            id="actiivtyName"
                            name='actiivtyName'
                            placeholder='Nombre de la actividad'
                            type='text'
                            onChange={(e) => formHanlder('name', e)}
                            label="Nombre de la Actividad"
                            value={(activity as any)?.name || ''}
                        />
                        <TextField
                            className='activities-container__form-section__form-1__field'
                            id="description"
                            name='description'
                            placeholder='Esta es una activida'
                            type='text'
                            onChange={(e) => formHanlder('description', e)}
                            label="Descripción"
                            value={(activity as any)?.description || ''}
                        />
                        <TextField
                            className='activities-container__form-section__form-1__field'
                            id="date"
                            name='date'
                            placeholder='02-12-2023'
                            type='text'
                            onChange={(e) => formHanlder('execution_date', e)}
                            label="Fecha de realización"
                            value={(activity as any)?.execution_date || ''}
                        />
                        <TextField
                            className='activities-container__form-section__form-1__field'
                            id="aforo"
                            name='aforo'
                            placeholder='123'
                            type='number'
                            onChange={(e) => formHanlder('estimate_attendance', e)}
                            label="Aforo estimado"
                            value={(activity as any)?.aforo || ''}
                        />
                    </div>
                    <div className='activities-container__form-section__assitants'>
                        <Typography className='activities-container__form-section__assitants__title' variant="h6">Agregar asociaciones asistentes</Typography>

                        <form className="activities-container__form-section__assitants__form-2">

                            <div className='activities-container__form-section__assitants__form-2__field'>
                                <SelectDropdown
                                    selectValue={(activity as any)?.department}
                                    label="Departamento"
                                    options={departments}
                                    keyLabel='name'
                                    keyValue='id'
                                    targetKey='department'
                                    handleValue={formHanlder}
                                />
                            </div>
                            <div className='activities-container__form-section__assitants__form-2__field'>
                                <SelectDropdown
                                    selectValue={(activity as any)?.municipality}
                                    label="Municipio"
                                    options={municipies}
                                    keyLabel='name'
                                    keyValue='id'
                                    targetKey='municipality'
                                    handleValue={formHanlder}
                                />
                            </div>

                            <div className='activities-container__form-section__assitants__form-2__field'>
                                <SelectDropdown
                                    selectValue={(activity as any)?.community}
                                    label="Comuna"
                                    options={community}
                                    keyLabel='name'
                                    keyValue='_id'
                                    targetKey='community'
                                    handleValue={formHanlder}
                                />
                            </div>

                            <div className='activities-container__form-section__assitants__form-2__field'>
                                <SelectDropdown
                                    selectValue={(activity as any)?.participatingAssociations}
                                    label="Asociacion"
                                    options={associations}
                                    keyLabel='name'
                                    keyValue='_id'
                                    targetKey='participatingAssociations'
                                    handleValue={formHanlder}
                                />
                            </div>

                            <Button className='btn-save'>Agregar</Button>
                        </form>

                        <section className="activities-container__form-section__assitants__table">
                            <Table>
                                <TableRow header>
                                    <TableCell>Departamento</TableCell>
                                    <TableCell>Municipio</TableCell>
                                    <TableCell>Comuna</TableCell>
                                    <TableCell>Nombre de Asociación</TableCell>
                                </TableRow>
                                {asociaciones.length > 0 &&
                                    asociaciones.map((user: any, index) => {
                                        return (
                                            <TableRow key={index}>
                                                <TableCell>{user.name}</TableCell>
                                                <TableCell>{user.email}</TableCell>
                                                <TableCell>{user.role.role}</TableCell>
                                                <TableCell>
                                                    <Stack className="actions-cell" direction="row" spacing={2}>
                                                        <ClearIcon
                                                            className="action-item-icon action-item-icon-delete"
                                                        // onClick={() => handleDeleteAction(user)}
                                                        ></ClearIcon>
                                                    </Stack>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                }

                            </Table>
                            {
                                asociaciones.length === 0 &&
                                <div className='activities-container__form-section__assitants__table__empty'>
                                    <span>No hay asociaciones agregadas a esta actividad</span>
                                </div>
                            }

                            <Button onClick={createActivity} className='btn-save-activity' >Guardar actividad</Button>
                        </section>
                    </div>
                </Paper>
            </section>
        </>
    );
}

export default ActivityDetail