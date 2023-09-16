// import { Avatar, Button, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Stack, TextField, Typography } from "@mui/material";
// import firma from '../../assets/firma.jpeg';
// import huella from '../../assets/huella.jpeg';
import { Button, Paper, TextField, Typography } from '@mui/material';
import './beneficiaries.scss';
import SelectDropdown from '../../components/select';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { useEffect, useState } from 'react';
import WebcamCapture from './capture';
import DPersonaReader from './dpersonaReader';
import { createBeneficiary, getBeneficiarieById, updateBeneficiary } from '../../services/beneficiaries.service';
import { useParams } from 'react-router-dom';


function Beneficiaries() {
    const documentTypes = [{ label: 'C.C', value: 'cc' }, { label: 'Pasaporte', value: 'pasaporte' }, { label: 'NIT', value: 'nit' }]
    const bloodTypes = [{ label: 'A+', value: 'A+' }, { label: 'O+', value: 'O+' }, { label: 'B+', value: 'B+' }, { label: 'AB+', value: 'AB+' }, { label: 'A-', value: 'A-' }, { label: 'O-', value: 'O-' }, { label: 'B-', value: 'B-' }, { label: 'AB-', value: 'AB-' }]
    const comuna = useSelector((state: RootState) => state.references.references?.communities);
    const asociacion = useSelector((state: RootState) => state.references.references?.associations);
    const municipios = useSelector((state: RootState) => state.references.references?.municipalities);
    const eps = useSelector((state: RootState) => state.references.references?.eps);
    const [beneficiarie, setBeneficiarie] = useState({});
    const [selectedFile, setSelectedFile] = useState(null);
    const [isSisbenValid, setIsSisbenValid] = useState(true);
    const { beneficiarieId } = useParams();
    const sisbenRegex = /^(A[1-5]|B[1-7]|C[1-18]|D[1-21])$/;

    useEffect(() => {
        getBeneficiary();
    }, [])

    const formHanlder = (target: string, e: any) => {
        const value = e.target.value;
        setBeneficiarie({ ...beneficiarie, [target]: value });
        if(target === "sisben_score") setIsSisbenValid(sisbenRegex.test(value));
    }

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
                console.log('Upload successful:', response);
            } catch (error) {
                console.error('Upload failed:', error);
            }
        } else {
            console.log('No file selected.');
        }
    }

    const createBeneficiarie = () => {
        saveBeneficiary(beneficiarie);
    }

    const getBeneficiary = async () => {
        try {
            const response = await getBeneficiarieById(beneficiarieId);
            if (response.status === 200) {
                setBeneficiarie(response.result.data);
            }
        } catch (error) {
            throw new Error("the beneficieary doesn't exist");
        }
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
                            <WebcamCapture onCapture={handleWebcamCapture} isEditing={Boolean(beneficiarieId)} existingImage={(beneficiarie as any)?.photo_url || null} />
                        </div>
                        <div>
                            <DPersonaReader />
                        </div>
                    </div>
                    <div className='beneficiaries-container__form-section__beneficiarie'>

                        <form className="beneficiaries-container__form-section__beneficiarie__form">


                            <div className="beneficiaries-container__form-section__beneficiarie__form__field">
                                <SelectDropdown
                                    selectValue={(beneficiarie as any)?.identification_type}
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
                                    value={(beneficiarie as any)?.identification || ''}
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
                                    value={(beneficiarie as any)?.first_last_name || ''}
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
                                    value={(beneficiarie as any)?.second_last_name || ''}
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
                                    value={(beneficiarie as any)?.first_name || ''}
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
                                    value={(beneficiarie as any)?.second_name || ''}
                                />
                            </div>

                            <div className="beneficiaries-container__form-section__beneficiarie__form__field">
                                <SelectDropdown
                                    selectValue={(beneficiarie as any)?.gender}
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
                                    value={(beneficiarie as any)?.birthday || ''}
                                />
                            </div>

                            <div className="beneficiaries-container__form-section__beneficiarie__form__field">
                                <SelectDropdown
                                    selectValue={(beneficiarie as any)?.blood_type}
                                    label="Tipo de Sangre"
                                    options={bloodTypes}
                                    targetKey='blood_type'
                                    handleValue={formHanlder}
                                />
                            </div>

                            <div className="beneficiaries-container__form-section__beneficiarie__form__field">
                                <SelectDropdown
                                    selectValue={(beneficiarie as any)?.municipality}
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
                                    selectValue={(beneficiarie as any)?.community}
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
                                    selectValue={(beneficiarie as any)?.association}
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
                                    selectValue={(beneficiarie as any)?.eps}
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
                                    placeholder='A1'
                                    type='text'
                                    label="Categoria SISBEN"
                                    onChange={(e) => formHanlder('sisben_score', e)}
                                    error={!isSisbenValid}
                                    helperText={!isSisbenValid ? 'Categoria no valida' : ''}
                                    value={(beneficiarie as any)?.sisben_score || ''}
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