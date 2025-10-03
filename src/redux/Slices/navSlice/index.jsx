import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    servicesDropdown: [],
    productsDropdown: [],
    servicesError: null,
    productsError: null,
    loading: false,
    error: null,
};

const navSlice = createSlice({
    name: 'nav',
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
        fetchNavDropdownsSuccess: (state, action) => {
            state.loading = false;
            state.servicesDropdown = action.payload.servicesDropdown || [];
            state.productsDropdown = action.payload.productsDropdown || [];
            state.servicesError = action.payload.servicesError;
            state.productsError = action.payload.productsError;
            state.error = null;
        },
        fetchNavDropdownsFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        clearNavData: (state) => {
            state.servicesDropdown = [];
            state.productsDropdown = [];
            state.servicesError = null;
            state.productsError = null;
            state.error = null;
        }
    }
});

export const {
    setLoading,
    setError,
    clearError,
    fetchNavDropdownsSuccess,
    fetchNavDropdownsFailure,
    clearNavData
} = navSlice.actions;

export default navSlice.reducer;
