import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'


export interface AuthState {
    user: string;
    password: string;
}

const initialState: AuthState = {
    user: '',
    password: '',
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
        }
    }
});

export const { setUser, setPassword } = authSlice.actions

export default authSlice.reducer