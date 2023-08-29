import './userForm.scss'
import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { getAllroles } from '../../services/roles.service';

const  UserForm = forwardRef((props:any, ref) => {
    const [user, setUser] = useState({ name: '', email: '', password: '' });
    const [roles, setRoles] = useState([]);

    useImperativeHandle(ref, () =>{
        return {
            getUser,
        }
    })
    
    const getUser = () => {
        return user;
    }

    useEffect(() => {
        getRoles();
    }, [])

    const getRoles = async () => {
        const response = await getAllroles();
        const rolList = response.result.data;
        setRoles(rolList);
    }

    const formHanlder = (target: 'name' |'email' | 'password' | 'role', e: any) => {
        const value = target === 'email' ? (e.target.value as string).trim() : e.target.value;
        setUser({ ...user, [target]: value });
      }

    return (
        roles.length > 0 &&
        <>
            <form className='user-form-container' action="">
                <TextField
                    className='login-view__login-form__form-container__input'
                    id="name"
                    name='name'
                    placeholder='juanito'
                    type='text'
                    label="Nombre de usuario"
                    onChange={(e) => formHanlder('name', e)}
                />
                <TextField
                    className='login-view__login-form__form-container__input'
                    id="email"
                    name='email'
                    placeholder='ejemplo@gmail.com'
                    type='text'
                    label="Correo electronico"
                    onChange={(e) => formHanlder('email', e)}
                />
                <TextField
                    className='login-view__login-form__form-container__input'
                    id="pass"
                    name='password'
                    placeholder='·$Wsaf.rwgge665wa'
                    type='password'
                    label="Contraseña"
                    onChange={(e) => formHanlder('password', e)}
                />
                <FormControl>
                    <InputLabel id="demo-simple-select-label">Role</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Role de usuario"
                        onChange={(e) => formHanlder('role', e)}
                    >
                        {roles.map((role: any) => {
                            return (
                                <MenuItem key={role._id} value={role._id}>{role.role}</MenuItem>
                            );
                        })}
                    </Select>
                </FormControl>
            </form>
        </>
    )
})

export default UserForm