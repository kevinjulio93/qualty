import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Pagination, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { Table, TableCell, TableRow } from '../../components/table/table';
import EditIcon from '@mui/icons-material/Edit';
import ClearIcon from '@mui/icons-material/Clear';
import { useEffect, useState } from 'react';
import LoadingComponent from '../../components/loading/loading';
import Search from '../../components/search/search';
import { getAllPhysicalDelivery,deletePhysicalDelivery } from '../../services/physicalDelivery.service';
import { useSelector } from 'react-redux';
import { SECTIONS } from '../../constants/sections';
import { PERMISSIONS } from '../../constants/permissions';
import { checkPermissions } from '../../helpers/checkPermissions';


function PhysicalDeliveryList() {
    const [physicalDeliveryList, setPhysicalDeliveryList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [dataLastSearch, setDataLastSearch] = useState("");
    const [deliverySeleted,setDeliverySeleted]=useState(null);
    const [openDialogMessage,setOpenDialogMessage]=useState(false);
    const [messageDialog,setMessageDialog]=useState("");
    const navigate = useNavigate();
    const abilities = useSelector((state: any) => state.auth.user.abilities);

    useEffect(() => {
        getDeliveryList();
    }, [])

    const getDeliveryList = async () => {
      setIsLoading(true);
        try {
          const { result } = await getAllPhysicalDelivery();
          const { data: dataList, totalPages } = result.data;
          setPhysicalDeliveryList(dataList);
          setTotalPages(totalPages);
          setIsLoading(false);
        } catch (err) {
          setIsLoading(false);
        }
    }

    const handleClickOpen = (id?: string) => {
        const redirectTo = id ? `${ROUTES.DASHBOARD}/${ROUTES.PHYSICAL_DELIVERY}/${id}` : `${ROUTES.DASHBOARD}/${ROUTES.PHYSICAL_DELIVERY}`
        navigate(redirectTo);
    };

    const deleteFromlist = async (id: string) => {
      try {
        const response = await deletePhysicalDelivery(id);
        if (response.status === 200) {
            getDeliveryList();
        }
      } catch (error) {
        setMessageDialog("Error al eliminar este registro");
        handDialogMessage();
      }
      handDialogMessage();
      setDeliverySeleted(null);
    };

    const handDialogMessage=()=>{
      setOpenDialogMessage(!openDialogMessage);
    }

    const handOpenDialogMessage=(delivery:any)=>{
      setDeliverySeleted(delivery);
      setMessageDialog("¿ Desea eliminar este registro ?");
      setOpenDialogMessage(!openDialogMessage);
    }

    const searchPhysicalDelivery=(data:string)=>{
      const deliveriesFound=physicalDeliveryList.filter((delivery)=>delivery?.event?.name.toLowerCase().includes(data.toLowerCase().trim()) || delivery?.author?.name.toLowerCase().includes(data.toLowerCase().trim()));
      setPhysicalDeliveryList(deliveriesFound);
    }

    const getPermission = (key) => {
      switch(key) {
        case 'edit':
          return {
            subject: SECTIONS.PHYSICAL_DELIVERY,
            action: [PERMISSIONS.UPDATE],
          };
        case 'delete':
          return {
            subject: SECTIONS.PHYSICAL_DELIVERY,
            action: [PERMISSIONS.DELETE],
          };
          case 'create':
            return {
              subject: SECTIONS.PHYSICAL_DELIVERY,
              action: [PERMISSIONS.CREATE],
            };
      }
    }

    return (
        <div className="users-container">
          <div className="users-container__actions">
            <div className="content-page-title">
              <Typography variant="h5" className="page-header">
                Administrar ordenes
              </Typography>
              <span className="page-subtitle">
                Aqui podrás gestionar las entregas que fueron realizadas fisicamente.
              </span>
            </div>
            { checkPermissions(getPermission('create'), abilities) && <Button className="btn-create" onClick={() => handleClickOpen()}>
              Generar orden
            </Button>
            }
          </div>
    
          <div className="main-center-container">
            <div className="panel-heading">
              Listado de ordenes realizadas
              <Search
              label="Buscar beneficiario"
              searchFunction={async (data: string) => {
              try {
                searchPhysicalDelivery(data);
              } catch (err) {
                console.error(err)
              }
            }}
            voidInputFunction={getDeliveryList}
          />
            </div>
            {isLoading ? (
              <LoadingComponent></LoadingComponent>
            ) : (
              <>
                <Table>
                  <TableRow header>
                    <TableCell>Evento</TableCell>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Autor</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                  {physicalDeliveryList.map((delivery: any) => {
                    return (
                      <TableRow key={delivery._id}>
                        <TableCell>{delivery?.event?.name}</TableCell>
                        <TableCell>{delivery?.createdAt}</TableCell>
                        <TableCell>{delivery?.author?.name}</TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={2}>
                            { checkPermissions(getPermission('edit'), abilities) && <EditIcon
                              onClick={() => handleClickOpen(delivery?._id)}
                              className="action-item-icon action-item-icon-edit"
                            ></EditIcon>
                            }
    
                            { checkPermissions(getPermission('delete'), abilities) && <ClearIcon
                              onClick={() =>
                                handOpenDialogMessage(delivery)
                              }
                              className="action-item-icon action-item-icon-delete"
                            ></ClearIcon>
                            }
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
                      const { result } = await getAllPhysicalDelivery(
                        dataLastSearch,
                        page
                      );
                      const { data: deliveries, totalPages } = result;
                      setPhysicalDeliveryList(deliveries);
                      setTotalPages(totalPages);
                    } catch (err) {
                      console.error(err);
                    }
                  }}
                />
              </>
            )}
             <Dialog open={openDialogMessage} >
                <DialogTitle>Mensaje</DialogTitle>
                <DialogContent>
                <DialogContentText>
                    {messageDialog}
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={()=>handDialogMessage()} color="primary">
                    Cancelar
                </Button>
                <Button onClick={()=>deleteFromlist(deliverySeleted?._id)} color="primary">
                    Eliminar
                </Button>
                </DialogActions>
            </Dialog>
          </div>
        </div>
      );
}

export default PhysicalDeliveryList;