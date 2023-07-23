import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'


export interface AuthState {
    user: string;
    password: string;
    isLogged: boolean;
}

const initialState: AuthState = {
    user: '',
    password: '',
    isLogged: false,
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<string>) => {
            state.user = action.payload
        },
        setPassword: (state, action: PayloadAction<string>) => {
            state.password = action.payload
        },
        setLogged: (state, action: PayloadAction<boolean>) => {
            state.isLogged = action.payload
        }
    }
});

export const { setUser, setPassword, setLogged } = authSlice.actions

export default authSlice.reducer