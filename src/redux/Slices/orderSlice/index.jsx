import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    orderHistory: [],
    serviceBooking: null
};

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        addOrderToHistory: (state, action) => {
            const { orderData, orderType } = action.payload;
            state.orderHistory.unshift({
                id: orderData.order?._id || orderData._id || Date.now(),
                type: orderType,
                data: orderData,
                createdAt: new Date().toISOString()
            });
        },

        // Set service booking data
        setServiceBooking: (state, action) => {
            state.serviceBooking = action.payload;
        },

        // Clear service booking
        clearServiceBooking: (state) => {
            state.serviceBooking = null;
        },

        // Clear order history
        clearOrderHistory: (state) => {
            state.orderHistory = [];
        }
    }
});

export const {
    addOrderToHistory,
    setServiceBooking,
    clearServiceBooking,
    clearOrderHistory
} = orderSlice.actions;

export default orderSlice.reducer;
