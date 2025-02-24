import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const meetingApiSlice = createApi({
  reducerPath: 'meetingApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/api' }),
  endpoints: (builder) => ({
    getMeetings: builder.query({
      query: () => '/meetings',
    }),
    getMeeting: builder.query({
      query: (id) => `/meetings/${id}`,
    }),
    createMeeting: builder.mutation({
      query: (meetingData) => ({
        url: '/meetings',
        method: 'POST',
        body: meetingData,
      }),
    }),
    updateMeetingStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/meetings/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
    }),
    deleteMeeting: builder.mutation({
      query: (id) => ({
        url: `/meetings/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetMeetingsQuery,
  useGetMeetingQuery,
  useCreateMeetingMutation,
  useUpdateMeetingStatusMutation,
  useDeleteMeetingMutation,
} = meetingApiSlice; 