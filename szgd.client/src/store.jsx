// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import resourceReducer from './features/resourceSlice';

export const store = configureStore({
    reducer: {
        resource: resourceReducer,
    },
});

export default store;
