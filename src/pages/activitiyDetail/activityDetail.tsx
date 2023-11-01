import { useNavigate, useParams } from 'react-router-dom';
import './activityDetail.scss';
import { useEffect, useState } from 'react';
import { Button, Paper, Stack, TextField, Typography } from '@mui/material';
import { Table, TableCell, TableRow } from '../../components/table/table';
import SelectDropdown from '../../components/select';
import { createActivities, getActivitybyId, getAssociationsByCommunity, getComunaByMunicipie, getDepartments, getMunicipies, updateActivities } from '../../services/activities.service';
import ClearIcon from "@mui/icons-material/Clear";
import { ROUTES } from '../../constants/routes';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from "dayjs";


function ActivityDetail() {
    const { activityId } = useParams();
    const [title, setTitle] = useState('Crear');
    const [activity, setActivity] = useState({});
    const [departmentsList, setDepartmentsList] = useState([]);
    const [municipiesList, setMunicipiesList] = useState([]);
    const [communityList, setCommunityList] = useState([]);
    const [associationsList, setAssociations] = useState([]);
    const [activitiesAssociations, setActivitiesAssociations] = useState<any[]>([]);
    const [selectedAssociations, setSelectedAssociations] = useState<any[]>([]);
    const [selectedDep, setSelectedDep] = useState(null);
    const [selectedMun, setSelectedMun] = useState(null);
    const [selectedCom, setSelectedCom] = useState(null);
    const [selectedAso, setSelectedAso] = useState(null);
    const navigate = useNavigate();

    useEffect( () => {
        if (activityId) {
            setTitle('Editar');
            getCurrentActivity()
        }
        getDepartamentsList();
    }, [])

    const getCurrentActivity = async () => {
        const currentActivity = await getActivitybyId(activityId);
        setActivity(currentActivity.result.data);
        setActivitiesAssociations(currentActivity.result.data.participatingAssociations);
    }

    const formHanlder = (target: string, e: any) => {
        const value = e.target ? e.target.value : e;
        if (target === 'participatingAssociations') {
            const updateSelectedAssciotions = [...selectedAssociations]
            updateSelectedAssciotions.push(value as any);
            setSelectedAssociations([...updateSelectedAssciotions]);
        } else {
            setActivity({ ...activity, [target]: value });
        }
    }

    const getDepartamentsList = async () => {
        try {
            const response = await getDepartments();
            if (response && response.length > 0) {
                setDepartmentsList(response);
            }
        } catch (error) {
            setDepartmentsList([]);

        }
    }

    const getMunicipiesList = async (department: any) => {
        console.log(department);
        try {
            setSelectedDep(department);
            const response = await getMunicipies(department?.id);
            if (response && response.length > 0) {
                setMunicipiesList(response);
                setSelectedMun(null);
                setSelectedCom(null);
                setSelectedAso(null);
            }
        } catch (error) {
            setDepartmentsList([]);

        }
    }

    const getCommunities = async (municipality: any) => {
        try {
            setSelectedMun(municipality);
            const response = await getComunaByMunicipie(municipality?.id);
            if (response.status === 200) {
                setCommunityList(response.result.data);
                setSelectedCom(null);
                setSelectedAso(null);
            }
        } catch (error) {
            setDepartmentsList([]);

        }
    }

    const getAssociations = async (community: any) => {
        try {
            setSelectedCom(community);
            const response = await getAssociationsByCommunity(community?.id);
            if (response.status === 200) {
                setAssociations(response.result.data);
                setSelectedAso(null);
            }
        } catch (error) {
            setDepartmentsList([]);

        }
    }

    const addAssociationToActivity = () => {
        const associationsData = {
            department: selectedDep,
            municipality: selectedMun,
            community: selectedCom,
            association: selectedAso,
        }
        const exist = activitiesAssociations.length ? activitiesAssociations.some(asso => associationsData.association.id === asso.association.id) : false;
        if (exist) return;
        const associacions = [...activitiesAssociations]
        associacions.push(associationsData)
        setActivitiesAssociations(associacions);
    }

    const removeSelectedAssociation = (association: any) => {
        const updateAssociations = activitiesAssociations.filter(asso => association.association.id !== asso.association.id);
        setActivitiesAssociations(updateAssociations);
    }

    const saveActivity = (payload) => {
        const saveWhen = {
            create: async () => await createActivities(payload),
            edit: async () => await updateActivities((activityId as string), payload)
        }

        return activityId ? saveWhen.edit() : saveWhen.create();
    }

    const createActivity = async () => {
        const payload = {
            name: (activity as any)?.name,
            description: (activity as any)?.description,
            execution_date: (activity as any)?.execution_date,
            estimate_attendance: (activity as any)?.estimate_attendance,
            participatingAssociations: activitiesAssociations.map(asso => asso?.association?.id ?? asso._id)
        }

        try {
            const response = await saveActivity(payload);
            console.log('actividad creada', response.result);
            navigate(`${ROUTES.DASHBOARD}/${ROUTES.ACTIVITIES_LIST}`);
            
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
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker 
                                onChange={(newDate: Dayjs) => formHanlder('execution_date', newDate.format())}
                                value={(activity as any)?.execution_date ? dayjs((activity as any)?.execution_date) : null}
                                label="Fecha de realización"
                            />
                        </LocalizationProvider>
                        <TextField
                            className='activities-container__form-section__form-1__field'
                            id="aforo"
                            name='aforo'
                            placeholder='123'
                            type='number'
                            onChange={(e) => formHanlder('estimate_attendance', e)}
                            label="Aforo estimado"
                            value={(activity as any)?.estimate_attendance || ''}
                        />
                    </div>
                    <div className='activities-container__form-section__assitants'>
                        <Typography className='activities-container__form-section__assitants__title' variant="h6">Agregar asociaciones asistentes</Typography>

                        <form className="activities-container__form-section__assitants__form-2">

                            <div className='activities-container__form-section__assitants__form-2__field'>
                                <SelectDropdown
                                    selectValue={selectedDep?.id}
                                    label="Departamento"
                                    options={departmentsList}
                                    keyLabel='name'
                                    keyValue='id'
                                    targetKey='department'
                                    handleValue={(value) => getMunicipiesList(value)}
                                />
                            </div>
                            <div className='activities-container__form-section__assitants__form-2__field'>
                                <SelectDropdown
                                    selectValue={selectedMun?.id}
                                    label="Municipio"
                                    options={municipiesList}
                                    keyLabel='name'
                                    keyValue='id'
                                    targetKey='municipality'
                                    handleValue={(value) => getCommunities(value)}
                                />
                            </div>

                            <div className='activities-container__form-section__assitants__form-2__field'>
                                <SelectDropdown
                                    selectValue={selectedCom?.id}
                                    label="Comuna"
                                    options={communityList}
                                    keyLabel='name'
                                    keyValue='_id'
                                    targetKey='community'
                                    handleValue={(value) => getAssociations(value)}
                                />
                            </div>

                            <div className='activities-container__form-section__assitants__form-2__field'>
                                <SelectDropdown
                                    selectValue={selectedAso?.id}
                                    label="Asociacion"
                                    options={associationsList}
                                    keyLabel='name'
                                    keyValue='_id'
                                    targetKey='association'
                                    handleValue={(value) => setSelectedAso(value)}
                                />
                            </div>

                            <Button className='btn-save' onClick={() => addAssociationToActivity()}>Agregar</Button>
                        </form>

                        <section className="activities-container__form-section__assitants__table">
                            <Table>
                                <TableRow header>
                                    <TableCell>Departamento</TableCell>
                                    <TableCell>Municipio</TableCell>
                                    <TableCell>Comuna</TableCell>
                                    <TableCell>Nombre de Asociación</TableCell>
                                </TableRow>
                                {activitiesAssociations.length > 0 &&
                                    activitiesAssociations.map((asso: any, index) => {
                                        return (
                                            <TableRow key={index}>
                                                <TableCell>{asso?.department?.label ?? asso?.department}</TableCell>
                                                <TableCell>{asso?.municipality?.label ?? asso?.municipality}</TableCell>
                                                <TableCell>{asso?.community?.label ?? asso?.community}</TableCell>
                                                <TableCell>{asso?.association?.label ?? asso?.name}</TableCell>
                                                <TableCell>
                                                    <Stack className="actions-cell" direction="row" spacing={2}>
                                                        <ClearIcon
                                                            className="action-item-icon action-item-icon-delete"
                                                            onClick={() => removeSelectedAssociation(asso)}
                                                        ></ClearIcon>
                                                    </Stack>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                }

                            </Table>
                            {
                                activitiesAssociations.length === 0 &&
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