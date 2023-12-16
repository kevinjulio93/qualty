// import { Avatar, Button, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Stack, TextField, Typography } from "@mui/material";
// import firma from '../../assets/firma.jpeg';
// import huella from '../../assets/huella.jpeg';
import {
  Button,
  Paper,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
  Autocomplete,
  Tabs,
  Tab,
  Box,
  Stack,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Dialog,
  DialogContent,
} from "@mui/material";
import "./beneficiaries.scss";
import SelectDropdown from "../../components/select";
import { useEffect, useRef, useState } from "react";
import WebcamCapture from "./capture";
import DPersonaReader from "./dpersonaReader";
import {
  createBeneficiary,
  getBeneficiarieById,
  updateBeneficiary,
} from "../../services/beneficiaries.service";
import { useNavigate, useParams } from "react-router-dom";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import frontCedula from "../../assets/front-cedula.png";
import backCedula from "../../assets/back-cedula.png";
import iconEps from "../../assets/icon-eps.png";
import iconSisben from "../../assets/ico-sisben.png";
import iconRegistra from "../../assets/icon-resgistra.png";
import Webcam from "react-webcam";
import { ROUTES } from "../../constants/routes";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import {
  getAllActivities,
  getAssociationsByCommunity,
  getComunaByMunicipie,
  getDepartments,
  getMunicipies,
} from "../../services/activities.service";
import { epsList } from "../../constants/epsList";
import { isEmpty } from "../../helpers/isEmpty";
import SaveCancelControls from "../../components/saveActionComponent/saveCancelControls";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { regimeList } from "../../constants/regimeList";
import { SEVERITY_TOAST } from "../../constants/severityToast";
import Toast from "../../components/toast/toast";

