import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import { getAllroles } from "../../services/roles.service";

const AssociationForm = forwardRef((props: any, ref) => {
  const [association, setAssociation] = useState({
    name: "",
    typeAssociation: "",
    municipality: "",
    commune: "",
    presidentName: "",
    address: "",
    phone: "",
    integrantNumber: "",
  });
  const [typesAssociation, setTypesAssociation] = useState([]);
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
    getRoles();
  }, []);

  useEffect(() => {
    setCurrentAssociation();
  }, []);

  const setCurrentAssociation = () => {
    if (props.currentAssociation)
      setAssociation({
        ...props.currentAssociation,
        role: props.currentAssociation.role._id,
      });
  };

  const getRoles = async () => {
    const response = await getAllroles();
    const rolList = response.result.data;
    setTypesAssociation(rolList);
  };

  const formHanlder = (
    target:
      | "name"
      | "typeAssociation"
      | "municipality"
      | "commune"
      | "presidentName"
      | "address"
      | "phone"
      | "integrantNumber",
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
            onChange={(e) => formHanlder("typeAssociation", e)}
            value={association.typeAssociation || ""}
          >
            {typesAssociation.length > 0 &&
              typesAssociation.map((type: any) => {
                return (
                  <MenuItem key={type._id} value={type._id}>
                    {type.role}
                  </MenuItem>
                );
              })}
          </Select>
        </FormControl>
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
        <TextField
          className="login-view__login-form__form-container__input"
          id="commune"
          name="commune"
          placeholder="Comuna"
          type="text"
          label="Comuna"
          onChange={(e) => formHanlder("commune", e)}
          value={association.commune || ""}
        />
        <TextField
          className="login-view__login-form__form-container__input"
          id="presidentName"
          name="presidentName"
          placeholder="Nombre del presidente"
          type="text"
          label="Nombre del presidente"
          onChange={(e) => formHanlder("presidentName", e)}
          value={association.presidentName || ""}
        />
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
          id="phone"
          name="phone"
          placeholder="Telefono"
          type="text"
          label="Telefono"
          onChange={(e) => formHanlder("phone", e)}
          value={association.phone || ""}
        />
        <TextField
          className="login-view__login-form__form-container__input"
          id="integrantNumber"
          name="integrantNumber"
          placeholder="Numero de integrantes"
          type="text"
          label="Numero de integrantes"
          onChange={(e) => formHanlder("integrantNumber", e)}
          value={association.integrantNumber || ""}
        />
      </form>
    </>
  );
});

export default AssociationForm;
