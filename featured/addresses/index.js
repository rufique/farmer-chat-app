import { createSlice } from "@reduxjs/toolkit";

const addressesSlice = createSlice({
    name: "addresses",
    initialState: {
        address: null,
    },
    reducers: {
        updateAddress: (state, action) => {
            state.address = action.payload;
        }
    }
})

export default addressesSlice.reducer;
export const { updateAddress } = addressesSlice.actions;