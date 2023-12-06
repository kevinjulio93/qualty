import { Autocomplete, Button, Stack, TextField, Typography } from '@mui/material';
import { Table, TableCell, TableRow } from '../../components/table/table';
import { useEffect, useState } from 'react';
import LoadingComponent from '../../components/loading/loading';
import { getAllEvents, getEventById } from '../../services/events.service';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import userImage from '../../assets/user.png'
import { getPdfDeliveryBeneficiarie } from '../../services/delivery.service';


function ListEventAssistance() {
    const [isLoading, setIsLoading] = useState(true);
    const [valuesAutocomplete,setValuesAutocomplete] = useState([{label:"",value:null}]);
    const [eventSelected, setEventSelected] = useState(null);
    const [beneficiaries, setBeneficiaries] = useState([]);

    useEffect(() => {
        getEvents();
    }, []);

    useEffect(() => {
        if (eventSelected) {
            getEventInfo();
        }
    }, [eventSelected]);

    const getEventInfo = async() => {
      try {
        setIsLoading(true);
        const response  = await getEventById(eventSelected);
        setBeneficiaries(response?.result?.data?.attendees);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    }

    const getValuesAutocomplete = (data: []) => {
      const list = [];
      data.map((itemData:any) => {
        list.push({label:itemData.name,value:itemData._id});
      });
      setValuesAutocomplete(list);
    }
       
    const getEvents = async() => {
      try {
        const responseEvents = await getAllEvents(null, 1, 1000);
        const events = responseEvents.result.data.data;
        getValuesAutocomplete(events);
      } catch (error) {
        console.error(error);
      }
    }

    const generateEventActPDF = async(beneficiarie) => {
      await getPdfDeliveryBeneficiarie(eventSelected, beneficiarie);
    }

    const handlerAutocomplete = (data) => {
      if(data) {
        setEventSelected(data.value);
      } else {
        setEventSelected(null);
      }
    }

    const refressInfo = async () => {
      await getEventInfo();
    }

    return (
        <div className="users-container">
          <div className="users-container__actions">
            <div className="content-page-title">
              <Typography variant="h5" className="page-header">
                Listado de asistencia a evento
              </Typography>
              <span className="page-subtitle">
                Aquí podrás visualizar el listado de asistencia a evento
              </span>
            </div>
          </div>
    
          <div className="main-center-container">
          <Stack direction="row" spacing={2} >
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={valuesAutocomplete}
            sx={{ width: 300 }}
            onChange={(_,data)=>handlerAutocomplete(data)}
            renderInput={(params) => <TextField {...params} label="Evento" />}
          />
          <Button className="btn-create" onClick={()=>refressInfo()}>
          Refrescar información
          </Button>
          </Stack>
            <br></br>
            <br></br>
            {
              eventSelected !== null ? 
                <>
                <div className="panel-heading">
                  Listado de beneficiarios
                </div>
                  {isLoading ? (
              <LoadingComponent></LoadingComponent>
            ) : (
              <>
                <Table>
                  <TableRow header>
                    <TableCell>#</TableCell>
                    <TableCell>FOTO</TableCell>
                    <TableCell>NOMBRE</TableCell>
                    <TableCell>CEDULA</TableCell>
                    <TableCell>ASOCIACIÓN</TableCell>
                    <TableCell>ACCIONES</TableCell>
                  </TableRow>
                  {beneficiaries.map((ben: any, index: number) => {
                    return (
                      <TableRow key={ben._id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                        <img
                        className="ben-foto"
                        src={ben.photo_url?ben.photo_url:userImage}
                        alt="foto"
                          />
                        </TableCell>
                        <TableCell>
                        {ben?.first_name} {ben.second_name}{" "}
                        {ben?.first_last_name}{" "}
                        {ben?.second_last_name}
                        </TableCell>
                        <TableCell>{ben?.identification}</TableCell>
                      <TableCell>{ben?.association?.name}</TableCell>
                        <TableCell>
                            <PictureAsPdfIcon 
                                className="action-item-icon action-item-icon-edit"
                                onClick={() => generateEventActPDF(ben)}
                            />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </Table>
              </>
            )}
                </>
              :""
            }
          </div>
        </div>
      );
}

export default ListEventAssistance;