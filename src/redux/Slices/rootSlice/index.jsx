import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    productCategories: [],
    productSubCategories: [],
    serviceCategories: [],
}
const rootSlice = createSlice({
    name: 'appRoot',
    initialState,
    reducers: {
        setProductCategories: (state, action) => {
            state.productCategories = action.payload
        },
        setServiceCategories: (state, action) => {
            state.serviceCategories = action.payload
        },
        setProductSubCategories: (state, action) => {
            state.productSubCategories = action.payload
        }
    }
})

export const { setProductCategories, setServiceCategories, setProductSubCategories } = rootSlice.actions

export default rootSlice.reducer
