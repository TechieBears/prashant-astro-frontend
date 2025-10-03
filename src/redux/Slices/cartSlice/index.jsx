import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    // Cart data
    productItems: [],
    serviceItems: [],

    // Loading states
    isLoading: false,
    isUpdatingQuantity: false,
    isRemovingItem: false,

    // Error states
    error: null,
    productsError: null,
    servicesError: null,

    // Last updated timestamp for cache invalidation
    lastUpdated: null
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        // Set loading state
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },

        // Set updating quantity state
        setUpdatingQuantity: (state, action) => {
            state.isUpdatingQuantity = action.payload;
        },

        // Set removing item state
        setRemovingItem: (state, action) => {
            state.isRemovingItem = action.payload;
        },

        // Set error state
        setError: (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
        },

        // Set products error
        setProductsError: (state, action) => {
            state.productsError = action.payload;
        },

        // Set services error
        setServicesError: (state, action) => {
            state.servicesError = action.payload;
        },

        // Clear errors
        clearError: (state) => {
            state.error = null;
            state.productsError = null;
            state.servicesError = null;
        },

        // Fetch cart data success
        fetchCartDataSuccess: (state, action) => {
            state.isLoading = false;
            state.productItems = action.payload.products || [];
            state.serviceItems = action.payload.services || [];
            state.productsError = action.payload.productsError;
            state.servicesError = action.payload.servicesError;
            state.lastUpdated = Date.now();
        },

        // Update product quantity success
        updateProductQuantitySuccess: (state, action) => {
            state.isUpdatingQuantity = false;
            state.productItems = action.payload.products || state.productItems;
            state.lastUpdated = Date.now();
        },

        // Remove product item success
        removeProductItemSuccess: (state, action) => {
            state.isRemovingItem = false;
            state.productItems = state.productItems.filter(item => item._id !== action.payload);
            state.lastUpdated = Date.now();
        },

        // Remove service item success
        removeServiceItemSuccess: (state, action) => {
            state.isRemovingItem = false;
            state.serviceItems = state.serviceItems.filter(item => item._id !== action.payload);
            state.lastUpdated = Date.now();
        },

        // Update service item success
        updateServiceItemSuccess: (state, action) => {
            state.isUpdatingQuantity = false;
            state.serviceItems = state.serviceItems.map(item =>
                item._id === action.payload.id
                    ? { ...item, ...action.payload.updateData }
                    : item
            );
            state.lastUpdated = Date.now();
        },

        // Optimistic update for quantity (for immediate UI feedback)
        optimisticUpdateQuantity: (state, action) => {
            const { id, quantity } = action.payload;
            const item = state.productItems.find(item => item._id === id);
            if (item) {
                const newQuantity = typeof quantity === 'number' ? quantity : (item.quantity + 1);
                item.quantity = newQuantity;
                item.totalPrice = item.price * newQuantity;
            }
        },

        // Revert optimistic update
        revertOptimisticUpdate: (state, action) => {
            const { id, previousQuantity } = action.payload;
            const item = state.productItems.find(item => item._id === id);
            if (item) {
                item.quantity = previousQuantity;
                item.totalPrice = (item.totalPrice / item.quantity) * previousQuantity;
            }
        },

        // Optimistic remove item
        optimisticRemoveItem: (state, action) => {
            const id = action.payload;
            state.productItems = state.productItems.filter(item => item._id !== id);
        },

        // Revert optimistic remove
        revertOptimisticRemove: (state, action) => {
            const item = action.payload;
            state.productItems.push(item);
        },

        // Clear all cart data
        clearCart: (state) => {
            state.productItems = [];
            state.serviceItems = [];
            state.error = null;
            state.productsError = null;
            state.servicesError = null;
            state.lastUpdated = null;
        },

        // Add item to cart (for immediate UI feedback)
        addToCart: (state, action) => {
            const newItem = action.payload;
            const existingItem = state.productItems.find(item =>
                item.productId === newItem.productId ||
                item.product?._id === newItem.productId
            );

            if (existingItem) {
                existingItem.quantity += newItem.quantity || 1;
                existingItem.totalPrice = existingItem.price * existingItem.quantity;
            } else {
                state.productItems.push({
                    ...newItem,
                    _id: `temp-${Date.now()}`,
                    totalPrice: newItem.price * (newItem.quantity || 1)
                });
            }
            state.lastUpdated = Date.now();
        },

        // Add service to cart
        addServiceToCart: (state, action) => {
            const newService = action.payload;
            state.serviceItems.push({
                ...newService,
                _id: `temp-service-${Date.now()}`
            });
            state.lastUpdated = Date.now();
        }
    }
});

export const {
    setLoading,
    setUpdatingQuantity,
    setRemovingItem,
    setError,
    setProductsError,
    setServicesError,
    clearError,
    fetchCartDataSuccess,
    updateProductQuantitySuccess,
    removeProductItemSuccess,
    removeServiceItemSuccess,
    updateServiceItemSuccess,
    optimisticUpdateQuantity,
    revertOptimisticUpdate,
    optimisticRemoveItem,
    revertOptimisticRemove,
    clearCart,
    addToCart,
    addServiceToCart
} = cartSlice.actions;

// Selectors for efficient data access
export const selectCartItems = (state) => state.cart.productItems;
export const selectServiceCartItems = (state) => state.cart.serviceItems;
export const selectCartLoading = (state) => state.cart.isLoading;
export const selectCartError = (state) => state.cart.error;
export const selectCartItemCount = (state) => state.cart.productItems.length;
export const selectServiceCartItemCount = (state) => state.cart.serviceItems.length;

export default cartSlice.reducer;