import { describe, it, expect,  } from "vitest";
import { setupListeners } from "@reduxjs/toolkit/query";
import { configureStore } from "@reduxjs/toolkit";
import { categorySlice } from "../core/features/categoryApi";
import type { Category } from "../core/interfaces/category";

function createMockStore() {
  const store = configureStore({
    reducer: {
      categoryApi: categorySlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(categorySlice.middleware),
  });
  setupListeners(store.dispatch);
  return store;
}

describe("categorySlice API", () => {
  it("getAllCategories query should return mocked data", async () => {
    const fakeCategories: Category[] = [
      { id: 1, name: "Electronics", slug: "electronics", image: "img1.jpg" },
      { id: 2, name: "Books", slug: "books", image: "img2.jpg" },
    ];

    const mockApi = categorySlice.injectEndpoints({
      overrideExisting: true,
      endpoints: (builder) => ({
        getAllCategories: builder.query<Category[], void>({
          queryFn: () => ({ data: fakeCategories }),
        }),
      }),
    });

    const store = createMockStore();

    const result = await store.dispatch(
      mockApi.endpoints.getAllCategories.initiate()
    );

    expect(result.data).toEqual(fakeCategories);
    expect(result.isSuccess).toBe(true);
  });

  it("getCategoryById query should return a single category", async () => {
    const category: Category = {
      id: 1,
      name: "Electronics",
      slug: "electronics",
      image: "img1.jpg",
    };

    const mockApi = categorySlice.injectEndpoints({
      overrideExisting: true,
      endpoints: (builder) => ({
        getCategoryById: builder.query<Category, number>({
          queryFn: (id) => ({ data: id === 1 ? category : null }) as any,
        }),
      }),
    });

    const store = createMockStore();

    const result = await store.dispatch(
      mockApi.endpoints.getCategoryById.initiate(1)
    );

    expect(result.data).toEqual(category);
    expect(result.isSuccess).toBe(true);
  });
});
