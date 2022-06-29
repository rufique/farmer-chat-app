import api from "../api.service";

export default chatApi = api.injectEndpoints({  
  endpoints: (builder) => ({
    getTracker: builder.query({
      query: () => `chat/tracker`,
    })
  })
})

export const { useGetTrackerQuery } = chatApi;
