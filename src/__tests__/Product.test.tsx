import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import * as router from "react-router-dom";
import * as productApi from "../core/features/productApi";
import * as cartSlice from "../core/features/cartSlice";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../core/features/cartSlice";
import Product from "../components/product";

vi.mock("../assets/edit-icon.svg", () => ({ default: "edit-icon.svg" }));

const mockDispatch = vi.fn();
vi.mock("react-redux", async () => {
  const actual = await vi.importActual<typeof import("react-redux")>(
    "react-redux"
  );
  return {
    ...actual,
    useDispatch: () => mockDispatch,
  };
});

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom"
  );
  return {
    ...actual,
    useParams: vi.fn(),
    Link: ({ children, to }: any) => <a href={to}>{children}</a>,
  };
});

describe("Product Component", () => {
  afterEach(() => {
    vi.resetAllMocks();
    mockDispatch.mockClear();
  });

  const renderWithProvider = () => {
    const store = configureStore({
      reducer: { cart: cartReducer },
      preloadedState: {
        cart: { items: [], totalAmount: 0, status: "idle" },
      },
    });

    render(
      <Provider store={store}>
        <Product />
      </Provider>
    );

    return store;
  };

  it("renders loading state", () => {
    (router.useParams as any).mockReturnValue({ id: "1" });
    vi.spyOn(productApi, "useGetProductByIdQuery").mockReturnValue({
      data: null,
      error: null,
      isLoading: true,
    } as any);

    renderWithProvider();

    expect(screen.getByText("Loading Product...")).toBeInTheDocument();
  });

  it("renders error state", () => {
    (router.useParams as any).mockReturnValue({ id: "1" });
    vi.spyOn(productApi, "useGetProductByIdQuery").mockReturnValue({
      data: null,
      error: { message: "Failed" },
      isLoading: false,
    } as any);

    renderWithProvider();

    expect(screen.getByText("Error Occured!!!")).toBeInTheDocument();
  });

  it("renders product info and handles Add to Cart", () => {
    (router.useParams as any).mockReturnValue({ id: "1" });
    vi.spyOn(productApi, "useGetProductByIdQuery").mockReturnValue({
      data: {
        id: 1,
        title: "Test Product",
        description: "Product description",
        price: 99.99,
        category: { name: "Test Category" },
        images: ["img1.jpg", "img2.jpg"],
      },
      error: null,
      isLoading: false,
    } as any);

    renderWithProvider();

    // Product info
    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByText("Product description")).toBeInTheDocument();
    expect(screen.getByText("$99.99")).toBeInTheDocument();
    expect(screen.getByText("Category: Test Category")).toBeInTheDocument();

    // Switch image
    const thumbnails = screen.getAllByRole("img");
    expect(thumbnails[0]).toHaveAttribute("src", "img1.jpg");
    fireEvent.click(thumbnails[1]);
    expect(thumbnails[1]).toHaveAttribute("src", "img2.jpg");

    // Add to cart
    fireEvent.click(screen.getByText("Add To Cart"));
    expect(mockDispatch).toHaveBeenCalledWith(
      cartSlice.addToCart({
        id: 1,
        title: "Test Product",
        description: "Product description",
        price: 99.99,
        category: { name: "Test Category" },
        images: ["img1.jpg", "img2.jpg"],
      })
    );
  });
});
