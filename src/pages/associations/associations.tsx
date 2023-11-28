import { useEffect, useRef, useState } from "react";
import Modal from "../../components/modal/modal";
import { SimpleDialog } from "../../components/dialog/dialog";
import { ERROR_MESSAGES } from "../../constants/errorMessageDictionary";
import { SEVERITY_TOAST } from "../../constants/severityToast";
import AssociationForm from "../../components/associationForm/associationForm";
import {
  createAssociation,
  deleteAssociation,
  getAssociationsList,
  updateAssociation,
} from "../../services/associations.service";
import ListView from "../../components/list-view/list-view";
import { useSelector } from "react-redux";
import { SECTIONS } from "../../constants/sections";
import { PERMISSIONS } from "../../constants/permissions";
import { checkPermissions } from "../../helpers/checkPermissions";
import SyncIcon from "@mui/icons-material/Sync";

function Associations() {
  const columnAndRowkeys = [
    { label: "Nombre", rowKey: "name" },
    { label: "Coordinador", rowKey: "coordinator_name" },
    { label: "Miembros", rowKey: "membersCount" },
  ];
  const associationRef = useRef(null);
  const modalRef = useRef(null);
  const [associations, setAssociations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentAssociation, setCurrentAssociation] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [dataLastSearch, setDataLastSearch] = useState("");
  const [toastGetAssociationsError, setToastGetAssociationsError] =
    useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const abilities = useSelector((state: any) => state.auth.user.abilities);

  useEffect(() => {
    getAssociations();
  }, []);

  const getAssociations = async (search?: string, page: number = 1) => {
    setIsLoading(true);
    try {
      const {
        result: { data },
      } = await getAssociationsList(search, page);
      setDataLastSearch(search);
      const { data: associationList, currentPage, totalPages } = data;
      setCurrentPage(currentPage);
      setAssociations(associationList);
      setTotalPages(totalPages);
      setIsLoading(false);
    } catch (error) {
      setAssociations([]);
      setIsLoading(false);
    }
  };

  const saveData = async () => {
    if (associationRef.current !== null) {
      let association = (associationRef.current as any).getAssociation();
      const { community } = association;
      association = {
        ...association,
        community: community._id,
      };
      await createAssociation(association);
      setIsLoading(true);
      getAssociations();
    }
    setCurrentAssociation(null);
  };

  const updateData = async () => {
    if (associationRef.current !== null) {
      let association = (associationRef.current as any).getAssociation();
      const { community } = association;
      association = {
        ...association,
        community: community._id ?? community.id,
      };
      await updateAssociation(association);
      setIsLoading(true);
      getAssociations();
    }
    setCurrentAssociation(null);
  };

  const onCloseModal = () => {
    setCurrentAssociation(null);
  };

  const handleEditAction = (association) => {
    setCurrentAssociation(association);
    (modalRef as any).current.handleClickOpen();
  };

  const handleDeleteAction = (association) => {
    setCurrentAssociation(association);
    setOpenDialog(true);
  };

  const confirmDelete = async () => {
    setIsLoading(true);
    setOpenDialog(false);
    await deleteAssociation((currentAssociation as any)._id);
    setCurrentAssociation(null);
    getAssociations();
  };

  const cancelDelete = () => {
    setCurrentAssociation(null);
    setOpenDialog(false);
  };

  const getPermission = (key) => {
    switch (key) {
      case "edit":
        return {
          subject: SECTIONS.ASSOCIATIONS,
          action: [PERMISSIONS.UPDATE],
        };
      case "delete":
        return {
          subject: SECTIONS.ASSOCIATIONS,
          action: [PERMISSIONS.DELETE],
        };
      case "create":
        return {
          subject: SECTIONS.ASSOCIATIONS,
          action: [PERMISSIONS.CREATE],
        };
    }
  };

  const getCreateButton = () => {
    return (
      <div className="create-button-section">
        <Modal
          className="btn-create"
          buttonText="Crear Asociacion"
          title="Crear asociacion"
          ref={modalRef}
          modalClose={onCloseModal}
          saveMethod={currentAssociation ? updateData : saveData}
        >
          <AssociationForm
            currentAssociation={currentAssociation}
            ref={associationRef}
          ></AssociationForm>
        </Modal>
        <SyncIcon
          onClick={() => {
            getAssociations();
          }}
          className="action-item-icon action-item-icon-edit"
        ></SyncIcon>
      </div>
    );
  };

  return (
    <>
      <ListView
        sectionTitle="Administrar Asociaciones"
        sectionDescription="Aquí podras gestionar las asociaciones del sistema."
        createButtonText="Crear asociaciones"
        listTitle="Listado de Asociaciones"
        openToast={false}
        toastMessage={ERROR_MESSAGES.GET_ACTIVITIES_ERROR}
        toastSeverity={SEVERITY_TOAST.ERROR}
        isLoading={isLoading}
        columnHeaders={columnAndRowkeys}
        listContent={associations}
        totalPages={totalPages}
        hanldeSearchFunction={(data) => getAssociations(data)}
        hanldeVoidInputFunction={() => getAssociations()}
        handleCloseToast={() => setToastGetAssociationsError(false)}
        handleEdit={(event) => handleEditAction(event)}
        handleDelete={(param) => handleDeleteAction(param)}
        handlePaginationChange={(data) => getAssociations("", data)}
        createButton={getCreateButton()}
        currentPage={currentPage}
        hasEdit={checkPermissions(getPermission("edit"), abilities)}
        hasDelete={checkPermissions(getPermission("delete"), abilities)}
        hasCreate={checkPermissions(getPermission("create"), abilities)}
        hasStats={false}
      />
      {openDialog && (
        <SimpleDialog
          title="Eliminar asociacion"
          bodyContent="¿Está seguro que desea eliminar esta asociacion?"
          mainBtnText="Confirmar"
          secondBtnText="Cancelar"
          mainBtnHandler={confirmDelete}
          secondBtnHandler={cancelDelete}
          open={openDialog}
        ></SimpleDialog>
      )}
    </>
  );
}

export default Associations;
