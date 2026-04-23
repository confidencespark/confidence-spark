import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

const BASE_URL = process.env.API_URL;

export const confidenceApi = createApi({
  reducerPath: 'confidenceApi',
  /**
   * Base Query Configuration
   * - Sets the API base URL
   * - Automatically injects the 'Authorization' header if a token exists in the Redux store
   */
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, {getState}) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      // headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Session', 'Progress'],
  endpoints: builder => ({
    /**
     * Start a new session / user flow
     * POST /get_started
     */
    getStarted: builder.mutation({
      query: data => ({
        url: '/get_started',
        method: 'POST',
        body: data,
      }),
      // invalidatesTags: ['Session', 'Progress'],
    }),

    /**
     * Edit Situation details for the current device
     * PATCH /situation_edit_device_id_based_info
     */
    editSituation: builder.mutation({
      query: data => ({
        url: '/situation_edit_device_id_based_info',
        method: 'PATCH',
        body: data,
      }),
    }),

    /**
     * Edit Mood details for the current device
     * PATCH /mood_edit_device_id_based_info_
     */
    editMood: builder.mutation({
      query: data => ({
        url: '/mood_edit_device_id_based_info_',
        method: 'PATCH',
        body: data,
      }),
    }),

    /**
     * Lookup confidence info by device ID
     * GET /Confidence_lookup
     */
    confidenceLookup: builder.mutation({
      query: ({device_id}) => ({
        url: `/Confidence_lookup?device_id=${device_id}`,
        method: 'GET', // since your API looks like GET with query params
      }),
    }),
  }),
});

export const {
  useGetStartedMutation,
  useEditSituationMutation,
  useEditMoodMutation,
  useConfidenceLookupMutation,
} = confidenceApi;
