import { CircularProgress } from '@mui/material'
import './loading.scss';

function LoadingComponent() {
  return (
    <div className='loading-component'>
      <CircularProgress /> 
    </div>
  )
}

export default LoadingComponent