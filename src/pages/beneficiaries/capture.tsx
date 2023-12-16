import { useRef, useState } from 'react';
import { Button } from "@mui/material";

import Webcam from 'react-webcam';

function WebcamCapture({ onCapture, isEditing, existingImage, onImageExplored }) {
    const webcamRef = useRef(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const [cameraOpen, setCameraOpen] = useState(false); // Track whether the camera is open

    const capture = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        setCapturedImage(imageSrc);
        const imageBlob = dataURItoBlob(imageSrc);
        onCapture(imageBlob);
    };

    const startCamera = () => {
        setCameraOpen(true);
    };

    const clearCapturedImage = () => {
        setCameraOpen(false);
        setCapturedImage(null);
    };
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

    return (
        <div>

            {cameraOpen && !capturedImage && (
                <div className='content-webcam'>
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                    />
                    <Button onClick={capture} className='btn-image--capture'>Capturar imagen</Button>
                    <Button className='btn-image--delete' onClick={clearCapturedImage}>Cancelar</Button>

                </div>
            )}
            {(
                <div className='content-image'>
                    <div className='content-image__borde-image'>
                        {((!isEditing && capturedImage) && <img src={capturedImage || existingImage} alt="Captured" className='content-image__image' />) }
                        {(isEditing &&  existingImage && <img src={capturedImage || existingImage} alt="Captured" className='content-image__image' />)}
                    </div>
                    <div className='content-image__buttons'>
                        <Button onClick={startCamera} className='btn-image--capture'>Abrir camara</Button>
                        <input
                          id="photo_url"
                          hidden
                          type="file"
                          accept="image/*"
                          name="myImage"
                          onChange={(event) => onImageExplored(event)}
                        />
                        <label
                          className='btn-image--upload'
                          htmlFor="photo_url"
                        >
                          Explorar
                        </label>
                        <Button className='btn-image--delete' onClick={clearCapturedImage}>Borrar imagen</Button>
                    </div>
                </div>
            )}


        </div>

    );
}

export default WebcamCapture;