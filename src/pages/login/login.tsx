import "./login.scss";
import { TextField, Typography } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import loginImg from "../../assets/login-img.png";
import { useState } from "react";
import { setUser } from "../../features/auth/authSlice";
import { ROUTES } from "../../constants/routes";
import { userLogin } from "../../services/login.service";
import { AppUser } from "../../models/user.model";
import { getReferences } from "../../services/references.service";
import { setReference } from "../../features/referencesSlice";
import Toast from "../../components/toast/toast";
import { ERROR_MESSAGES } from "./../../constants/errorMessageDictionary";
import { SEVERITY_TOAST } from "../../constants/severityToast";
import { sectionList } from "../../constants/section-list";
import { checkPermissions } from "../../helpers/checkPermissions";
import { setCurrentSection } from "../../features/generalSlice";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [credentials, setCredentials] = useState({ user_name: "", password: "" });
  const [loading, setLoading] = useState(false);

  // toasts
  const [toastLoginError, setToastLoginError] = useState(false);
  const [toastGetAllReferencesError, setToastGetAllReferencesError] =
    useState(false);

  const formHanlder = (target: "user_name" | "password", e: any) => {
    const value =
      target === "user_name" ? (e.target.value as string).trim() : e.target.value;
    setCredentials({ ...credentials, [target]: value });
  };

  const getAllReferences = async () => {
    try {
      const response = await getReferences();
      if (response.status === 200) {
        const references = response.result;
        dispatch(setReference({ ...references }));
      }
    } catch (error) {
      //
      console.error(error);
    }
  };

  const login = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await userLogin(credentials);
      if (response.status === 200) {
        setLoading(false);
        const user = new AppUser(response.result.user);
        dispatch(setUser({ ...user }));
        getAllReferences();
        const availableSections = sectionList
          .filter((section) => checkPermissions(section.permission, user.abilities))
          .sort((a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0));
        dispatch(setCurrentSection(availableSections[0].key));
        navigate(`${ROUTES.DASHBOARD}/${availableSections[0].path}`);
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      setToastLoginError(true);
    }
  };

  const validCredentials = (): boolean => {
    return credentials.user_name === "" || credentials.password === "";
  };

  return (
    <div className="login-view">
      <div className="login-view__image-container">
        <img src={loginImg} alt="Logo" />
      </div>

      <div className="login-view__login-form">
        <div className="login-view__login-form__card">
          <img
            className="login-view__login-form__card__logo"
            src={logo}
            alt="Logo"
          />
          <form
            className="login-view__login-form__card__form-container"
            onSubmit={login}
          >
            <TextField
              className="login-view__login-form__form-container__input"
              id="user"
              name="user_name"
              onChange={(e) => formHanlder("user_name", e)}
              placeholder="Usuario"
            />

            <TextField
              className="login-view__login-form__form-container__input"
              id="pass"
              name="password"
              placeholder="Contraseña"
              type="password"
              onChange={(e) => formHanlder("password", e)}
            />

            <LoadingButton
              loading={loading}
              variant="contained"
              type="submit"
              disabled={validCredentials()}
            >
              Ingresar
            </LoadingButton>
          </form>
        </div>
      </div>
      <Toast
        open={toastLoginError}
        handleClose={() => setToastLoginError(false)}
        message={ERROR_MESSAGES.LOGIN_ERROR}
        severity={SEVERITY_TOAST.ERROR}
      />
      <Toast
        open={toastGetAllReferencesError}
        handleClose={() => setToastGetAllReferencesError(false)}
        message={ERROR_MESSAGES.GET_ALL_REFERENCES_ERROR}
        severity={SEVERITY_TOAST.ERROR}
      />
    </div>
  );
}

export default Login;
