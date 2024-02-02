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
import "./delivery.scss";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Search from "../../components/search/search";
import { getBeneficiariesList } from "../../services/beneficiaries.service";
import { getAllEvents } from "../../services/events.service";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import {
  createDelivery,
  getDeliveryById,
} from "../../services/delivery.service";
import WarningIcon from "@mui/icons-material/Warning";
import { useParams } from "react-router-dom";
import { getRatingsByBeneficiary } from "../../services/rating.service";
import SaveCancelControls from "../../components/saveActionComponent/saveCancelControls";
import { formatCurrencyNummber } from "../../helpers/formatCurrencyNumber";
import { isEmpty } from "../../helpers/isEmpty";
import { regimeList } from "../../constants/regimeList";
import Toast from "../../components/toast/toast";
import { SEVERITY_TOAST } from "../../constants/severityToast";

function Delivery() {
  const { deliveryId } = useParams();
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [bens, setBens] = useState([]);
  const [selectedBen, setSelectedBen] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventArray, setEventArray] = useState([]);
  const [itemList, setItemList] = useState([]);
  const [counters, setCounters] = useState([]);
  const [forceRender, setForceRender] = useState(+new Date());
  const levelSisben = [
    "A1",
    "A2",
    "A3",
    "A4",
    "A5",
    "B1",
    "B2",
    "B3",
    "B4",
    "B5",
    "B6",
    "B7",
    "C1",
  ];
  const regimeHealthList = [
    regimeList.SUBSIDIADO,
    regimeList.CONTRIBUTIVO_BENEFICIARIO,
    regimeList.NO_AFILIADO,
    regimeList.RETIRADO,
  ];
  const [missingRequirements, setMissingRequirements] = useState([]);
  const [openDialogMessage, setOpenDialogMessage] = useState(false);
  const [openDialogRequeriment, setOpenDialogRequeriment] = useState(false);
  const [openDialogConfirm, setOpenDialogConfirm] = useState(false);
  const [updatedDelivery, setUpdatedDelivery] = useState({});
  const [openLeftModal, setOpenLeftModal] = useState(false);
  const [openToast, setOpenToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");


  useEffect(() => {
    getEvents();
    getBens();
    if (deliveryId) {
      getCurrentDelivery();
    }
  }, []);

  useEffect(() => {
    if (deliveryId && !isEmpty(selectedBen)) {
      getAllRatingsByBen(selectedBen._id);
    }
  }, [selectedBen]);

  useEffect(() => {
    if (deliveryId && !isEmpty(itemList)) {
      setCurrentCounter();
      setOpenLeftModal(true);
    }
  }, [itemList]);

  const getCurrentDelivery = async () => {
    const response = await getDeliveryById(deliveryId);
    const currentDelivery = response.result.data;
    const { event, beneficiary } = currentDelivery;
    setSelectedBen(beneficiary);
    setSelectedEvent(event);
    setUpdatedDelivery(currentDelivery);
  };

  const setListMissingRequirements = (message: string) => {
    const list = missingRequirements;
    list.push(message);
    setMissingRequirements(list);
  };

  function isAgeBenValid(date) {
    date = new Date(date);
    const fechaHace60Anios = new Date();
    fechaHace60Anios.setFullYear(fechaHace60Anios.getFullYear() - 60);
    return date < fechaHace60Anios;
  }

  const checkRequirements = (ben: any) => {
    let aux = 0;

    if (ben?.sisben_score && levelSisben.includes(ben?.sisben_score) === true) {
      aux += 1;
    } else {
      setListMissingRequirements(
        "Nivel de SISBEN: A1, A2, A3, A4, A5, B1, B2, B3, B4, B5, B6, B7, C1"
      );
    }

    if (
      ben?.sisben_department &&
      ben?.sisben_department.includes("Norte de Santander") === true
    ) {
      aux += 1;
    } else {
      setListMissingRequirements("Tener sisben del Norte de Santander");
    }

    if (
      ben?.health_regimen &&
      regimeHealthList.includes(ben?.health_regimen) === true
    ) {
      aux += 1;
    } else {
      setListMissingRequirements(
        "Tener regimen de salud Subsidiado o Cotizante beneficiario"
      );
    }

    if (ben?.birthday && isAgeBenValid(ben?.birthday) === true) {
      aux += 1;
    } else {
      setListMissingRequirements("Mayor o igual a 60 años");
    }

    if (ben?.fosiga_url) {
      aux += 1;
    } else {
      setListMissingRequirements("No posee el soporte de EPS");
    }
    /*
        if(ben?.registry_doc_url){
            aux+=1
          }else{
            setListMissingRequirements("No posee el soporte de Registraduría");
        }
        */
    if (ben?.sisben_url) {
      aux += 1;
    } else {
      setListMissingRequirements("No posee el soporte de SISBEN");
    }

    if (ben?.id_front) {
      aux += 1;
    } else {
      setListMissingRequirements("No posee el soporte de Cédula Frontal");
    }

    if (ben?.id_back) {
      aux += 1;
    } else {
      setListMissingRequirements("No posee el soporte de Cédula Posterior");
    }

    if (ben?.photo_url) {
      aux += 1;
    } else {
      setListMissingRequirements("No posee foto de beneficiario");
    }

    if (ben?.footprint_url) {
      aux += 1;
    } else {
      setListMissingRequirements("No posee huella de beneficiario");
    }

    if (aux === 10) {
      aux = 0;
      return true;
    } else {
      aux = 0;
      return false;
    }
  };

  const handOpenDialogRequirement = () => {
    setOpenDialogRequeriment(!openDialogRequeriment);
  };

  const getEvents = async () => {
    setIsLoading(true);
    try {
      const response = await getAllEvents(null, 1, 1000);
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

  const getBens = async () => {
    try {
      const response = await getBeneficiariesList();
      const benList = response.result.data;
      setBens(benList);
    } catch (error) {
      console.error(error);
    }
  };

  const searchBeneficiaries = async (data) => {
    try {
      const { result } = await getBeneficiariesList(data);
      const { data: beneficiaries } = result;
      setBens(beneficiaries);
    } catch (err) {
      console.error(err);
    }
  };

  const onSelectEvent = (_, selected) => {
    const currentEvent = eventArray.find((item) => item.name === selected);
    setSelectedEvent(currentEvent);
  };

  const handOpenDialogMessage = () => {
    setOpenDialogMessage(!openDialogMessage);
  };

  const handleAddAction = async (item) => {
    missingRequirements.length = 0;
    setMissingRequirements(missingRequirements);
    if (!checkRequirements(item)) {
      setOpenDialogMessage(true);
    } else {
      getAllRatingsByBen(item._id);
      setSelectedBen(item);
      setOpenLeftModal(!openLeftModal);
    }
  };

  const getAllRatingsByBen = async (id: string) => {
    const response = await getRatingsByBeneficiary(id);
    const todosSuggestedItems = response.result.data.reduce((acc, item) => {
      const suggestedItemsElement = item.suggested_items || [];
      acc = acc.concat(suggestedItemsElement);
      return acc;
    }, []);
    const mapResponse = [
      ...new Map(todosSuggestedItems.map((item) => [item._id, item])).values(),
    ];
    const inventory = (mapResponse as any).filter(
      (el) => !el.isDefault && !el.associationItem
    );
    setItemList(inventory);
    const newCounts = new Array(inventory.length).fill(0);
    setCounters(newCounts);
  };

  const getFinalItemList = (): any[] => {
    const finalList = [];
    itemList
      .filter((el) => !el.isDefault && !el.associationItem)
      .forEach((item, i) => {
        if (counters[i] > 0)
          finalList.push({
            item: item._id,
            amount: counters[i],
          });
      });
    return finalList;
  };

  const getItemsDetail = () => {
    const finalList = [];
    itemList.forEach((item, i) => {
      if (counters[i] > 0)
        finalList.push({
          item: item.name,
          value: item.value,
        });
    });
    return finalList;
  };

  const confirmSaveDelivery = async () => {
    setOpenDialogConfirm(false);
    const currentDevlivery = {
      beneficiary: selectedBen._id,
      event: selectedEvent._id,
      itemList: getFinalItemList(),
      associated_winery: selectedEvent.associated_winery._id,
      type: "beneficiary",
    };
    try {
      await createDelivery(currentDevlivery);
      setOpenLeftModal(!openLeftModal);
      setSelectedBen(null);
    } catch (error) {
        setOpenToast(true);
        setToastMsg('Ocurrio un error realizando la entrega');
    }
  };

  const saveDelivery = () => {
    setOpenDialogConfirm(!openDialogConfirm);
  };

  const addCounter = (i) => {
    const counts = counters;
    counts[i]++;
    setCounters(counts);
    setForceRender(+new Date());
  };

  const removeCounter = (i) => {
    const counts = counters;
    counts[i]--;
    setCounters(counters);
    setForceRender(+new Date());
  };

  const setCurrentCounter = () => {
    const counts = counters;
    const items = (updatedDelivery as any)?.itemList || [];
    const itemIds = itemList.map((item) => item._id);
    itemIds.forEach((item, i) => {
      if (items.some((element) => element.item === item)) {
        counts[i]++;
      }
    });
    setCounters(counts);
    setForceRender(+new Date());
  };

  const closeLefModal = () => {
    setSelectedBen(null);
    setOpenLeftModal(!openLeftModal);
  };

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
              Generar entrega de bienes a beneficiario.
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
                label="Buscar beneficiario"
                buttonText="Buscar"
                searchFunction={(data: any) => searchBeneficiaries(data)}
                width={450}
                voidInputFunction={getBens}
              />
            )}
          </Stack>
          <div className="content-deliveries">
            {selectedEvent && !deliveryId && (
              <div className="assistance-container__form-section__table">
                <div className="panel-heading">Resultados de la busqueda</div>
                <Table>
                  <TableRow header>
                    <TableCell>Foto</TableCell>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Cedula</TableCell>
                    <TableCell>Asociación</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                  {bens.length > 0 ? (
                    bens.map((beneficiary: any, index) => {
                      return (
                        <TableRow key={index}>
                          <TableCell>
                            <img
                              className="ben-foto"
                              src={beneficiary.photo_url}
                              alt="foto"
                            />
                          </TableCell>
                          <TableCell>
                            {beneficiary?.first_name} {beneficiary.second_name}{" "}
                            {beneficiary.first_last_name}{" "}
                            {beneficiary.second_last_name}
                          </TableCell>
                          <TableCell>{beneficiary?.identification}</TableCell>
                          <TableCell>
                            {beneficiary?.association?.name}
                          </TableCell>
                          <TableCell>
                            <Stack
                              className="actions-cell"
                              direction="row"
                              spacing={2}
                            >
                              <AddCircleIcon
                                className="action-item-icon action-item-icon-add"
                                onClick={() => handleAddAction(beneficiary)}
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
            {selectedBen && openLeftModal && (
              <div className="section-table-butom">
                <div className="panel-heading">
                  Beneficiario seleccionado
                  {!deliveryId && <button
                    className="btn-close-left"
                    onClick={() => closeLefModal()}
                  >
                    x
                  </button>}
                </div>
                <div className="content-scroll">
                  <div className="assistance-container__form-section__table__info">
                    <Table>
                      <TableRow header>
                        <TableCell>Foto</TableCell>
                        <TableCell>Nombre</TableCell>
                        <TableCell>Cedula</TableCell>
                        <TableCell>Asociación</TableCell>
                      </TableRow>
                      <TableRow key={selectedBen.id}>
                        <TableCell>
                          <img
                            className="ben-foto-info"
                            src={selectedBen.photo_url}
                            alt="foto"
                          />
                        </TableCell>
                        <TableCell>
                          {selectedBen?.first_name} {selectedBen.second_name}{" "}
                          {selectedBen.first_last_name}{" "}
                          {selectedBen.second_last_name}
                        </TableCell>
                        <TableCell>{selectedBen?.identification}</TableCell>
                        <TableCell>{selectedBen?.association?.name}</TableCell>
                      </TableRow>
                    </Table>
                  </div>

                  {itemList.length > 0 && (
                    <div className="ratings-container__form-section__info">
                      <div className="panel-heading">
                        Articulos seguridos en valoraciones
                      </div>
                      <Card sx={{ width: 500, padding: 2 }}>
                        <Stack direction={"column"}>
                          {itemList.map((item, i) => {
                            return (
                              <Grid
                                container
                                spacing={2}
                                key={item.name + "_" + i}
                              >
                                <Grid item xs={5}>
                                  <FormLabel component="legend">
                                    {item.name}
                                  </FormLabel>
                                </Grid>
                                <Grid item xs={3}>
                                  <Button
                                    aria-label="reduce"
                                    className="btn-counter-action"
                                    onClick={() => removeCounter(i)}
                                    disabled={
                                      counters[i] === 0 || !isEmpty(deliveryId)
                                    }
                                  >
                                    <RemoveIcon fontSize="small" />
                                  </Button>
                                </Grid>
                                <Grid item xs={1}>
                                  <Typography
                                    variant="overline"
                                    display="block"
                                    gutterBottom
                                  >
                                    {counters[i]}
                                  </Typography>
                                </Grid>
                                <Grid item xs={3}>
                                  <Button
                                    aria-label="increase"
                                    className="btn-counter-action"
                                    onClick={() => addCounter(i)}
                                    disabled={
                                      counters[i] === 1 || !isEmpty(deliveryId)
                                    }
                                  >
                                    <AddIcon fontSize="small" />
                                  </Button>
                                </Grid>
                              </Grid>
                            );
                          })}
                        </Stack>
                      </Card>
                    </div>
                  )}
                </div>
                {!deliveryId && (
                  <SaveCancelControls
                    saveText="Guardar"
                    handleSave={() => saveDelivery()}
                  />
                )}
              </div>
            )}
          </div>
        </Paper>
        <Dialog open={openDialogMessage}>
          <DialogTitle>Advertencia</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {missingRequirements.length > 0 ? (
                <>
                  <h2>Requisitos necesarios para este beneficiario:</h2>
                  {missingRequirements.map(
                    (requitement: string, index: number) => {
                      return (
                        <p key={index}>
                          {index + 1}. {requitement}{" "}
                          <WarningIcon color="warning" />
                        </p>
                      );
                    }
                  )}
                </>
              ) : (
                ""
              )}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => handOpenDialogMessage()} color="primary">
              Aceptar
            </Button>
            <Button onClick={() => handOpenDialogRequirement()} color="primary">
              Ver requisitos
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openDialogRequeriment}>
          <DialogTitle>Requisitos</DialogTitle>
          <DialogContent>
            <DialogContentText>
              <p>
                1. Nivel de SISBEN: A1, A2, A3, A4, A5, B1, B2, B3, B4, B5, B6,
                B7, C1
              </p>
              <p>2. Tener sisben del Norte de Santander</p>
              <p>
                3. Tener regimen de salud Subsidiado o Cotizante beneficiario
              </p>
              <p>4. Mayor o igual a 60 años</p>
              <p>5. Tener soportes de EPS, SISBEN, Registraduría y Cédula</p>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => handOpenDialogRequirement()} color="primary">
              Aceptar
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openDialogConfirm}>
          <DialogTitle>Confirmar entrega</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {getItemsDetail().map((item, index) => {
                return (
                  <p>
                    {index + 1}. {item.item} -{" "}
                    {formatCurrencyNummber(item.value)}
                  </p>
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
      <Toast
        open={openToast}
        message={toastMsg}
        severity={SEVERITY_TOAST.ERROR}
        handleClose={() => setOpenToast(false)}
      />
    </>
  );
}

export default Delivery;
