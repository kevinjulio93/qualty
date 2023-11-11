import { Button, Pagination, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { Table, TableCell, TableRow } from '../../components/table/table';
import EditIcon from '@mui/icons-material/Edit';
import ClearIcon from '@mui/icons-material/Clear';
import { useEffect, useState } from 'react';
import LoadingComponent from '../../components/loading/loading';
import Search from '../../components/search/search';
import { deleteDelivery, getAllDelivery } from '../../services/delivery.service';
import { SECTIONS } from '../../constants/sections';
import { PERMISSIONS } from '../../constants/permissions';
import { useSelector } from 'react-redux';
import { checkPermissions } from '../../helpers/checkPermissions';
import dayjs from "dayjs";



function DeliveryList() {
    const [delivery, setDelivery] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [dataLastSearch, setDataLastSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();
    const abilities = useSelector((state: any) => state.auth.user.abilities);

    useEffect(() => {
        getDeliveryList();
    }, [])

    const getDeliveryList = async () => {
      setIsLoading(true);
        try {
          const { result } = await getAllDelivery();
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
        const redirectTo = id ? `${ROUTES.DASHBOARD}/${ROUTES.DELIVERY}/${id}` : `${ROUTES.DASHBOARD}/${ROUTES.DELIVERY}`
        navigate(redirectTo);
    };

    const deleteFromlist = async (id: string) => {
      try {
        const response = await deleteDelivery(id);
        if (response.status === 200) {
            getDeliveryList();
        }
      } catch (error) {
        throw new Error("the beneficieary doesn't exist");
      }
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
                Administrar entregas
              </Typography>
              <span className="page-subtitle">
                Aquí podras gestionar las entregas realizadas.
              </span>
            </div>
            { checkPermissions(getPermission('create'), abilities) && <Button className="btn-create" onClick={() => handleClickOpen()}>
              Generar entrega
            </Button>
            }
          </div>
    
          <div className="main-center-container">
            <div className="panel-heading">
              Listado de entregas realizadas
              <Search
              label="Buscar beneficiario"
              searchFunction={async (data: string) => {
              try {
                const { result } = await getAllDelivery(data);
                setDataLastSearch(data);
                const { data: list } = result;
                const mappedList = list.map((event) => {
                  return {
                    ...event,
                    createdAt: dayjs(event.createdAt).format("L"),
                  };
                });
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
                    <TableCell>Beneficiario</TableCell>
                    <TableCell>Autor</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                  {delivery.map((dev: any) => {
                    return (
                      <TableRow key={dev._id}>
                        <TableCell>{dev?.event?.name}</TableCell>
                        <TableCell>{dev?.createdAt}</TableCell>
                        <TableCell>{dev?.beneficiary?.first_name} {dev?.beneficiary?.first_last_name}</TableCell>
                        <TableCell>{dev?.author?.user_name}</TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={2}>
                            { checkPermissions(getPermission('edit'), abilities) && <EditIcon
                              onClick={() => handleClickOpen(dev?._id)}
                              className="action-item-icon action-item-icon-edit"
                            ></EditIcon>
                            }
                            { checkPermissions(getPermission('delete'), abilities) && <ClearIcon
                              onClick={() =>
                                deleteFromlist(dev?._id)
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
                  page={currentPage}
                  onChange={async (_, page) => {
                    try {
                      const { result } = await getAllDelivery(
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
        </div>
      );
}

export default DeliveryList;