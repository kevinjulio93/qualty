import { useEffect, useRef, useState } from "react";
import "./inventory.scss";
import {
  getAllItems,
  updateItem,
  createItem,
  deleteItem,
} from "../../services/inventory.service";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Pagination,
  Stack,
  Typography,
} from "@mui/material";
import Modal from "../../components/modal/modal";
import { Table, TableCell, TableRow } from "../../components/table/table";
import EditIcon from "@mui/icons-material/Edit";
import ClearIcon from "@mui/icons-material/Clear";
import LoadingComponent from "../../components/loading/loading";
import ItemForm from "../../components/inventory/itemForm";
import { SimpleDialog } from "../../components/dialog/dialog";
import Search from "../../components/search/search";
import Toast from "../../components/toast/toast";
import { ERROR_MESSAGES } from "../../constants/errorMessageDictionary";
import { SEVERITY_TOAST } from "../../constants/severityToast";
import { useSelector } from "react-redux";
import { SECTIONS } from "../../constants/sections";
import { PERMISSIONS } from "../../constants/permissions";
import { checkPermissions } from "../../helpers/checkPermissions";
import { formatCurrencyNummber } from "../../helpers/formatCurrencyNumber";
import SyncIcon from "@mui/icons-material/Sync";

function Inventory() {
  const itemRef = useRef(null);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentItem, setCurrentItem] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [toastGetItemsError, setToastGetItemsError] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [dataLastSearch, setDataLastSearch] = useState("");
  const [openDialogMessage, setOpenDialogMessage] = useState(false);
  const [messageDialog, setMessageDialog] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const abilities = useSelector((state: any) => state.auth.user.abilities);
  const [forceRender, setForceRender] = useState(+new Date());

  const modalRef = useRef(null);

  useEffect(() => {
    getItems();
  }, []);

  const getItems = async () => {
    setIsLoading(true);
    try {
      const { result } = await getAllItems();
      const { data: itemList, totalPages } = result;
      setItems(itemList.data);
      setTotalPages(totalPages);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const onCloseModal = () => {
    setCurrentItem(null);
  };

  const isValidUpdate = (dataNewItem) => {
    const filterItems = items.filter(
      (item) => currentItem.name !== item.name && currentItem.code !== item.code
    );
    const itemFound = filterItems.find(
      (item) =>
        dataNewItem.name.trim().toLowerCase() === item.name ||
        dataNewItem.code.trim().toLowerCase() === item.code
    );
    if (!itemFound) {
      return true;
    }
    return false;
  };

  const updateData = async () => {
    if (itemRef.current !== null) {
      const item = (itemRef.current as any).getItem();
      if (isValidUpdate(item)) {
        await updateItem(item);
        setIsLoading(true);
        getItems();
      } else {
        setMessageDialog("Ya existe un artículo con los datos ingresados");
        handOpenDialogMessage();
      }
    }
    setCurrentItem(null);
  };

  const saveData = async () => {
    if (itemRef.current !== null) {
      const item = (itemRef.current as any).getItem();
      const itemFound = items.find(
        (it) =>
          it.name.trim().toLowerCase() === item.name.trim().toLowerCase() ||
          it.code.trim().toLowerCase() === item.code.trim().toLowerCase()
      );
      if (itemFound) {
        setMessageDialog("Artículo ya existente en el sistema");
        handOpenDialogMessage();
      } else {
        await createItem(item);
        setIsLoading(true);
        getItems();
      }
    }
    setCurrentItem(null);
  };

  const handleEditAction = (item) => {
    setCurrentItem(item);
    (modalRef as any).current.handleClickOpen();
  };

  const handleDeleteAction = (item) => {
    setCurrentItem(item);
    setOpenDialog(true);
  };

  const confirmDelete = async () => {
    setIsLoading(true);
    setOpenDialog(false);
    await deleteItem(currentItem._id);
    setCurrentItem(null);
    getItems();
  };

  const cancelDelete = () => {
    setCurrentItem(null);
    setOpenDialog(false);
  };

  const handOpenDialogMessage = () => {
    setOpenDialogMessage(!openDialogMessage);
  };

  const getPermission = (key) => {
    switch (key) {
      case "edit":
        return {
          subject: SECTIONS.INVENTORY,
          action: [PERMISSIONS.UPDATE],
        };
      case "delete":
        return {
          subject: SECTIONS.INVENTORY,
          action: [PERMISSIONS.DELETE],
        };
      case "create":
        return {
          subject: SECTIONS.INVENTORY,
          action: [PERMISSIONS.CREATE],
        };
    }
  };

  return (
    <div className="inventary-container">
      <div className="inventary-container__actions">
        <div className="content-page-title">
          <Typography variant="h5" className="page-header">
            Administrar artículos
          </Typography>
          <span className="page-subtitle">
            Aqui podrás gestionar los artículos de las bodegas del sistema.
          </span>
        </div>
        {checkPermissions(getPermission("create"), abilities) && (
          <div className="create-button-section">
            <Modal
              className="btn-create"
              buttonText="Crear artículo"
              title="Crear artículo"
              ref={modalRef}
              modalClose={onCloseModal}
              saveMethod={currentItem ? updateData : saveData}
            >
              <ItemForm currentItem={currentItem} ref={itemRef}></ItemForm>
            </Modal>
            <SyncIcon
              onClick={() => {
                getItems()
              }}
              className="action-item-icon action-item-icon-edit"
            ></SyncIcon>
          </div>
        )}
      </div>
      <div className="main-center-container">
        <div className="panel-heading">
          Listado de artículos
          <Search
            label="Buscar artículo"
            searchFunction={async (value: string) => {
              try {
                const { result } = await getAllItems(value);
                setDataLastSearch(value);
                const { data } = result.data;
                setItems(data);
              } catch (err) {
                setToastGetItemsError(true);
              }
            }}
            voidInputFunction={getItems}
          />
          <Toast
            open={toastGetItemsError}
            message={ERROR_MESSAGES.GET_ITEMS_ERROR}
            severity={SEVERITY_TOAST.ERROR}
            handleClose={() => setToastGetItemsError(false)}
          />
        </div>
        {isLoading ? (
          <LoadingComponent></LoadingComponent>
        ) : (
          <>
            <Table>
              <TableRow header>
                <TableCell>Nombre</TableCell>
                <TableCell>Código</TableCell>
                <TableCell>Valor</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
              {items.length > 0 &&
                items.map((item: any, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.code}</TableCell>
                      <TableCell>{formatCurrencyNummber(item.value)}</TableCell>
                      <TableCell>
                        {item.isDefault
                          ? "Predeterminado"
                          : item.associationItem
                          ? "De asociación"
                          : "De Valoración"}
                      </TableCell>
                      <TableCell>
                        <Stack
                          className="actions-cell"
                          direction="row"
                          spacing={3}
                        >
                          {checkPermissions(
                            getPermission("edit"),
                            abilities
                          ) && (
                            <EditIcon
                              className="action-item-icon action-item-icon-edit"
                              onClick={() => handleEditAction(item)}
                            ></EditIcon>
                          )}
                          {checkPermissions(
                            getPermission("delete"),
                            abilities
                          ) && (
                            <ClearIcon
                              className="action-item-icon action-item-icon-delete"
                              onClick={() => handleDeleteAction(item)}
                            ></ClearIcon>
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </Table>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={async (_, page) => {
                try {
                  const { result } = await getAllItems(dataLastSearch, page);
                  const { data: items, totalPages } = result;
                  const { currentPage: currentPageAfterSearch } = items;
                  if (currentPage !== currentPageAfterSearch) {
                    setCurrentPage(currentPageAfterSearch);
                  }
                  setItems(items.data);
                  setTotalPages(totalPages);
                } catch (err) {
                  setToastGetItemsError(true);
                }
              }}
            />
          </>
        )}
      </div>

      {openDialog && (
        <SimpleDialog
          title="Eliminar artículo"
          bodyContent="¿Está seguro que desea eliminar este artículo?"
          mainBtnText="Confirmar"
          secondBtnText="Cancelar"
          mainBtnHandler={confirmDelete}
          secondBtnHandler={cancelDelete}
          open={openDialog}
        ></SimpleDialog>
      )}
      <Dialog open={openDialogMessage}>
        <DialogTitle>Advertencia</DialogTitle>
        <DialogContent>
          <DialogContentText>{messageDialog}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handOpenDialogMessage()} color="primary">
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Inventory;
