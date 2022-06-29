import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query'
import authReducer from '../featured/auth/auth.slice';
import chatReducer from '../featured/chat/chat.slice';
import cartReducer from '../featured/cart/cart.slice';
import introReducer from '../featured/intro';
import addressesReducer from '../featured/addresses';
import chatMiddleware from '../featured/chat/chat.middleware';
import api from './api.service';

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    authReducer,
    chatReducer,
    introReducer,
    cartReducer,
    addressesReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([api.middleware,chatMiddleware]),
})

setupListeners(store.dispatch);