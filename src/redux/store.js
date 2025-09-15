import { configureStore } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import loginSlice from "./Slices/loginSlice";
import actorsSlice from "./Slices/actorsSlice";
import rootSlice from "./Slices/rootSlice";

const reducers = combineReducers({
    user: loginSlice,
    appRoot: rootSlice,
    actors: actorsSlice
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
