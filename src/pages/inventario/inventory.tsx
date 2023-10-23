import { useEffect, useRef, useState } from "react";
import "./inventory.scss";
import {
  getAllItems,updateItem,createItem,deleteItem
} from "../../services/inventory.service";
import { Pagination, Stack, Typography } from "@mui/material";
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

function Inventory() {
  const itemRef = useRef(null);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentItem, setCurrentItem] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [toastGetItemsError, setToastGetItemsError] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [dataLastSearch, setDataLastSearch] = useState("");

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

  const updateData = async () => {
    if (itemRef.current !== null) {
      const item = (itemRef.current as any).getItem();
      await updateItem(item);
      setIsLoading(true);
      getItems();
    }
    setCurrentItem(null);
  };

  const saveData = async () => {
    if (itemRef.current !== null) {
      const item = (itemRef.current as any).getItem();
      await createItem(item);
      setIsLoading(true);
      getItems();
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

  return (
    <div className="inventary-container">
      <div className="inventary-container__actions">
        <div className="content-page-title">
          <Typography variant="h5" className="page-header">
            Administrar Items
          </Typography>
          <span className="page-subtitle">
            Aqui podrás gestionar los articulos (items) de las bodegas del sistema.
          </span>
        </div>
        <Modal
          className="btn-create"
          buttonText="Crear Item"
          title="Crear item"
          ref={modalRef}
          modalClose={onCloseModal}
          saveMethod={currentItem ? updateData : saveData}
          >
          <ItemForm currentItem={currentItem} ref={itemRef}></ItemForm>
        </Modal>
      </div>
      <div className="main-center-container">
        <div className="panel-heading">
          Listado de items
          <Search
            label="Buscar item"
            searchFunction={async (value: string) => {
              try {
                const { result } = await getAllItems(value);
                setDataLastSearch(value);
                const {data}=result.data;
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
                <TableCell>Acciones</TableCell>
              </TableRow>
              {items.length > 0 &&
                items.map((item: any, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>
                        {item.code}
                      </TableCell>
                      <TableCell>
                        {item.value}
                      </TableCell>
                      <TableCell>
                        <Stack
                          className="actions-cell"
                          direction="row"
                          spacing={3}
                        >
                          <EditIcon
                            className="action-item-icon action-item-icon-edit"
                            onClick={() => handleEditAction(item)}
                          ></EditIcon>
                          <ClearIcon
                            className="action-item-icon action-item-icon-delete"
                            onClick={() => handleDeleteAction(item)}
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
                  const { result } = await getAllItems(dataLastSearch, page);
                  const { data: items, totalPages } = result;
                  setItems(items);
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
          title="Eliminar item"
          bodyContent="¿Está seguro que desea eliminar este articulo?"
          mainBtnText="Confirmar"
          secondBtnText="Cancelar"
          mainBtnHandler={confirmDelete}
          secondBtnHandler={cancelDelete}
          open={openDialog}
        ></SimpleDialog>
      )}
    </div>
  );
}

export default Inventory;
