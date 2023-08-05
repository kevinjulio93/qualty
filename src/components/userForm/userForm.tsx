import './userForm.scss'
import { TextField } from '@mui/material'
import { useState, forwardRef, useImperativeHandle } from 'react';

const  UserForm = forwardRef((props:any, ref) => {
    const [user, setUser] = useState({ name: '', email: '', password: '' });

    useImperativeHandle(ref, () =>{
        return {
            getUser,
        }
    })
    
    const getUser = () => {
        return user;
    }

    const formHanlder = (target: 'name' |'email' | 'password', e: any) => {
        const value = target === 'email' ? (e.target.value as string).trim() : e.target.value;
        setUser({ ...user, [target]: value });
      }

    return (
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
            </form>
        </>
    )
})

export default UserForm