import { useEffect, useState } from "react";
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import LoadingComponent from "../../components/loading/loading";
import { Table, TableCell, TableRow } from "../../components/table/table";
import ClearIcon from "@mui/icons-material/Clear";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Search from "../../components/search/search";
import "./wineries.scss";
import { getAllItems } from "../../services/inventory.service";
import {
  createWinerie,
  getAllWineries,
  getWinerie,
  updateWinerie,
} from "../../services/winerie.service";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { typesWineries } from "../../constants/winerie";
import SaveCancelControls from "../../components/saveActionComponent/saveCancelControls";
import { formatCurrencyNummber } from "../../helpers/formatCurrencyNumber";

function Winerie() {
  //code
  const [winerie, setWinerie] = useState({
    _id: "",
    name: "",
    type: "",
    inventory: [],
    associated_winery: null,
  });
  const [wineries, setWineries] = useState([]);
  const [namesWineries, setNameWineries] = useState([]);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingItems, setIsLoadingItems] = useState(false);
  const [listItemSelected, setListItemSelected] = useState([]);
  const [currentItem, setCurrentItem] = useState(null);
  const [open, setOpen] = useState(false);
  const [openDialogMessage, setOpenDialogMessage] = useState(false);
  const navigate = useNavigate();
  const params = useParams();
  const [mesageDialog, setMessageDialog] = useState("");

  const [itemsWinerieMain, setItemsWinerieMain] = useState([]);
  const [itemSeletedWinerieMain, setItemSeletedWinerieMain] = useState(null);
  const [auxItemsWinerieMain, setAuxItemsWinerieMain] = useState([]);

  const update = async (e) => {
    e.preventDefault();
    if (winerie.type === typesWineries.SECUNDARIA) {
      const dataUpdate = {
        winerie,
        inventoryWinerieMain: itemsWinerieMain,
      };
      await updateWinerie(winerie._id, dataUpdate);
      resetChanges();
      navigate(`${ROUTES.DASHBOARD}/${ROUTES.WINERIES_LIST}`);
      return;
    }
    await updateWinerie(winerie._id, winerie);
    resetChanges();
    navigate(`${ROUTES.DASHBOARD}/${ROUTES.WINERIES_LIST}`);
  };

  const onSelectWinerie = (e, data) => {
    if (data) {
      const winerieFound = wineries.find((win) => win.name === data);
      if (winerieFound) {
        setWinerie({ ...winerie, associated_winery: winerieFound._id });
        setIsLoadingItems(true);
        setItemsWinerieMain(winerieFound.inventory);
        setAuxItemsWinerieMain(winerieFound.inventory);
        setIsLoadingItems(false);
        setListItemsSelected([]);
      }
    } else {
      setItemsWinerieMain([]);
      setListItemsSelected([]);
    }
  };

  const getNamesWineries = (data) => {
    const arrayNames: string[] = [];
    data.map((win) => {
      if (win.type === typesWineries.PRINCIPAL) {
        arrayNames.push(win.name);
      }
    });
    setNameWineries(arrayNames);
  };

  const handleRemoveAction = (index) => {
    setListItemSelected([
      ...listItemSelected.filter((item, indexItem) => indexItem !== index),
    ]);
    setWinerie({
      ...winerie,
      inventory: [
        ...winerie.inventory.filter((item, indexItem) => indexItem !== index),
      ],
    });
    const itemFound = listItemSelected.find(
      (item, indexItem) => indexItem === index
    );
    if (winerie.type === typesWineries.SECUNDARIA) {
      if (itemFound) {
        incrementAmount(itemFound.amount, itemFound._id);
      }
    }
  };

  const getWineries = async () => {
    setIsLoading(true);
    const response = await getAllWineries(null, 1, 100);
    setWineries(response.result.data.data);
    getNamesWineries(response.result.data.data);
  };

  const resetChanges = () => {
    setCurrentItem(null);
    setWinerie({
      _id: "",
      name: "",
      type: "",
      associated_winery: null,
      inventory: [],
    });
    setListItemSelected([]);
  };

  const saveWinerie = async (e) => {
    e.preventDefault();
    const winerieFound = wineries.find(
      (win) =>
        win.name.trim().toLowerCase() === winerie.name.trim().toLowerCase()
    );
    if (!winerieFound) {
      delete winerie._id;
      await createWinerie(winerie);
      resetChanges();
      navigate(`${ROUTES.DASHBOARD}/${ROUTES.WINERIES_LIST}`);
    } else {
      setMessageDialog("Nombre de bodega ya existente en el sistema");
      handlerOpenDialogMessage();
    }
  };

  const cancelAction = (e) => {
    e.preventDefault();
    navigate(`${ROUTES.DASHBOARD}/${ROUTES.WINERIES_LIST}`);
  };

  const handlerAmountItem = (e) => {
    setCurrentItem({ ...currentItem, amount: parseInt(e.target.value) });
  };

  const decrementAmount = (amountAdd, idItem) => {
    const listItemsWinerieMain = itemsWinerieMain;
    const itemFound = listItemsWinerieMain.find(
      (data) => data.item._id === idItem
    );
    const index = listItemsWinerieMain.indexOf(itemFound);
    listItemsWinerieMain[index].amount =
      listItemsWinerieMain[index].amount - amountAdd;
    setItemsWinerieMain([...listItemsWinerieMain]);
  };

  const incrementAmount = (amountAdd, idItem) => {
    const listItemsWinerieMain = itemsWinerieMain;
    const itemFound = listItemsWinerieMain.find(
      (data) => data.item._id === idItem
    );
    const index = listItemsWinerieMain.indexOf(itemFound);
    listItemsWinerieMain[index].amount =
      listItemsWinerieMain[index].amount + amountAdd;
    setItemsWinerieMain([...listItemsWinerieMain]);
  };

  const handleAddAction = async () => {
    if (currentItem.amount > 0) {
      if (itemSeletedWinerieMain) {
        if (currentItem.amount > itemSeletedWinerieMain.amount) {
          setMessageDialog("La cantidad ingresada es superior a la actual");
          handlerOpenDialogMessage();
          return;
        }
      }
      setOpen(false);
      setWinerie({
        ...winerie,
        inventory: [
          ...winerie.inventory,
          { amount: currentItem.amount, item: currentItem._id },
        ],
      });
      setListItemSelected([...listItemSelected, currentItem]);
      setItemSeletedWinerieMain(null);
      if (winerie.type === typesWineries.SECUNDARIA) {
        decrementAmount(currentItem.amount, currentItem._id);
      }
    }
  };

  const handlerOpenDialog = (item?: any) => {
    const itemFound = listItemSelected.find(
      (dataItem) => dataItem._id === item._id
    );
    if (!itemFound) {
      setCurrentItem({ ...item, amount: 0 });
      setOpen(!open);
    } else {
      setMessageDialog(
        "Este articulo ya existe en la tabla de articulos agregados"
      );
      handlerOpenDialogMessage();
    }
  };
  const handlerClosedDialog = () => {
    setOpen(false);
    setItemSeletedWinerieMain(null);
    setCurrentItem(null);
  };

  const handlerOpenDialogAddAmountItem = (data?: any) => {
    setItemSeletedWinerieMain(data);
    setCurrentItem({ ...data.item, amount: 0 });
    const itemRepet = listItemSelected.find(
      (dataItem) => dataItem._id === data.item._id
    );
    if (itemRepet) {
      setMessageDialog(
        "Este articulo ya existe en la tabla de articulos agregados"
      );
      handlerOpenDialogMessage();
      return;
    }
    setOpen(true);
  };

  const handlerOpenDialogMessage = () => {
    setOpenDialogMessage(!openDialogMessage);
  };

  const getItems = async () => {
    setIsLoading(true);
    try {
      const { result } = await getAllItems();
      const { data: itemList, totalPages } = result;
      setItems(itemList.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handlerForm = (e, data?: any) => {
    if (e.target.name === "name") {
      setWinerie({ ...winerie, name: e.target.value });
    } else {
      setWinerie({ ...winerie, type: data });
    }
  };

  const setListItemsSelected = (inventoryWinerieFound: any[]) => {
    const listItems = [];
    inventoryWinerieFound.map((data) => {
      listItems.push({ ...data.item, amount: data.amount, total: data.total });
    });
    setListItemSelected([...listItems]);
  };

  const getOneWinerie = async (id: string) => {
    try {
      setIsLoading(true);
      const dataResponse = await getWinerie(id);
      const winerieGet = dataResponse.result.data;
      if (winerieGet) {
        if (winerieGet.type === typesWineries.PRINCIPAL) {
          setWinerie(winerieGet);
          setListItemsSelected(winerieGet.inventory);
        } else {
          setNameWineries(wineries);
          const dataResponseWinerieMain = await getWinerie(
            winerieGet.associated_winery._id
          );
          const winerieMainFound = dataResponseWinerieMain.result.data;
          winerieGet.associated_winery = winerieMainFound;
          setListItemsSelected(winerieGet.inventory);
          setWinerie(winerieGet);
          setItemsWinerieMain(winerieMainFound.inventory);
          setAuxItemsWinerieMain(winerieMainFound.inventory);
        }
      }
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      navigate(`${ROUTES.DASHBOARD}/${ROUTES.WINERIES_LIST}`);
    }
  };

  const searchItemInventoryWinerieMain = (value: string) => {
    const listItemsInventory = itemsWinerieMain;
    const filter = listItemsInventory.filter(
      (data) =>
        data.item.name.toLowerCase().includes(value.trim()) ||
        data.item.code === value.trim()
    );
    setItemsWinerieMain([...filter]);
  };

  useEffect(() => {
    getItems();
    getWineries();
    if (params.winerieId) {
      getWineries();
      getOneWinerie(params.winerieId);
    }
  }, []);

  return isLoading ? (
    <LoadingComponent></LoadingComponent>
  ) : (
    <>
      <section className="winerie-container">
        <header className="assistance-container__actions">
          <div className="content-page-title">
            <Typography variant="h5" className="page-header">
              {params.winerieId !== undefined
                ? "Editar bodega"
                : "Crear bodega"}
            </Typography>
            <span className="page-subtitle">
              {params.winerieId !== undefined
                ? "Editar bodega y añadir nuevos articulos."
                : "Crear bodega y añadir articulos."}
            </span>
          </div>
        </header>

        <Paper elevation={1} className="assistance-container__form-section">
          <Stack direction="row" spacing={4}>
            <TextField
              className="login-view__login-form__form-container__input"
              id="name__winerie"
              name="name"
              placeholder="Nombre"
              type="text"
              label="Nombre de bodega"
              onChange={(e) => handlerForm(e)}
              value={winerie?.name || ""}
              key="winerie-input"
            />
            <FormControl sx={{ width: 300 }}>
              {params.winerieId !== undefined ? (
                <Autocomplete
                  disablePortal
                  id="demo-simple-select"
                  options={[]}
                  sx={{ width: 300 }}
                  readOnly
                  value={winerie?.type || ""}
                  renderInput={(params) => (
                    <TextField {...params} label="Tipo de bodega" />
                  )}
                  onChange={handlerForm}
                />
              ) : (
                <Autocomplete
                  disablePortal
                  id="demo-simple-select"
                  options={[typesWineries.PRINCIPAL, typesWineries.SECUNDARIA]}
                  sx={{ width: 300 }}
                  value={winerie?.type || ""}
                  renderInput={(params) => (
                    <TextField {...params} label="Tipo de bodega" />
                  )}
                  onChange={handlerForm}
                />
              )}
            </FormControl>
            {winerie.type === typesWineries.PRINCIPAL ||
            winerie.type === "" ||
            winerie.type === null ? (
              ""
            ) : params.winerieId !== undefined ? (
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                defaultValue={winerie?.associated_winery?.name}
                options={namesWineries}
                readOnly
                sx={{ width: 300 }}
                renderInput={(params) => (
                  <TextField {...params} label="Asociar bodega" />
                )}
                onChange={onSelectWinerie}
              />
            ) : (
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                defaultValue={winerie?.associated_winery?.name}
                options={namesWineries}
                sx={{ width: 300 }}
                renderInput={(params) => (
                  <TextField {...params} label="Asociar bodega" />
                )}
                onChange={onSelectWinerie}
              />
            )}
          </Stack>
          {winerie.type === typesWineries.PRINCIPAL ? (
            <>
              <div className="panel-heading">
                Resultados de la busqueda
                <Search
                  label="Buscar articulo"
                  searchFunction={async (value: string) => {
                    try {
                      const { result } = await getAllItems(value);
                      const { data } = result.data;
                      setItems(data);
                    } catch (err) {}
                  }}
                  voidInputFunction={getItems}
                />
              </div>
              <div className="assistance-container__form-section__table">
                <Table>
                  <TableRow header>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Código</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell>value</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                  {items.length > 0 ? (
                    items.map((item: any, index) => {
                      return (
                        <TableRow key={index}>
                          <TableCell>{item?.name}</TableCell>
                          <TableCell>{item?.code}</TableCell>
                          <TableCell>{item.isDefault ? 'Predeterminado' : item.associationItem ? 'De asociación'  : 'De Valoración'}</TableCell>
                          <TableCell>{formatCurrencyNummber(item?.value)}</TableCell>
                          <TableCell>
                            <Stack
                              className="actions-cell"
                              direction="row"
                              spacing={2}
                            >
                              <AddCircleIcon
                                className="action-item-icon action-item-icon-add"
                                onClick={() => handlerOpenDialog(item)}
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
              <div className="panel-heading">
                Listado de items (articulos) agregados
              </div>
              <div className="assistance-container__form-section__table">
                <Table>
                  <TableRow header>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Código</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell>value</TableCell>
                    <TableCell>Cantidad</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                  {listItemSelected.map((item: any, index) => {
                    return (
                      <TableRow key={index}>
                        <TableCell>{item?.name}</TableCell>
                        <TableCell>{item?.code}</TableCell>
                        <TableCell>{item.isDefault ? 'Predeterminado' : item.associationItem ? 'De asociación'  : 'De Valoración'}</TableCell>
                        <TableCell>{formatCurrencyNummber(item?.value)}</TableCell>
                        <TableCell>{item?.amount}</TableCell>

                        <TableCell>
                          <Stack
                            className="actions-cell"
                            direction="row"
                            spacing={2}
                          >
                            <ClearIcon
                              className="action-item-icon action-item-icon-delete"
                              onClick={() => handleRemoveAction(index)}
                            ></ClearIcon>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </Table>
              </div>
            </>
          ) : winerie.type === typesWineries.SECUNDARIA &&
            itemsWinerieMain.length > 0 ? (
            <>
              {isLoadingItems ? (
                <LoadingComponent></LoadingComponent>
              ) : (
                <>
                  <div className="assistance-container__form-section__table">
                    <div className="panel-heading">
                      Items (articulos) de la bodega asociada
                      <Search
                        label="Buscar articulo"
                        searchFunction={async (value: string) => {
                          try {
                            searchItemInventoryWinerieMain(value);
                          } catch (err) {}
                        }}
                        voidInputFunction={() =>
                          setItemsWinerieMain([...auxItemsWinerieMain])
                        }
                      />
                    </div>
                    <Table>
                      <TableRow header>
                        <TableCell>Nombre</TableCell>
                        <TableCell>Código</TableCell>
                        <TableCell>value</TableCell>
                        <TableCell>Cantidad</TableCell>
                        <TableCell>Restantes</TableCell>
                        <TableCell>Acciones</TableCell>
                      </TableRow>
                      {itemsWinerieMain.length > 0 ? (
                        itemsWinerieMain.map((data: any, index) => {
                          return (
                            <TableRow key={index}>
                              <TableCell>{data.item?.name}</TableCell>
                              <TableCell>{data.item?.code}</TableCell>
                              <TableCell>{formatCurrencyNummber(data.item?.value)}</TableCell>
                              <TableCell>{data?.total}</TableCell>
                              <TableCell>{data?.amount}</TableCell>
                              <TableCell>
                                <Stack
                                  className="actions-cell"
                                  direction="row"
                                  spacing={2}
                                >
                                  <AddCircleIcon
                                    className="action-item-icon action-item-icon-add"
                                    onClick={() =>
                                      handlerOpenDialogAddAmountItem(data)
                                    }
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
                  <div className="assistance-container__form-section__table">
                    <div className="panel-heading">
                      Listado de items (articulos) agregados de la bodega
                      asociada
                      <div></div>
                    </div>
                    <Table>
                      <TableRow header>
                        <TableCell>Nombre</TableCell>
                        <TableCell>Código</TableCell>
                        <TableCell>Valor</TableCell>
                        <TableCell>Cantidad</TableCell>
                        <TableCell>Restantes</TableCell>
                        <TableCell>Acciones</TableCell>
                      </TableRow>
                      {listItemSelected.map((item: any, index) => {
                        return (
                          <TableRow key={index}>
                            <TableCell>{item?.name}</TableCell>
                            <TableCell>{item?.code}</TableCell>
                            <TableCell>{formatCurrencyNummber(item.value)}</TableCell>
                            <TableCell>{item?.total}</TableCell>
                            <TableCell>{item?.amount}</TableCell>

                            <TableCell>
                              <Stack
                                className="actions-cell"
                                direction="row"
                                spacing={2}
                              >
                                <ClearIcon
                                  className="action-item-icon action-item-icon-delete"
                                  onClick={() => handleRemoveAction(index)}
                                ></ClearIcon>
                              </Stack>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </Table>
                  </div>
                </>
              )}
            </>
          ) : (
            ""
          )}

          <Dialog open={open}>
            <DialogTitle>Cantidad</DialogTitle>
            <DialogContent>
              <DialogContentText>Introduce una cantidad</DialogContentText>
              <DialogContentText>
                {itemSeletedWinerieMain && itemSeletedWinerieMain.amount > 0
                  ? `Cantidad disponible : ${itemSeletedWinerieMain.amount}`
                  : ""}
              </DialogContentText>
              <br></br>
              <TextField
                autoFocus
                margin="dense"
                id="input"
                name="amount"
                label="Cantidad"
                type="number"
                fullWidth
                onInput={(e) => handlerAmountItem(e)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => handlerClosedDialog()} color="primary">
                Cancelar
              </Button>
              <Button onClick={() => handleAddAction()} color="primary">
                Guardar
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog open={openDialogMessage}>
            <DialogTitle>Mensaje</DialogTitle>
            <DialogContent>
              <DialogContentText>{mesageDialog}</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => handlerOpenDialogMessage()}
                color="primary"
              >
                Aceptar
              </Button>
            </DialogActions>
          </Dialog>
        </Paper>
        {/* <Stack direction="row" spacing={4}>
                        <Button
                        className="btn-cancel-winerie"
                        onClick={(e) => cancelAction(e) }
                        >
                        Cancelar
                        </Button>
                        
                        <Button
                        className="btn-save-winerie"
                        onClick={(e) => params.winerieId!==undefined ? update(e) :saveWinerie(e) }
                        >
                        Guardar
                        </Button>
                    </Stack> */}
      </section>
      <SaveCancelControls
        saveText="Guardar"
        cancelText="Cancelar"
        handleSave={(e) => params.winerieId!==undefined ? update(e) :saveWinerie(e)}
        hanldeCancel={(e) => cancelAction(e)}
      />
    </>
  );
}

export default Winerie;
