import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

interface IProp {
  label?: string;
  value?: string;
  options?: Array<any>;
  keyLabel?: string;
  keyValue?: string;
  handleValue?: any;
  targetKey?: string;
  selectValue?: string;
  id:string
}

function SelectDropdown(props: IProp) {

    const selectValue = (e: any) => {
        const propKey = props.keyValue || 'value';
        const selectedItem = props.options?.find(item => item[propKey] === e.target.value);
        props.handleValue(selectedItem, e);
    }

    return (
        <FormControl style={{ width: '100%' }}>
            <InputLabel id={props.value}>{props.label}</InputLabel>
            <Select
                labelId={props.value}
                id={props.id}
                label={props.label}
                onChange={(e) => selectValue(e)}
                value={props.selectValue || ''}
            >
                {props.options?.length >0  && props.options.map((option: any, index: number) => {
                    return (
                        <MenuItem
                            key={index}
                            defaultValue={''}
                            value={props.keyValue ? option[props.keyValue as string] : option.value}>
                            {props.keyLabel ? option[props.keyLabel as string] : option.label}
                        </MenuItem>
                    )
                })}
            </Select>
        </FormControl>
    )
}

export default SelectDropdown;
