import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import SelectDropdown from "../select";
import {
  getAssociationsByCommunity,
  getComunaByMunicipie,
  getDepartments,
  getMunicipies,
} from "../../services/activities.service";

const RepresentativeForm = forwardRef((props: any, ref) => {
  const [representative, setRepresentative] = useState<any>({
    name: "",
    identification_type: "",
    identification: "",
    address: "",
    phone: "",
    association: "",
  });
  const [departmentsList, setDepartmentsList] = useState([]);
  const [municipiesList, setMunicipiesList] = useState([]);
  const [communityList, setCommunityList] = useState([]);
  const [associationsList, setAssociations] = useState([]);
  const [selectedDep, setSelectedDep] = useState(null);
  const [selectedMun, setSelectedMun] = useState(null);
  const [selectedCom, setSelectedCom] = useState(null);
  const [selectedAso, setSelectedAso] = useState(null);

  const identificationTypes = ["Cédula de ciudadanía", "NIT", "Pasaporte"];

  useImperativeHandle(ref, () => {
    return {
      getRepresentative: () => ({
        ...representative,
        association: selectedAso.id ?? selectedAso._id,
      }),
    };
  });

  useEffect(() => {
    setCurrentRepresentative();
    getDepartamentsList();
  }, []);

  const getDepartamentsList = async () => {
    try {
      const response = await getDepartments();
      if (response && response.length > 0) {
        setDepartmentsList(response);
        if (props.currentRepresentative) {
          const dep = response.find(({ name }: any) => {
            return name === props.currentRepresentative.association.department;
          });
          getMunicipiesList(dep);
          setSelectedDep(dep);
        }
      }
    } catch (error) {
      setDepartmentsList([]);
    }
  };

  const getMunicipiesList = async (department: any) => {
    try {
      setSelectedDep(department);
      const response = await getMunicipies(department?.id);
      if (response && response.length > 0) {
        setMunicipiesList(response);
        setSelectedMun(null);
        setSelectedCom(null);
        setSelectedAso(null);
        if (props.currentRepresentative) {
          const mun = response.find(({ name }: any) => {
            return (
              name === props.currentRepresentative.association.municipality
            );
          });
          getCommunities(mun);
          setSelectedMun(mun);
        }
      }
    } catch (error) {
      setDepartmentsList([]);
    }
  };

  const getCommunities = async (municipality: any) => {
    try {
      setSelectedMun(municipality);
      const response = await getComunaByMunicipie(municipality?.id);
      if (response.status === 200) {
        const communities = response.result.data;
        setCommunityList(communities);
        setSelectedCom(null);
        setSelectedAso(null);
        if (props.currentRepresentative) {
          const com = communities.find(({ _id }: any) => {
            return _id === props.currentRepresentative.association.community;
          });
          getAssociations(com);
          setSelectedCom(com);
        }
      }
    } catch (error) {
      setDepartmentsList([]);
    }
  };

  const getAssociations = async (community: any) => {
    try {
      setSelectedCom(community);
      const response = await getAssociationsByCommunity(
        community?.id ?? community?._id
      );
      if (response.status === 200) {
        const associations = response.result.data;
        setAssociations(associations);
        setSelectedAso(null);
        if (props.currentRepresentative) {
          const aso = associations.find(({ _id }: any) => {
            return _id === props.currentRepresentative.association._id;
          });
          setSelectedAso(aso);
        }
      }
    } catch (error) {
      setDepartmentsList([]);
    }
  };

  const setCurrentRepresentative = () => {
    if (props.currentRepresentative) {
      setRepresentative({
        ...props.currentRepresentative,
        role: props.currentRepresentative._id,
        "identification_type": props.currentRepresentative.identification_type,
      });
    }
  };

  const formHanlder = (
    target:
      | "name"
      | "identification_type"
      | "identification"
      | "address"
      | "phone"
      | "association",
    e: any
  ) => {
    const value = e.target ? e.target.value : e;
    setRepresentative({ ...representative, [target]: value });
  };

  return (
    <>
      <form className="user-form-container" action="">
        <TextField
          className="login-view__login-form__form-container__input"
          id="name"
          name="name"
          placeholder="Nombre completo"
          type="text"
          label="Nombre completo"
          onChange={(e) => formHanlder("name", e)}
          value={representative.name || ""}
        />
        <FormControl>
          <InputLabel id="demo-simple-select-label">
            Tipo de documento
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Tipo de documento"
            onChange={(e) => formHanlder("identification_type", e)}
            value={representative.identification_type || ""}
          >
            {identificationTypes.length > 0 &&
              identificationTypes.map((type: string, i: number) => {
                return (
                  <MenuItem key={i} value={type}>
                    {type}
                  </MenuItem>
                );
              })}
          </Select>
        </FormControl>
        <TextField
          className="login-view__login-form__form-container__input"
          id="identification"
          name="identification"
          placeholder="Nro. Documento"
          type="number"
          label="Nro. Documento"
          onChange={(e) => formHanlder("identification", e)}
          value={representative.identification || ""}
        />
        <TextField
          className="login-view__login-form__form-container__input"
          id="address"
          name="address"
          placeholder="Direccion"
          type="text"
          label="Direccion"
          onChange={(e) => formHanlder("address", e)}
          value={representative.address || ""}
        />
        <TextField
          className="login-view__login-form__form-container__input"
          id="phone"
          name="phone"
          placeholder="Telefono"
          type="number"
          label="Telefono"
          onChange={(e) => formHanlder("phone", e)}
          value={representative.phone || ""}
        />
        <SelectDropdown
          selectValue={selectedDep?.id}
          label="Departamento"
          options={departmentsList}
          keyLabel="name"
          keyValue="id"
          targetKey="department"
          handleValue={(value) => getMunicipiesList(value)}
        />
        <SelectDropdown
          selectValue={selectedMun?.id}
          label="Municipio"
          options={municipiesList}
          keyLabel="name"
          keyValue="id"
          targetKey="municipality"
          handleValue={(value) => getCommunities(value)}
        />
        <SelectDropdown
          selectValue={selectedCom?.id ?? selectedCom?._id}
          label="Comuna"
          options={communityList}
          keyLabel="name"
          keyValue="_id"
          targetKey="community"
          handleValue={(value) => getAssociations(value)}
        />
        <SelectDropdown
          selectValue={selectedAso?.id ?? selectedAso?._id}
          label="Asociacion"
          options={associationsList}
          keyLabel="name"
          keyValue="_id"
          targetKey="association"
          handleValue={(value) => setSelectedAso(value)}
        />
      </form>
    </>
  );
});

export default RepresentativeForm;
