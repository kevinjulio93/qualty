import { useState } from 'react';
import { Button } from "@mui/material";
import { DeviceConnected, DeviceDisconnected, FingerprintReader, SampleFormat } from '@digitalpersona/devices';

function DPersonaReader() {
    const reader = new FingerprintReader();
    const [deviceState, setDeviceState] = useState('initial');
    const [capturedImage, setCapturedImage] = useState(null);

    const onDeviceConnected = (event: DeviceConnected) => {
        console.log(event);
        setDeviceState('connected');
    };

    const onDeviceDisconnected = (event: DeviceDisconnected) => {
        console.log("disconnected", event);
        setDeviceState('disconnected');
    };

    const onSamplesAcquired = async (event: any) => {
        console.log(event);
        //injectImage(event.samples[0])
        setDeviceState('acquired');
        setTimeout(function () {
            setDeviceState('connected');
        }, 1000)
        const srcImage = injectImage(event.samples[0])
        setCapturedImage(srcImage);
        await reader.stopAcquisition();
     
    };

    const injectImage = (base64Data: string): any => {
        let dataImage = "";
        dataImage = base64Data;
        dataImage = dataImage.replace(/_/g, "/");
        dataImage = dataImage.replace(/-/g, "+");

        const imageTag = `data:image/png;base64,${dataImage}`;

        return imageTag;
    }


    const loadReader = async () => {
        
        const device = await reader.enumerateDevices();
        reader.on("DeviceConnected", onDeviceConnected);
        reader.on("DeviceDisconnected", onDeviceDisconnected);
        reader.on("SamplesAcquired", onSamplesAcquired);
        await reader.startAcquisition(SampleFormat.PngImage, device[0]);
        setDeviceState('disconnected');
        setCapturedImage(null);

    }

    return (
        <div className='content-image'>
            <div className={`content-image__borde-image ${deviceState}-border`}>
                {(capturedImage && <img src={capturedImage} alt="Image" className='fingerprint-img' />)}
            </div>
            <div className='content-image__buttons'>
                <Button className='btn-image--capture' onClick={loadReader}>{(!capturedImage ? 'Capturar huella': 'Borrar huella')}</Button>
            </div>
        </div>
    );
}

export default DPersonaReader;