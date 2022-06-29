import api from "../api.service";
import { ADDRESSES } from "../apiTagTypes";

const addressApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAddress: builder.query({
      query: (id) => `addresses/${id}`,
      providesTags: [ADDRESSES],
    }),
    getUserAddresses: builder.query({
      query: (args) => `addresses/user/${args}`,
      providesTags: [ADDRESSES],
    }),
    createAddress: builder.mutation({
      query: (body) => ({
        url: `addresses`,
        method: "POST",
        body,
      }),
      invalidatesTags: [ADDRESSES],
    }),
  }),
  overrideExisting: true,
});

export default addressApi;
export const {
  useGetAddressQuery,
  useGetUserAddressesQuery,
  useCreateAddressMutation,
} = addressApi;
