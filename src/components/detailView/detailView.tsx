import { calculateAge } from '../../helpers/helpers';
import './detailView.scss';
const DetailView = ({ beneficiary, visible, onClose }) => {
  const close = (event) => {
    event.stopPropagation();
    onClose();
  }
  return (
    <div className="full-content" onClick={(e)=>e.stopPropagation()}>

    {visible &&<div className='detail-view-background' onClick={close}></div>}
      {visible && 
         <div className="content-detail-view">
          <div className='head-detail-view'>
            <div className='icon'>
              <img src={beneficiary?.photo_url} alt="" />
            </div>
            <div className='title'>
              <h3>
                {beneficiary?.first_name} {beneficiary?.first_last_name}
              </h3>
              <span className='id-link'>CC. {beneficiary?.identification}</span>
              <span>Edad: {calculateAge(beneficiary?.birthday)} años</span>
              {beneficiary?.association?.name && <span>Asociacion: {beneficiary?.association?.name}</span>}

            </div>
          </div>
          <div className='main-content'>
            <div className='middle-content'>
              <div className='content-labels'>
                <table>
                  <tr>
                    <td className='label'>Autor</td>
                    <td className='value'>{beneficiary?.author?.name}</td>
                  </tr>
                  <tr>
                    <td className='label'>Fecha nacimiento</td>
                    <td className='value'>{beneficiary?.birthday.split('T')[0]}</td>
                  </tr>
                  <tr>
                    <td className='label'>Telefono</td>
                    <td className='value'>{beneficiary?.phones}</td>
                  </tr>
                  <tr>
                    <td className='label'>Discapacidad</td>
                    <td className='value'>{beneficiary?.disability}</td>
                  </tr>
                  <tr>
                    <td className='label'>Tipo de sangre</td>
                    <td className='value'>{beneficiary?.blody_type}</td>
                  </tr>
                  <tr>
                    <td className='label'>Sexo</td>
                    <td className='value'>{beneficiary?.sex}</td>
                  </tr>
                  <tr>
                    <td className='label'>Direccion</td>
                    <td className='value'>{beneficiary?.address}</td>
                  </tr>
                  <tr>
                    <td className='label'>Comuna</td>
                    <td className='value'>{beneficiary?.community?.name}</td>
                  </tr>
                  <tr>
                    <td className='label'>EPS</td>
                    <td className='value'>{beneficiary?.eps}</td>
                  </tr>
                  <tr>
                    <td className='label'>Actividad</td>
                    <td className='value'>{beneficiary?.activity?.name}</td>
                  </tr>
                </table>
              </div>
            </div>
            <div className='footer-detail-view'>
              <button className={beneficiary?.id_front || beneficiary?.id_back ?'badget requi-ok':'badget requi-not'}>Cedula</button>
              <button className={beneficiary?.sisben_url ?'badget requi-ok':'badget requi-not'}>EPS</button>
              <button className={beneficiary?.fosiga_url ?'badget requi-ok':'badget requi-not'}>SISBEN</button>
              <button className={beneficiary?.registry_doc_url ?'badget requi-ok':'badget requi-not'}>Registraduría</button>
            </div>
          </div>
        </div>
       }
      
      
    </div>
  );
}

export { DetailView };