import { Button, Pagination, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { Table, TableCell, TableRow } from '../../components/table/table';
import EditIcon from '@mui/icons-material/Edit';
import ClearIcon from '@mui/icons-material/Clear';
import { useEffect, useState } from 'react';
import LoadingComponent from '../../components/loading/loading';
import { deleteWorkshop, getAllWorkshops } from '../../services/workshop.service';
import Search from '../../components/search/search';


function WorkshopsList() {
    const [workshops, setWorkshops] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [dataLastSearch, setDataLastSearch] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        getWorkshopsList();
    }, [])

    const getWorkshopsList = async () => {
      setIsLoading(true);
        try {
          const { result } = await getAllWorkshops();
          const { data: dataList, totalPages } = result;
          setWorkshops(dataList);
          setTotalPages(totalPages);
          setIsLoading(false);
        } catch (err) {
          setIsLoading(false);
        }
    }

    const handleClickOpen = (id?: string) => {
        const redirectTo = id ? `${ROUTES.DASHBOARD}/${ROUTES.ASSISTANCE}/${id}` : `${ROUTES.DASHBOARD}/${ROUTES.ASSISTANCE}`
        navigate(redirectTo);
    };

    const deleteFromlist = async (id: string) => {
      try {
        const response = await deleteWorkshop(id);
        if (response.status === 200) {
          getWorkshopsList();
          console.log("deleted successfully");
        }
      } catch (error) {
        throw new Error("the beneficieary doesn't exist");
      }
    };

    return (
        <div className="users-container">
          <div className="users-container__actions">
            <div className="content-page-title">
              <Typography variant="h5" className="page-header">
                Administrar Talleres
              </Typography>
              <span className="page-subtitle">
                Aqui podras gestionar los talleres realizados.
              </span>
            </div>
            <Button className="btn-create" onClick={() => handleClickOpen()}>
              Generar asistencia
            </Button>
          </div>
    
          <div className="main-center-container">
            <div className="panel-heading">
              Listado de talleres realizados
              <Search
              label="Buscar beneficiario"
              searchFunction={async (data: string) => {
              try {
                const { result } = await getAllWorkshops(data);
                setDataLastSearch(data);
                const { data: works } = result;
                setWorkshops(works);
              } catch (err) {
                console.log(err)
              }
            }}
            voidInputFunction={getWorkshopsList}
          />
            </div>
            {isLoading ? (
              <LoadingComponent></LoadingComponent>
            ) : (
              <>
                <Table>
                  <TableRow header>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Actividad</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                  {workshops.map((workshop: any) => {
                    return (
                      <TableRow key={workshop._id}>
                        <TableCell>{workshop?.name}</TableCell>
                        <TableCell>{workshop?.execution_date}</TableCell>
                        <TableCell>{workshop?.activity?.name}</TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={2}>
                            <EditIcon
                              onClick={() => handleClickOpen(workshop?._id)}
                              className="action-item-icon action-item-icon-edit"
                            ></EditIcon>
    
                            <ClearIcon
                              onClick={() =>
                                deleteFromlist(workshop?._id)
                              }
                              className="action-item-icon action-item-icon-delete"
                            ></ClearIcon>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </Table>
                <Pagination
                  count={totalPages}
                  onChange={async (_, page) => {
                    try {
                      const { result } = await getAllWorkshops(
                        dataLastSearch,
                        page
                      );
                      const { data: benfs, totalPages } = result;
                      setWorkshops(benfs);
                      setTotalPages(totalPages);
                    } catch (err) {
                      console.log(err);
                    }
                  }}
                />
              </>
            )}
          </div>
        </div>
      );
}

export default WorkshopsList;