import { createSlice } from '@reduxjs/toolkit';

export const resourceSlice = createSlice({
    name: 'resource',
    initialState: {
        gospodarstwo: {},  // Store a single gospodarstwo object
        domownik: null,      // Store a single domownik object
        domownikWGospodarstwie: {},
    },
    reducers: {
        setGospodarstwo: (state, action) => {
            console.log('redux stan', action.payload);
            state.gospodarstwo = action.payload; // Set gospodarstwo
        },
        setDomownikWGospodarstwie: (state, action) => {
            console.log('redux stan', action.payload);
            state.domownikWGospodarstwie = action.payload; // Set gospodarstwo
        },
        clearGospodarstwo: (state) => {
            state.gospodarstwo = null; // Clear gospodarstwo
        },
        setDomownik: (state, action) => {
            state.domownik = action.payload; // Set single domownik
        },
        clearDomownik: (state) => {
            state.domownik = null; // Clear single domownik
        },
    },
});

// Export actions
export const {
    setGospodarstwo,
    clearGospodarstwo,
    setDomownik,
    clearDomownik,
    setDomownikWGospodarstwie
} = resourceSlice.actions;

// Selectors
export const selectGospodarstwo = (state) => state.resource.gospodarstwo; // Select the gospodarstwo
export const selectDomownik = (state) => state.resource.domownik; // Select the single domownik
export const selectDomownikWGospodarstwie = (state) => state.resource.domownikWGospodarstwie; // Select the single domownik

export default resourceSlice.reducer;
