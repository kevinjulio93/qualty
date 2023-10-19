import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import { getReferences } from "../../services/references.service";

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
  const [communities, setCommunities] = useState([]);
  const typesAssociation = [{ type: "Centro de vida" }, { type: "Asociacion" }];
  // ["Centro de vida","Centro de bienestar","Municipio","Asociación"]

  useImperativeHandle(ref, () => {
    return {
      getAssociation,
    };
  });

  const getAssociation = () => {
    return association;
  };

  useEffect(() => {
    setCurrentAssociation();
  }, []);

  useEffect(() => {
    getCommunities();
  }, []);

  const setCurrentAssociation = () => {
    if (props.currentAssociation)
      setAssociation({
        ...props.currentAssociation,
        role: props.currentAssociation._id,
      });
  };

  const getCommunities = async () => {
    setCommunities(await getReferences().then((v) => v.result.communities));
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
    const value = e.target.value;
    setAssociation({ ...association, [target]: value });
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
                  <MenuItem key={i} value={type.type}>
                    {type.type}
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
          type="text"
          label="Telefono"
          onChange={(e) => formHanlder("phones", e)}
          value={association.phones || ""}
        />
        <TextField
          className="login-view__login-form__form-container__input"
          id="department"
          name="department"
          placeholder="Departamento"
          type="text"
          label="Departamento"
          onChange={(e) => formHanlder("department", e)}
          value={association.department || ""}
        />
        <TextField
          className="login-view__login-form__form-container__input"
          id="municipality"
          name="municipality"
          placeholder="Municipio"
          type="text"
          label="Municipio"
          onChange={(e) => formHanlder("municipality", e)}
          value={association.municipality || ""}
        />
        <FormControl>
          <InputLabel id="demo-simple-select-label">Comuna</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Comuna"
            onChange={(e) => formHanlder("community", e)}
            value={association.community._id || ""}
          >
            {communities.length > 0 &&
              communities
                .sort(({ municipality: a }, { municipality: b }) => {
                  if (a > b) return 1;
                  if (a < b) return -1;
                  return 0;
                })
                .map(({ _id, municipality }: any, i: number) => {
                  return (
                    <MenuItem key={i} value={_id}>
                      {municipality}
                    </MenuItem>
                  );
                })}
          </Select>
        </FormControl>
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
