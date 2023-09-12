import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'



export interface referencesState {
    references: any;
}

const initialState: referencesState = {
    references: localStorage.getItem('references') ? JSON.parse(localStorage.getItem('references') as any) : null
}

export const authSlice = createSlice({
    name: 'references',
    initialState,
    reducers: {
        setReference: (state, action: PayloadAction<any>) => {
            localStorage.setItem('references', JSON.stringify(action.payload));
            state.references = { ...action.payload }
        }
    }
});

export const { setReference } = authSlice.actions

export default authSlice.reducer