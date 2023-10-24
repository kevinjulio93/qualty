import { Button, Pagination, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { Table, TableCell, TableRow } from '../../components/table/table';
import EditIcon from '@mui/icons-material/Edit';
import ClearIcon from '@mui/icons-material/Clear';
import { useEffect, useState } from 'react';
import LoadingComponent from '../../components/loading/loading';
import Search from '../../components/search/search';
import { deleteRatings, getAllRatings } from '../../services/rating.service';


function RatingList() {
    const [ratings, setRatings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [dataLastSearch, setDataLastSearch] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        getRatingsList();
    }, [])

    const getRatingsList = async () => {
      setIsLoading(true);
        try {
          const { result } = await getAllRatings();
          const { data: dataList, totalPages } = result;
          setRatings(dataList);
          setTotalPages(totalPages);
          setIsLoading(false);
        } catch (err) {
          setIsLoading(false);
        }
    }

    const handleClickOpen = (id?: string) => {
        const redirectTo = id ? `${ROUTES.DASHBOARD}/${ROUTES.RATINGS}/${id}` : `${ROUTES.DASHBOARD}/${ROUTES.RATINGS}`
        navigate(redirectTo);
    };

    const deleteFromlist = async (id: string) => {
      try {
        const response = await deleteRatings(id);
        if (response.status === 200) {
            getRatingsList();
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
                Administrar Valoraciones
              </Typography>
              <span className="page-subtitle">
                Aquí puedes gestionar las valoraciones realizadas.
              </span>
            </div>
            <Button className="btn-create" onClick={() => handleClickOpen()}>
              Generar valoración
            </Button>
          </div>
    
          <div className="main-center-container">
            <div className="panel-heading">
              Listado de valoraciones realizadas
              <Search
              label="Buscar beneficiario"
              searchFunction={async (data: string) => {
              try {
                const { result } = await getAllRatings(data);
                setDataLastSearch(data);
                const { data: list } = result;
                setRatings(list);
              } catch (err) {
                console.log(err)
              }
            }}
            voidInputFunction={getRatingsList}
          />
            </div>
            {isLoading ? (
              <LoadingComponent></LoadingComponent>
            ) : (
              <>
                <Table>
                  <TableRow header>
                    <TableCell>Valoración</TableCell>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Beneficiario</TableCell>
                    <TableCell>Autor</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                  {ratings.map((rating: any) => {
                    return (
                      <TableRow key={rating._id}>
                        <TableCell>{rating?.rating_type}</TableCell>
                        <TableCell>{rating?.createdAt}</TableCell>
                        <TableCell>{rating?.attendee?.first_name} {rating?.attendee?.first_last_name}</TableCell>
                        <TableCell>{rating?.author?.name}</TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={2}>
                            <EditIcon
                              onClick={() => handleClickOpen(rating?._id)}
                              className="action-item-icon action-item-icon-edit"
                            ></EditIcon>
    
                            <ClearIcon
                              onClick={() =>
                                deleteFromlist(rating?._id)
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
                      const { result } = await getAllRatings(
                        dataLastSearch,
                        page
                      );
                      const { data: benfs, totalPages } = result;
                      setRatings(benfs);
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

export default RatingList;