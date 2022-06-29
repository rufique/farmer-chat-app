import { createSlice } from "@reduxjs/toolkit";

// { id, name, price, quantity }
const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: [],
    shippingCost: 0, // TODO...
    shippingAddress: null,
  },
  reducers: {
    updateCart: (state, action) => {
        state.cart = action.payload
    },
    clearCart: (state) => {
        state.cart = [];
    },
    updateShippingAddress: (state, action) => { 
      state.shippingAddress = action.payload 
    }
  },
});

export default cartSlice.reducer;
export const { updateCart, clearCart, updateShippingAddress } = cartSlice.actions;
