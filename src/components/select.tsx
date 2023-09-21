import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'

interface IProp {
    label?: string,
    value?: string,
    options?: Array<any>,
    keyLabel?: string,
    keyValue?: string,
    handleValue?: any,
    targetKey?: string
    selectValue?: string;

}

function SelectDropdown(props: IProp) {
    const value = props.keyValue ? props.keyValue : 'value';

    const selectValue = (e:any) => {
        console.log(e.target);
        props.handleValue(props.targetKey, e)
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
