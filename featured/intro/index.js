import { createSlice } from "@reduxjs/toolkit";

const introSlice = createSlice({
    name: "intro",
    initialState: {
        isIntro: true,
    },
    reducers: {
        setIsIntro: (state, action) => {
            state.isIntro = action.payload;
        }
    }
})

export default introSlice.reducer;
export const { setIsIntro } = introSlice.actions;