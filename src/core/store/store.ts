import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { productSlice } from "../features/productApi";
import { categorySlice } from "../features/categoryApi";
import cartReducer from "../features/cartSlice";
import { authSlice } from "../features/authApi";

export const store = configureStore({
  reducer: {
    [productSlice.reducerPath]: productSlice.reducer,
    [categorySlice.reducerPath]: categorySlice.reducer,
    [authSlice.reducerPath]: authSlice.reducer,
    cart: cartReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      productSlice.middleware,
      categorySlice.middleware,
      authSlice.middleware
    ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = ReturnType<typeof store.dispatch>;
