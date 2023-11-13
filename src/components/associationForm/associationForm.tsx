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
  getComunaByMunicipie,
  getDepartments,
  getMunicipies,
} from "../../services/activities.service";

const AssociationForm = forwardRef((props: any, ref) => {
  const [association, setAssociation] = useState<any>({
    name: "",
    type: "",
    address: "",
    coordinator_name: "",
    phones: "",
    department: "",
    municipality: "",
    community: "",
    membersCount: "",
  });
  const [departmentsList, setDepartmentsList] = useState([]);
  const [municipiesList, setMunicipiesList] = useState([]);
  const [communityList, setCommunityList] = useState([]);
  const typesAssociation = [
    'CENTRO VIDA', 'Centro de bienestar', 'Municipio y Asociación', 'VIDA/DÍA', 'CENTRO DÍA'
  ];
  // ["Centro de vida","Centro de bienestar","Municipio","Asociación"]

  useImperativeHandle(ref, () => {
    return { getAssociation };
  });

  const getAssociation = () => {
    return association;
  };

  useEffect(() => {
    setCurrentAssociation();
    getDepartamentsList();
  }, []);


  const setCurrentAssociation = () => {
    if (props.currentAssociation) {
      setAssociation({
        ...props.currentAssociation,
        role: props.currentAssociation._id,
      });
    }
  };

  const getDepartamentsList = async () => {
    try {
      const response = await getDepartments();
      if (response && response.length > 0) {
        setDepartmentsList(response);
        if (props.currentAssociation) {
          getMunicipiesList(
            response.find(
              ({ name }: any) => name === props.currentAssociation.department
            )
          );
        }
      }
    } catch (error) {
      setDepartmentsList([]);
    }
  };
  const getMunicipiesList = async (department: any) => {
    try {
      const response = await getMunicipies(department?.id);
      if (response && response.length > 0) {
        setMunicipiesList(response);
        if (props.currentAssociation) {
          getCommunitiesList(
            response.find(
              ({ name }: any) => name === props.currentAssociation.municipality
            )
          );
        }
      }
    } catch (error) {
      setDepartmentsList([]);
    }
  };
  const getCommunitiesList = async (municipality: any) => {
    try {
      const response = await getComunaByMunicipie(municipality?.id);
      if (response.status === 200) {
        setCommunityList(response.result.data);
      }
    } catch (error) {
      setDepartmentsList([]);
    }
  };

  const formHanlder = (
    target:
      | "name"
      | "type"
      | "address"
      | "coordinator_name"
      | "phones"
      | "department"
      | "municipality"
      | "community"
      | "membersCount",
    e: any
  ) => {
    const value = e.target ? e.target.value : e;
    if(["department", "municipality"].includes(target)) {
      setAssociation({ ...association, [target]: value.name });
    } else {
      setAssociation({ ...association, [target]: value });
    }

    if (target === "department") {
      getMunicipiesList(value);
      (association as any).municipality && formHanlder("municipality", "");
    }
    if (target === "municipality") {
      getCommunitiesList(value);
      (association as any).municipality && formHanlder("community", "");
    }
  };

  return (
    <>
      <form className="user-form-container" action="">
        <TextField
          className="login-view__login-form__form-container__input"
          id="name"
          name="name"
          placeholder="Nombre de la asociacion"
          type="text"
          label="Nombre de la asociacion"
          onChange={(e) => formHanlder("name", e)}
          value={association.name || ""}
        />
        <FormControl>
          <InputLabel id="demo-simple-select-label">
            Tipo de asociacion
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Tipo de asociacion"
            onChange={(e) => formHanlder("type", e)}
            value={association.type || ""}
          >
            {typesAssociation.length > 0 &&
              typesAssociation.map((type: any, i: number) => {
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
          id="address"
          name="address"
          placeholder="Direccion"
          type="text"
          label="Direccion"
          onChange={(e) => formHanlder("address", e)}
          value={association.address || ""}
        />
        <TextField
          className="login-view__login-form__form-container__input"
          id="coordinator_name"
          name="coordinator_name"
          placeholder="Nombre del presidente"
          type="text"
          label="Nombre del presidente"
          onChange={(e) => formHanlder("coordinator_name", e)}
          value={association.coordinator_name || ""}
        />
        <TextField
          className="login-view__login-form__form-container__input"
          id="phones"
          name="phones"
          placeholder="Telefono"
          type="number"
          label="Telefono"
          onChange={(e) => formHanlder("phones", e)}
          value={association.phones || ""}
        />

        <div className="activities-container__form-section__assitants__form-2__field">
          <SelectDropdown
            selectValue={(() => {
              return departmentsList.length
                ? departmentsList.find(
                    ({ name }) => name === association.department
                  )?.id
                : "";
            })()}
            label="Departamento"
            options={departmentsList}
            keyLabel="name"
            keyValue="id"
            targetKey="department"
            handleValue={(value) => formHanlder("department", value)}
          />
        </div>
        <div className="activities-container__form-section__assitants__form-2__field">
          <SelectDropdown
            selectValue={(() => {
              return municipiesList.length
                ? municipiesList.find(
                    ({ name }) => name === association.municipality
                  )?.id
                : "";
            })()}
            label="Municipio"
            options={municipiesList}
            keyLabel="name"
            keyValue="id"
            targetKey="municipality"
            handleValue={(value) => formHanlder("municipality", value)}
          />
        </div>
        <div className="activities-container__form-section__assitants__form-2__field">
          <SelectDropdown
            selectValue={(() => {
              return communityList.length
                ? communityList.find(
                    ({ _id }) => _id === association.community._id
                  )?._id
                : "";
            })()}
            label="Comuna"
            options={communityList}
            keyLabel="name"
            keyValue="_id"
            targetKey="community"
            handleValue={(value) => formHanlder("community", value)}
          />
        </div>

        <TextField
          className="login-view__login-form__form-container__input"
          id="membersCount"
          name="membersCount"
          placeholder="Numero de integrantes"
          type="text"
          label="Numero de integrantes"
          onChange={(e) => formHanlder("membersCount", e)}
          value={association.membersCount || ""}
        />
      </form>
    </>
  );
});

export default AssociationForm;
