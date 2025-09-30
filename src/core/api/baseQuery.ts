import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query";

const BASE = `${import.meta.env.VITE_API_URL}/v1`;

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE,
    // prepareHeaders: (headers, { getState }) => {
    //   const token = (getState() as RootState).auth.token;
    //   if (token) headers.set("Authorization", `Bearer ${token}`);
    //   return headers;
    // },
  }),
  tagTypes: [],
  endpoints: () => ({}),
});
