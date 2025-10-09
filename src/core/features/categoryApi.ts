import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Category } from "../interfaces/category";

const API_URL: string =
  import.meta.env.VITE_API_URL || "https://api.escuelajs.co/api";

export const categorySlice = createApi({
  reducerPath: "categoryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL+"/v1",
  }),
  tagTypes: ["Category"],
  endpoints: (builder) => ({
    getAllCategories: builder.query<Category[], void>({
      query: () => "categories",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Category" as const, id })),
              { type: "Category", id: "LIST" },
            ]
          : [{ type: "Category", id: "LIST" }],
    }),

    getCategoryById: builder.query<Category, number>({
      query: (id) => `categories/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Category", id }],
    }),

    updateCategory: builder.mutation<any, Partial<any>>({
      query: ({ id, data }) => ({
        url: `categories/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Category", id }],
    }),

    createCategory: builder.mutation<any, Partial<any>>({
      query: ({ data }) => ({
        url: `categories`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Category", id: "LIST" }],
    }),
  }),
});

export const {
  useGetAllCategoriesQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
} = categorySlice;
