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
import { useNavigate } from "react-router-dom";
import "./beneficiariesList.scss";
import { ROUTES } from "../../constants/routes";
import { Table, TableCell, TableRow } from "../../components/table/table";
import EditIcon from "@mui/icons-material/Edit";
import ClearIcon from "@mui/icons-material/Clear";
import userImage from "../../assets/user.png";

import { useEffect, useState } from "react";
import {
  deleteBeneficiary,
  getBeneficiariesList,
} from "../../services/beneficiaries.service";
import LoadingComponent from "../../components/loading/loading";
import Search from "../../components/search/search";
import Toast from "../../components/toast/toast";
import { ERROR_MESSAGES } from "../../constants/errorMessageDictionary";
import { SEVERITY_TOAST } from "../../constants/severityToast";
import { SECTIONS } from "../../constants/sections";
import { PERMISSIONS } from "../../constants/permissions";
import { checkPermissions } from "../../helpers/checkPermissions";
import { useSelector } from "react-redux";
import { DetailView } from "../../components/detailView/detailView";
import SyncIcon from "@mui/icons-material/Sync";

function BeneficiariesList() {
  const [benfs, setBenfs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toastGetBeneficiariesError, setToastGetBeneficiariesError] =
    useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [dataLastSearch, setDataLastSearch] = useState("");
  const [benSelected, setBenSelected] = useState(null);
  const [openDialogDelete, setOpenDialogDelete] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const abilities = useSelector((state: any) => state.auth.user.abilities);
  const [targetBeneficiary, setTargetBeneficiary] = useState(false);
  const [displayDetail, setDisplayDetail] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getBenfs();
  }, []);

  const getBenfs = async () => {
    setIsLoading(true);
    try {
      const { result } = await getBeneficiariesList();
      const { data: benfsList, totalPages } = result;
      const mappedList = benfsList.map((beneficiary) => {
        return {
          ...beneficiary,
          identification: parseInt(
            beneficiary.identification,
            10
          ).toLocaleString("es-CO"),
        };
      });
      setBenfs(mappedList);
      setTotalPages(totalPages);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
    }
  };

  const handleClickOpen = (id?: string) => {
    const redirectTo = id
      ? `${ROUTES.DASHBOARD}/${ROUTES.BENEFICIARIES}/${id}`
      : `${ROUTES.DASHBOARD}/${ROUTES.BENEFICIARIES}`;
    navigate(redirectTo);
  };

  const deleteBeneficiaryFromList = async (id: string) => {
    try {
      const response = await deleteBeneficiary(id);
      if (response.status === 200) {
        getBenfs();
        setBenSelected(null);
        handlerOpenDialogDelete();
      }
    } catch (error) {
      throw new Error("the beneficieary doesn't exist");
    }
  };

  const handlerOpenDialogDelete = () => {
    setOpenDialogDelete(!openDialogDelete);
  };

  const selectBenToDelete = (e, ben: any) => {
    e.stopPropagation();
    setBenSelected(ben);
    handlerOpenDialogDelete();
  };

  const showDetail = (target) => {
    setTargetBeneficiary(target);
    setDisplayDetail(!displayDetail);
  };

  const closeDetail = () => {
    setTargetBeneficiary(null);
    setDisplayDetail(!displayDetail);
  };

  const getPermission = (key) => {
    switch (key) {
      case "edit":
        return {
          subject: SECTIONS.BENEFICIARY,
          action: [PERMISSIONS.UPDATE],
        };
      case "delete":
        return {
          subject: SECTIONS.BENEFICIARY,
          action: [PERMISSIONS.DELETE],
        };
      case "create":
        return {
          subject: SECTIONS.BENEFICIARY,
          action: [PERMISSIONS.CREATE],
        };
    }
  };

  return (
    <div className="users-container">
      <div className="users-container__actions">
        <div className="content-page-title">
          <Typography variant="h5" className="page-header">
            Administrar beneficiarios
          </Typography>
          <span className="page-subtitle">
            Aquí podras gestionar los beneficiarios del sistema.
          </span>
        </div>
        {checkPermissions(getPermission("create"), abilities) && (
          <div className="create-button-section">
            <Button className="btn-create" onClick={() => handleClickOpen()}>
              Crear Beneficiario
            </Button>
            <SyncIcon
              onClick={() => {
                getBenfs()
              }}
              className="action-item-icon action-item-icon-edit"
            ></SyncIcon>
          </div>
        )}
      </div>

      <div className="main-center-container">
        <div className="panel-heading">
          Listado de beneficiarios
          <Search
            label="Buscar beneficiario"
            searchFunction={async (data: string) => {
              try {
                const { result } = await getBeneficiariesList(data);
                setDataLastSearch(data);
                const { data: beneficiaries, totalPages } = result;
                setBenfs(beneficiaries);
                setTotalPages(totalPages);
              } catch (err) {
                setToastGetBeneficiariesError(true);
              }
            }}
            voidInputFunction={getBenfs}
          />
          <Toast
            open={toastGetBeneficiariesError}
            message={ERROR_MESSAGES.GET_BENEFICIARIES_ERROR}
            severity={SEVERITY_TOAST.ERROR}
            handleClose={() => setToastGetBeneficiariesError(false)}
          />
        </div>
        {isLoading ? (
          <LoadingComponent></LoadingComponent>
        ) : (
          <>
            <Table>
              <TableRow header>
                <TableCell>#</TableCell>
                <TableCell>Foto</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Cedula</TableCell>
                <TableCell>Asociación</TableCell>
                <TableCell>SISBEN</TableCell>
                <TableCell>Autor</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
              {benfs.map((beneficiary: any, i) => {
                return (
                  <TableRow
                    key={beneficiary._id}
                    handlerRowClick={() => showDetail(beneficiary)}
                  >
                    <TableCell>{i + 1 + (currentPage - 1) * 20}</TableCell>
                    <TableCell>
                      <img
                        className="ben-foto"
                        src={
                          beneficiary.photo_url
                            ? beneficiary.photo_url
                            : userImage
                        }
                        alt="foto"
                      />
                    </TableCell>
                    <TableCell>
                      {beneficiary?.first_name} {beneficiary.second_name}{" "}
                      {beneficiary.first_last_name}{" "}
                      {beneficiary.second_last_name}
                    </TableCell>
                    <TableCell>
                      <a className="id-link">{beneficiary?.identification}</a>
                    </TableCell>
                    <TableCell>{beneficiary?.association?.name}</TableCell>
                    <TableCell>{beneficiary?.sisben_score}</TableCell>
                    <TableCell>{beneficiary?.author?.name}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={2}>
                        {checkPermissions(getPermission("edit"), abilities) && (
                          <EditIcon
                            onClick={() => handleClickOpen(beneficiary?._id)}
                            className="action-item-icon action-item-icon-edit"
                          ></EditIcon>
                        )}
                        {checkPermissions(
                          getPermission("delete"),
                          abilities
                        ) && (
                          <ClearIcon
                            onClick={(e) => selectBenToDelete(e, beneficiary)}
                            className="action-item-icon action-item-icon-delete"
                          ></ClearIcon>
                        )}
                        {/*<VisibilityIcon
                          onClick={() => showDetail(beneficiary)}
                          className="action-item-icon action-item-icon-add"
                      ></VisibilityIcon>*/}
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
                  const { result } = await getBeneficiariesList(
                    dataLastSearch,
                    page
                  );
                  const { data: benfs, currentPage, totalPages } = result;
                  setBenfs(benfs);
                  setCurrentPage(currentPage);
                  setTotalPages(totalPages);
                } catch (err) {
                  setToastGetBeneficiariesError(true);
                }
              }}
            />
          </>
        )}
      </div>
      <Dialog open={openDialogDelete}>
        <DialogTitle>Mensaje</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿ Desea eliminar a este beneficiario ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handlerOpenDialogDelete()} color="primary">
            Cancelar
          </Button>
          <Button
            onClick={() => deleteBeneficiaryFromList(benSelected._id)}
            color="primary"
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {targetBeneficiary && (
        <DetailView
          beneficiary={targetBeneficiary}
          visible={displayDetail}
          onClose={closeDetail}
        />
      )}
    </div>
  );
}

export default BeneficiariesList;
