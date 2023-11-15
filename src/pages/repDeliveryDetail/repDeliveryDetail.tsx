import { useEffect, useState } from "react";
import {
  Autocomplete,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormLabel,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import LoadingComponent from "../../components/loading/loading";
import { Table, TableCell, TableRow } from "../../components/table/table";
import "./repDeliveryDetail.scss";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Search from "../../components/search/search";
import { getAllEvents } from "../../services/events.service";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import {
  createDelivery,
  getDeliveryById,
} from "../../services/delivery.service";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { getRatingsByBeneficiary } from "../../services/rating.service";
import SaveCancelControls from "../../components/saveActionComponent/saveCancelControls";
import { formatCurrencyNummber } from "../../helpers/formatCurrencyNumber";
import { isEmpty } from "../../helpers/isEmpty";
import { getRepresentativesList } from "../../services/representative.service";
import { getWinerie } from "../../services/winerie.service";
import { Inventory } from "@mui/icons-material";

function RepDeliveryDetail() {
  const { deliveryId } = useParams();
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [representants, setRepresentants] = useState([]);
  const [selectedRepre, setSelectedRepre] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventArray, setEventArray] = useState([]);
  const [counters, setCounters] = useState([]);
  const [openDialogConfirm, setOpenDialogConfirm] = useState(false);
  const [updatedDelivery, setUpdatedDelivery] = useState({});
  const [currentInventory, setCurrentInventory] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    getEvents();
    getRepresentants();
    if (deliveryId) {
      getCurrentDelivery();
    }
  }, []);


  const getCurrentDelivery = async () => {
    const response = await getDeliveryById(deliveryId);
    const currentDelivery = response.result.data;
    const { event, beneficiary } = currentDelivery;
    setSelectedRepre(beneficiary);
    setSelectedEvent(event);
    setUpdatedDelivery(currentDelivery);
  };

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
      console.error(error);
    }
    setIsLoading(false);
  };

  const getRepresentants = async () => {
    try {
      const response = await getRepresentativesList();
      const { data: repreList } = response.result.data;
      setRepresentants(repreList);
    } catch (error) {
      console.error(error);
    }
  };

  const searchRepresentants = async (data) => {
    try {
      const { result } = await getRepresentativesList(data);
      const { data: representants } = result.data;
      setRepresentants(representants);
    } catch (err) {
      console.error(err);
    }
  };

  const onSelectEvent = (_, selected) => {
    const currentEvent = eventArray.find((item) => item.name === selected);
    setSelectedEvent(currentEvent);
    getAssociatedWinery(currentEvent.associated_winery._id);
  };

  const getAssociatedWinery = async(id) => {
    const response = await getWinerie(id);
    const inventory = response.result.data.inventory.filter(item => item.item.associationItem === true);
    setCurrentInventory(inventory);
    const newCounts = new Array(inventory.length).fill(0);
    setCounters(newCounts);
  }

  const handleAddAction = async (item) => {
    setSelectedRepre(item);
  };


  const getFinalItemList = (): any[] => {
    const finalList = [];
    currentInventory
      ?.filter((el) => !el.isDefault && !el.associationItem)
      .forEach((item, i) => {
        if (counters[i] > 0)
          finalList.push({
            item: item.item._id,
            amount: counters[i],
          });
      });
    return finalList;
  };

  const getItemsDetail = () => {
    const finalList = [];
    currentInventory?.forEach((item, i) => {
      if (counters[i] > 0)
        finalList.push({
          item: item.item.name,
          value: item.item.value,
        });
    });
    console.log(finalList)
    return finalList;
  };

  const confirmSaveDelivery = async () => {
    setOpenDialogConfirm(false);
    const currentDevlivery = {
      representant: selectedRepre._id,
      event: selectedEvent._id,
      itemList: getFinalItemList(),
      associated_winery: selectedEvent.associated_winery._id,
      type: "representant"
    };
    console.log(currentDevlivery);
    await createDelivery(currentDevlivery);
    navigate(`${ROUTES.DASHBOARD}/${ROUTES.DELIVERY_LIST}`);
  };

  const saveDelivery = () => {
    setOpenDialogConfirm(!openDialogConfirm);
  };

  const setValue = (value, i) => {
    const counts = counters;
    counts[i] = value;
    setCounters(counts);
}

  return isLoading ? (
    <LoadingComponent></LoadingComponent>
  ) : (
    <>
      <section className="delivery-container">
        <header className="delivery-container__actions">
          <div className="content-page-title">
            <Typography variant="h5" className="page-header">
              Entrega de bienes
            </Typography>
            <span className="page-subtitle">
              Generar entrega de bienes a representantes.
            </span>
          </div>
        </header>

        <Paper elevation={1} className="assistance-container__form-section">
          <Stack direction="row" spacing={4}>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={events}
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="Evento" />}
              onChange={onSelectEvent}
              value={(selectedEvent as any)?.name || ""}
              disabled={!isEmpty(deliveryId)}
            />
            {!deliveryId && (
              <Search
                label="Buscar representante"
                buttonText="Buscar"
                searchFunction={(data: any) => searchRepresentants(data)}
                width={450}
                voidInputFunction={getRepresentants}
              />
            )}
          </Stack>
          {selectedEvent && !deliveryId && (
            <div className="assistance-container__form-section__table">
              <div className="panel-heading">Resultados de la busqueda</div>
              <Table>
                <TableRow header>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Cedula</TableCell>
                  <TableCell>Teléfono</TableCell>
                  <TableCell>Asociación</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
                {representants.length > 0 ? (
                  representants.map((repre: any, index) => {
                    return (
                      <TableRow key={index}>
                        <TableCell> {repre?.name} </TableCell>
                        <TableCell>{repre?.identification}</TableCell>
                        <TableCell> {repre?.phone} </TableCell>
                        <TableCell>{repre?.association?.name}</TableCell>
                        <TableCell>
                          <Stack
                            className="actions-cell"
                            direction="row"
                            spacing={2}
                          >
                            <AddCircleIcon
                              className="action-item-icon action-item-icon-add"
                              onClick={() => handleAddAction(repre)}
                            ></AddCircleIcon>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell>No hay registros disponible</TableCell>
                  </TableRow>
                )}
              </Table>
            </div>
          )}
          {selectedRepre && (
            <div className="assistance-container__form-section__table__info">
              <div className="panel-heading">Representante seleccionado</div>
              <Table>
                <TableRow header>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Cedula</TableCell>
                  <TableCell>Teléfono</TableCell>
                  <TableCell>Asociación</TableCell>
                </TableRow>
                <TableRow key={selectedRepre.id}>
                  <TableCell> {selectedRepre?.name} </TableCell>
                  <TableCell>{selectedRepre?.identification}</TableCell>
                  <TableCell> {selectedRepre?.phone} </TableCell>
                  <TableCell>{selectedRepre?.association?.name}</TableCell>
                </TableRow>
              </Table>
            </div>
          )}
          {currentInventory?.length > 0 && selectedRepre && (
            <div className="ratings-container__form-section__info">
              <div className="panel-heading">
                Articulos a entregar
              </div>
              <Card sx={{ width: 300, padding: 2 }}>
                <Stack direction={"column"}>
                  {currentInventory.map((item, i) => {
                    return (
                      <Grid container spacing={2} key={item?.item?.name + "_" + i}>
                        <Grid item xs={5}>
                          <FormLabel component="legend">{item?.item?.name || ""}</FormLabel>
                        </Grid>
                        <Grid item xs={2}>
                          <TextField
                            id="outlined-number"
                            sx={{width: 100}}
                            label="Cantidad"
                            type="number"
                            size="small"
                            onChange={(e) => setValue(e.target.value, i)}
                          />
                        </Grid>
                      </Grid>
                    );
                  })}
                </Stack>
              </Card>
            </div>
          )}
        </Paper>

        <Dialog open={openDialogConfirm}>
          <DialogTitle>Confirmar entrega</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {getItemsDetail().map((item, index) => {
                return (
                  <span key={item.item + '_' + index}>
                    {index + 1}. {item.item} - {formatCurrencyNummber(item.value)}
                  </span>
                );
              })}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialogConfirm(false)} color="primary">
              Cancelar
            </Button>
            <Button onClick={() => confirmSaveDelivery()} color="primary">
              Aceptar
            </Button>
          </DialogActions>
        </Dialog>
      </section>
      {!deliveryId && (
        <SaveCancelControls
          saveText="Guardar"
          handleSave={() => saveDelivery()}
        />
      )}
    </>
  );
}

export default RepDeliveryDetail;
