import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URL: string =
  import.meta.env.VITE_API_URL || "https://api.escuelajs.co/api";

export const authSlice = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL + "/v1",
  }),
  endpoints: (builder) => ({
    login: builder.mutation<any, Partial<any>>({
      query: ({ data }) => ({
        url: "auth/login",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useLoginMutation } = authSlice;
