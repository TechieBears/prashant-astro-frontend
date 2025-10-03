import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { environment } from '../../../env';

const initialState = {
    servicesDropdown: [],
    productsDropdown: [],
    loading: false,
    error: null,
};

export const fetchNavDropdowns = createAsyncThunk(
    'nav/fetchNavDropdowns',
    async (_, { rejectWithValue }) => {
        try {
            const [serviceCatRes, productCatRes] = await Promise.all([
                axios.get(`${environment.baseUrl}service-categories/public/dropdown`),
                axios.get(`${environment.baseUrl}product-categories/astroguid/public/categories-with-products`),
            ]);

            return {
                servicesDropdown: serviceCatRes.data.data,
                productsDropdown: productCatRes.data.data,
            };
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch navigation data');
        }
    }
);


const navSlice = createSlice({
    name: 'nav',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchNavDropdowns.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchNavDropdowns.fulfilled, (state, action) => {
                state.loading = false;
                state.servicesDropdown = action.payload.servicesDropdown;
                state.productsDropdown = action.payload.productsDropdown;
            })
            .addCase(fetchNavDropdowns.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default navSlice.reducer;
