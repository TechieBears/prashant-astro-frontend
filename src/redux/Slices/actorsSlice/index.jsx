import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    leadActor: [],
    randomActors: [],
    filteredActors: [],
    letestCasting: [],
    castingDirector: [],
    castingAgency: [],
    letestProduction: [],
    blacklistedActors: [],
    knownActors: [],
    semiKnownActors: [],
    activeTab: 0
}
const actorsSlice = createSlice({
    name: 'actors',
    initialState,
    reducers: {
        setLeadActor: (state, action) => {
            state.leadActor = action.payload
        },
        setRandomActors: (state, action) => {
            state.randomActors = action.payload
        },
        setFilteredActors: (state, action) => {
            state.filteredActors = action.payload
        },
        setLetestCasting: (state, action) => {
            state.letestCasting = action.payload
        },
        setCastingDirector: (state, action) => {
            state.castingDirector = action.payload
        },
        setcastingAgency: (state, action) => {
            state.castingAgency = action.payload
        },
        setLetestProduction: (state, action) => {
            state.letestProduction = action.payload
        },
        setBlacklistedActors: (state, action) => {
            state.blacklistedActors = action.payload
        },
        setKnownActors: (state, action) => {
            state.knownActors = action.payload
        },
        setSemiKnownActors: (state, action) => {
            state.semiKnownActors = action.payload
        },
        setActiveTab: (state, action) => {
            state.activeTab = action.payload
        },

    }
})

export const { setLeadActor, setRandomActors, setFilteredActors, setLetestCasting, setCastingDirector, setcastingAgency, setLetestProduction, setActiveTab, setBlacklistedActors, setKnownActors, setSemiKnownActors } = actorsSlice.actions

export default actorsSlice.reducer
