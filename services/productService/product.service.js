import api from '../api.service';

const productApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => `products`,
      providesTags: ['Products']
    }),
    getProduct: builder.query({
      query: (id) => `products/${id}`,
    }),
    getProductsInWatch: builder.query({
      query: () => `products/watch-list`,
    }),
    createProduct: builder.mutation({
      query: (body) => ({
        url: `products`,
        method: "POST",
        body,
      }),
      invalidatesTags: ['Products']
    }),
  }),
});

export default productApi;
export const { useGetProductsQuery, useGetProductsInWatchQuery, useGetProductQuery, useCreateProductMutation } =
  productApi;
