// import { Avatar, Button, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Stack, TextField, Typography } from "@mui/material";
// import firma from '../../assets/firma.jpeg';
// import huella from '../../assets/huella.jpeg';
import { Button, Paper, TextField, Typography,Checkbox, FormControlLabel ,Autocomplete, Tabs, Tab, Box, Stack, Card, CardMedia, CardContent, CardActions} from "@mui/material";
import "./beneficiaries.scss";
import SelectDropdown from "../../components/select";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
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
import cameraImg from "../../assets/camera.png";
import documentImg from "../../assets/document.jpeg";
import Webcam from "react-webcam";
import { ROUTES } from "../../constants/routes";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from "dayjs";

function Beneficiaries() {
  const documentTypes = [
    { label: "C.C", value: "cc" },
    { label: "Pasaporte", value: "pasaporte" },
    { label: "NIT", value: "nit" },
    { label: "Permiso especial de permanencia", value: "permiso especial de permanencia " },
    { label: "Contraseña", value: "contraseña" },
  ];
  const optionsCivilStatus=[
    {label:"Soltero",value:"Soltero"},
    {label:"Casado",value:"Casado"},
    {label:"Divorciado",value:"Divorciado"},
    {label:"Viudo",value:"Viudo"},
    {label:"Union libre",value:"Union libre"},
    {label:"Separado",value:"Separado"},
  ];
  const optionsRegimenHealth=[
    {label:"Subsidiado",value:"Subsidiado"},  
    {label:"Contributivo",value:"Contributivo"},  
    {label:"Cotizante",value:"Cotizante"},  
    {label:"Cotizante Beneficiario",value:"Cotizante Beneficiario"},  
  ];

  const optionsEthnicity=[
    {label:"Indígena",value:"Indígena"},  
    {label:"Afro",value:"Afro"},  
    {label:"Raizal",value:"Raizal"},  
    {label:"Palenquero",value:"Palenquero"},  
    {label:"Ninguno",value:"Ninguno"},  
  ];

  const optionsEducationLevel=[
    {label:"Primaria",value:"Primaria"},  
    {label:"Secundaria",value:"Secundaria"},  
    {label:"Técnica",value:"Técnica"},  
    {label:"Universitaria",value:"Universitaria"},  
    {label:"Sin escolaridad",value:"Sin escolaridad"},  
    {label:"Otra",value:"Otra"},  
  ];

  const optionsDisability=[
    {label:"Auditiva",value:"Auditiva"},  
    {label:"Visual",value:"Visual"},  
    {label:"Del gusto",value:"Del gusto"},  
    {label:"Olfato",value:"Olfato"},  
    {label:"Tacto",value:"Tacto"},  
    {label:"Multiple",value:"Multiple"},  
    {label:"Mental-Cognitiva",value:"Mental-Cognitiva"},  
    {label:"Mental-Psicosocial",value:"Mental-Psicosocial"},  
    {label:"Otra",value:"Otra"},  
  ];

  const optionsOcupation=[
    {label:"Empleo formal",value:"Empleo formal"},  
    {label:"Empleo informal",value:"Empleo informal"},  
    {label:"Desempleado",value:"Desempleado"},  
    {label:"Pensionado",value:"Pensionado"},  
    {label:"Hogar",value:"Hogar"}, 
    {label:"Campesino",value:"Campesino"}, 
  ];

  const optionsGender=[
    {label:"Masculino",value:"Masculino"},
    {label:"Femenino",value:"Femenino"},
    {label:"Otro",value:"Otro"},
  ];

  const comuna = useSelector(
    (state: RootState) => state.references.references?.communities
  );
  const asociacion = useSelector(
    (state: RootState) => state.references.references?.associations
  );
  const municipios = useSelector(
    (state: RootState) => state.references.references?.municipalities
  );
  const eps = useSelector(
    (state: RootState) => state.references.references?.eps
  );
  const [beneficiarie, setBeneficiarie] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSisbenValid, setIsSisbenValid] = useState(true);
  const [isVictimArmedConflict, setIsVictimArmedConflict] = useState(true);
  const [optionsEps, setOptionsEps] = useState([]);
  const [optionsMunicipality, setOptionsMunicipality] = useState([]);
  const [optionsComuna, setOptionsComuna] = useState([]);
  const [optionsAsociacion, setOptionsAsociacion] = useState([]);
  const [selectedTab, setSelectedTab] = useState("1");
  const [cedFront, setCedFront] = useState(null);
  const [cedBack, setCedBack] = useState(null);
  const [docEps, setDocEps] = useState(null);
  const [docSis, setDocSis] = useState(null);
  const [docReg, setDocReg] = useState(null);
  const { beneficiarieId } = useParams();
  const sisbenRegex = /^(A[1-5]|B[1-7]|C[1-18]|D[1-21])$/;
  const [openCamaraSupports,setOpenCamaraSupports]=useState(false);
  const webcamRef=useRef(null);
  const [typeSupport,setTypeSupport]=useState(null);
  const [files,setFiles]=useState([]);
  const navigate=useNavigate();

  useEffect(() => {
    if(beneficiarieId!==undefined){
      getBeneficiary();
    }
    getOptionsEps();
    getOptionsMunicipality();
    getOptionsComuna();
    getOptionsAsociacion();
  }, []);


  const getBeneficiary = async () => {
    try {
      const response = await getBeneficiarieById(beneficiarieId);
      if (response.status === 200) {
        setBeneficiarie(response.result.data);
        setFilesBen(response.result.data);
      }
    } catch (error) {
      navigate(`${ROUTES.DASHBOARD}/${ROUTES.BEN_LIST}`);
    }
  };

  const setFilesBen = (data) => {
    setDocEps(data?.fosiga_url);
    setCedBack(data?.id_back);
    setCedFront(data?.id_front);
    setDocReg(data?.registry_doc_url);
    setDocSis(data?.sisben_url);
  }

  const getOptionsAsociacion=()=>{
    let list:any=[];
    asociacion.map((item:any)=>{
      list=[...list,{label:item.name,value:item._id}];
    });
    setOptionsAsociacion(list);
  }

  const getOptionsComuna=()=>{
    let list:any=[];
    comuna.map((item:any)=>{
      list=[...list,{label:item.name,value:item._id}];
    });
    setOptionsComuna(list);
  }

  const getOptionsMunicipality=()=>{
    let list:any=[];
    municipios.map((item:any)=>{
      list=[...list,{label:item.name,value:item._id}];
    });
    setOptionsMunicipality(list);
  }

  const getOptionsEps=()=>{
    let list:any=[];
    eps.map((item:any)=>{
      list=[...list,{label:item.name,value:item._id}];
    });
    setOptionsEps(list);
  }

  const formHanlder = (target: string, e: any,data?:any) => {
    if(data){
      setBeneficiarie({ ...beneficiarie, [target]: data});
    }else{
      if (target === "is_victim_armed_conflict")setIsVictimArmedConflict(!isVictimArmedConflict);
      const value = e.target.value;
      setBeneficiarie({ ...beneficiarie, [target]: value });
      if (target === "sisben_score") setIsSisbenValid(sisbenRegex.test(value));
    }
  };

  const handleWebcamCapture = (imageBlob: any) => {
    // Include the imageBlob in your FormData
    const file = imageBlob;
    const ext=file.type.split("/")[1];
    const filePhoto=new File([file],"foto."+ext);
    setFileBen("photo_url",filePhoto);
    setSelectedFile(file);
  };

  const getFormData=()=>{
    const formData=new FormData();
    files.map((item,index)=>{
      const keys=Object.keys(item);
      formData.append(keys[0],files[index][`${keys[0]}`]);
    });
    return formData;
  }

  const saveBeneficiary = async (beneficiary: any) => {
    const saveData = beneficiarieId ? updateBeneficiary : createBeneficiary;
    if (files || (beneficiarie as any)?.photo_url) {
      try {
        await saveData(getFormData(), beneficiary); // Replace with your actual access token
        navigate(`${ROUTES.DASHBOARD}/${ROUTES.BEN_LIST}`);
      } catch (error) {
        console.error("Upload failed:", error);
      }
    }
  };

  const createBeneficiarie = () => {
    saveBeneficiary(beneficiarie);
  };

  const setFileBen=(key,file,name?:string | null)=>{
    const listFiles=files;
    let fileParse=null;
    if(name){
      const ext="."+file.type.split("/")[1];
      fileParse=new File([file],name+ext);
      listFiles.push({[`${key}`]:fileParse});
      setFiles([...listFiles]);
    }else{
      listFiles.push({[`${key}`]:file});
      setFiles([...listFiles]);
    }
  }

  const handleImage = (e, key) => {
    const imageDoc2 = e.target.files[0];
    const imageDoc = URL.createObjectURL(imageDoc2);
    switch(key) {
      case "front":
        setCedFront(imageDoc);
        setFileBen("id_front",imageDoc2);
        break;
      case "back":
        setFileBen("id_back",imageDoc2);
        setCedBack(imageDoc);
        break;
      case "eps":
        setFileBen("fosiga_url",imageDoc2);
        setDocEps(imageDoc);
        break;
      case "sisben":
        setFileBen("sisben_url",imageDoc2);
        setDocSis(imageDoc);
        break;
      case "reg":
        setFileBen("registry_doc_url",imageDoc2);
        setDocReg(imageDoc);
        break;
      default: break;
    }
  }

  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
};

  const getCaptureSupport=()=>{
    return webcamRef.current.getScreenshot();
  } 

  const handlerCaptureSupport = (e) => {
    const imageDoc2=dataURItoBlob(getCaptureSupport());
    const imageDoc = URL.createObjectURL(imageDoc2);
    switch(typeSupport) {
      case "front":
        setFileBen("id_front",imageDoc2,"cedula-frontal");
        setCedFront(imageDoc);
        break;
      case "back":
        setFileBen("id_back",imageDoc2,"cedula-frontal");
        setCedBack(imageDoc);
        break;
      case "eps":
        setFileBen("fosiga_url",imageDoc2,"soporte-eps");
        setDocEps(imageDoc);
        break;
      case "sisben":
        setFileBen("sisben_url",imageDoc2,"soporte-sisben");
        setDocSis(imageDoc);
        break;
      case "reg":
        setFileBen("registry_doc_url",imageDoc2,"registraduria");
        setDocReg(imageDoc);
        break;
      default: break;
    }
    setOpenCamaraSupports(false);
    setTypeSupport(null);
  }

  const handleSelectedTab = (e, newValue) => {
    setSelectedTab(newValue);
  }

  const openCaptureSupport=(typeSupport:string)=>{
    setTypeSupport(typeSupport);
    setOpenCamaraSupports(true);
  }
  
  const cancelCaptureSupport=()=>{
    setOpenCamaraSupports(false);
  }

  return (
    <>
      <section className="beneficiaries-container">
        <header className="beneficiaries-container__actions">
          <div className="content-page-title">
            <Typography variant="h5" className="page-header">
              Administrar beneficiarios
            </Typography>
            <span className="page-subtitle">
              Aqui podras gestionar los usuarios del sistema.
            </span>
          </div>
        </header>

        <Paper elevation={1} className="beneficiaries-container__form-section">
          <div className="beneficiaries-container__form-section__resources">
            <div className="beneficiaries-container__form-section__resources__foto">
              <WebcamCapture
                onCapture={handleWebcamCapture}
                isEditing={(beneficiarie as any)?.photo_url !==undefined ? true : false}
                existingImage={(beneficiarie as any)?.photo_url || null}
              />
            </div>
            <div>
              <DPersonaReader />
            </div>
          </div>
          <div className="beneficiaries-container__form-section__beneficiarie">
            <TabContext value={selectedTab}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList onChange={handleSelectedTab} aria-label="Información de beneficiario" centered>
                  <Tab label="Información básica" value="1" />
                  <Tab label="Información complementaria" value="2" />
                  <Tab label="Soportes" value="3" />
                </TabList>
              </Box>
              <TabPanel value="1">
                <form className="beneficiaries-container__form-section__beneficiarie__form">
                <div className="beneficiaries-container__form-section__beneficiarie__form__field">
                  <SelectDropdown
                    selectValue={(beneficiarie as any)?.identification_type}
                    label="Tipo de documento"
                    options={documentTypes}
                    targetKey="identification_type"
                    handleValue={formHanlder}
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
                    className="beneficiaries-container__form-section__beneficiarie__form__field__input"
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
                  <Autocomplete style={{width:"100%"}}
                    disablePortal
                    id="sex"
                    options={['Hombre', 'Mujer', 'Otro']}
                    onChange={(e:any,data:any)=>formHanlder("sex",e,data)}
                    renderInput={(params) => <TextField  {...params} label="Sexo" />}
                    value={(beneficiarie as any)?.sex || ""}
                  />
                </div>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker 
                        onChange={(newDate: Dayjs) => formHanlder('birthday', newDate.format())}
                        value={(beneficiarie as any)?.birthday ? dayjs((beneficiarie as any)?.birthday) : null}
                        label="Fecha de nacimiento"
                    />
                </LocalizationProvider>

                <div className="beneficiaries-container__form-section__beneficiarie__form__field">
                  <Autocomplete style={{width:"100%"}}
                    disablePortal
                    id="blody_type"
                    options={["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"]}
                    onChange={(e:any,data:any)=>formHanlder("blody_type",e,data)}
                    value={(beneficiarie as any)?.blody_type || ""}
                    renderInput={(params) => <TextField  {...params} label="Tipo de sangre" />}
                  />
                </div>
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
                    <TextField
                      id="departamentoresidencia"
                      className="beneficiaries-container__form-section__beneficiarie__form__field__input"
                      name="departamentoresidencia"
                      placeholder="Norte de Santander"
                      type="text"
                      label="Departamento de Residencia"
                      onChange={(e) => formHanlder("residence_department", e)}
                      value={(beneficiarie as any)?.residence_department || ""}
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
                      selectValue={(beneficiarie as any)?.gender}
                      label="Género"
                      options={optionsGender}
                      targetKey="gender"
                      handleValue={formHanlder}
                    />
                  </div>

                  <div className="beneficiaries-container__form-section__beneficiarie__form__field">
                    <SelectDropdown
                      selectValue={(beneficiarie as any)?.civil_status}
                      label="Estado Civil"
                      options={optionsCivilStatus}
                      targetKey="civil_status"
                      handleValue={formHanlder}
                    />
                  </div>

                  <div className="beneficiaries-container__form-section__beneficiarie__form__field">
                    <SelectDropdown
                      selectValue={(beneficiarie as any)?.ethnicity}
                      label="Pertenencia Étnica"
                      options={optionsEthnicity}
                      targetKey="ethnicity"
                      handleValue={formHanlder}
                    />
                  </div>

                  <div className="beneficiaries-container__form-section__beneficiarie__form__field">
                    <SelectDropdown
                      selectValue={(beneficiarie as any)?.education_level}
                      label="Nivel Educativo"
                      options={optionsEducationLevel}
                      targetKey="education_level"
                      handleValue={formHanlder}
                    />
                  </div>

                  <div className="beneficiaries-container__form-section__beneficiarie__form__field">
                    <SelectDropdown
                      selectValue={(beneficiarie as any)?.ocupation}
                      label="Ocupación"
                      options={optionsOcupation}
                      targetKey="ocupation"
                      handleValue={formHanlder}
                    />
                  </div>

                  <div className="beneficiaries-container__form-section__beneficiarie__form__field">
                    <SelectDropdown
                      selectValue={(beneficiarie as any)?.disability}
                      label="Discapacidad"
                      options={optionsDisability}
                      targetKey="disability"
                      handleValue={formHanlder}
                    />
                  </div>

                  <div className="beneficiaries-container__form-section__beneficiarie__form__field">
                    <SelectDropdown
                      selectValue={(beneficiarie as any)?.municipality}
                      label="Municipios"
                      options={optionsMunicipality}
                      keyLabel="name"
                      // keyValue="_id"
                      targetKey="municipality"
                      handleValue={formHanlder}
                    />
                  </div>

                  <div className="beneficiaries-container__form-section__beneficiarie__form__field">
                    <SelectDropdown
                      selectValue={(beneficiarie as any)?.community}
                      label="Comuna"
                      options={optionsComuna}
                      keyLabel="name"
                      keyValue="_id"
                      targetKey="community"
                      handleValue={formHanlder}
                    />
                  </div>

                  <div className="beneficiaries-container__form-section__beneficiarie__form__field">
                    <SelectDropdown
                      selectValue={(beneficiarie as any)?.association}
                      label="Asociación"
                      options={optionsAsociacion}
                      keyLabel="name"
                      keyValue="_id"
                      targetKey="association"
                      handleValue={formHanlder}
                    />
                  </div>

                  <div className="beneficiaries-container__form-section__beneficiarie__form__field">
                    <TextField
                      id="departamentosisben"
                      className="beneficiaries-container__form-section__beneficiarie__form__field__input"
                      name="departamentosisben"
                      placeholder="Norte de Santander"
                      type="text"
                      label="Departamento de SISBEN"
                      onChange={(e) => formHanlder("sisben_department", e)}
                      value={(beneficiarie as any)?.sisben_department || ""}
                    />
                  </div>

                  <div className="beneficiaries-container__form-section__beneficiarie__form__field">
                    <Autocomplete style={{width:"100%"}}
                      disablePortal
                      id="eps"
                      options={optionsEps}
                      value={beneficiarie!=null && optionsEps.find((item)=>item.value===(beneficiarie as any)?.eps) || ""}
                      onChange={(e:any,data:any)=>formHanlder("eps",e,data.value)}
                      renderInput={(params) => <TextField  {...params} label="EPS" />}
                    />
                  </div>

                  <div className="beneficiaries-container__form-section__beneficiarie__form__field">
                    <TextField
                      id="puntajesisben"
                      className="beneficiaries-container__form-section__beneficiarie__form__field__input"
                      name="puntajesisben"
                      placeholder="A1"
                      type="text"
                      label="Categoria SISBEN"
                      onChange={(e) => formHanlder("sisben_score",e)}
                      error={!isSisbenValid}
                      helperText={!isSisbenValid ? "Categoria no valida" : ""}
                      value={(beneficiarie as any)?.sisben_score || ""}
                    />
                  </div>

                  <div className="beneficiaries-container__form-section__beneficiarie__form__field">
                    <SelectDropdown
                      selectValue={(beneficiarie as any)?.health_regimen}
                      label="Régimen de Salud"
                      options={optionsRegimenHealth}
                      targetKey="health_regimen"
                      handleValue={formHanlder}
                    />
                  </div>

                <FormControlLabel control={<Checkbox />} value={isVictimArmedConflict ?'Si':'No'} onChange={(e)=>formHanlder("is_victim_armed_conflict",e)}  label="¿Ha sido víctima del conflicto armado?" />
              </form>
              </TabPanel>
              <TabPanel value="3">
                {
                  openCamaraSupports && 
                  <div className='content-webcam'>
                    <Webcam className="video__capture__supports"
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    />
                    <Button  className='btn-image--capture' onClick={(e)=>handlerCaptureSupport(e)} >Capturar imagen</Button>
                    <Button className='btn-image--delete' onClick={()=>cancelCaptureSupport()} >Cancelar</Button>
                  </div>
                }
                <Stack direction="row" spacing={2}>
                  <Card sx={{ maxWidth: 200 }}>
                    <CardMedia
                      sx={{ width: 100 , height: 100 }}
                      image={cedFront || cameraImg}
                      title="Cedula frontal"
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
                        name="myImage"
                        onChange={(event) => handleImage(event, "front")}
                      />
                      <label className="set__file btn__handler1" htmlFor="cedula__frontal">Explorar</label>
                      <label className="set__file btn__handler2" onClick={()=>openCaptureSupport("front")}>Cámara</label>
                    </CardActions>
                  </Card>
                  <Card sx={{ maxWidth: 200 }}>
                    <CardMedia
                      sx={{ width: 100 , height: 100 }}
                      image={cedBack || cameraImg}
                      title="Cedula lateral"
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
                        name="myImage"
                        onChange={(event) => handleImage(event, "back")}
                      />
                      <label className="set__file btn__handler1" htmlFor="cedula__lateral">Explorar</label>
                      <label className="set__file btn__handler2" onClick={()=>openCaptureSupport("back")}>Cámara</label>
                    </CardActions>
                  </Card>
                  <Card sx={{ maxWidth: 200 }}>
                    <CardMedia
                      sx={{ width: 100 , height: 100 }}
                      image={docEps || documentImg}
                      title="Cedula frontal"
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
                        name="myImage"
                        onChange={(event) => handleImage(event, "eps")}
                      />
                      <label className="set__file btn__handler1" htmlFor="soporte__eps">Explorar</label>
                      <label className="set__file btn__handler2" onClick={()=>openCaptureSupport("eps")}>Cámara</label>
                    </CardActions>
                  </Card>
                  <Card sx={{ maxWidth: 345 }}>
                    <CardMedia
                      sx={{ width: 100 , height: 100 }}
                      image={docSis || documentImg}
                      title="Cedula lateral"
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
                        name="myImage"
                        onChange={(event) => handleImage(event, "sisben")}
                      />
                      <label className="set__file btn__handler1" htmlFor="soporte__sisben">Explorar</label>
                      <label className="set__file btn__handler2" onClick={()=>openCaptureSupport("sisben")}>Cámara</label>
                    </CardActions>
                  </Card>
                  <Card sx={{ maxWidth: 200 }}>
                    <CardMedia
                      sx={{ width: 100 , height: 100 }}
                      image={docReg || documentImg}
                      title="Cedula lateral"
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
                        name="myImage"
                        onChange={(event) => handleImage(event, "reg")}
                      />
                      <label className="set__file btn__handler1" htmlFor="registraduria">Explorar</label>
                      <label className="set__file btn__handler2" onClick={()=>openCaptureSupport("reg")}>Cámara</label>
                    </CardActions>
                  </Card>
                </Stack>
              </TabPanel>
            </TabContext>
            <Button
              className="btn-save-beneficiarie"
              onClick={() => createBeneficiarie()}
            >
              Guardar Beneficiario
            </Button>
          </div>
        </Paper>
      </section>
    </>
  );
}

export default Beneficiaries;
