import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'



export interface referencesState {
    references: any;
}

const initialState: referencesState = {
    references: null
}

export const authSlice = createSlice({
    name: 'references',
    initialState,
    reducers: {
        setReference: (state, action: PayloadAction<any>) => {
            state.references = {...action.payload}
        }
    }
});

export const { setReference} = authSlice.actions

export default authSlice.reducer