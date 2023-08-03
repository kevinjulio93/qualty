import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';

const rows: GridRowsProp = [
  { id: 1, col1: 'Andres Bobadilla', col2: 'Sura EPS' },
  { id: 2, col1: 'Kevin Julio', col2: 'Comeva EPS' },
  { id: 3, col1: 'Keiner Pajaro', col2: 'Salud Total' },
  { id: 4, col1: 'Hernando Ariza', col2: 'Sura EPS' },
];

const columns: GridColDef[] = [
  { field: 'col1', headerName: 'Nombre', width: 150 },
  { field: 'col2', headerName: 'EPS', width: 150 },
];

function Users() {
  return (
    <div style={{padding: '10px', height: '100%', width: '100%', boxSizing: 'border-box' }}>
      <DataGrid rows={rows} columns={columns} />
    </div>
  );
}

export default Users;