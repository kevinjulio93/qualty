import { Button, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import "./activities.scss";
import { ROUTES } from '../../constants/routes';
import { Table, TableCell, TableRow } from '../../components/table/table';
import EditIcon from '@mui/icons-material/Edit';
import ClearIcon from '@mui/icons-material/Clear';
import { useEffect, useState } from 'react';
import LoadingComponent from '../../components/loading/loading';
import { getAllActivities } from '../../services/activities.service';


function ActivityList() {
  const [actitivies, setActivities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getActivitiesList();
  }, [])

  const getActivitiesList = async () => {
    try {
      const response = await getAllActivities();
      if (response.status === 200) {
        const dataList = response.result.data;
        setActivities(dataList);
      } else {
        setActivities([]);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleClickOpen = (id?: string) => {
    const redirectTo = id ? `${ROUTES.DASHBOARD}/${ROUTES.ACTIVITIES}/${id}` : `${ROUTES.DASHBOARD}/${ROUTES.ACTIVITIES}`
    navigate(redirectTo);
  };


  return (
    actitivies.length > 0 ?
      <div className='users-container'>
        <div className="users-container__actions">
          <div className="content-page-title">
            <Typography variant="h5" className="page-header">Administrar Actividades</Typography>
            <span className="page-subtitle">Aqui podras gestionar los actividades del sistema.</span>
          </div>
        </div>

        <div className="main-center-container">
          <div className="panel-heading"> Listado de Actividades
            <Button className="btn-create" onClick={() => handleClickOpen()}>
              Crear Actividad
            </Button>
          </div>
          <Table>
            <TableRow header>
              <TableCell>Nombre</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
            {actitivies.map((activity: any) => {
              return (
                <TableRow key={activity._id}>
                  <TableCell>{activity?.name}</TableCell>
                  <TableCell>{activity?.description}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={2}>
                      <EditIcon
                        onClick={() => handleClickOpen(activity?._id)}
                        className="action-item-icon action-item-icon-edit">
                      </EditIcon>

                      <ClearIcon
                        onClick={() => console.log('borrar')}
                        className="action-item-icon action-item-icon-delete">
                      </ClearIcon>
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })}
          </Table>
        </div>
      </div>

      : <LoadingComponent></LoadingComponent>

  );
}

export default ActivityList;