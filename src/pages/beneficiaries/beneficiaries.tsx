// import { Avatar, Button, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Stack, TextField, Typography } from "@mui/material";
import tony from '../../assets/tony.jpg';
// import firma from '../../assets/firma.jpeg';
// import huella from '../../assets/huella.jpeg';
import { Button, Paper, TextField, Typography } from '@mui/material';
import './beneficiaries.scss';
import SelectDropdown from '../../components/select';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { useEffect, useState } from 'react';
import WebcamCapture from './capture';
import { createBeneficiary } from '../../services/beneficiaries.service';


function Beneficiaries() {
    const documentTypes = [{ label: 'C.C', value: 'cc' }, { label: 'Pasaporte', value: 'pasaporte' }, { label: 'NIT', value: 'nit' }]
    const bloodTypes = [{ label: 'A+', value: 'A+' }, { label: 'O+', value: 'O+' }, { label: 'B+', value: 'B+' }, { label: 'AB+', value: 'AB+' }, { label: 'A-', value: 'A-' }, { label: 'O-', value: 'O-' }, { label: 'B-', value: 'B-' }, { label: 'AB-', value: 'AB-' }]
    const comuna = useSelector((state: RootState) => state.references.references.communities);
    const asociacion = useSelector((state: RootState) => state.references.references.associations);
    const municipios = useSelector((state: RootState) => state.references.references.municipalities);
    const eps = useSelector((state: RootState) => state.references.references.eps);
    const [beneficiarie, setBeneficiarie] = useState({});
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    useEffect(() => {
    }, [])

    const formHanlder = (target: string, e: any) => {
        const value = e.target.value;
        setBeneficiarie({ ...beneficiarie, [target]: value });
        
    }

    const handleWebcamCapture = (imageBlob: any) => {
        // Include the imageBlob in your FormData
        const file = imageBlob;
        setSelectedFile(file);

    };

    const saveBeneficiary = async (beneficiary: any) => {
        if (selectedFile) {
            console.log(selectedFile);
            try {
                const response = await createBeneficiary(selectedFile, beneficiary); // Replace with your actual access token
                console.log('Upload successful:', response);
            } catch (error) {
                console.error('Upload failed:', error);
            }
        } else {
            console.log('No file selected.');
        }
    }

    const createBeneficiarie = () => {
        const beneficiary = JSON.stringify(beneficiarie);
        saveBeneficiary(beneficiary);
    }

    return (
        <>
            <section className='beneficiaries-container'>
                <header className="beneficiaries-container__actions">
                    <div className="content-page-title">
                        <Typography variant="h5" className="page-header">Administrar beneficiarios</Typography>
                        <span className="page-subtitle">Aqui podras gestionar los usuarios del sistema.</span>
                    </div>
                </header>

                <Paper elevation={1} className="beneficiaries-container__form-section">
                    <div className='beneficiaries-container__form-section__resources'>
                        <div className='beneficiaries-container__form-section__resources__foto'>
                            <WebcamCapture onCapture={handleWebcamCapture} />
                        </div>
                    </div>
                    <div className='beneficiaries-container__form-section__beneficiarie'>

                        <form className="beneficiaries-container__form-section__beneficiarie__form">


                            <div className="beneficiaries-container__form-section__beneficiarie__form__field">
                                <SelectDropdown
                                    label="Tipo de documento"
                                    options={documentTypes}
                                    targetKey='identification_type'
                                    handleValue={formHanlder}
                                />
                            </div>

                            <div className="beneficiaries-container__form-section__beneficiarie__form__field">
                                <TextField
                                    id="nodocumento"
                                    className="beneficiaries-container__form-section__beneficiarie__form__field__input"
                                    name='nodocumento'
                                    placeholder='112233445'
                                    type='number'
                                    onChange={(e) => formHanlder('identification', e)}
                                    label="No Documento"
                                />
                            </div>

                            <div className="beneficiaries-container__form-section__beneficiarie__form__field">
                                <TextField
                                    id="primerap"
                                    className="beneficiaries-container__form-section__beneficiarie__form__field__input"
                                    name='primerap'
                                    placeholder='Zapata'
                                    type='text'
                                    label="Primer Apellido"
                                    onChange={(e) => formHanlder('first_last_name', e)}
                                />
                            </div>

                            <div className="beneficiaries-container__form-section__beneficiarie__form__field">
                                <TextField
                                    id="segundoap"
                                    className="beneficiaries-container__form-section__beneficiarie__form__field__input"
                                    name='segundoap'
                                    placeholder='Rodriguez'
                                    type='text'
                                    label="Segundo Apellido"
                                    onChange={(e) => formHanlder('second_last_name', e)}
                                />
                            </div>

                            <div className="beneficiaries-container__form-section__beneficiarie__form__field">
                                <TextField
                                    id="primernom"
                                    className="beneficiaries-container__form-section__beneficiarie__form__field__input"
                                    name='primernom'
                                    placeholder='Juanito'
                                    type='text'
                                    label="Primer Nombre"
                                    onChange={(e) => formHanlder('first_name', e)}
                                />
                            </div>

                            <div className="beneficiaries-container__form-section__beneficiarie__form__field">
                                <TextField
                                    id="segundonom"
                                    className="beneficiaries-container__form-section__beneficiarie__form__field__input"
                                    name='segundonom'
                                    placeholder='Andres'
                                    type='text'
                                    label="Segundo Nombre"
                                    onChange={(e) => formHanlder('second_name', e)}
                                />
                            </div>

                            <div className="beneficiaries-container__form-section__beneficiarie__form__field">
                                <SelectDropdown
                                    label="Sexo"
                                    options={[{ label: 'Masculino', value: 'Masculino' }, { label: 'Femenino', value: 'Femenino' }]}
                                    targetKey='gender'
                                    handleValue={formHanlder}
                                />
                            </div>

                            <div className="beneficiaries-container__form-section__beneficiarie__form__field">
                                <TextField
                                    id="fechanacimiento"
                                    className="beneficiaries-container__form-section__beneficiarie__form__field__input"
                                    name='fechanacimiento'
                                    placeholder='01-02-2023'
                                    type='text'
                                    label="Fecha de Nacimiento"
                                    onChange={(e) => formHanlder('birthday', e)}
                                />
                            </div>

                            <div className="beneficiaries-container__form-section__beneficiarie__form__field">
                                <SelectDropdown
                                    label="Tipo de Sangre"
                                    options={bloodTypes}
                                />
                            </div>

                            <div className="beneficiaries-container__form-section__beneficiarie__form__field">
                                <SelectDropdown
                                    label="Municipios"
                                    options={municipios}
                                    keyLabel='name'
                                    keyValue='_id'
                                    targetKey='municipality'
                                    handleValue={formHanlder}
                                />
                            </div>

                            <div className="beneficiaries-container__form-section__beneficiarie__form__field">
                                <SelectDropdown
                                    label="Comuna"
                                    options={comuna}
                                    keyLabel='name'
                                    keyValue='_id'
                                    targetKey='community'
                                    handleValue={formHanlder}
                                />
                            </div>

                            <div className="beneficiaries-container__form-section__beneficiarie__form__field">
                                <SelectDropdown
                                    label="Asociación"
                                    options={asociacion}
                                    keyLabel='name'
                                    keyValue='_id'
                                    targetKey='association'
                                    handleValue={formHanlder}
                                />
                            </div>

                            <div className="beneficiaries-container__form-section__beneficiarie__form__field">
                                <SelectDropdown
                                    label="EPS"
                                    options={eps}
                                    keyLabel='name'
                                    keyValue='_id'
                                    targetKey='eps'
                                    handleValue={formHanlder}
                                />
                            </div>

                            <div className="beneficiaries-container__form-section__beneficiarie__form__field">
                                <TextField
                                    id="puntajesisben"
                                    className="beneficiaries-container__form-section__beneficiarie__form__field__input"
                                    name='puntajesisben'
                                    placeholder='12'
                                    type='text'
                                    label="Puntaje SISBEN"
                                    onChange={(e) => formHanlder('sisben_score', e)}
                                />
                            </div>

                        </form>

                        <Button className='btn-save-beneficiarie' onClick={() => createBeneficiarie()}>Guardar Beneficiario</Button>
                    </div>
                </Paper>
            </section>
        </>
    );
}

export default Beneficiaries;


/**
 *              "first_name": "Keiner",
                "second_name": "Jose",
                "first_last_name": "Pajaro",
                "second_last_name": "Ordoniez",
                "identification_type": "Cedula",
                "identification": "123456789",
                "eps": "64dc6afa77a66abcebddea08",
                "sisben_score": 85,
                "birthday": "1990-05-15",
                "gender": "Masculino",
                "ethnic_affiliation": "Indigena",
                "marital_status": "Casado",
                "is_disability": true,
                "type_of_disability": "Movilidad",
                "place_of_birth": "Bogota",
                "region": "Andina",
                "municipality": "64dc7d46dc6709f5787e08cf",
                "community": "64dc7e17dc6709f5787e08d0",
                "association": "64dc7ec4dc6709f5787e08d1",
                "neighborhood": "64dc7fd7c4ab7d79157d5ec6",
                "address": "123 Main St",
                "phones": ["123-456-7890", "987-654-3210"],
                "responsible_family_member": "Jane Doe",
                "kinship": "Spouse"
 */