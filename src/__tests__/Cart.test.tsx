
import { describe, it, expect, vi, beforeEach, beforeAll } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import Cart from "../pages/cart/cart";
import { createMockStore } from "./mockStore";


beforeAll(() => {
  const fakeIndexedDB = {
    open: vi.fn().mockReturnValue({
      onupgradeneeded: null,
      onsuccess: null,
      onerror: null,
    }),
  };
  // @ts-ignore
  global.indexedDB = fakeIndexedDB;
});

vi.mock("../core/db/db", () => ({
  saveCartToDB: vi.fn(),
  openDB: vi.fn(),
}));

describe("Cart Component", () => {
  let store: ReturnType<typeof createMockStore>;

  const cartWithItems = {
    items: [
      { id: 1, title: "Product 1", price: 10, quantity: 2 },
      { id: 2, title: "Product 2", price: 20, quantity: 1 },
    ],
    totalAmount: 40,
  };

  const emptyCart = {
    items: [],
    totalAmount: 0,
  };

  const preloadedState = {
    cart: cartWithItems,
    productApi: { queries: {}, mutations: {}, provided: {}, subscriptions: {} },
    categoryApi: { queries: {}, mutations: {}, provided: {}, subscriptions: {} },
    authApi: { queries: {}, mutations: {}, provided: {}, subscriptions: {} },
  };

  const renderWithProvider = (state = preloadedState) => {
    store = createMockStore(state);
    vi.spyOn(store, "dispatch"); 
    return render(
      <Provider store={store}>
        <Cart />
      </Provider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders cart items and total", () => {
    renderWithProvider();
    expect(screen.getByText("Shopping Cart")).toBeInTheDocument();
    expect(screen.getByText("Product 1")).toBeInTheDocument();
    expect(screen.getByText("Product 2")).toBeInTheDocument();
    expect(screen.getByText("Total: $40")).toBeInTheDocument();
  });

  it("shows empty message if cart is empty", () => {
    renderWithProvider({
      ...preloadedState,
      cart: emptyCart,
    });
    expect(screen.getByText("Your cart is empty")).toBeInTheDocument();
  });

  it("dispatches updateQuantity when quantity changes", async () => {
    renderWithProvider();
    const quantityInput = screen.getAllByRole("spinbutton")[0];

    fireEvent.change(quantityInput, { target: { value: 3 } });

    expect(store.dispatch).toHaveBeenCalledWith({
      type: "cart/updateQuantity",
      payload: { id: 1, quantity: 3 },
    });
  });

  it("dispatches removeFromCart when Remove is clicked", async () => {
    renderWithProvider();
    const removeButton = screen.getAllByText("Remove")[0];
    await userEvent.click(removeButton);

    expect(store.dispatch).toHaveBeenCalledWith({
      type: "cart/removeFromCart",
      payload: 1,
    });
  });

  it("clears cart and calls alert on checkout", async () => {
    const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});
    renderWithProvider();

    const checkoutButton = screen.getByText("Checkout");
    await userEvent.click(checkoutButton);

    expect(alertMock).toHaveBeenCalledWith("Order placed! Total: $40");
    expect(store.dispatch).toHaveBeenCalledWith({
      type: "cart/clearCart",
    });

    alertMock.mockRestore();
  });
});
