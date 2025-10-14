import { describe, it, expect, vi, beforeEach } from "vitest";
import cartReducer, {
  addToCart,
  removeFromCart,
  clearCart,
  updateQuantity,
  fetchCart,
} from "../core/features/cartSlice";
import type { Product } from "../core/interfaces/product";
import * as db from "../core/db/db";
import { configureStore } from "@reduxjs/toolkit";

vi.mock("../core/db/db", () => {
    return {
      loadCartFromDB: vi.fn(async () => []),
      saveCartToDB: vi.fn(async () => undefined),
    };
  });
describe("cartSlice", () => {
  const sampleProduct: Product = {
    id: 1,
    title: "Test Product",
    price: 10,
    quantity: 1,
    slug: "",
    description: "",
    category: {
      id: 1,
      name: "Test",
      slug: "string",
      image: "string",
    },
    images: [],
    creationAt: "",
    updatedAt: "",
  };

  const initialState = {
    items: [] as Product[],
    totalAmount: 0,
    status: "idle",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return the initial state", () => {
    const result = cartReducer(undefined, { type: '' });
    expect(result).toEqual(initialState);
  });

  it("should handle addToCart for a new item", () => {
    const state = cartReducer(initialState, addToCart(sampleProduct));

    expect(state.items.length).toBe(1);
    expect(state.items[0].quantity).toBe(1);
    expect(state.totalAmount).toBe(10);
    expect(db.saveCartToDB).toHaveBeenCalledOnce();
  });

  it("should handle addToCart for an existing item", () => {
    const stateWithItem = {
      ...initialState,
      items: [{ ...sampleProduct, quantity: 1 }],
    };

    const state = cartReducer(stateWithItem, addToCart(sampleProduct));
    expect(state.items[0].quantity).toBe(2);
    expect(state.totalAmount).toBe(20);
  });

  it("should handle removeFromCart", () => {
    const stateWithItem = {
      ...initialState,
      items: [{ ...sampleProduct }],
      totalAmount: 10,
    };

    const state = cartReducer(stateWithItem, removeFromCart(1));
    expect(state.items.length).toBe(0);
    expect(state.totalAmount).toBe(0);
    expect(db.saveCartToDB).toHaveBeenCalledOnce();
  });

  it("should handle clearCart", () => {
    const stateWithItems = {
      ...initialState,
      items: [{ ...sampleProduct }],
      totalAmount: 10,
    };

    const state = cartReducer(stateWithItems, clearCart());
    expect(state.items).toEqual([]);
    expect(state.totalAmount).toBe(0);
    expect(db.saveCartToDB).toHaveBeenCalledOnce();
  });

  it("should handle updateQuantity", () => {
    const stateWithItem = {
      ...initialState,
      items: [{ ...sampleProduct, quantity: 1 }],
    };

    const state = cartReducer(
      stateWithItem,
      updateQuantity({ id: 1, quantity: 3 })
    );

    expect(state.items[0].quantity).toBe(3);
    expect(state.totalAmount).toBe(30);
    expect(db.saveCartToDB).toHaveBeenCalledOnce();
  });

  it("should not update quantity if item not found", () => {
    const state = cartReducer(
      initialState,
      updateQuantity({ id: 99, quantity: 3 })
    );
    expect(state.items).toEqual([]);
  });

  it("should handle fetchCart (fulfilled)", async () => {
    const mockItems = [{ ...sampleProduct, quantity: 2 }];
    (db.loadCartFromDB as any).mockResolvedValue(mockItems);

    const store = configureStore({ reducer: { cart: cartReducer } });
    await store.dispatch(fetchCart());

    const state = store.getState().cart;

    expect(state.items).toEqual(mockItems);
    expect(state.totalAmount).toBe(20);
  });
});
