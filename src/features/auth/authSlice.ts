import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { AppUser } from '../../models/user.model';



export interface AuthState {
    user: AppUser;
}

const initialState: AuthState = {
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as any) : new AppUser()
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<AppUser>) => {
            localStorage.setItem('user', JSON.stringify(action.payload));
            state.user = {...action.payload}
        },
        setLogout: (state, action: PayloadAction<AppUser>) => {
            state.user = {...action.payload};
        }
    }
});

export const { setUser, setLogout} = authSlice.actions

export default authSlice.reducer