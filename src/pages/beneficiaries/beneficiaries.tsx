// import { Avatar, Button, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Stack, TextField, Typography } from "@mui/material";
// import firma from '../../assets/firma.jpeg';
// import huella from '../../assets/huella.jpeg';
import { Button, Paper, TextField, Typography,Checkbox, FormControlLabel ,Autocomplete, Tabs, Tab, Box, Stack, Card, CardMedia, CardContent, CardActions} from "@mui/material";
import "./beneficiaries.scss";
import SelectDropdown from "../../components/select";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { useEffect, useState } from "react";
import WebcamCapture from "./capture";
import DPersonaReader from "./dpersonaReader";
import {
  createBeneficiary,
  getBeneficiarieById,
  updateBeneficiary,
} from "../../services/beneficiaries.service";
import { useParams } from "react-router-dom";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import cameraImg from "../../assets/camera.png";
import documentImg from "../../assets/document.jpeg";

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
    {label:"Hombre",value:"Hombre"},
    {label:"Mujer",value:"Mujer"},
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
  const [selectedTab, setSelectedTab] = useState("1");
  const [cedFront, setCedFront] = useState(null);
  const [cedBack, setCedBack] = useState(null);
  const [docEps, setDocEps] = useState(null);
  const [docSis, setDocSis] = useState(null);
  const [docReg, setDocReg] = useState(null);
  const { beneficiarieId } = useParams();
  const sisbenRegex = /^(A[1-5]|B[1-7]|C[1-18]|D[1-21])$/;

  useEffect(() => {
    //getBeneficiary();
    getOptionsEps();
  }, []);

  const getOptionsEps=()=>{
    let list:any=[];
    eps.map((item:any)=>{
      list=[...list,{label:item.name,value:item._id}];
    });
    setOptionsEps(list);
  }

  const formHanlder = (target: string, e: any,data?:any) => {
    if (target === "is_victim_armed_conflict")setIsVictimArmedConflict(!isVictimArmedConflict);
    const value = e.target.value;
    setBeneficiarie({ ...beneficiarie, [target]: value });
    if (target === "sisben_score") setIsSisbenValid(sisbenRegex.test(value));
    if (target === "eps" && data !== null){
      setBeneficiarie({ ...beneficiarie, [target]: data.value});
    }
  };

  const handleWebcamCapture = (imageBlob: any) => {
    // Include the imageBlob in your FormData
    const file = imageBlob;
    setSelectedFile(file);
  };

  const saveBeneficiary = async (beneficiary: any) => {
    const saveData = beneficiarieId ? updateBeneficiary : createBeneficiary;
    if (selectedFile || (beneficiarie as any)?.photo_url) {
      try {
        const response = await saveData(selectedFile, beneficiary); // Replace with your actual access token
        console.log("Upload successful:", response);
      } catch (error) {
        console.error("Upload failed:", error);
      }
    } else {
      console.log("No file selected.");
    }
  };

  const createBeneficiarie = () => {
    saveBeneficiary(beneficiarie);
  };

  const getBeneficiary = async () => {
    try {
      const response = await getBeneficiarieById(beneficiarieId);
      if (response.status === 200) {
        setBeneficiarie(response.result.data);
      }
    } catch (error) {
      throw new Error("the beneficieary doesn't exist");
    }
  };

  const handleImage = (e, key) => {
    console.log(e);
    const imageDoc2 = e.target.files[0];
    const imageDoc = URL.createObjectURL(imageDoc2);
    console.log(URL.createObjectURL(imageDoc2));
    switch(key) {
      case "front":
        setCedFront(imageDoc);
        break;
      case "back":
        setCedBack(imageDoc);
        break;
      case "eps":
        setDocEps(imageDoc);
        break;
      case "sisben":
        setDocSis(imageDoc);
        break;
      case "reg":
        setDocReg(imageDoc);
        break;
      default: break;
    }
  }

  const handleSelectedTab = (e, newValue) => {
    setSelectedTab(newValue);
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
                isEditing={Boolean(beneficiarieId)}
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
                    options={["M", "F"]}
                    onChange={(e:any,data:any)=>formHanlder("sex",e,data)}
                    renderInput={(params) => <TextField  {...params} label="Sexo" />}
                  />
                </div>

                <div className="beneficiaries-container__form-section__beneficiarie__form__field">
                  <TextField
                    id="fechanacimiento"
                    className="beneficiaries-container__form-section__beneficiarie__form__field__input"
                    name="fechanacimiento"
                    placeholder="01-02-2023"
                    type="text"
                    label="Fecha de Nacimiento"
                    onChange={(e) => formHanlder("birthday", e)}
                    value={(beneficiarie as any)?.birthday || ""}
                  />
                </div>

                <div className="beneficiaries-container__form-section__beneficiarie__form__field">
                  <Autocomplete style={{width:"100%"}}
                    disablePortal
                    id="blody_type"
                    options={["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"]}
                    onChange={(e:any,data:any)=>formHanlder("blody_type",e,data)}
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
                      options={municipios}
                      keyLabel="name"
                      keyValue="_id"
                      targetKey="municipality"
                      handleValue={formHanlder}
                    />
                  </div>

                  <div className="beneficiaries-container__form-section__beneficiarie__form__field">
                    <SelectDropdown
                      selectValue={(beneficiarie as any)?.community}
                      label="Comuna"
                      options={comuna}
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
                      options={asociacion}
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
                      onChange={(e:any,data:any)=>formHanlder("eps",e,data)}
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
                      onChange={(e) => formHanlder("sisben_score", e)}
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

                <FormControlLabel control={<Checkbox />}  value={isVictimArmedConflict ?'Si':'No'} onChange={(e)=>formHanlder("is_victim_armed_conflict",e)}  label="¿Ha sido víctima del conflicto armado?" />
              </form>
              </TabPanel>
              <TabPanel value="3">
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
                        type="file"
                        name="myImage"
                        onChange={(event) => handleImage(event, "front")}
                      />
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
                        type="file"
                        name="myImage"
                        onChange={(event) => handleImage(event, "back")}
                      />
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
                        type="file"
                        name="myImage"
                        onChange={(event) => handleImage(event, "eps")}
                      />
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
                        type="file"
                        name="myImage"
                        onChange={(event) => handleImage(event, "sisben")}
                      />
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
                        type="file"
                        name="myImage"
                        onChange={(event) => handleImage(event, "reg")}
                      />
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
