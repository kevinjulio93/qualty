import { Button } from "@mui/material";
import "./saveCancelControls.scss";

interface ISaveCancelControls {
  cancelText?: string;
  saveText: string;
  handleSave: (e) => void;
  hanldeCancel?: (e) => void;
}

function SaveCancelControls(props: ISaveCancelControls) {
  return (
    <div className="save-container">
      {props.cancelText && props.cancelText !== "" && (
        <Button className="btn-cancel-winerie" onClick={(e) => props.hanldeCancel(e)}>
          {props.cancelText}
        </Button>
      )}

      <Button className="btn-save-winerie" onClick={(e) => props.handleSave(e) }>
        {props.saveText}
      </Button>
    </div>
  );
}

export default SaveCancelControls;
