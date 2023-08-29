import { Button, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { Table, TableCell, TableRow } from '../../components/table/table';
import EditIcon from '@mui/icons-material/Edit';
import ClearIcon from '@mui/icons-material/Clear';
import { useEffect, useState } from 'react';
import { getBeneficiariesList } from '../../services/beneficiaries.service';
import LoadingComponent from '../../components/loading/loading';


function BeneficiariesList() {
  const [benfs, setBenfs] = useState([]);  
  const navigate = useNavigate();

  useEffect(() => {
    getBenfs();
  }, [])

  const getBenfs = async () => {
    const response = await getBeneficiariesList();
    const dataList = response.result.data;
    setBenfs(dataList);
  }

  const handleClickOpen = () => {
    navigate(ROUTES.DASHBOARD + '/' + ROUTES.BENEFICIARIES);
  };

  return (
    benfs.length > 0 ? <div className='users-container'>
      <div className='users-container__actions'>
        <Typography variant="h5">Listado de beneficiarios</Typography>
        <Button variant="outlined" onClick={handleClickOpen}>
            Crear Beneficiario
        </Button>
      </div>
      <Table>
        <TableRow header>
          <TableCell>Nombre</TableCell>
          <TableCell>Cedula</TableCell>
          <TableCell>Asociación</TableCell>
          <TableCell>EPS</TableCell>
          <TableCell>Acciones</TableCell>
        </TableRow>
        {benfs.map((beneficiary: any) => {
          return (
            <TableRow>
              <TableCell>{beneficiary.full_name}</TableCell>
              <TableCell>{beneficiary.identification}</TableCell>
              <TableCell>{beneficiary.neighborhood}</TableCell>
              <TableCell>{beneficiary.eps}</TableCell>
              <TableCell>
                <Stack  direction="row" spacing={2}> 
                  <EditIcon></EditIcon>
                  <ClearIcon></ClearIcon>
                </Stack>
              </TableCell>
            </TableRow>
          );
        })}
      </Table>
    </div> 
    : <LoadingComponent></LoadingComponent>
  );
}

export default BeneficiariesList;