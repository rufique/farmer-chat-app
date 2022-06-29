import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../constants';
import { setCredentials, unsetCredentials } from '../featured/auth/auth.slice';
import { PRODUCTS, CATEGORIES, MEASUREMENTS, USERS, ROLES, ADDRESSES, ORDERS, MARKET_WATCH } from './apiTagTypes';

const baseQuery = fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: 'include',
    prepareHeaders: (headers, { getState, endpoint }) => {
        const {accessToken} = getState().authReducer;
        if (accessToken && endpoint !== "refresh") {
          headers.set("Authorization", `Bearer ${accessToken}`);
        }
        return headers;
    }
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if(result?.error?.originalStatus === 403) {
        console.log("sending refresh token")
        const refreshResult = await baseQuery('/refresh', api, extraOptions);

        if(refreshResult?.data) {
            api.dispatch(setCredentials(refreshResult.data));
            result = await baseQuery(args, api, extraOptions);
        } else {
            api.dispatch(unsetCredentials());
        }
    }
    return result;
}

const api = createApi({
    baseQuery: baseQueryWithReauth,
    tagTypes: [PRODUCTS, CATEGORIES, MARKET_WATCH, MEASUREMENTS, USERS, ROLES, ADDRESSES, ORDERS],
    endpoints: () => ({})
})
export default api;