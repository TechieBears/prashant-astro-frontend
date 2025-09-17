import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

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
      const [serviceCatRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_BASE_URL}/api/service-categories/public/dropdown`),
        // axios.get(`${import.meta.env.VITE_BASE_URL}/api/product-categories/public/dropdown`),
      ]);

      console.log('serviceCatRes', serviceCatRes); // Ensure this logs
      // console.log('productCatRes', productCatRes);

      return {
        servicesDropdown: serviceCatRes.data.data,
        // productsDropdown: productCatRes.data.data,
      };
    } catch (err) {
      console.log('Error fetching dropdowns:', err); // Add this
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
