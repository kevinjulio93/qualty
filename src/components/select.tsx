import {
  FormControl,
  InputAdornment,
  InputLabel,
  ListSubheader,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";

interface IProp {
  label?: string;
  value?: string;
  options?: Array<any>;
  keyLabel?: string;
  keyValue?: string;
  handleValue?: any;
  targetKey?: string;
  selectValue?: string;
  id?:string
}

function SelectDropdown(props: IProp) {
  const [filteredOptions, setFilteredOptions] = useState([]);

  useEffect(()=>{
    setFilteredOptions([...props.options]);
  }, [props.options])

  const selectValue = (e: any) => {
    const propKey = props.keyValue || "value";
    const selectedItem = props.options?.find(
      (item) => item[propKey] === e.target.value
    );
    props.handleValue(selectedItem, e);
  };

  const containsText = (text, searchText) =>
    text.toLowerCase().indexOf(searchText.toLowerCase()) > -1;

  const returnFilteredOptions = (text: string) => {
    if (text === "") {
      setFilteredOptions([...props.options]);
      return;
    }

    const filterResult = props.options.filter((opt) =>
      containsText(opt[props.keyLabel] ?? opt.label, text)
    );
    setFilteredOptions(filterResult);
  };

  return (
    <FormControl style={{ width: "100%" }}>
      <InputLabel id={props.value}>{props.label}</InputLabel>
      <Select
        labelId={props.value}
        id={props.label}
        label={props.label}
        onChange={(e) => selectValue(e)}
        onClose={() => returnFilteredOptions("")}
        value={props.selectValue || ""}
      >
        <ListSubheader>
          <TextField
            size="small"
            // Autofocus on textfield
            autoFocus
            placeholder="Tu busqueda..."
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            onChange={(e) => returnFilteredOptions(e.target.value)}
            onKeyDown={(e) => {
              if (e.key !== "Escape") {
                e.stopPropagation();
              }
            }}
          />
        </ListSubheader>
        {filteredOptions.length > 0 &&
          filteredOptions.map((option: any, index: number) => {
            return (
              <MenuItem
                key={index}
                defaultValue={""}
                value={
                  props.keyValue
                    ? option[props.keyValue as string]
                    : option.value
                }
              >
                {props.keyLabel
                  ? option[props.keyLabel as string]
                  : option.label}
              </MenuItem>
            );
          })}
      </Select>
    </FormControl>
  );
}

export default SelectDropdown;
