import { useState } from 'react';
import './detailView.scss';

const DetailView = ({ beneficiary, visible}) => {
  const [isVisible, setVisible] = useState(visible);
  const close = () => {
    setVisible(false);
  }
  return (
    <div>

      {isVisible && <div className='detail-view-background' onClick={() => close()}>

        <div className="content-detail-view">
          <div className='head-detail-view'>
            <div className='icon'>
              <img src={beneficiary?.photo_url} alt="" />
            </div>
            <div className='main-content'>
              <div className='title'>
                <h3>
                  {beneficiary?.first_name} {beneficiary?.first_last_name} (50 años)
                </h3>
                <span>Asociacion | {beneficiary?.association?.name}</span>
              </div>
              <div className='middle-content'>
                <div className='content-labels'>
                  <label >Cedula | <span>{beneficiary?.identification}</span></label>
                  <label >Fecha nacimiento | <span>{beneficiary?.birthday.split('T')[0]}</span></label>
                  <label >Telefono | <span>{beneficiary?.phones}</span></label>
                  <label >Discapacidad | <span>{beneficiary?.disability}</span></label>
                </div>
                <div className='content-labels'>
                  <label >Tipo de sangre | <span>{beneficiary?.blody_type}</span></label>
                  <label >Sexo | <span>{beneficiary?.sex}</span></label>
                  <label >Direccion | <span>{beneficiary?.disability}</span></label>
                  <label >Comuna | <span>{beneficiary?.community?.name}</span></label>
                </div>

              </div>
              <div className='content-labels-foot'>
                <label >EPS | <span>{beneficiary?.eps}</span></label>
                <label >Actividad | <span>{beneficiary?.activity?.name}</span></label>
              </div>
            </div>
          </div>
          <div className='footer-detail-view'>
            <button className='badget requi-ok'>Nivel de SISBEN</button>
            <button className='badget requi-not'>Mayor de 60</button>
            <button className='badget requi-ok'>Departamento de SISBEN</button>
            <button className='badget requi-ok'>Regimen de Salud</button>
          </div>
        </div>

      </div>}
    </div>
  );
}

export { DetailView };