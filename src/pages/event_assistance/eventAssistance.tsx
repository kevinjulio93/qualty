import { Autocomplete, Button, DialogContentText, Divider, Pagination, Stack, TextField, Typography } from '@mui/material';
import { Table, TableCell, TableRow } from '../../components/table/table';
import { useEffect, useState } from 'react';
import LoadingComponent from '../../components/loading/loading';
import Search from '../../components/search/search';
import { getBeneficiariesList } from '../../services/beneficiaries.service';
import { getAllEvents ,removeAssitance,updateEvent} from '../../services/events.service';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DoneIcon from '@mui/icons-material/Done';
import WarningIcon from '@mui/icons-material/Warning';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import userImage from '../../assets/user.png'
import ClearIcon from "@mui/icons-material/Clear";
import { regimeList } from '../../constants/regimeList';
import { getPdfDeliveryBeneficiarie } from '../../services/delivery.service';
import { useSelector } from 'react-redux';
import { checkPermissions } from '../../helpers/checkPermissions';
import { SECTIONS } from '../../constants/sections';
import { PERMISSIONS } from '../../constants/permissions';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
      padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
      padding: theme.spacing(1),
  },
}));

function EventAssistance() {
    const [beneficiaries, setBeneficiaries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [dataLastSearch, setDataLastSearch] = useState("");
    const [valuesAutocomplete,setValuesAutocomplete]=useState([{label:"",value:null}]);
    const [eventSelected,setEventSelected]=useState(null);
    const [events,setEvents]=useState([]);
    const [openModal,setOpenModal]=useState(false);
    const [benSelected,setBenSelected]=useState(null);
    const [enableButtonAdd,setEnableButtonAdd]=useState(false);
    const [missingRequirements,setMissingRequirements]=useState([]);
    const [openDialogMessage,setOpenDialogMessage]=useState(false);
    const [openDialogMessageAction,setOpenDialogMessageAction]=useState(false);
    const [openDialogRemoved, setOpenDialogRemoved] = useState(false);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const abilities = useSelector((state: any) => state.auth.user.abilities);

    const [levelSisben,setLevelSisben]=useState(["A1", "A2", "A3", "A4", "A5","B1", "B2", "B3", "B4", "B5", "B6", "B7","C1"]);
    const [regimeHealthList,setRegimeHealthList]=useState([regimeList.SUBSIDIADO, regimeList.CONTRIBUTIVO_BENEFICIARIO, regimeList.NO_AFILIADO, regimeList.RETIRADO]);

    const checkRequirements=(ben:any)=>{
      let aux=0;

      if(ben?.sisben_score && levelSisben.includes(ben?.sisben_score)===true){
        aux+=1
      }else{
        setListMissingRequirements("Nivel de SISBEN: A1, A2, A3, A4, A5, B1, B2, B3, B4, B5, B6, B7, C1");
      }

      if(ben?.sisben_department && ben?.sisben_department.includes("Norte de Santander")===true){
        aux+=1
      }else{
        setListMissingRequirements("Tener sisben del Norte de Santander");
      }

      if(ben?.health_regimen && regimeHealthList.includes(ben?.health_regimen)===true){
        aux+=1
      }else{
        setListMissingRequirements("Tener regimen de salud Subsidiado o Cotizante beneficiario");
      }

      if(ben?.birthday && isAgeBenValid(ben?.birthday)===true){
        aux+=1
      }else{
        setListMissingRequirements("Mayor o igual a 60 años");
      }

      if(!ben?.isAttendee){
        aux+=1
      }else{
        setListMissingRequirements("El beneficiario ya asistió a un evento");
      }

      if (ben?.id_front) {
        aux += 1
      } else {
          setListMissingRequirements("No posee el soporte de Cédula Frontal");
      }

      if (ben?.id_back) {
          aux += 1
      } else {
          setListMissingRequirements("No posee el soporte de Cédula Posterior");
      }

      if (ben?.photo_url) {
        aux += 1
      } else {
          setListMissingRequirements("No posee foto de beneficiario");
      }

      if (ben?.footprint_url) {
          aux += 1
      } else {
          setListMissingRequirements("No posee huella de beneficiario");
      }

      if (ben?.fosiga_url) {
        aux += 1
      } else {
          setListMissingRequirements("No posee el soporte de EPS");
      }
      
      if(ben?.sisben_url){
          aux+=1
        }else{
          setListMissingRequirements("No posee el soporte de SISBEN");
      }

      if(aux===11){
        setEnableButtonAdd(true);
      }else{
        setEnableButtonAdd(false);
      }
      aux=0;
      
    }

    const setListMissingRequirements=(message:string)=>{
      const list=missingRequirements;
      list.push(message);
      setMissingRequirements(list);
    }

    function isAgeBenValid(date) {
      date = new Date(date);
      const fechaHace60Anios = new Date();
      fechaHace60Anios.setFullYear(fechaHace60Anios.getFullYear() - 60);
      return date < fechaHace60Anios;
    }

    const getValuesAutocomplete=(data:[])=>{
      const list=[];
      data.map((itemData:any)=>{
        list.push({label:itemData.name,value:itemData._id});
      });
      setValuesAutocomplete(list);
    }
       
    const getEvents=async()=>{
      try {
        const responseEvents=await getAllEvents(null, 1, 1000);
        const events=responseEvents.result.data.data;
        setEvents(events);
        getValuesAutocomplete(events);
      } catch (error) {
        console.error(error);
      }
    }

    const getAllBeneficiaries = async () => {
      setIsLoading(true);
      try {
        const { result } = await getBeneficiariesList();
        const { data: dataList, totalPages } = result.data;
        setBeneficiaries(result.data);
        setTotalPages(totalPages);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
      }
    }

    const generateEventActPDF = async(beneficiarie) => {
      await getPdfDeliveryBeneficiarie(eventSelected, beneficiarie._id);
  }

    const checkAttendeceBen=(beneficiarie:any)=>{
      const eventFound=events.find((event)=>event._id===eventSelected);
      const listAttendees=eventFound?.attendees;
      const benFound=listAttendees.find((ben)=>beneficiarie?._id===ben);
      if(!benFound){
        return <VisibilityIcon
        onClick={() => handleClickOpen(beneficiarie)}
          className="action-item-icon action-item-icon-edit"
        >
        </VisibilityIcon>
      }else{
        return [
          <DoneIcon className="action-item-icon action-item-icon-add"/>,
          <PictureAsPdfIcon 
            className="action-item-icon action-item-icon-edit"
            onClick={() => generateEventActPDF(beneficiarie)}
          />,
          (checkPermissions(
            {
              subject: SECTIONS.EVENTS,
              action: [PERMISSIONS.DELETE],
            },
            abilities
          ) &&  <ClearIcon
            onClick={() => openRemoveConfirmDialog(beneficiarie)}
            className="action-item-icon action-item-icon-delete"
          ></ClearIcon>)
        ];
      }
    }

    const handlerAutocomplete=(data)=>{
      if(data){
        setEventSelected(data.value);
      }else{
        setEventSelected(null);
      }
    }

    const handleClickOpen=(ben:any)=>{
      setIsConfirmed(false);
      checkRequirements(ben);
      setBenSelected(ben);
      setOpenModal(!openModal);
    }

    const handlerCloseModal=()=>{
      setOpenModal(false);
      setMissingRequirements([])
    }

    const handOpenDialogMessage=()=>{
      setOpenDialogMessage(!openDialogMessage);
    }

    const handOpenDialogMessageAction=()=>{
      setOpenDialogMessageAction(!openDialogMessageAction);
    }

    const openRemoveConfirmDialog = (ben: any) => {
      setBenSelected(ben);
      setOpenDialogRemoved(true);
    }

    const handleOpenDialogRemoved = () => {
      setOpenDialogRemoved(false);
    }

    const confirmRemoveAssistance = async() => {
      const eventFound = events.find((event) => event._id === eventSelected);
      eventFound.attendees = [benSelected?._id];
      await removeAssitance(eventFound?._id, eventFound);
      refressInfo();
      handleOpenDialogRemoved();
    }

    const confirmAssistance=async ()=>{
      setIsConfirmed(true);
      const eventFound=events.find((event)=>event._id===eventSelected);
      eventFound.attendees=[benSelected?._id];
      await updateEvent(eventFound?._id,eventFound);
      setOpenModal(false);
      refressInfo();
      handOpenDialogMessageAction();
      setEnableButtonAdd(false);
    }

    const refressInfo=async ()=>{
      await getAllBeneficiaries();
      getEvents();
    }

    useEffect(() => {
      getEvents();
      getAllBeneficiaries();
    }, []);

    return (
        <div className="users-container">
          <div className="users-container__actions">
            <div className="content-page-title">
              <Typography variant="h5" className="page-header">
                Administrar asistencias
              </Typography>
              <span className="page-subtitle">
                Aquí podras gestionar las asistencias de eventos
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
                  <Search
                  label="Buscar beneficiario"
                  searchFunction={async (data: string) => {
                  try {
                    const { result } = await getBeneficiariesList(data);
                    setDataLastSearch(data);
                    const { data: works, totalPages } = result;
                    setTotalPages(totalPages);
                    setBeneficiaries(works);
                  } catch (err) {
                    console.error(err)
                  }
                }}
                voidInputFunction={getAllBeneficiaries}
                />
                </div>
                  {isLoading ? (
              <LoadingComponent></LoadingComponent>
            ) : (
              <>
                <Table>
                  <TableRow header>
                    <TableCell>FOTO</TableCell>
                    <TableCell>NOMBRE</TableCell>
                    <TableCell>CEDULA</TableCell>
                    <TableCell>ASOCIACIÓN</TableCell>
                    <TableCell>EPS</TableCell>
                    <TableCell>ACCIONES</TableCell>
                  </TableRow>
                  {beneficiaries.map((ben: any) => {
                    return (
                      <TableRow key={ben._id}>
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
                      <TableCell>{ben?.eps?.name}</TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={2}>
                            {checkAttendeceBen(ben)}
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
                      const { result } = await getBeneficiariesList(
                        dataLastSearch,
                        page
                      );
                      const { data: benfs, totalPages } = result;
                      setBeneficiaries(benfs);
                      setTotalPages(totalPages);
                    } catch (err) {
                      console.error(err);
                    }
                  }}
                />
              </>
            )}
                </>
              :""
            }
            {
              benSelected !== null && openModal=== true ?
                <>
                  <BootstrapDialog className='modal-dialog'
                // onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={openModal}
            >
                <DialogTitle className='modal-header'
                id="customized-dialog-title" 
                // onClose={handleClose}
                >
                    Datos de beneficiario
                </DialogTitle>
                <DialogContent dividers>
                 <form className="item-form-container">
                  {
                    missingRequirements.length > 0 ? 
                      <>
                        <h2>Requisitos necesarios:</h2>
                        {
                          missingRequirements.map((requitement:string,index:number)=>{
                            return <p key={index}>{index+1}. {requitement} <WarningIcon color='warning'/></p>
                          })
                        }
                        <Divider />
                      </>
                    : <><p>Este beneficiario cumple con todos los requisitos <DoneIcon color='success'/></p> </>
                  }
                     <Button autoFocus className='btn-view-requirement' onClick={()=>handOpenDialogMessage()}>
                        Ver requisitos
                      </Button>
                    {!benSelected?.photo_url? ""
                      :<>
                         <img
                        className="ben-photo-details"
                        src={benSelected?.photo_url}
                        alt="foto"
                        />
                      </>
                    }

                  <TextField 
                    id="outlined-basic"
                    label="Tipo de documento"   
                    variant="outlined"
                    defaultValue={benSelected?.identification_type}
                    InputProps={{
                      readOnly: true,
                    }}
                    />

                  <TextField 
                    id="outlined-basic"
                    label="Número Documento"
                    variant="outlined"
                    defaultValue={benSelected?.identification}
                    InputProps={{
                      readOnly: true,
                    }}
                    />

                  <TextField 
                    id="outlined-basic"
                    label="Nombre"
                    variant="outlined"
                    defaultValue={`${benSelected?.first_name} ${benSelected.second_name} ${benSelected?.first_last_name} ${benSelected?.second_last_name}`}
                    InputProps={{
                      readOnly: true,
                    }}
                    />

                    <TextField 
                      id="outlined-basic"
                      label="Fecha de nacimiento"
                      variant="outlined"
                      defaultValue={benSelected?.birthday}
                      InputProps={{
                        readOnly: true,
                      }}
                      />

                    <TextField 
                      id="outlined-basic"
                      label="Municipio"
                      variant="outlined"
                      defaultValue={benSelected?.municipality}
                      InputProps={{
                        readOnly: true,
                      }}
                      />

                    <TextField 
                      id="outlined-basic"
                      label="Asociación"
                      variant="outlined"
                      defaultValue={benSelected?.association?.name}
                      InputProps={{
                        readOnly: true,
                      }}
                      />

                    <TextField 
                      id="outlined-basic"
                      label="Eps"
                      variant="outlined"
                      defaultValue={benSelected?.eps}
                      InputProps={{
                        readOnly: true,
                      }}
                      />

                    <TextField 
                      id="outlined-basic"
                      label="Regimen de Salud"
                      variant="outlined"
                      defaultValue={benSelected?.health_regimen}
                      InputProps={{
                        readOnly: true,
                      }}
                      />

                    <TextField 
                      id="outlined-basic"
                      label="Categoria SISBEN"
                      variant="outlined"
                      defaultValue={benSelected?.sisben_score}
                      InputProps={{
                        readOnly: true,
                      }}
                      />
                 </form>

                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={()=>handlerCloseModal()}>
                        {enableButtonAdd===false ? "Aceptar" : "Cancelar"}
                    </Button>
                    {
                      enableButtonAdd ===true ?
                      <Button autoFocus disabled={isConfirmed} onClick={()=>confirmAssistance()}>
                        Confirmar asistencia
                      </Button>
                      : ""
                    }
                </DialogActions>
            </BootstrapDialog>                
                </>
              :""
            }
            <Dialog open={openDialogMessage} >
              <DialogTitle>Requisitos</DialogTitle>
              <DialogContent>
              <DialogContentText>
                  <p>1. Nivel de SISBEN: A1, A2, A3, A4, A5, B1, B2, B3, B4, B5, B6, B7, C1</p>
                  <p>2. Tener sisben del Norte de Santander</p>
                  <p>3. Tener regimen de salud Subsidiado o Cotizante beneficiario</p>
                  <p>4. Mayor o igual a 60 años</p>
                  <p>5. No haber asistido a un evento previo</p>
              </DialogContentText>
              </DialogContent>
              <DialogActions>
              <Button onClick={()=>handOpenDialogMessage()} color="primary">
                  Aceptar
              </Button>
              </DialogActions>
            </Dialog>

            <Dialog open={openDialogMessageAction} >
              <DialogTitle>Mensaje</DialogTitle>
              <DialogContent>
              <DialogContentText>
                  Asistencia confirmada correctamente
              </DialogContentText>
              </DialogContent>
              <DialogActions>
              <Button onClick={()=>handOpenDialogMessageAction()} color="primary">
                  Aceptar
              </Button>
              </DialogActions>
            </Dialog>

            <Dialog open={openDialogRemoved} >
              <DialogTitle>Advertencia</DialogTitle>
              <DialogContent>
              <DialogContentText>
                  ¿Está seguro que desea remover la asistencia al evento?
              </DialogContentText>
              </DialogContent>
              <DialogActions>
              <Button onClick={()=>handleOpenDialogRemoved()} color="primary">
                  Cancelar
              </Button>
              <Button onClick={()=>confirmRemoveAssistance()} color="primary">
                  Aceptar
              </Button>
              </DialogActions>
            </Dialog>
          </div>
        </div>
      );
}

export default EventAssistance;