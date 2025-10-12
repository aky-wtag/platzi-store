import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import cartReducer, { fetchCart } from "../core/features/cartSlice";
import { MemoryRouter } from "react-router-dom";
import Navbar from "../components/navbar";

vi.mock("../core/features/cartSlice", async () => {
  const actual = await vi.importActual("../core/features/cartSlice");
  return {
    ...actual,
    fetchCart: vi.fn(() => ({ type: "cart/fetchCart" })),
  };
});

describe("Navbar Component", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  const renderWithStore = (preloadedState?: any) => {
    const store = configureStore({
      reducer: { cart: cartReducer },
      preloadedState: { cart: { items: [], ...preloadedState } },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      </Provider>
    );

    return store;
  };

  it("renders all links and cart count 0", () => {
    renderWithStore();

    expect(screen.getByText("My Store")).toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Products")).toBeInTheDocument();
    expect(screen.getByText("Categories")).toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByText("Cart 0")).toBeInTheDocument();
  });

  it("renders cart with items count", () => {
    renderWithStore({ items: [{ id: 1, name: "Product 1" }, { id: 2 }] });

    expect(screen.getByText("Cart 2")).toBeInTheDocument();
  });

  it("dispatches fetchCart on mount", () => {
    renderWithStore();
    expect(fetchCart).toHaveBeenCalled();
  });
});
