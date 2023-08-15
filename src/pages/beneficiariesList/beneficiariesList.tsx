import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';
import { Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

const columns: GridColDef[] = [
    { field: 'nombre', headerName: 'Nombre', width: 300 },
    { field: 'cedula', headerName: 'Cedula', width: 300 },
    { field: 'association', headerName: 'Asociación', width: 300 },
    { field: 'eps', headerName: 'EPS', width: 300 },
    {field: 'actions', headerName: 'Acciones', width: 300}
];

const rows: GridRowsProp = [
    {
        id: 1,
        nombre: "Kevin Julio",
        cedula: "156645454",
        association: "los chiquiluki",
        eps: "SURA",
        actions: "Editar - Eliminar"
    },
    {
        id: 2,
        nombre: "Andres Bobadilla",
        cedula: "165455677",
        association: "cachones alegres",
        eps: "Salud Total",
        actions: "Editar - Eliminar"
    },
    {
        id: 3,
        nombre: "Hernando Ariza",
        cedula: "1005434345",
        association: "Los huevo muedto",
        eps: "SURA",
        actions: "Editar - Eliminar"
    },
];

function BeneficiariesList() {
  const navigate = useNavigate();

  const handleClickOpen = () => {

    navigate(ROUTES.DASHBOARD + '/' + ROUTES.BENEFICIARIES);
  };

  return (
    rows && <div className='users-container'>
      <div className='users-container__actions'>
        <Typography variant="h5">Listado de beneficiarios</Typography>
        <Button variant="outlined" onClick={handleClickOpen}>
            Crear Beneficiario
        </Button>
      </div>
      <DataGrid rows={rows} columns={columns} />
    </div>
  );
}

export default BeneficiariesList;