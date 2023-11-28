import { Button, Pagination, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { Table, TableCell, TableRow } from '../../components/table/table';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DoNotDisturbOffIcon from '@mui/icons-material/DoNotDisturbOff';
import { useEffect, useState } from 'react';
import LoadingComponent from '../../components/loading/loading';
import Search from '../../components/search/search';
import { getAllDeliveryByRep, updateDelivery } from '../../services/delivery.service';
import { SECTIONS } from '../../constants/sections';
import { PERMISSIONS } from '../../constants/permissions';
import { useSelector } from 'react-redux';
import { checkPermissions } from '../../helpers/checkPermissions';
import dayjs from "dayjs";
import { SimpleDialog } from '../../components/dialog/dialog';
import SyncIcon from "@mui/icons-material/Sync";



function RepDeliveryList() {
    const [delivery, setDelivery] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [dataLastSearch, setDataLastSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [openDialog, setOpenDialog] = useState(false);
    const [currentDelivery, setCurrentDelivery] = useState(null);
    const navigate = useNavigate();
    const abilities = useSelector((state: any) => state.auth.user.abilities);

    useEffect(() => {
        getDeliveryList();
    }, [])

    const getDeliveryList = async () => {
      setIsLoading(true);
        try {
          const { result } = await getAllDeliveryByRep();
          const { data: dataList, totalPages } = result.data;
          const mappedList = dataList.map((event) => {
            return {
              ...event,
              createdAt: dayjs(event.createdAt).format("L"),
            };
          });
          setDelivery(mappedList);
          setTotalPages(totalPages);
          setIsLoading(false);
        } catch (err) {
          setIsLoading(false);
        }
    }

    const handleClickOpen = (id?: string) => {
        const redirectTo = id ? `${ROUTES.DASHBOARD}/${ROUTES.REPRESENTATIVE_DELIVERY_DETAIL}/${id}` : `${ROUTES.DASHBOARD}/${ROUTES.REPRESENTATIVE_DELIVERY_DETAIL}`
        navigate(redirectTo);
    };

    const deleteFromlist = async (dev: string) => {
      setCurrentDelivery(dev);
      setOpenDialog(true);
    };

    const confirmDelete = async () => {
      setIsLoading(true);
      setOpenDialog(false);
      try {
        const response = await updateDelivery(currentDelivery._id);
        if (response.status === 200) {
          setCurrentDelivery(null);
          getDeliveryList();
        }
      } catch (error) {
        throw new Error("the beneficieary doesn't exist");
      } 
    };

    const cancelDelete = () => {
      setCurrentDelivery(null);
      setOpenDialog(false);
    };

    const getPermission = (key) => {
      switch(key) {
        case 'edit':
          return {
            subject: SECTIONS.DELIVERY,
            action: [PERMISSIONS.UPDATE],
          };
        case 'delete':
          return {
            subject: SECTIONS.DELIVERY,
            action: [PERMISSIONS.DELETE],
          };
          case 'create':
            return {
              subject: SECTIONS.DELIVERY,
              action: [PERMISSIONS.CREATE],
            };
      }
    }

    return (
        <div className="users-container">
          <div className="users-container__actions">
            <div className="content-page-title">
              <Typography variant="h5" className="page-header">
              Administrar entregas a representantes
              </Typography>
              <span className="page-subtitle">
                Aquí podras gestionar las entregas realizadas.
              </span>
            </div>
            { checkPermissions(getPermission('create'), abilities) && 
            <div className="create-button-section">
            <Button className="btn-create" onClick={() => handleClickOpen()}>
              Generar entrega
            </Button>
            <SyncIcon
              className="action-item-icon action-item-icon-edit"
              onClick={() => getDeliveryList()}
            />
          </div>
            }
          </div>
    
          <div className="main-center-container">
            <div className="panel-heading">
              Listado de entregas realizadas
              <Search
              label="Buscar beneficiario"
              searchFunction={async (data: string) => {
              try {
                const { result } = await getAllDeliveryByRep(data);
                setDataLastSearch(data);
                const { data: list, totalPages } = result;
                const mappedList = list.map((event) => {
                  return {
                    ...event,
                    createdAt: dayjs(event.createdAt).format("L"),
                  };
                });
                setTotalPages(totalPages);
                setDelivery(mappedList);
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
                    <TableCell>Representante</TableCell>
                    <TableCell>Asociación</TableCell>
                    <TableCell>Autor</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                  {delivery.map((dev: any) => {
                    return (
                      <TableRow key={dev._id}>
                        <TableCell>{dev?.event?.name}</TableCell>
                        <TableCell>{dev?.createdAt}</TableCell>
                        <TableCell>{dev?.representant?.name}</TableCell>
                        <TableCell>{dev?.beneficiary?.association ?? 'predeterminado'}</TableCell>
                        <TableCell>{dev?.author?.user_name}</TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={2}>
                            { checkPermissions(getPermission('edit'), abilities) && <VisibilityIcon
                              onClick={() => handleClickOpen(dev?._id)}
                              className="action-item-icon action-item-icon-edit"
                            ></VisibilityIcon>
                            }
                            { checkPermissions(getPermission('delete'), abilities) && <DoNotDisturbOffIcon
                              onClick={() =>
                                deleteFromlist(dev)
                              }
                              className="action-item-icon action-item-icon-delete"
                            ></DoNotDisturbOffIcon>
                            }
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
                      const { result } = await getAllDeliveryByRep(
                        dataLastSearch,
                        page
                      );
                      const { data: list, currentPage, totalPages } = result.data;
                      const mappedList = list.map((event) => {
                        return {
                          ...event,
                          createdAt: dayjs(event.createdAt).format("L"),
                        };
                      });
                      setCurrentPage(currentPage);
                      setDelivery(mappedList);
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
          title="Anular entrega"
          bodyContent="¿Está seguro que desea anular esta entrega?"
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

export default RepDeliveryList;