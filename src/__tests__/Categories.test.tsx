import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import * as categoryApi from "../core/features/categoryApi";
import Categories from "../pages/categories/category";


vi.mock("../core/features/categoryApi", () => ({
  useGetAllCategoriesQuery: vi.fn(),
}));

describe("Categories Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithRouter = () =>
    render(
      <BrowserRouter>
        <Categories />
      </BrowserRouter>
    );

  it("renders loading state", () => {
    (categoryApi.useGetAllCategoriesQuery as any).mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    renderWithRouter();
    expect(screen.getByText("Category Loading...")).toBeInTheDocument();
  });

  it("renders error state", () => {
    (categoryApi.useGetAllCategoriesQuery as any).mockReturnValue({
      data: null,
      isLoading: false,
      error: { message: "Error" },
    });

    renderWithRouter();
    expect(screen.getByText("Error!!!")).toBeInTheDocument();
  });

  it("renders category list correctly", () => {
    const mockCategories = [
      { id: 1, name: "Cat 1", slug: "cat-1", image: "cat1.jpg" },
      { id: 2, name: "Cat 2", slug: "cat-2", image: "cat2.jpg" },
    ];

    (categoryApi.useGetAllCategoriesQuery as any).mockReturnValue({
      data: mockCategories,
      isLoading: false,
      error: null,
    });

    renderWithRouter();

    expect(screen.getByText("Cat 1")).toBeInTheDocument();
    expect(screen.getByText("Cat 2")).toBeInTheDocument();
    expect(screen.getByText("cat-1")).toBeInTheDocument();
    expect(screen.getByText("cat-2")).toBeInTheDocument();

    const images = screen.getAllByRole("img") as HTMLImageElement[];
    expect(images[0].src).toContain("cat1.jpg");
    expect(images[1].src).toContain("cat2.jpg");
  });

  it("renders Add Category button with correct link", async () => {
    (categoryApi.useGetAllCategoriesQuery as any).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });

    renderWithRouter();
    const addButton = screen.getByRole("button", { name: "Add Category" });
    expect(addButton).toBeInTheDocument();
  });
});
