import { loadCartFromDB, saveCartToDB } from "../db/db";
import type { Product } from "./../interfaces/product";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchCart = createAsyncThunk("cart/fetchCart", async () => {
  const items = await loadCartFromDB();
  return items;
});

const initialState: { items: Product[]; totalAmount: number; status: string } =
  {
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
      saveCartToDB(JSON.parse(JSON.stringify(state.items)));
    },
    removeFromCart: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter((item) => item.id !== id);
      state.totalAmount = state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
      saveCartToDB(JSON.parse(JSON.stringify(state.items)));
    },
    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
      saveCartToDB(JSON.parse(JSON.stringify(state.items)));
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter((i) => i.id !== id);
        } else {
          item.quantity = quantity;
        }
      }

      state.totalAmount = state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );

      saveCartToDB(JSON.parse(JSON.stringify(state.items)));
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCart.fulfilled, (state, action) => {
      state.items = action.payload;
      state.totalAmount = state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    });
  },
});

export const { addToCart, removeFromCart, clearCart, updateQuantity } =
  cartSlice.actions;
export default cartSlice.reducer;
