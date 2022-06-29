import api from "../api.service";

export default authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: ({ mobile: username, pin: password, ...rest }) => ({
         url: `users/login`,
         method: 'POST',
         body: { username, password, ...rest },
      }),
      //transformResponse: (response, meta, arg) => response.data,
    }),
    getUserProfile: builder.query({
      query: (id) => `users/${id}`
    }),
    uploadUserPhoto: builder.mutation({
      query: ({id, ...photo}) => ({
        url: `users/${id}/photos`,
        method: 'POST',
        body: photo,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data; charset=utf-8; boundary="---file"',
        },
      })
    })
  }),
  overrideExisting: true
})

export const { useLoginMutation, useGetUserProfileQuery, useUploadUserPhotoMutation } = authApi;
