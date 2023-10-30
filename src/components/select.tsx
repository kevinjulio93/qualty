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

    const selectValue = (e: any) => {
        const selectedItem = props.options?.find(item => item.value === e.target.value);
        // const selectedValue = { id: selectedItem[props.keyValue as string], label: selectedItem[props.keyLabel as string] }
        props.handleValue(props.targetKey, e);
    }

    return (
        <FormControl style={{ width: '100%' }}>
            <InputLabel id={props.value}>{props.label}</InputLabel>
            <Select
                labelId={props.value}
                id={props.label}
                label={props.label}
                onChange={(e) => selectValue(e)}
                value={props.selectValue || ''}
            >
                {props.options?.length >0  && props.options.map((option: any, index: number) => {
                    return (
                        <MenuItem
                            key={index}
                            defaultValue={''}
                            value={option.value}>
                            {props.keyLabel ? option.label : option.label}
                        </MenuItem>
                    )
                })}
            </Select>
        </FormControl>
    )
}

export default SelectDropdown;
