import "./itemForm.scss";
import {
  TextField,
} from "@mui/material";
import {
  useState,
  forwardRef,
  useEffect,
  useImperativeHandle,
} from "react";

const ItemForm = forwardRef((props: any, ref) => {
  const [item, setItem] = useState({name:"",code:"",value:""});

  useImperativeHandle(ref, () => {
    return {
      getItem,
    };
  });

  const getItem = () => {
    return item;
  };

  useEffect(() => {
    setCurrentItem();
  }, []);

  const setCurrentItem = () => {
    if (props.currentItem) {
      setItem(props.currentItem);
    }
  };

  const formHanlder = (e: any) => {
    const value = e.target.value;
    setItem({...item,[e.target.name]:value});
  };
  
  return (
    <>
      <form className="item-form-container" action="">
        <TextField
          className="login-view__login-form__form-container__input"
          id="name__item"
          name="name"
          placeholder="Nombre"
          type="text"
          label="Nombre del item"
          onChange={(e) => formHanlder(e)}
          value={item?.name || ""}
          key="item-input-name"
        />
        <TextField
          className="login-view__login-form__form-container__input"
          id="code__item"
          name="code"
          placeholder="Código"
          type="text"
          label="Código de item"
          onChange={(e) => formHanlder(e)}
          value={item?.code || ""}
          key="item-input-code"
        />
        <TextField
          className="login-view__login-form__form-container__input"
          id="value__item"
          name="value"
          placeholder="Valor"
          type="number"
          label="Valor de item"
          onChange={(e) => formHanlder(e)}
          value={item?.value || ""}
          key="item-input-value"
        />
      </form>
    </>
  );
});

export default ItemForm;
