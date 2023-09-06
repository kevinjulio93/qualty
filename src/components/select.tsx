import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'

interface IProp {
    label?: string,
    value?: string,
    options?: Array<any>,
    keyLabel?: string,
    keyValue?: string

}

function SelectDropdown(props: IProp) {
    return (
        <FormControl style={{ width: '100%' }}>
            <InputLabel id={props.value}>{props.label}</InputLabel>
            <Select
                labelId={props.value}
                id={props.label}
                label={props.label}
            >
                {props.options && props.options.map((option: any, index: number) => {
                    return (
                        <MenuItem
                            key={index}
                            value={props.keyValue ? option[props.keyValue] : option.value}>
                            {props.keyLabel ? option[props.keyLabel] : option.label}
                        </MenuItem>
                    )
                })}
            </Select>
        </FormControl>
    )
}

export default SelectDropdown

