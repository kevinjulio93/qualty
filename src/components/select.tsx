import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'

interface IProp {
    label?: string,
    value?: string,
    options?: Array<any>,
    keyLabel?: string,
    keyValue?: string,
    handleValue?: any,
    targetKey?: string

}

function SelectDropdown(props: IProp) {
    const value = props.keyValue ? props.keyValue : 'value';
    return (
        <FormControl style={{ width: '100%' }}>
            <InputLabel id={props.value}>{props.label}</InputLabel>
            <Select
                labelId={props.value}
                id={props.label}
                label={props.label}
                onChange={(e)=> props.handleValue(props.targetKey, e)}
            >
                {props.options?.length && props.options.map((option: any, index: number) => {
                    return (
                        <MenuItem
                            key={index}
                            defaultValue={''}
                            value={option[`${value}`]}>
                            {props.keyLabel ? option[props.keyLabel] : option.label}
                        </MenuItem>
                    )
                })}
            </Select>
        </FormControl>
    )
}

export default SelectDropdown
