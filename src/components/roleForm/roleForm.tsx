import './roleForm.scss'
import { FormControl, FormControlLabel, FormGroup, FormLabel, Switch, TextField } from '@mui/material'
import { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { arrayPermissions, arraySections } from '../../constants/resources';

const  RoleForm = forwardRef((props: any, ref) => {
    const [role, setRole] = useState("");
    const [permissions, setPermissions] = useState([]);

    useImperativeHandle(ref, () =>{
        return {
            getRole,
        }
    })
    
    const getRole = () => {
        return { role, permissions };
    }

    useEffect(() => {
        setCurrentRole();
    }, []);

    const setCurrentRole = () => {
        if(props.currentRole) setRole(props.currentRole);
    }


    const formHanlder = (e: any) => {
        const value = e.target.value;
        setRole(value);
        
    }

    const permissionHandler = (section: any, permission: any, e) => {
        const value = e.target.value;
        const index = permissions.findIndex((perm: any) => perm.section === section);
        const tempPerm: any = permissions;
        if(index === -1) {
            const newPerm = {
                section: section,
                actions: [permission]
            };
            tempPerm.push(newPerm);
        } else {
            if(value) tempPerm[index].actions.push(permission) 
            else tempPerm[index].actions = tempPerm[index].actions.filter(act => act !== permission);
        }
        setPermissions(tempPerm);
    }

    return (
        <>
            <form className='role-form-container' action="">
                <TextField
                    className='login-view__login-form__form-container__input'
                    id="role"
                    name='role'
                    placeholder='Role'
                    type='text'
                    label="Nombre del rol"
                    onChange={(e) => formHanlder(e)}
                    value={role || ''}
                    key="role-input"
                />
                <FormControl component="fieldset" key="permissions-section">
                    {arraySections.map((section) => {
                        return (
                            <>
                            <FormLabel component="legend" key={section.key + '-section'}>{section.value}</FormLabel>
                            <FormGroup aria-label="position" key={section.key + '-legend'} row>
                                {arrayPermissions.map((permission) => {
                                    return (
                                        <FormControlLabel
                                            value={permission.key}
                                            control={<Switch color="primary" />}
                                            label={permission.value}
                                            labelPlacement="start"
                                            key={section.key + '-' + permission.key}
                                            onChange={(e) => permissionHandler(section.key, permission.key, e)}
                                        />
                                    );
                                })}
                            </FormGroup>
                            </>
                        );
                    })}
                </FormControl>
            </form>
        </>
    )
})

export default RoleForm;