function Beneficiaries() {
  const documentTypes = [
    { label: "C.C", value: "cc" },
    { label: "Pasaporte", value: "pasaporte" },
    { label: "NIT", value: "nit" },
    {
      label: "Permiso especial de permanencia",
      value: "permiso especial de permanencia ",
    },
    { label: "Contraseña", value: "contraseña" },
  ];
  const optionsCivilStatus = [
    { label: "Soltero", value: "Soltero" },
    { label: "Casado", value: "Casado" },
    { label: "Divorciado", value: "Divorciado" },
    { label: "Viudo", value: "Viudo" },
    { label: "Union libre", value: "Union libre" },
    { label: "Separado", value: "Separado" },
  ];
  const optionsRegimenHealth = [
    { label: regimeList.SUBSIDIADO, value: regimeList.SUBSIDIADO },
    {
      label: regimeList.CONTRIBUTIVO_COTIZANTE,
      value: regimeList.CONTRIBUTIVO_COTIZANTE,
    },
    {
      label: regimeList.CONTRIBUTIVO_BENEFICIARIO,
      value: regimeList.CONTRIBUTIVO_BENEFICIARIO,
    },
    { label: regimeList.REGIMEN_ESPECIAL, value: regimeList.REGIMEN_ESPECIAL },
    { label: regimeList.RETIRADO, value: regimeList.RETIRADO },
    { label: regimeList.NO_AFILIADO, value: regimeList.NO_AFILIADO },
  ];

  const optionsEthnicity = [
    { label: "Indígena", value: "Indígena" },
    { label: "Afro", value: "Afro" },
    { label: "Raizal", value: "Raizal" },
    { label: "Palenquero", value: "Palenquero" },
    { label: "Ninguno", value: "Ninguno" },
  ];

  const optionsEducationLevel = [
    { label: "Primaria", value: "Primaria" },
    { label: "Secundaria", value: "Secundaria" },
    { label: "Técnica", value: "Técnica" },
    { label: "Universitaria", value: "Universitaria" },
    { label: "Sin escolaridad", value: "Sin escolaridad" },
    { label: "Otra", value: "Otra" },
  ];

  const optionsDisability = [
    { label: "Ninguna", value: "Ninguna" },
    { label: "Auditiva", value: "Auditiva" },
    { label: "Visual", value: "Visual" },
    { label: "Del gusto", value: "Del gusto" },
    { label: "Olfato", value: "Olfato" },
    { label: "Tacto", value: "Tacto" },
    { label: "Multiple", value: "Multiple" },
    { label: "Mental-Cognitiva", value: "Mental-Cognitiva" },
    { label: "Mental-Psicosocial", value: "Mental-Psicosocial" },
    { label: "Motriz", value: "Motriz" },
    { label: "Otra", value: "Otra" },
  ];

  const optionsOcupation = [
    { label: "Empleo formal", value: "Empleo formal" },
    { label: "Empleo informal", value: "Empleo informal" },
    { label: "Desempleado", value: "Desempleado" },
    { label: "Pensionado", value: "Pensionado" },
    { label: "Hogar", value: "Hogar" },
    { label: "Campesino", value: "Campesino" },
  ];

  const optionsGender = [
    { label: "Masculino", value: "Masculino" },
    { label: "Femenino", value: "Femenino" },
    { label: "Otro", value: "Otro" },
  ];

  const sisbenList = [
    "A1",
    "A2",
    "A3",
    "A4",
    "A5",
    "B1",
    "B2",
    "B3",
    "B4",
    "B5",
    "B6",
    "B7",
    "C1",
    "C2",
    "C3",
    "C4",
    "C5",
    "C6",
    "C7",
    "C8",
    "C9",
    "C10",
    "C11",
    "C12",
    "C13",
    "C14",
    "C15",
    "C16",
    "C17",
    "C18",
    "D1",
    "D2",
    "D3",
    "D4",
    "D5",
    "D6",
    "D7",
    "D8",
    "D9",
    "D10",
    "D11",
    "D12",
    "D13",
    "D14",
    "D15",
    "D16",
    "D17",
    "D18",
    "D19",
    "D20",
    "D21",
  ];

  const mandatoryFields = [
    "identification_type",
    "identification",
    "first_last_name",
    "first_name",
    "sex",
    "birthday",
    "blody_type",
  ];

  const [beneficiarie, setBeneficiarie] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [isVictimArmedConflict, setIsVictimArmedConflict] = useState(true);
  const [selectedTab, setSelectedTab] = useState("1");
  const [cedFront, setCedFront] = useState(null);
  const [cedBack, setCedBack] = useState(null);
  const [docEps, setDocEps] = useState(null);
  const [docSis, setDocSis] = useState(null);
  const [docReg, setDocReg] = useState(null);
  const [uploadedPhoto, setUploadedPhoto] = useState(null);
  const { beneficiarieId } = useParams();
  const [openCamaraSupports, setOpenCamaraSupports] = useState(false);
  const webcamRef = useRef(null);
  const [typeSupport, setTypeSupport] = useState(null);
  const [files, setFiles] = useState([]);
  const [departmentsList, setDepartmentsList] = useState([]);
  const [municipiesList, setMunicipiesList] = useState([]);
  const [communityList, setCommunityList] = useState([]);
  const [associationsList, setAssociations] = useState([]);
  const [forceRender, setForceRender] = useState(+new Date());
  const [activities, setActivities] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openToast, setOpenToast] = useState(false);
  const [inAct, setInAct] = useState("");
  const [displayedImage, setDisplayedImage] = useState(null);
  const navigate = useNavigate();
  dayjs.extend(customParseFormat);

  useEffect(() => {
    getDepartamentsList();
    getActivitiesList();
    if (beneficiarieId !== undefined) {
      (async () => {
        await getBeneficiary();
      })();
    }

    //setValuesDefaultBeneficiarie();
  }, []);

  useEffect(() => {
    if (!isEmpty(beneficiarieId) && !isEmpty(beneficiarie)) {
      (async () => await getMuns())();
    }
  }, [beneficiarie, departmentsList]);

  useEffect(() => {
    if (!isEmpty(beneficiarieId) && !isEmpty(beneficiarie)) {
      (async () => await getComs())();
    }
  }, [beneficiarie, municipiesList]);

  useEffect(() => {
    if (!isEmpty(beneficiarieId) && !isEmpty(beneficiarie)) {
      (async () => await getAsos())();
    }
  }, [beneficiarie, communityList]);

  const getMuns = async () => {
    const currentDep = getSelectedValueDep("residence_department");
    if (isEmpty(currentDep)) return;
    const responseMuns = await getMunicipies(currentDep.id);
    setMunicipiesList(responseMuns);
  };

  const getComs = async () => {
    const currentMun = getSelectedValueMun("municipality");
    if (isEmpty(currentMun)) return;
    const responseCom = await getComunaByMunicipie(currentMun.id);
    setCommunityList(responseCom.result.data);
  };

  const getAsos = async () => {
    const benCommunity = (beneficiarie as any).community;
    console.log(benCommunity);
    if (isEmpty(benCommunity)) return;
    const responseAso = await getAssociationsByCommunity(benCommunity._id);
    setAssociations(responseAso.result.data);
    setForceRender(+new Date());
  };

  const getActivitiesList = async () => {
    try {
      const response = await getAllActivities(null, 1, 200);
      if (response.status === 200) {
        const { data: dataList } = response.result;
        setActivities(dataList);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getBeneficiary = async () => {
    try {
      const response = await getBeneficiarieById(beneficiarieId);
      if (response.status === 200) {
        const currentBen = response.result.data;
        setBeneficiarie(currentBen);
        setFilesBen(currentBen);
        if (currentBen.activity) setInAct("SI");
        else setInAct("NO");
      }
    } catch (error) {
      console.error(error);
      navigate(`${ROUTES.DASHBOARD}/${ROUTES.BEN_LIST}`);
    }
  };

  const setFilesBen = (data) => {
    setDocEps(data?.fosiga_url);
    setCedBack(data?.id_back);
    setCedFront(data?.id_front);
    setDocReg(data?.registry_doc_url);
    setDocSis(data?.sisben_url);
  };

  const formHanlder = (target: string, e: any, data?: any) => {
    if (data) {
      setBeneficiarie({ ...beneficiarie, [target]: data });
    } else {
      if (target === "is_victim_armed_conflict")
        setIsVictimArmedConflict(!isVictimArmedConflict);
      const value = e.target ? e.target.value : e.value || e;
      setBeneficiarie({ ...beneficiarie, [target]: value });
    }
  };

  const handleWebcamCapture = (imageBlob: any) => {
    // Include the imageBlob in your FormData
    const file = imageBlob;
    const ext = file.type.split("/")[1];
    const filePhoto = new File([file], "foto." + ext);
    console.log(filePhoto);
    setFileBen("photo_url", filePhoto);
    setSelectedFile(file);
  };

  const handleImageExplored = (e) => {
    const imageDoc = e.target.files[0];
    const file = imageDoc;
    const ext = file.type.split("/")[1];
    const filePhoto = new File([file], "foto." + ext);
    console.log(filePhoto);
    setBeneficiarie({...beneficiarie, photo_url: null});
    setFileBen("photo_url", imageDoc);
    setUploadedPhoto(URL.createObjectURL(imageDoc));
    setSelectedFile(file);
  }

  const handleCaptureFootprint = (imageBlob: any) => {
    // Include the imageBlob in your FormData
    const file = imageBlob;
    const ext = file.type.split("/")[1];
    const fileFootprint = new File([file], "huella." + ext);
    setFileBen("footprint_url", fileFootprint);
    setSelectedFile(file);
  };

  const saveBeneficiary = async (beneficiary: any) => {
    const saveData = beneficiarieId ? updateBeneficiary : createBeneficiary;
    if (files || (beneficiarie as any)?.photo_url) {
      try {
        await saveData(files, beneficiary); // Replace with your actual access token
        navigate(`${ROUTES.DASHBOARD}/${ROUTES.BEN_LIST}`);
      } catch (error) {
        setOpenToast(true);
      }
    }
  };

  const createBeneficiarie = () => {
    saveBeneficiary(beneficiarie);
  };

  const setFileBen = (key, file, name?: string | null) => {
    console.log(files);
    const listFiles = files;
    let fileParse = null;
    if (name) {
      const ext = "." + file.type.split("/")[1];
      fileParse = new File([file], name + ext);
      listFiles.push({ [`${key}`]: fileParse });
      setFiles([...listFiles]);
    } else {
      listFiles.push({ [`${key}`]: file });
      setFiles([...listFiles]);
    }
  };

  const handleImage = (e, key) => {
    const imageDoc2 = e.target.files[0];
    const imageDoc = URL.createObjectURL(imageDoc2);
    switch (key) {
      case "front":
        setCedFront(imageDoc);
        setFileBen("id_front", imageDoc2);
        break;
      case "back":
        setFileBen("id_back", imageDoc2);
        setCedBack(imageDoc);
        break;
      case "eps":
        setFileBen("fosiga_url", imageDoc2);
        setDocEps(imageDoc);
        break;
      case "sisben":
        setFileBen("sisben_url", imageDoc2);
        setDocSis(imageDoc);
        break;
      case "reg":
        setFileBen("registry_doc_url", imageDoc2);
        setDocReg(imageDoc);
        break;
      default:
        break;
    }
  };

  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(",")[1]);
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  const getCaptureSupport = () => {
    return webcamRef.current.getScreenshot();
  };

  const handlerCaptureSupport = (e) => {
    const imageDoc2 = dataURItoBlob(getCaptureSupport());
    const imageDoc = URL.createObjectURL(imageDoc2);
    switch (typeSupport) {
      case "front":
        setFileBen("id_front", imageDoc2, "cedula-frontal");
        setCedFront(imageDoc);
        break;
      case "back":
        setFileBen("id_back", imageDoc2, "cedula-frontal");
        setCedBack(imageDoc);
        break;
      case "eps":
        setFileBen("fosiga_url", imageDoc2, "soporte-eps");
        setDocEps(imageDoc);
        break;
      case "sisben":
        setFileBen("sisben_url", imageDoc2, "soporte-sisben");
        setDocSis(imageDoc);
        break;
      case "reg":
        setFileBen("registry_doc_url", imageDoc2, "registraduria");
        setDocReg(imageDoc);
        break;
      default:
        break;
    }
    setOpenCamaraSupports(false);
    setTypeSupport(null);
  };

  const handleSelectedTab = (e, newValue) => {
    setSelectedTab(newValue);
  };

  const openCaptureSupport = (typeSupport: string) => {
    setTypeSupport(typeSupport);
    setOpenCamaraSupports(true);
  };

  const cancelCaptureSupport = () => {
    setOpenCamaraSupports(false);
  };

  const getDepartamentsList = async () => {
    try {
      const response = await getDepartments();
      if (response && response.length > 0) {
        setDepartmentsList(response);
      }
    } catch (error) {
      setDepartmentsList([]);
    }
  };

  const getMunicipiesList = async (target: string, department: any) => {
    try {
      const response = await getMunicipies(department?.id);
      if (response && response.length > 0) {
        setMunicipiesList(response);
        setBeneficiarie({
          ...beneficiarie,
          community: null,
          association: null,
          municipality: null,
          [target]: department.name,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getCommunities = async (target, municipality: any) => {
    try {
      const response = await getComunaByMunicipie(municipality?.id);
      if (response.status === 200) {
        setCommunityList(response.result.data);
        setBeneficiarie({
          ...beneficiarie,
          community: null,
          association: null,
          [target]: municipality.name,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getAssociations = async (target, community: any) => {
    try {
      formHanlder(target, community);
      const response = await getAssociationsByCommunity(community?._id);
      if (response.status === 200) {
        setAssociations(response.result.data);
        setBeneficiarie({
          ...beneficiarie,
          association: null,
          [target]: community,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getSelectedValueDep = (key) => {
    const valueKey = beneficiarie[key];
    const index = departmentsList.findIndex((item) => item.name === valueKey);
    return departmentsList[index];
  };

  const getSelectedValueMun = (key) => {
    const valueKey = beneficiarie[key];
    const index = municipiesList.findIndex((item) => item.name === valueKey);
    return municipiesList[index];
  };

  const getFormattedDate = (newDate) => {
    if (newDate.length === 8) {
      const dateTemp = dayjs(newDate, "YYYYMMDD");
      return dateTemp;
    } else {
      return newDate.format();
    }
  };

  const getSelectedActivity = (data) => {
    const currentAct = activities.find((item) => item.name === data);
    return currentAct._id;
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setDisplayedImage("");
  };

  const displayImage = (image) => {
    setDisplayedImage(image);
    setOpenModal(true);
  };

  const validateFields = () => {
    return mandatoryFields.some((item) => isEmpty(beneficiarie[item]));
  };

  const getCurrentActivity = (act) => {
    const actId = typeof act === "object" ? act._id : act;
    const index = activities.findIndex((item) => item._id === actId);
    return activities[index]?.name || "";
  };

  const getAssociationsList = () => {
    const index = activities.findIndex(
      (item) => item._id === (beneficiarie as any).activity
    );
    const currentAct = activities[index];
    return !currentAct || currentAct === ""
      ? associationsList
      : associationsList.filter((act) =>
          currentAct.participatingAssociations.some(
            (element) => element._id === act._id
          )
        );
  };

  return (
    <>
      <section className="beneficiaries-container">
        <header className="beneficiaries-container__actions">
          <div className="content-page-title">
            <Typography variant="h5" className="page-header">
              Administrar beneficiarios
            </Typography>
            <span className="page-subtitle">
              Aquí podras gestionar los usuarios del sistema.
            </span>
          </div>
        </header>

        <Paper elevation={1} className="beneficiaries-container__form-section">
          <div className="beneficiaries-container__form-section__resources">
            <div className="beneficiaries-container__form-section__resources__foto">
              <WebcamCapture
                onCapture={handleWebcamCapture}
                isEditing={
                  (beneficiarie as any)?.photo_url !== undefined || uploadedPhoto ? true : false
                }
                existingImage={(beneficiarie as any)?.photo_url || uploadedPhoto || null}
                onImageExplored={handleImageExplored}
              />
            </div>
            <div>
              <DPersonaReader
                handleCaptureFootprint={handleCaptureFootprint}
                existingImage={(beneficiarie as any)?.footprint_url || null}
              />
            </div>
          </div>
          <div className="beneficiaries-container__form-section__beneficiarie">
            <div className="beneficiaries-container__form-section__beneficiarie__section">
              <TabContext value={selectedTab}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <TabList
                    onChange={handleSelectedTab}
                    aria-label="Información de beneficiario"
                    centered
                  >
                    <Tab label="Información básica" value="1" />
                    <Tab label="Información complementaria" value="2" />
                    <Tab label="Soportes" value="3" />
                  </TabList>
                </Box>
                <TabPanel value="1">
                  <form className="beneficiaries-container__form-section__beneficiarie__form">
                    <div className="beneficiaries-container__form-section__beneficiarie__form__field">
                      <SelectDropdown
                        selectValue={
                          (beneficiarie as any)?.identification_type || ""
                        }
                        id="tipo_de_documento"
                        label="Tipo de documento"
                        options={documentTypes}
                        targetKey="identification_type"
                        handleValue={(value) =>
                          formHanlder("identification_type", value)
                        }
                      />
                    </div>

                    <div className="beneficiaries-container__form-section__beneficiarie__form__field">
                      <TextField
                        id="nodocumento"
                        className="beneficiaries-container__form-section__beneficiarie__form__field__input"
                        name="nodocumento"
                        placeholder="112233445"
                        type="number"
                        onChange={(e) => formHanlder("identification", e)}
                        label="No Documento"
                        value={(beneficiarie as any)?.identification || ""}
                      />
                    </div>

                    <div className="beneficiaries-container__form-section__beneficiarie__form__field">
                      <TextField
                        id="primerap"
                        className="beneficiaries-container__form-section__beneficiarie__form__field__input input_form_ben"
                        name="primerap"
                        placeholder="Zapata"
                        type="text"
                        label="Primer Apellido"
                        onChange={(e) => formHanlder("first_last_name", e)}
                        value={(beneficiarie as any)?.first_last_name || ""}
                      />
                    </div>

                    <div className="beneficiaries-container__form-section__beneficiarie__form__field">
                      <TextField
                        id="segundoap"
                        className="beneficiaries-container__form-section__beneficiarie__form__field__input"
                        name="segundoap"
                        placeholder="Rodriguez"
                        type="text"
                        label="Segundo Apellido"
                        onChange={(e) => formHanlder("second_last_name", e)}
                        value={(beneficiarie as any)?.second_last_name || ""}
                      />
                    </div>

                    <div className="beneficiaries-container__form-section__beneficiarie__form__field">
                      <TextField
                        id="primernom"
                        className="beneficiaries-container__form-section__beneficiarie__form__field__input"
                        name="primernom"
                        placeholder="Juanito"
                        type="text"
                        label="Primer Nombre"
                        onChange={(e) => formHanlder("first_name", e)}
                        value={(beneficiarie as any)?.first_name || ""}
                      />
                    </div>

                    <div className="beneficiaries-container__form-section__beneficiarie__form__field">
                      <TextField
                        id="segundonom"
                        className="beneficiaries-container__form-section__beneficiarie__form__field__input"
                        name="segundonom"
                        placeholder="Andres"
                        type="text"
                        label="Segundo Nombre"
                        onChange={(e) => formHanlder("second_name", e)}
                        value={(beneficiarie as any)?.second_name || ""}
                      />
                    </div>

                    <div className="beneficiaries-container__form-section__beneficiarie__form__field">
                      <Autocomplete
                        style={{ width: "100%" }}
                        disablePortal
                        id="sex"
                        options={["M", "F"]}
                        onChange={(e: any, data: any) =>
                          formHanlder("sex", e, data)
                        }
                        renderInput={(params) => (
                          <TextField {...params} label="Sexo" />
                        )}
                        value={(beneficiarie as any)?.sex || ""}
                      />
                    </div>

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        onChange={(newDate: Dayjs) =>
                          formHanlder("birthday", getFormattedDate(newDate))
                        }
                        value={
                          (beneficiarie as any)?.birthday
                            ? dayjs((beneficiarie as any)?.birthday)
                            : null
                        }
                        label="Fecha de nacimiento"
                      />
                    </LocalizationProvider>

                    <div className="beneficiaries-container__form-section__beneficiarie__form__field">
                      <Autocomplete
                        style={{ width: "100%" }}
                        disablePortal
                        id="blody_type"
                        options={[
                          "O+",
                          "O-",
                          "A+",
                          "A-",
                          "B+",
                          "B-",
                          "AB+",
                          "AB-",
                          "NI",
                        ]}
                        onChange={(e: any, data: any) =>
                          formHanlder("blody_type", e, data)
                        }
                        value={(beneficiarie as any)?.blody_type || ""}
                        renderInput={(params) => (
                          <TextField {...params} label="Tipo de sangre" />
                        )}
                      />
                    </div>

                    <div className="beneficiaries-container__form-section__beneficiarie__form__field">
                      <FormControl sx={{ width: "100%" }}>
                        <InputLabel id="demo-simple-select-label">
                          ¿Registrado en Actividad?
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          label="Tipo de asociacion"
                          onChange={(e) => {
                            setInAct(e.target.value);
                          }}
                          value={inAct || ""}
                        >
                          <MenuItem key={"inActYes"} value={"SI"}>
                            SI
                          </MenuItem>
                          <MenuItem key={"inActNo"} value={"NO"}>
                            NO
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                    {inAct === "SI" && (
                      <div className="beneficiaries-container__form-section__beneficiarie__form__field">
                        <Autocomplete
                          style={{ width: "100%" }}
                          disablePortal
                          id="activity"
                          options={activities.map((item) => item.name)}
                          onChange={(e: any, data: any) => {
                            formHanlder("activity", getSelectedActivity(data));
                          }}
                          value={getCurrentActivity(
                            (beneficiarie as any)?.activity
                          )}
                          renderInput={(params) => (
                            <TextField {...params} label="Actividad" />
                          )}
                        />
                      </div>
                    )}
                  </form>
                </TabPanel>
                <TabPanel value="2">
                  <form className="beneficiaries-container__form-section__beneficiarie__form">
                    <div className="beneficiaries-container__form-section__beneficiarie__form__field">
                      <TextField
                        id="telefono"
                        className="beneficiaries-container__form-section__beneficiarie__form__field__input"
                        name="telefono"
                        placeholder=""
                        type="tel"
                        label="Número de Teléfono"
                        onChange={(e) => formHanlder("phones", e)}
                        value={(beneficiarie as any)?.phones || ""}
                      />
                    </div>

                    <div className="beneficiaries-container__form-section__beneficiarie__form__field">
                      <SelectDropdown
                        id="genero"
                        selectValue={(beneficiarie as any)?.gender}
                        label="Género"
                        options={optionsGender}
                        targetKey="gender"
                        handleValue={(value) => formHanlder("gender", value)}
                      />
                    </div>

                    <div className="beneficiaries-container__form-section__beneficiarie__form__field">
                      <SelectDropdown
                        id="estado_civil"
                        selectValue={(beneficiarie as any)?.civil_status}
                        label="Estado Civil"
                        options={optionsCivilStatus}
                        targetKey="civil_status"
                        handleValue={(value) =>
                          formHanlder("civil_status", value)
                        }
                      />
                    </div>

                    <div className="beneficiaries-container__form-section__beneficiarie__form__field">
                      <SelectDropdown
                        id="pertenencia_etnica"
                        selectValue={(beneficiarie as any)?.ethnicity}
                        label="Pertenencia Étnica"
                        options={optionsEthnicity}
                        targetKey="ethnicity"
                        handleValue={(value) => formHanlder("ethnicity", value)}
                      />
                    </div>

                    <div className="beneficiaries-container__form-section__beneficiarie__form__field">
                      <SelectDropdown
                        id="nivel_educativo"
                        selectValue={(beneficiarie as any)?.education_level}
                        label="Nivel Educativo"
                        options={optionsEducationLevel}
                        targetKey="education_level"
                        handleValue={(value) =>
                          formHanlder("education_level", value)
                        }
                      />
                    </div>

                    <div className="beneficiaries-container__form-section__beneficiarie__form__field">
                      <SelectDropdown
                        id="ocupacion"
                        selectValue={(beneficiarie as any)?.ocupation}
                        label="Ocupación"
                        options={optionsOcupation}
                        targetKey="ocupation"
                        handleValue={(value) => formHanlder("ocupation", value)}
                      />
                    </div>

                    <div className="beneficiaries-container__form-section__beneficiarie__form__field">
                      <SelectDropdown
                        id="discapacidad"
                        selectValue={(beneficiarie as any)?.disability}
                        label="Discapacidad"
                        options={optionsDisability}
                        targetKey="disability"
                        handleValue={(value) =>
                          formHanlder("disability", value)
                        }
                      />
                    </div>

                    <div
                      className={`beneficiaries-container__form-section__beneficiarie__form__field }`}
                    >
                      <SelectDropdown
                        id="departamento"
                        selectValue={
                          getSelectedValueDep("residence_department")?.id
                        }
                        label="Departamento"
                        options={departmentsList}
                        keyLabel="name"
                        keyValue="id"
                        targetKey="residence_department"
                        handleValue={(value) =>
                          getMunicipiesList("residence_department", value)
                        }
                      />
                    </div>

                    <div
                      className={`activities-container__form-section__assitants__form-2__field}`}
                    >
                      <SelectDropdown
                        id="municipio"
                        selectValue={getSelectedValueMun("municipality")?.id}
                        label="Municipio"
                        options={municipiesList}
                        keyLabel="name"
                        keyValue="id"
                        targetKey="municipality"
                        handleValue={(value) =>
                          getCommunities("municipality", value)
                        }
                      />
                    </div>

                    <div
                      className={`activities-container__form-section__assitants__form-2__field}`}
                    >
                      <SelectDropdown
                        id="comuna"
                        selectValue={
                          (beneficiarie as any)?.community?._id ||
                          (beneficiarie as any)?.community
                        }
                        label="Comuna"
                        options={communityList}
                        keyLabel="name"
                        keyValue="_id"
                        targetKey="community"
                        handleValue={(value) =>
                          getAssociations("community", value)
                        }
                      />
                    </div>

                    <div className="activities-container__form-section__assitants__form-2__field">
                      <SelectDropdown
                        id="asociacion"
                        selectValue={
                          (beneficiarie as any)?.association?._id ||
                          (beneficiarie as any)?.association
                        }
                        label="Asociacion"
                        options={getAssociationsList()}
                        keyLabel="name"
                        keyValue="_id"
                        targetKey="association"
                        handleValue={(value) =>
                          formHanlder("association", value)
                        }
                      />
                    </div>
                    <div className="beneficiaries-container__form-section__beneficiarie__form__field">
                      <TextField
                        id="direccion"
                        className="beneficiaries-container__form-section__beneficiarie__form__field__input"
                        name="direccion"
                        placeholder="Dirección completa"
                        type="text"
                        label="Dirección"
                        onChange={(e) => formHanlder("address", e)}
                        value={(beneficiarie as any)?.address || ""}
                      />
                    </div>

                    <div className="beneficiaries-container__form-section__beneficiarie__form__field">
                      <SelectDropdown
                        id="departamento_SISBEN"
                        selectValue={
                          getSelectedValueDep("sisben_department")?.id
                        }
                        label="Departamento de SISBEN"
                        options={departmentsList}
                        keyLabel="name"
                        keyValue="id"
                        targetKey="sisben_department"
                        handleValue={(value) =>
                          formHanlder("sisben_department", value.name)
                        }
                      />
                    </div>

                    <div className="beneficiaries-container__form-section__beneficiarie__form__field">
                      <Autocomplete
                        id="eps"
                        style={{ width: "100%" }}
                        disablePortal
                        options={epsList}
                        onChange={(e: any, data: any) =>
                          formHanlder("eps", e, data)
                        }
                        value={(beneficiarie as any)?.eps || ""}
                        renderInput={(params) => (
                          <TextField {...params} label="EPS" />
                        )}
                      />
                    </div>

                    <div className="beneficiaries-container__form-section__beneficiarie__form__field">
                      <Autocomplete
                        style={{ width: "100%" }}
                        disablePortal
                        id="sisben_score"
                        options={sisbenList}
                        onChange={(e: any, data: any) =>
                          formHanlder("sisben_score", e, data)
                        }
                        renderInput={(params) => (
                          <TextField {...params} label="Puntaje SISBEN" />
                        )}
                        value={(beneficiarie as any)?.sisben_score || ""}
                      />
                    </div>

                    <div className="beneficiaries-container__form-section__beneficiarie__form__field">
                      <SelectDropdown
                        id="regimen_salud"
                        selectValue={(beneficiarie as any)?.health_regimen}
                        label="Régimen de Salud"
                        options={optionsRegimenHealth}
                        targetKey="health_regimen"
                        handleValue={(value) =>
                          formHanlder("health_regimen", value)
                        }
                      />
                    </div>

                    <FormControlLabel
                      control={<Checkbox />}
                      value={isVictimArmedConflict ? "Si" : "No"}
                      onChange={(e) =>
                        formHanlder("is_victim_armed_conflict", e)
                      }
                      label="¿Ha sido víctima del conflicto armado?"
                    />
                  </form>
                </TabPanel>
                <TabPanel value="3">
                  {openCamaraSupports && (
                    <div className="content-webcam">
                      <Webcam
                        className="video__capture__supports"
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                      />
                      <Button
                        className="btn-image--capture"
                        onClick={(e) => handlerCaptureSupport(e)}
                      >
                        Capturar imagen
                      </Button>
                      <Button
                        className="btn-image--delete"
                        onClick={() => cancelCaptureSupport()}
                      >
                        Cancelar
                      </Button>
                    </div>
                  )}
                  <Stack
                    className="content-supports"
                    direction="row"
                    spacing={2}
                  >
                    <Card sx={{ maxWidth: 200 }}>
                      <CardMedia
                        sx={{ width: 100, height: 100 }}
                        image={cedFront || frontCedula}
                        title="Cedula frontal"
                        onClick={() => displayImage(cedFront)}
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                          Cédula frontal
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <input
                          id="cedula__frontal"
                          hidden
                          type="file"
                          accept="image/*"
                          name="myImage"
                          onChange={(event) => handleImage(event, "front")}
                        />
                        <label
                          className="set__file btn__handler1"
                          htmlFor="cedula__frontal"
                        >
                          Explorar
                        </label>
                        <label
                          className="set__file btn__handler2"
                          onClick={() => openCaptureSupport("front")}
                        >
                          Cámara
                        </label>
                      </CardActions>
                    </Card>
                    <Card sx={{ maxWidth: 200 }}>
                      <CardMedia
                        sx={{ width: 100, height: 100 }}
                        image={cedBack || backCedula}
                        title="Cedula lateral"
                        onClick={() => displayImage(cedBack)}
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                          Cédula Lateral
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <input
                          id="cedula__lateral"
                          hidden
                          type="file"
                          accept="image/*"
                          name="myImage"
                          onChange={(event) => handleImage(event, "back")}
                        />
                        <label
                          className="set__file btn__handler1"
                          htmlFor="cedula__lateral"
                        >
                          Explorar
                        </label>
                        <label
                          className="set__file btn__handler2"
                          onClick={() => openCaptureSupport("back")}
                        >
                          Cámara
                        </label>
                      </CardActions>
                    </Card>
                    <Card sx={{ maxWidth: 200 }}>
                      <CardMedia
                        sx={{ width: 100, height: 100 }}
                        image={docEps || iconEps}
                        title="EPS"
                        onClick={() => displayImage(docEps)}
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                          Soporte EPS
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <input
                          id="soporte__eps"
                          hidden
                          type="file"
                          accept="image/*"
                          name="myImage"
                          onChange={(event) => handleImage(event, "eps")}
                        />
                        <label
                          className="set__file btn__handler1"
                          htmlFor="soporte__eps"
                        >
                          Explorar
                        </label>
                        <label
                          className="set__file btn__handler2"
                          onClick={() => openCaptureSupport("eps")}
                        >
                          Cámara
                        </label>
                      </CardActions>
                    </Card>
                    <Card sx={{ maxWidth: 345 }}>
                      <CardMedia
                        sx={{ width: 100, height: 100 }}
                        image={docSis || iconSisben}
                        title="SISBEN"
                        onClick={() => displayImage(docSis)}
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                          Soporte SISBEN
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <input
                          id="soporte__sisben"
                          hidden
                          type="file"
                          accept="image/*"
                          name="myImage"
                          onChange={(event) => handleImage(event, "sisben")}
                        />
                        <label
                          className="set__file btn__handler1"
                          htmlFor="soporte__sisben"
                        >
                          Explorar
                        </label>
                        <label
                          className="set__file btn__handler2"
                          onClick={() => openCaptureSupport("sisben")}
                        >
                          Cámara
                        </label>
                      </CardActions>
                    </Card>
                    <Card sx={{ maxWidth: 200 }}>
                      <CardMedia
                        sx={{ width: 100, height: 100 }}
                        image={docReg || iconRegistra}
                        title="Registraduria"
                        onClick={() => displayImage(docReg)}
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                          Registraduría
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <input
                          id="registraduria"
                          hidden
                          type="file"
                          accept="image/*"
                          name="myImage"
                          onChange={(event) => handleImage(event, "reg")}
                        />
                        <label
                          className="set__file btn__handler1"
                          htmlFor="registraduria"
                        >
                          Explorar
                        </label>
                        <label
                          className="set__file btn__handler2"
                          onClick={() => openCaptureSupport("reg")}
                        >
                          Cámara
                        </label>
                      </CardActions>
                    </Card>
                  </Stack>
                </TabPanel>
              </TabContext>
            </div>
            {/* <Button
              className="btn-save-beneficiarie"
              onClick={() => createBeneficiarie()}
            >
              Guardar Beneficiario
            </Button> */}
          </div>
        </Paper>
      </section>
      <SaveCancelControls
        saveText="Guardar"
        handleSave={(e) => createBeneficiarie()}
        disabled={validateFields()}
      />
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
      >
        <DialogContent>
          <img
            src={displayedImage}
            alt="support"
            width={"100%"}
            height={"100%"}
          />
        </DialogContent>
      </Dialog>
      <Toast
          open={openToast}
          message={`Ocurrio un error al guardar el beneficiario`}
          severity={SEVERITY_TOAST.ERROR}
          handleClose={() => setOpenToast(false)}
        />;
    </>
  );
}

export default Beneficiaries;