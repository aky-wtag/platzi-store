import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Product } from "../interfaces/product";

const API_URL: string =
  import.meta.env.VITE_API_URL || "https://api.escuelajs.co/api";

export const productSlice = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/v1`,
  }),
  tagTypes: ["Product"],
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], Record<string, any>>({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters?.title) params.append("title", filters.title);
        if (filters?.price) params.append("price", filters.price);
        if (filters?.price_min) params.append("price_min", filters.price_min);
        if (filters?.price_max) params.append("price_max", filters.price_max);
        if (filters?.categoryId)
          params.append("categoryId", filters.categoryId);
        if (filters?.categorySlug)
          params.append("categorySlug", filters.categorySlug);
        params.append("limit", filters.limit);
        params.append("offset", filters.offset);

        return `products?${params.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Product" as const, id })),
              { type: "Product", id: "LIST" },
            ]
          : [{ type: "Product", id: "LIST" }],
    }),

    getProductById: builder.query<Product, number>({
      query: (id) => `products/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Product", id }],
    }),

    createProduct: builder.mutation<any, Partial<any>>({
      query: (body) => ({
        url: "products",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),

    updateProduct: builder.mutation<
      Product,
      { id: number; data: Partial<any> }
    >({
      query: ({ id, data }) => ({
        url: `products/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Product", id }],
    }),

    getProductsPaginated: builder.query<
      any[],
      { offset: number; limit: number }
    >({
      query: ({ offset, limit }) => `products?offset=${offset}&limit=${limit}`,
      providesTags: ["Product"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useGetProductsPaginatedQuery,
} = productSlice;
