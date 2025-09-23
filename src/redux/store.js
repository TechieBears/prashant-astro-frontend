import { configureStore } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import loginSlice from "./Slices/loginSlice";
import actorsSlice from "./Slices/actorsSlice";
import navSlice from "./Slices/navSlice";
import rootSlice from "./Slices/rootSlice";
import orderSlice from "./Slices/orderSlice";
import cartSlice from "./Slices/cartSlice";

const reducers = combineReducers({
    user: loginSlice,
    appRoot: rootSlice,
    nav: navSlice,
    actors: actorsSlice,
    order: orderSlice,
    cart: cartSlice
});

const persistConfig = {
    key: "root",
    version: 1,
    storage,
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
    reducer: persistedReducer,

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }), // Removed .concat(thunk)
});

export default store;
