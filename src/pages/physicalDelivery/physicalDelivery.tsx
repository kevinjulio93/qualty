import { useEffect, useState } from "react";
import { Autocomplete, Button, Card, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormLabel, Grid, Paper, Stack, TextField, Typography } from "@mui/material";
import LoadingComponent from "../../components/loading/loading";
import { Table, TableCell, TableRow } from "../../components/table/table";
import './physicalDelivery.scss';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Search from "../../components/search/search";
import { getAllEvents } from "../../services/events.service";
import { getWinerie } from "../../services/winerie.service"
import RemoveIcon from '@mui/icons-material/Remove';
import { createPhysicalDelivery,updatePhysicalDelivery,getOnePhysicalDelivery } from "../../services/physicalDelivery.service";
import { getUserList } from "../../services/user.service";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "../../constants/routes";

function PhysicalDelivery () {
    const [physicalDelivery,setPhysicalDelivery]=useState({_id:"",event:"",itemsList:[{item:""}],author:""});
    const [events, setEvents] = useState([]);
    const [users, setUsers] = useState([]);
    const [usersArray, setUsersArray] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [eventArray, setEventArray] = useState([]);
    const [itemList, setItemList] = useState([]);
    const [addedList,setAddedList]=useState([]);
    const [openDialogMessage,setOpenDialogMessage]=useState(false);
    const [messageDialog,setMessageDialog]=useState("");
    const navigate=useNavigate();
    const params=useParams();
    const [physicalDeliveryEdit,setPhysicalDeliveryEdit]=useState(null)

    useEffect(() => {
        getPhysicalDelivery();
        getEvents();
        getAllUsers();
    }, []);

    const getPhysicalDelivery=async ()=>{
        try {
            if(params.idDelivery){
                const response=await getOnePhysicalDelivery(params.idDelivery);
                const deliveryFound=response.result.data;
                if(deliveryFound){
                    setPhysicalDeliveryEdit(deliveryFound);
                    const idWinerie=deliveryFound?.event?.associated_winery;
                    const response=await getWinerie(idWinerie);
                    setItemList(response.result.data.inventory);
                    setSelectedUser(deliveryFound?.author);
                    setSelectedEvent(deliveryFound?.event);
                    setAddedList(deliveryFound?.itemsList);
                    const items=[];
                    deliveryFound?.itemsList.map((data)=>{
                        items.push({item:data?.item?._id});
                    });
                    setPhysicalDelivery({_id:deliveryFound?._id,event:deliveryFound?.event?._id,author:deliveryFound?.author?._id,itemsList:items});
                }
            }
        } catch (error) {
            navigate(`${ROUTES.DASHBOARD}${ROUTES.PHYSICAL_DELIVERY_LIST}`);
        }
    }

    const getEvents = async () => {
        setIsLoading(true);
        try {
            const response = await getAllEvents();
            if (response.status === 200) {
                const dataList = response.result.data.data.map((item) => item.name);
                setEvents(dataList);
                setEventArray(response.result.data.data);
            }
        } catch (error) {
            setMessageDialog("Se produjo un error al obtener los eventos");
            handOpenDialogMessage();
        }
        setIsLoading(false);
    }

    const getAllUsers=async ()=>{
        try {
            setIsLoading(true);
            const response=await getUserList();
            setUsersArray(response.result.data);
            const dataListUsersAutocomplete=response.result.data.map((user)=>user.name);
            setUsers(dataListUsersAutocomplete);
        } catch (error) {
            setMessageDialog("Se produjo un error al obtener los usuarios");
            handOpenDialogMessage();
        }
        setIsLoading(false);
    }

    const onSelectUser = (_, selected) => {
        const currentUser = usersArray.find(item => item.name === selected);
        setSelectedUser(currentUser);
        setPhysicalDelivery({...physicalDelivery,author:currentUser?._id});
    }

    const onSelectEvent = (_, selected) => {
        const currentEvent = eventArray.find(item => item.name === selected);
        setSelectedEvent(currentEvent);
        const inventory = currentEvent?.associated_winery?.inventory;
        setItemList(inventory);
        setPhysicalDelivery({...physicalDelivery,event:currentEvent?._id});
    }

    const resetSearch=()=>{
        setIsLoading(true);
        setItemList(selectedEvent?.associated_winery?.inventory);
        setIsLoading(false);
    }

    const handleAddAction=(dataItem:any)=>{
        const itemFound=addedList.find((data)=>data.item._id===dataItem.item._id); 
        if(!itemFound){
            let list=addedList;
            list.push(dataItem);
            setAddedList([...list]);
        }else{
            setMessageDialog("Artículo ya existente en la tabla de agregados");
            handOpenDialogMessage();
        }
    }

    const searchItem=(data:string)=>{
        const itemsFound=itemList.filter((dataItem)=>dataItem?.item?.name.includes(data) || dataItem?.item?.code.includes(data));
        setItemList(itemsFound);
    }

    const handleDeleteAction=(dataItem:any)=>{
        const listItemsAddend=addedList.filter((data)=>data?.item?._id !==dataItem?.item?._id);
        setAddedList([...listItemsAddend]);
    }

    const saveDelivery = async () => {
        try {
            const items=[];
            addedList.map((data)=>{
                items.push({item:data?.item?._id});
            });
            physicalDelivery.itemsList=items;
            if(physicalDeliveryEdit ===null){
                delete physicalDelivery._id;
            }  
            const action=physicalDeliveryEdit ===null ? createPhysicalDelivery: updatePhysicalDelivery
            const response=await action(physicalDelivery);
            if(response.status===200){
                navigate(`${ROUTES.DASHBOARD}/${ROUTES.PHYSICAL_DELIVERY_LIST}`);
            }
        } catch (error) {
            setMessageDialog("Se produjo un error");
            handOpenDialogMessage();
        }
    }

    const handOpenDialogMessage=()=>{
        setOpenDialogMessage(!openDialogMessage);
    }

    return isLoading ? (
        <LoadingComponent></LoadingComponent>
      ) : (
        <>
            <section className='delivery-container'>
                <header className="delivery-container__actions">
                    <div className="content-page-title">
                        <Typography variant="h5" className="page-header">Ordenes de bienes</Typography>
                        <span className="page-subtitle">{physicalDeliveryEdit!==null ?  "Editar":"Generar"} registro.</span>
                    </div>
                </header>

                <Paper elevation={1} className="assistance-container__form-section">
                    <Stack direction="row" spacing={4}>
                        <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            options={events}
                            defaultValue={physicalDeliveryEdit?.event?.name || ""}
                            sx={{ width: 300 }}
                            renderInput={(params) => <TextField {...params} label="Evento" />}
                            onChange={onSelectEvent}
                        />
                        <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            options={users}
                            defaultValue={physicalDeliveryEdit?.author?.name || ""}
                            sx={{ width: 300 }}
                            renderInput={(params) => <TextField {...params} label="Usuario" />}
                            onChange={onSelectUser}
                        />
                        <Search
                            label="Buscar artículo"
                            buttonText="Buscar"
                            searchFunction={(data: any) => searchItem(data)}
                            width={450}
                            voidInputFunction={()=>resetSearch()}
                        />
                    </Stack>
                    {selectedEvent && selectedUser &&
                    <>
                        <div className="assistance-container__form-section__table">
                        <div className="panel-heading"> 
                            Resultados de la busqueda
                        </div>
                        <Table>
                            <TableRow header>
                                <TableCell>NOMBRE</TableCell>
                                <TableCell>CÓDIGO</TableCell>
                                <TableCell>VALOR</TableCell>
                                <TableCell>ACCIONES</TableCell>
                            </TableRow>
                            {itemList.length > 0 ?
                            itemList.map((data: any, index) => {
                                return (
                                <TableRow key={index}>
                                    <TableCell>{data?.item?.name}</TableCell>
                                    <TableCell>{data?.item?.code}</TableCell>
                                    <TableCell>$ {data?.item?.value > 0 ? data?.item?.value: 0 }</TableCell>
                                    <TableCell>
                                    <Stack className="actions-cell" direction="row" spacing={2}>
                                        <AddCircleIcon
                                        className="action-item-icon action-item-icon-add"
                                        onClick={() => handleAddAction(data)}
                                        ></AddCircleIcon>
                                    </Stack>
                                    </TableCell>
                                </TableRow>
                                );
                            }) : <TableRow>
                                    <TableCell>No hay registros disponible</TableCell>
                                </TableRow>}
                        </Table>
                        
                    </div>
                        <div className="assistance-container__form-section__table">
                        <div className="panel-heading"> 
                            Artículos agregados
                        </div>
                        <Table>
                            <TableRow header>
                                <TableCell>NOMBRE</TableCell>
                                <TableCell>CÓDIGO</TableCell>
                                <TableCell>VALOR</TableCell>
                                <TableCell>ACCIONES</TableCell>
                            </TableRow>
                            {addedList.length > 0 ?
                            addedList.map((data: any, index) => {
                                return (
                                <TableRow key={index}>
                                    <TableCell>{data?.item?.name}</TableCell>
                                    <TableCell>{data?.item?.code}</TableCell>
                                    <TableCell>$ {data?.item?.value > 0 ? data?.item?.value: 0 }</TableCell>
                                    <TableCell>
                                    <Stack className="actions-cell" direction="row" spacing={2}>
                                        <RemoveIcon
                                        className="action-item-icon action-item-icon-add"
                                        onClick={() => handleDeleteAction(data)}
                                        ></RemoveIcon>
                                    </Stack>
                                    </TableCell>
                                </TableRow>
                                );
                            }) : <TableRow>
                                    <TableCell>No hay registros disponible</TableCell>
                                </TableRow>}
                        </Table>
                        
                    </div>
                    </>
                    
                    }
                    {
                        selectedEvent && selectedUser ?
                        <Button
                            className="btn-save-delivery"
                            onClick={() => saveDelivery()}
                            >
                           Guardar
                        </Button>
                        : ""
                    }
                </Paper>
                <Dialog open={openDialogMessage} >
                    <DialogTitle>Mensaje</DialogTitle>
                    <DialogContent>
                    <DialogContentText>
                        {messageDialog}
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={()=>handOpenDialogMessage()} color="primary">
                        Aceptar
                    </Button>
                    </DialogActions>
                </Dialog>

            </section>
        </>
    );
}

export default PhysicalDelivery;