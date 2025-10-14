import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { productSlice } from "../core/features/productApi";
import { categorySlice } from "../core/features/categoryApi";
import cartReducer from "../core/features/cartSlice";

const reducers = {
  productApi: productSlice.reducer,
  categoryApi: categorySlice.reducer,
  cart: cartReducer,
} as const; 

export function createMockStore(preloadedState?: Partial<{
  productApi: any;
  categoryApi: any;
  cart: any;
}>) {
  const store = configureStore({
    reducer: reducers,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        productSlice.middleware,
        categorySlice.middleware,
      ),
    preloadedState,
  });

  setupListeners(store.dispatch);
  return store;
}

export type MockRootState = ReturnType<typeof createMockStore>["getState"];
export type MockAppDispatch = ReturnType<typeof createMockStore>["dispatch"];
