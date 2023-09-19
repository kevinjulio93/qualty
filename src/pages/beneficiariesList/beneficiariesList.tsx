import { Button, Pagination, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./beneficiariesList.scss";
import { ROUTES } from "../../constants/routes";
import { Table, TableCell, TableRow } from "../../components/table/table";
import EditIcon from "@mui/icons-material/Edit";
import ClearIcon from "@mui/icons-material/Clear";
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

function BeneficiariesList() {
  const [benfs, setBenfs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toastGetBeneficiariesError, setToastGetBeneficiariesError] =
    useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [dataLastSearch, setDataLastSearch] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    getBenfs();
  }, []);

  const getBenfs = async () => {
    setIsLoading(true);
    try {
      const { result } = await getBeneficiariesList();
      const { data: benfsList, totalPages } = result;
      setBenfs(benfsList);
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
        console.log("deleted successfully");
      }
    } catch (error) {
      throw new Error("the beneficieary doesn't exist");
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
            Aqui podras gestionar los beneficiarios del sistema.
          </span>
        </div>
        <Button className="btn-create" onClick={() => handleClickOpen()}>
          Crear Beneficiario
        </Button>
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
                const { data: beneficiaries } = result;
                setBenfs(beneficiaries);
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
                <TableCell>Foto</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Cedula</TableCell>
                <TableCell>Asociación</TableCell>
                <TableCell>EPS</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
              {benfs.map((beneficiary: any) => {
                return (
                  <TableRow key={beneficiary._id}>
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
                    <TableCell>{beneficiary?.association?.name}</TableCell>
                    <TableCell>{beneficiary?.eps?.name}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={2}>
                        <EditIcon
                          onClick={() => handleClickOpen(beneficiary?._id)}
                          className="action-item-icon action-item-icon-edit"
                        ></EditIcon>

                        <ClearIcon
                          onClick={() =>
                            deleteBeneficiaryFromList(beneficiary?._id)
                          }
                          className="action-item-icon action-item-icon-delete"
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
                  const { result } = await getBeneficiariesList(
                    dataLastSearch,
                    page
                  );
                  const { data: benfs, totalPages } = result;
                  setBenfs(benfs);
                  setTotalPages(totalPages);
                } catch (err) {
                  setToastGetBeneficiariesError(true);
                }
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default BeneficiariesList;
