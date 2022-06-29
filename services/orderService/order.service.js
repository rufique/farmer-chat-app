import api from "../api.service";
import { ORDERS } from "../apiTagTypes";

const orderApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUserOrders: builder.query({
      query: (userId) => `orders/user/${userId}`,
      providesTags: [ORDERS]
    }),
    getOrderDetails: builder.query({
      query: (orderId) => `orders/${orderId}`,
      providesTags: [ORDERS]
    }),
    createOrder: builder.mutation({
      query: (body) => ({
        url: "orders",
        method: "POST",
        body,
      }),
      invalidatesTags: [ORDERS]
    }),
    cancelOrder: builder.mutation({
      query: ({id, ...order}) => ({
        url: `orders/${id}`,
        method: "PATCH",
        body: order,
      }),
      invalidatesTags: [ORDERS]
    }),
  }),
});

export default orderApi;
export const {
  useGetUserOrdersQuery,
  useGetOrderDetailsQuery,
  useCreateOrderMutation,
  useCancelOrderMutation,
} = orderApi;
