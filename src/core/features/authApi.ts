import { baseApi } from "../api/baseQuery";
import { FETCH_PROFILE_URL, LOGIN_URL } from "../constants/api.constant";
import type { AuthResponse } from "../interfaces/authResponse";
import type { User } from "../interfaces/user";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, { email: string; password: string }>({
      query: (body) => ({
        url: LOGIN_URL,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),
    profile: builder.query<User, void>({
      query: () => FETCH_PROFILE_URL,
      providesTags: ["Auth"],
    }),
  }),
});

export const { useLoginMutation, useProfileQuery } = authApi;