import { loadCartFromDB, saveCartToDB } from "../db/db";
import type { Product } from "./../interfaces/product";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const loadCart = createAsyncThunk("cart/loadCart", async () => {
  const items: Product[] = await loadCartFromDB() as Product[];
  const totalAmount = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  return { items, totalAmount };
});

const initialState: { items: Product[]; totalAmount: number, status: string } = {
  items: [],
  totalAmount: 0,
  status: "idle",
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const existingItem = state.items.find((item) => item.id === product.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...product, quantity: 1 });
      }

      state.totalAmount = state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
      saveCartToDB(state.items);
    },
    removeFromCart: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter((item) => item.id !== id);
      state.totalAmount = state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
      saveCartToDB(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
      saveCartToDB(state.items);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item.id === id);

      if (item && quantity > 0) {
        item.quantity = quantity;
      }

      state.totalAmount = state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );

      saveCartToDB(state.items);
    },
  },
});

export const { addToCart, removeFromCart, clearCart, updateQuantity } =
  cartSlice.actions;
export default cartSlice.reducer;
