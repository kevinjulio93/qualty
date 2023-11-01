import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Pagination, Stack, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { Table, TableCell, TableRow } from '../../components/table/table';
import EditIcon from '@mui/icons-material/Edit';
import ClearIcon from '@mui/icons-material/Clear';
import { useEffect, useState } from 'react';
import LoadingComponent from '../../components/loading/loading';
import Search from '../../components/search/search';
import { deleteRatings, getAllRatings, getFilePdfRatings } from '../../services/rating.service';
import { SimpleDialog } from '../../components/dialog/dialog';
import { typesRating } from '../../constants/ratings';
import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from "dayjs";

function RatingList() {
    const [ratings, setRatings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [dataLastSearch, setDataLastSearch] = useState("");
    const [currentRating, setCurrentRating] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [openDialogMessage, setOpenDialogMessage] = useState(false);
    const navigate = useNavigate();
    const [filterRating,setFilterRating]=useState({startDate:"",endDate:"",valueTypeRating:""});

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

    const deleteFromlist = async (work: string) => {
      setCurrentRating(work);
      setOpenDialog(true);
    };

    const confirmDelete = async () => {
      setIsLoading(true);
      setOpenDialog(false);
      await deleteRatings((currentRating as any)._id);
      setCurrentRating(null);
      getRatingsList();
    };
  
    const cancelDelete = () => {
      setCurrentRating(null);
      setOpenDialog(false);
    };

    const handlerFilterRating=(target:string,value)=>{
      setFilterRating({...filterRating,[target]:value});
    }

    const getFilePdf=async ()=>{
      try {
        const responseFile=await getFilePdfRatings(filterRating);
        const blobPdf=responseFile.result;
        blobPdf.name="Valoraciones-"+filterRating.valueTypeRating+"_"+Date.now()+".pdf";
        const url = window.URL.createObjectURL(blobPdf);
        const a = document.createElement("a");
        a.href = url;
        a.download = blobPdf.name;
        a.style.display = "none";

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        window.URL.revokeObjectURL(url);
      } catch (error) {
        handlerOpenDialogMessage();
      }
    }

    const handlerOpenDialogMessage=()=>{
      setOpenDialogMessage(!openDialogMessage);
    }

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
                console.error(err)
              }
            }}
            voidInputFunction={getRatingsList}
            />
            </div>

            <div className="panel-heading">
              Generar reporte pdf
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker 
                    onChange={(newDate: Dayjs) => handlerFilterRating('startDate', newDate.format())}
                    label="Fecha inicial"
                />
              </LocalizationProvider>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker 
                    onChange={(newDate: Dayjs) => handlerFilterRating('endDate', newDate.format())}
                    label="Fecha final"
                />
              </LocalizationProvider>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={typesRating}
                sx={{ width: 200 }}
                onChange={(e,data)=>handlerFilterRating("valueTypeRating",data)}
                renderInput={(params) => <TextField {...params} label="Tipo de valoracion" />}
              />
              <PictureAsPdfRoundedIcon
                onClick={() =>getFilePdf()}
                className="action-item-icon action-item-icon-edit"
              ></PictureAsPdfRoundedIcon>
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
                                deleteFromlist(rating)
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
                      console.error(err);
                    }
                  }}
                />
              </>
            )}
          </div>
          {openDialog && (
        <SimpleDialog
          title="Eliminar asociacion"
          bodyContent="¿Está seguro que desea eliminar esta asociacion?"
          mainBtnText="Confirmar"
          secondBtnText="Cancelar"
          mainBtnHandler={confirmDelete}
          secondBtnHandler={cancelDelete}
          open={openDialog}
        ></SimpleDialog>
      )}
      <Dialog open={openDialogMessage} >
        <DialogTitle>Mensaje</DialogTitle>
        <DialogContent>
        <DialogContentText>
            No se encontraron registros
        </DialogContentText>
        </DialogContent>
        <DialogActions>
        <Button  onClick={()=>handlerOpenDialogMessage()} color="primary">
            Aceptar
        </Button>
        </DialogActions>
      </Dialog>
        </div>
      );
}

export default RatingList;