import api from "../api.service";
import { MARKET_WATCH } from "../apiTagTypes";

const marketWatchApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getWeeklyWatchList: builder.query({
      query: () => "/market-watch",
      providesTags: [MARKET_WATCH]
    }),
    getRetailerWatch: builder.query({
      query: (retailerId) => `/market-watch/retailer-list/${retailerId}`,
      providesTags: [MARKET_WATCH]
    }),
    createMarketWatch: builder.mutation({
      query: (data) => ({
        url: `/market-watch`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [MARKET_WATCH]
    }),
    updateMarketWatch: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/market-watch/products/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: [MARKET_WATCH]
    }),
  }),
  overrideExisting: true
});

export default marketWatchApi;
export const {
  useGetWeeklyWatchListQuery,
  useGetRetailerWatchQuery,
  useCreateMarketWatchMutation,
  useUpdateMarketWatchMutation,
} = marketWatchApi;
