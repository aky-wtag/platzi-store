import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import * as router from "react-router-dom";
import * as productApi from "../core/features/productApi";
import * as categoryApi from "../core/features/categoryApi";
import cartReducer from "../core/features/cartSlice";
import ProductForm from "../components/productForm";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: vi.fn(),
  };
});

vi.mock("../core/features/productApi", () => ({
  useGetProductByIdQuery: vi.fn(),
  useCreateProductMutation: vi.fn(),
  useUpdateProductMutation: vi.fn(),
}));

vi.mock("../core/features/categoryApi", () => ({
  useGetAllCategoriesQuery: vi.fn(),
}));

describe("ProductForm Component", () => {
  const renderWithProvider = () => {
    const store = configureStore({
        reducer: { cart: cartReducer },
        preloadedState: {
          cart: { items: [], totalAmount: 0, status: "idle" },
        },
      });
    render(
      <Provider store={store}>
        <ProductForm />
      </Provider>
    );
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state", () => {
    (router.useParams as any).mockReturnValue({ id: "1" });
    (productApi.useGetProductByIdQuery as any).mockReturnValue({
      data: null,
      error: null,
      isLoading: true,
    });
    (productApi.useCreateProductMutation as any).mockReturnValue([vi.fn(), {}]);
    (productApi.useUpdateProductMutation as any).mockReturnValue([vi.fn(), {}]);
    (categoryApi.useGetAllCategoriesQuery as any).mockReturnValue({ data: [] });

    renderWithProvider();
    expect(screen.getByText("Loading product...")).toBeInTheDocument();
  });

  it("renders error state", () => {
    (router.useParams as any).mockReturnValue({ id: "1" });
    (productApi.useGetProductByIdQuery as any).mockReturnValue({
      data: null,
      error: { message: "Error" },
      isLoading: false,
    });
    (categoryApi.useGetAllCategoriesQuery as any).mockReturnValue({ data: [] });

    renderWithProvider();
    expect(screen.getByText("Error Occured!!!")).toBeInTheDocument();
  });

  it("renders create form and submits new product", async () => {
    (router.useParams as any).mockReturnValue({});
    const mockCreate = vi.fn().mockReturnValue({ unwrap: () => Promise.resolve() });
    (productApi.useGetProductByIdQuery as any).mockReturnValue({
      data: null,
      error: null,
      isLoading: false,
    });
    (productApi.useCreateProductMutation as any).mockReturnValue([mockCreate]);
    (productApi.useUpdateProductMutation as any).mockReturnValue([vi.fn()]);
    (categoryApi.useGetAllCategoriesQuery as any).mockReturnValue({
      data: [{ id: 1, name: "Category 1" }],
    });

    renderWithProvider();

    fireEvent.change(screen.getByLabelText("Title"), { target: { value: "New Product" } });
    fireEvent.change(screen.getByLabelText("Slug"), { target: { value: "new-product" } });
    fireEvent.change(screen.getByLabelText("Price"), { target: { value: "100" } });
    fireEvent.change(screen.getByLabelText("Description"), { target: { value: "Nice product" } });
    fireEvent.change(screen.getByLabelText("Category"), { target: { value: "1" } });
    fireEvent.change(screen.getByPlaceholderText("Image URL"), { target: { value: "img1.jpg" } });

    fireEvent.click(screen.getByText("Create"));

    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  it("renders update form with existing data and updates successfully", async () => {
    (router.useParams as any).mockReturnValue({ id: "2" });
    const mockUpdate = vi.fn().mockReturnValue({ unwrap: () => Promise.resolve() });

    (productApi.useGetProductByIdQuery as any).mockReturnValue({
      data: {
        id: 2,
        title: "Old Product",
        slug: "old-product",
        price: 50,
        description: "Old description",
        category: { id: 3, name: "Old Category" },
        images: ["old.jpg"],
      },
      error: null,
      isLoading: false,
    });

    (categoryApi.useGetAllCategoriesQuery as any).mockReturnValue({
      data: [
        { id: 3, name: "Old Category" },
        { id: 4, name: "New Category" },
      ],
    });

    (productApi.useUpdateProductMutation as any).mockReturnValue([mockUpdate]);
    (productApi.useCreateProductMutation as any).mockReturnValue([vi.fn()]);

    renderWithProvider();

    // ensure data populated
    expect(screen.getByDisplayValue("Old Product")).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Title"), { target: { value: "Updated Product" } });

    fireEvent.click(screen.getByText("Update"));

    await waitFor(() => {
      expect(mockUpdate).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith("/product-detail/2");
    });
  });

  it("adds a new image field dynamically", () => {
    (router.useParams as any).mockReturnValue({});
    (productApi.useGetProductByIdQuery as any).mockReturnValue({
      data: null,
      error: null,
      isLoading: false,
    });
    (productApi.useCreateProductMutation as any).mockReturnValue([vi.fn()]);
    (productApi.useUpdateProductMutation as any).mockReturnValue([vi.fn()]);
    (categoryApi.useGetAllCategoriesQuery as any).mockReturnValue({
      data: [{ id: 1, name: "Category 1" }],
    });

    renderWithProvider();

    fireEvent.click(screen.getByText("+ Add Image"));
    const inputs = screen.getAllByPlaceholderText("Image URL");
    expect(inputs.length).toBe(2);
  });
});
