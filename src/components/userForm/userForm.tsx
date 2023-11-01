import "./userForm.scss";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import { getAllroles } from "../../services/roles.service";

const UserForm = forwardRef((props: any, ref) => {
  const [user, setUser] = useState({
    name: "",
    user_name: "",
    password: "",
    role: "",
  });
  const [roles, setRoles] = useState([]);

  useImperativeHandle(ref, () => {
    return {
      getUser,
    };
  });

  const getUser = () => {
    return user;
  };

  useEffect(() => {
    getRoles();
  }, []);

  useEffect(() => {
    setCurrentUser();
  }, []);

  const setCurrentUser = () => {
    if (props.currentUser)
      setUser({ ...props.currentUser, role: props.currentUser.role._id });
  };

  const getRoles = async () => {
    const response = await getAllroles();
    const rolList = response.result.data;
    setRoles(rolList);
  };

  const formHanlder = (
    target: "name" | "user_name" | "password" | "role",
    e: any
  ) => {
    const value =
      target === "user_name" ? (e.target.value as string).trim() : e.target.value;
    setUser({ ...user, [target]: value });
  };

  return (
    <>
      <form className="user-form-container" action="">
        <TextField
          className="login-view__login-form__form-container__input"
          id="name"
          name="name"
          placeholder="juanito"
          type="text"
          label="Nombre de usuario"
          onChange={(e) => formHanlder("name", e)}
          value={user.name || ""}
        />
        <TextField
          className="login-view__login-form__form-container__input"
          id="user_name"
          name="user_name"
          placeholder="ejemplo@gmail.com"
          type="text"
          label="Usuario"
          onChange={(e) => formHanlder("user_name", e)}
          value={user.user_name || ""}
        />
        <TextField
          className="login-view__login-form__form-container__input"
          id="pass"
          name="password"
          placeholder="·$Wsaf.rwgge665wa"
          type="password"
          label="Contraseña"
          onChange={(e) => formHanlder("password", e)}
        />
        <FormControl>
          <InputLabel id="demo-simple-select-label">Role</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Role de usuario"
            onChange={(e) => formHanlder("role", e)}
            value={user.role || ""}
          >
            {roles.length > 0 &&
              roles.map((role: any) => {
                return (
                  <MenuItem key={role._id} value={role._id}>
                    {role.role}
                  </MenuItem>
                );
              })}
          </Select>
        </FormControl>
      </form>
    </>
  );
});

export default UserForm;
