import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
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
}

function SelectDropdown(props: IProp) {
  const [newValue, setNewValue] = useState<any>(undefined);
  const selectValue = (e: any) => {
    const selectedItem = props.options?.find(
      (item) => item[props.keyValue as string] === e.target.value
    );
    const selectedValue = {
      id: selectedItem[props.keyValue as string],
      label: selectedItem[props.keyLabel as string],
    };
    props.handleValue(props.targetKey, selectedValue);
    setNewValue(selectedValue.id);
  };

  return (
    <FormControl style={{ width: "100%" }}>
      <InputLabel id={props.value}>{props.label}</InputLabel>
      <Select
        labelId={props.value}
        id={props.label}
        label={props.label}
        onChange={(e) => selectValue(e)}
        value={newValue ?? props.selectValue ?? ""}
      >
        {props.options?.length &&
          props.options.map((option: any, index: number) => {
            return (
              <MenuItem
                key={index}
                defaultValue={""}
                value={option[props.keyValue as string]}
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
