import { createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";
import {
    getCartItems,
    updateCartItem,
    removeCartItem,
    getServiceCartItems,
    removeServiceCartItem,
    updateServiceCartItem
} from "../../../api";

// Async thunks for cart operations
export const fetchCartData = createAsyncThunk(
    'cart/fetchCartData',
    async (_, { rejectWithValue }) => {
        try {
            const [productsResponse, servicesResponse] = await Promise.all([
                getCartItems(),
                getServiceCartItems()
            ]);

            return {
                products: productsResponse.success ? (productsResponse.data.items || []) : [],
                services: servicesResponse.success ? (servicesResponse.data.items || []) : [],
                productsError: productsResponse.success ? null : productsResponse.message,
                servicesError: servicesResponse.success ? null : servicesResponse.message
            };
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch cart data');
        }
    }
);

export const updateProductQuantity = createAsyncThunk(
    'cart/updateProductQuantity',
    async ({ id, quantity }, { rejectWithValue, getState }) => {
        try {
            const state = getState();
            const currentItems = state.cart.productItems;
            const item = currentItems.find(item => item._id === id);

            if (!item) {
                return rejectWithValue('Item not found in cart');
            }

            const response = await updateCartItem(id, quantity);

            if (response.success) {
                return response.data.items;
            } else {
                return rejectWithValue(response.message || 'Failed to update quantity');
            }
        } catch (error) {
            return rejectWithValue(error.message || 'Network error occurred');
        }
    }
);

export const removeProductItem = createAsyncThunk(
    'cart/removeProductItem',
    async (id, { rejectWithValue }) => {
        try {
            const response = await removeCartItem(id);

            if (response.success) {
                return response.data.items;
            } else {
                return rejectWithValue(response.message || 'Failed to remove item');
            }
        } catch (error) {
            return rejectWithValue(error.message || 'Network error occurred');
        }
    }
);

export const removeServiceItem = createAsyncThunk(
    'cart/removeServiceItem',
    async (id, { rejectWithValue }) => {
        try {
            const response = await removeServiceCartItem(id);

            if (response.success) {
                // Refetch service cart items to ensure sync
                const servicesResponse = await getServiceCartItems();
                return servicesResponse.success ? (servicesResponse.data.items || []) : [];
            } else {
                return rejectWithValue(response.message || 'Failed to remove service item');
            }
        } catch (error) {
            return rejectWithValue(error.message || 'Network error occurred');
        }
    }
);

export const updateServiceItem = createAsyncThunk(
    'cart/updateServiceItem',
    async ({ id, updateData }, { rejectWithValue }) => {
        try {
            const response = await updateServiceCartItem(id, updateData);

            if (response.success) {
                // Refetch service cart items to ensure sync
                const servicesResponse = await getServiceCartItems();
                return servicesResponse.success ? (servicesResponse.data.items || []) : [];
            } else {
                return rejectWithValue(response.message || 'Failed to update service item');
            }
        } catch (error) {
            return rejectWithValue(error.message || 'Network error occurred');
        }
    }
);

const initialState = {
    // Cart items
    productItems: [],
    serviceItems: [],

    // Loading states
    isLoading: false,
    isUpdatingQuantity: false,
    isRemovingItem: null, // ID of item being removed

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
        // Clear all cart data
        clearCart: (state) => {
            state.productItems = [];
            state.serviceItems = [];
            state.error = null;
            state.productsError = null;
            state.servicesError = null;
            state.lastUpdated = null;
        },

        // Clear errors
        clearError: (state) => {
            state.error = null;
            state.productsError = null;
            state.servicesError = null;
        },

        // Optimistic update for quantity (for immediate UI feedback)
        optimisticUpdateQuantity: (state, action) => {
            const { id, quantity } = action.payload;
            const item = state.productItems.find(item => item._id === id);
            if (item) {
                item.quantity = quantity;
                item.totalPrice = (item.totalPrice / item.quantity) * quantity;
            }
        },

        // Revert optimistic update
        revertOptimisticUpdate: (state, action) => {
            const { id, originalQuantity } = action.payload;
            const item = state.productItems.find(item => item._id === id);
            if (item) {
                item.quantity = originalQuantity;
                item.totalPrice = (item.totalPrice / item.quantity) * originalQuantity;
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
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch cart data
            .addCase(fetchCartData.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchCartData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.productItems = action.payload.products;
                state.serviceItems = action.payload.services;
                state.productsError = action.payload.productsError;
                state.servicesError = action.payload.servicesError;
                state.lastUpdated = Date.now();
            })
            .addCase(fetchCartData.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // Update product quantity
            .addCase(updateProductQuantity.pending, (state) => {
                state.isUpdatingQuantity = true;
                state.error = null;
            })
            .addCase(updateProductQuantity.fulfilled, (state, action) => {
                state.isUpdatingQuantity = false;
                state.productItems = action.payload;
                state.lastUpdated = Date.now();
            })
            .addCase(updateProductQuantity.rejected, (state, action) => {
                state.isUpdatingQuantity = false;
                state.error = action.payload;
            })

            // Remove product item
            .addCase(removeProductItem.pending, (state, action) => {
                state.isRemovingItem = action.meta.arg;
                state.error = null;
            })
            .addCase(removeProductItem.fulfilled, (state, action) => {
                state.isRemovingItem = null;
                state.productItems = action.payload;
                state.lastUpdated = Date.now();
            })
            .addCase(removeProductItem.rejected, (state, action) => {
                state.isRemovingItem = null;
                state.error = action.payload;
            })

            // Remove service item
            .addCase(removeServiceItem.pending, (state, action) => {
                state.isRemovingItem = action.meta.arg;
                state.error = null;
            })
            .addCase(removeServiceItem.fulfilled, (state, action) => {
                state.isRemovingItem = null;
                state.serviceItems = action.payload;
                state.lastUpdated = Date.now();
            })
            .addCase(removeServiceItem.rejected, (state, action) => {
                state.isRemovingItem = null;
                state.error = action.payload;
            })

            // Update service item
            .addCase(updateServiceItem.pending, (state) => {
                state.isUpdatingQuantity = true;
                state.error = null;
            })
            .addCase(updateServiceItem.fulfilled, (state, action) => {
                state.isUpdatingQuantity = false;
                state.serviceItems = action.payload;
                state.lastUpdated = Date.now();
            })
            .addCase(updateServiceItem.rejected, (state, action) => {
                state.isUpdatingQuantity = false;
                state.error = action.payload;
            });
    }
});

// Base selectors
const selectProductItems = (state) => state.cart.productItems;
const selectServiceItems = (state) => state.cart.serviceItems;
const selectCartLastUpdated = (state) => state.cart.lastUpdated;

// Memoized selectors for calculated values
export const selectProductCalculations = createSelector(
    [selectProductItems],
    (items) => {
        const subtotal = items.reduce((total, item) => total + (item.totalPrice || 0), 0);
        const gstAmount = subtotal * 0.18;
        const total = subtotal + gstAmount;
        const itemCount = items.reduce((total, item) => total + (item.quantity || 0), 0);

        return { subtotal, gstAmount, total, itemCount };
    }
);

export const selectServiceCalculations = createSelector(
    [selectServiceItems],
    (items) => {
        const subtotal = items.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
        const gstAmount = subtotal * 0.18;
        const total = subtotal + gstAmount;
        const itemCount = items.reduce((total, item) => total + (item.quantity || 0), 0);

        return { subtotal, gstAmount, total, itemCount };
    }
);

// Additional useful selectors
export const selectCartSummary = createSelector(
    [selectProductItems, selectServiceItems, selectCartLastUpdated],
    (productItems, serviceItems, lastUpdated) => ({
        totalProductItems: productItems.length,
        totalServiceItems: serviceItems.length,
        hasItems: productItems.length > 0 || serviceItems.length > 0,
        lastUpdated
    })
);

export const selectCartLoadingStates = createSelector(
    [(state) => state.cart.isLoading, (state) => state.cart.isUpdatingQuantity, (state) => state.cart.isRemovingItem],
    (isLoading, isUpdatingQuantity, isRemovingItem) => ({
        isLoading,
        isUpdatingQuantity,
        isRemovingItem
    })
);

export const selectCartErrors = createSelector(
    [(state) => state.cart.error, (state) => state.cart.productsError, (state) => state.cart.servicesError],
    (error, productsError, servicesError) => ({
        error,
        productsError,
        servicesError
    })
);

export const {
    clearCart,
    clearError,
    optimisticUpdateQuantity,
    revertOptimisticUpdate,
    optimisticRemoveItem,
    revertOptimisticRemove
} = cartSlice.actions;

export default cartSlice.reducer;
