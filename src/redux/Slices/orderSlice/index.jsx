import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createProductOrder, createServiceOrder } from "../../../api";

// Async thunk for creating product order
export const createOrder = createAsyncThunk(
    'order/createOrder',
    async (orderData, { rejectWithValue }) => {
        try {
            const response = await createProductOrder(orderData);
            if (response.success) {
                return response.data;
            } else {
                return rejectWithValue(response.message || 'Failed to create order');
            }
        } catch (error) {
            return rejectWithValue(error.message || 'Network error occurred');
        }
    }
);

// Async thunk for creating service order
export const createServiceOrderThunk = createAsyncThunk(
    'order/createServiceOrder',
    async (orderData, { rejectWithValue }) => {
        try {
            const response = await createServiceOrder(orderData);

            if (response.success) {
                return response.order;
            } else {
                return rejectWithValue(response.message || 'Failed to create service order');
            }
        } catch (error) {
            return rejectWithValue(error.message || 'Network error occurred');
        }
    }
);

const initialState = {
    // Current order data
    currentOrder: null,
    orderType: null, // 'products' or 'services'

    // Loading states
    isCreatingOrder: false,
    isLoading: false,

    // Error states
    error: null,

    // Order history (optional - for future use)
    orderHistory: [],

    // Service booking data (for services)
    serviceBooking: null
};

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        // Clear current order
        clearCurrentOrder: (state) => {
            state.currentOrder = null;
            state.orderType = null;
            state.error = null;
        },

        // Set service booking data
        setServiceBooking: (state, action) => {
            state.serviceBooking = action.payload;
            state.orderType = 'services';
            state.currentOrder = null; // Clear product order if switching to services
        },

        // Clear service booking
        clearServiceBooking: (state) => {
            state.serviceBooking = null;
            if (state.orderType === 'services') {
                state.orderType = null;
            }
        },

        // Clear error
        clearError: (state) => {
            state.error = null;
        },

        // Set order type
        setOrderType: (state, action) => {
            state.orderType = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // Create order pending
            .addCase(createOrder.pending, (state) => {
                state.isCreatingOrder = true;
                state.error = null;
            })
            // Create order fulfilled
            .addCase(createOrder.fulfilled, (state, action) => {
                state.isCreatingOrder = false;
                state.currentOrder = action.payload;
                state.orderType = 'products';
                state.error = null;

                // Add to order history
                state.orderHistory.unshift({
                    id: action.payload.order?._id || Date.now(),
                    type: 'products',
                    data: action.payload,
                    createdAt: new Date().toISOString()
                });
            })
            // Create order rejected
            .addCase(createOrder.rejected, (state, action) => {
                state.isCreatingOrder = false;
                state.error = action.payload;
            })
            // Create service order pending
            .addCase(createServiceOrderThunk.pending, (state) => {
                state.isCreatingOrder = true;
                state.error = null;
            })
            // Create service order fulfilled
            .addCase(createServiceOrderThunk.fulfilled, (state, action) => {
                state.isCreatingOrder = false;
                state.currentOrder = action.payload;
                state.orderType = 'services';
                state.error = null;

                // Add to order history
                state.orderHistory.unshift({
                    id: action.payload._id || Date.now(),
                    type: 'services',
                    data: action.payload,
                    createdAt: new Date().toISOString()
                });
            })
            // Create service order rejected
            .addCase(createServiceOrderThunk.rejected, (state, action) => {
                state.isCreatingOrder = false;
                state.error = action.payload;
            });
    }
});

export const {
    clearCurrentOrder,
    setServiceBooking,
    clearServiceBooking,
    clearError,
    setOrderType
} = orderSlice.actions;

export default orderSlice.reducer;
