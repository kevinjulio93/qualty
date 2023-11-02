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

function Associations() {
  const columnAndRowkeys = [
    { label: 'Nombre', rowKey: 'name' }, 
    { label: 'Coordinador', rowKey: 'coordinator_name' }, 
    { label: 'Miembros', rowKey: 'membersCount' }
  ];
  const associationRef = useRef(null);
  const modalRef = useRef(null);
  const [associations, setAssociations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentAssociation, setCurrentAssociation] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [dataLastSearch, setDataLastSearch] = useState("");
  const [toastGetAssociationsError, setToastGetAssociationsError] = useState(false);

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
      const { data: associationList, totalPages } = data;
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
      association = { ...association, community: community._id ?? community.id };
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

  const getCreateButton = () => {
    return (
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
    );
  }

  return (
    <>
    <ListView
      sectionTitle="Administrar Actividades"
      sectionDescription="Aquí podras gestionar las actividades del sistema."
      createButtonText="Crear actividad"
      listTitle="Listado de Actividades"
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
      handlePaginationChange={(data) => getAssociations('', data)}
      createButton={getCreateButton()}
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
