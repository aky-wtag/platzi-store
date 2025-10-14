import { describe, it, expect, vi, beforeEach, beforeAll } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

vi.mock("../core/features/productApi", () => {
  const noopMiddleware = (_: any) => (next: any) => (action: any) =>
    next(action);

  return {
    useGetProductsQuery: vi.fn(() => ({
      data: [
        { id: 1, title: "Product 1", price: 100, images: ["img1.jpg"] },
        { id: 2, title: "Product 2", price: 50, images: ["img2.jpg"] },
      ],
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    })),
    productSlice: { reducer: {}, middleware: noopMiddleware },
  };
});

vi.mock("../core/features/categoryApi", () => {
  const noopMiddleware = (_: any) => (next: any) => (action: any) =>
    next(action);

  return {
    useGetAllCategoriesQuery: vi.fn(() => ({
      data: [
        { id: "cat1", name: "Category 1" },
        { id: "cat2", name: "Category 2" },
      ],
    })),
    categorySlice: { reducer: {}, middleware: noopMiddleware },
  };
});

import Products from "../pages/products/products";
import { createMockStore } from "./mockStore";
import * as CartSlice from "../core/features/cartSlice";

describe("Products Component", () => {
  let store = createMockStore();

  beforeEach(() => {
    store = createMockStore();
    vi.clearAllMocks();
    vi.spyOn(CartSlice, "addToCart");
  });
  
  beforeAll(() => {
    global.indexedDB = {
      open: vi.fn(() => ({
        onupgradeneeded: null,
        onsuccess: null,
        onerror: null,
      })),
    } as any;
  });
  it("renders products and categories correctly", async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Products />
        </BrowserRouter>
      </Provider>
    );

    expect(await screen.findByText(/Product 1/i)).toBeDefined();
    expect(await screen.findByText(/Product 2/i)).toBeDefined();

    expect(screen.getByText(/Category 1/i)).toBeDefined();
    expect(screen.getByText(/Category 2/i)).toBeDefined();

    expect(screen.getByText(/Add Product/i)).toBeDefined();
  });

  it("dispatches addToCart when add button is clicked", async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Products />
        </BrowserRouter>
      </Provider>
    );

    const cartButton = await screen.findByLabelText("Add Product 1 to cart");
    fireEvent.click(cartButton);

    expect(CartSlice.addToCart).toHaveBeenCalledWith({
      id: 1,
      title: "Product 1",
      price: 100,
      images: ["img1.jpg"],
    });
  });
});
