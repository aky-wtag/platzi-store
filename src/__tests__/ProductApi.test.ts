import { describe, it, expect, vi, beforeEach } from "vitest";
import { createMockStore } from "./mockStore"; // adjust path to your mockStore
import { productSlice } from "../core/features/productApi";

global.fetch = vi.fn();

const mockProducts = [
  {
    id: 1,
    title: "Product 1",
    slug: "product-1",
    price: 100,
    description: "A product",
    category: { id: 1, name: "Category 1", slug: "cat-1", image: "" },
    images: [],
    creationAt: "2025-01-01",
    updatedAt: "2025-01-01",
    quantity: 10,
  },
  {
    id: 2,
    title: "Product 2",
    slug: "product-2",
    price: 200,
    description: "Another product",
    category: { id: 1, name: "Category 1", slug: "cat-1", image: "" },
    images: [],
    creationAt: "2025-01-01",
    updatedAt: "2025-01-01",
    quantity: 5,
  },
];

describe("productSlice RTK Query", () => {
  let store = createMockStore();

  beforeEach(() => {
    store = createMockStore();
    vi.resetAllMocks();
  });

  it("should fetch products with filters", async () => {
    (global.fetch as any).mockResolvedValueOnce(
      new Response(JSON.stringify(mockProducts), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    );

    const result = await store.dispatch(
      productSlice.endpoints.getProducts.initiate({ title: "Product", limit: "10", offset: "0" })
    );

    expect(global.fetch).toHaveBeenCalled();
    expect(result.data).toEqual(mockProducts);
  });

  it("should fetch a product by id", async () => {
    (global.fetch as any).mockResolvedValueOnce(
      new Response(JSON.stringify(mockProducts[0]), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    );

    const result = await store.dispatch(
      productSlice.endpoints.getProductById.initiate(1)
    );

    expect(global.fetch).toHaveBeenCalled();
    expect(result.data).toEqual(mockProducts[0]);
  });

  it("should create a product", async () => {
    const newProduct = { title: "New Product", price: 300 };
    (global.fetch as any).mockResolvedValueOnce(
      new Response(JSON.stringify({ id: 3, ...newProduct }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    );

    const result = await store.dispatch(
      productSlice.endpoints.createProduct.initiate(newProduct)
    );

    expect(global.fetch).toHaveBeenCalled();
    expect(result.data).toEqual({ id: 3, ...newProduct });
  });

  it("should update a product", async () => {
    const updatedData = { title: "Updated Product" };
    (global.fetch as any).mockResolvedValueOnce(
      new Response(JSON.stringify({ ...mockProducts[0], ...updatedData }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    );

    const result = await store.dispatch(
      productSlice.endpoints.updateProduct.initiate({
        id: 1,
        data: updatedData,
      })
    );

    expect(global.fetch).toHaveBeenCalled();
    expect(result.data).toEqual({ ...mockProducts[0], ...updatedData });
  });
});
