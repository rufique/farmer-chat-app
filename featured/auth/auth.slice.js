import { createSlice } from "@reduxjs/toolkit";
import jwtDecode from "jwt-decode";

const decodeUser = (token) =>
  token ? jwtDecode(token, { username: true, email: true, roles: true }) : null;

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    accessToken: null,
    isAuthenticating: true,
    isLoggedIn: false,
  },
  reducers: {
    setCredentials: (state, { payload: { accessToken } }) => {
      return {
        ...state,
        user: decodeUser(accessToken),
        accessToken,
        isLoggedIn: true,
      };
    },
    restoreAuthentication: (state, { payload: { accessToken } }) => {
      return {
        ...state,
        isAuthenticating: false,
        isLoggedIn: !!accessToken ?? false,
        accessToken: accessToken,
        user: decodeUser(accessToken),
      };
    },
    unsetCredentials: (state) => {
      return {
        ...state,
        user: {},
        accessToken: null,
        isLoggedIn: false,
      };
    },
  },
  extraReducers: (builder) => {},
});

export const { setCredentials, restoreAuthentication, unsetCredentials } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state) => state.authReducer.user;
