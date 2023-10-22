import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'



export interface GeneralState {
    currentSection: string;
}

const initialState: GeneralState = {
    currentSection: localStorage.getItem('currentSection') ? JSON.parse(localStorage.getItem('currentSection') as any) : null
}

export const generalSlice = createSlice({
    name: 'general',
    initialState,
    reducers: {
        setCurrentSection: (state, action: PayloadAction<any>) => {
            localStorage.setItem('currentSection', JSON.stringify(action.payload));
            state.currentSection = action.payload;
        },
    }
});

export const { setCurrentSection } = generalSlice.actions;

export default generalSlice.reducer;