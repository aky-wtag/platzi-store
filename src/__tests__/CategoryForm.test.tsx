import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import * as categoryApi from "../core/features/categoryApi";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useParams: vi.fn(),
    useNavigate: () => vi.fn(),
  };
});

import * as router from "react-router-dom";
import CategoryForm from "../components/categoryForm";
import { Provider } from "react-redux";
import { createMockStore } from "./mockStore";

describe("CategoryForm Component", () => {
  const store = createMockStore();
  afterEach(() => {
    vi.resetAllMocks();
  });

  it("renders loading state", () => {
    (router.useParams as any).mockReturnValue({ id: "1" });
    vi.spyOn(categoryApi, "useGetCategoryByIdQuery").mockReturnValue({
      data: null,
      error: null,
      isLoading: true,
      isFetching: false,
      refetch: (() => {}) as any,
    } as any);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <CategoryForm />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText("Loading Categories...")).toBeInTheDocument();
  });

  it("renders error state", () => {
    (router.useParams as any).mockReturnValue({ id: "1" });
    vi.spyOn(categoryApi, "useGetCategoryByIdQuery").mockReturnValue({
      data: null,
      error: { message: "Failed" },
      isLoading: false,
      isFetching: false,
      refetch: (() => {}) as any,
    } as any);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <CategoryForm />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText("Error !!!")).toBeInTheDocument();
  });

  it("Pre Fill Form for Upadting Category", () => {
    (router.useParams as any).mockReturnValue({ id: "1" });
    vi.spyOn(categoryApi, "useGetCategoryByIdQuery").mockReturnValue({
      data: {
        id: 1,
        name: "Test Category",
        slug: "test-category",
        image: "test.jpg",
      },
      error: null,
      isLoading: false,
      isFetching: false,
      refetch: (() => {}) as any,
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <CategoryForm />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByDisplayValue("Test Category")).toBeInTheDocument();
    expect(screen.getByDisplayValue("test-category")).toBeInTheDocument();
    expect(screen.getByDisplayValue("test.jpg")).toBeInTheDocument();
    expect(screen.getByText("Update")).toBeInTheDocument();
  });

  it("submits form to create category", async () => {
    (router.useParams as any).mockReturnValue({});
    const mockCreate = vi.fn(() => ({ unwrap: () => Promise.resolve() }));
    vi.spyOn(categoryApi, "useCreateCategoryMutation").mockReturnValue([mockCreate] as any);

    render(
        <Provider store={store}>
          <MemoryRouter>
            <CategoryForm />
          </MemoryRouter>
        </Provider>
    );

    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: "New Category" } });
    fireEvent.change(screen.getByLabelText(/Slug/i), { target: { value: "new-category" } });
    fireEvent.change(screen.getByPlaceholderText(/Image URL/i), { target: { value: "image.jpg" } });

    fireEvent.click(screen.getByText("Create"));

    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalledWith({
        name: "New Category",
        slug: "new-category",
        image: "image.jpg",
      });
    });
  });

  it("submits form to update existing category", async () => {
    (router.useParams as any).mockReturnValue({ id: "1" });
    const mockUpdate = vi.fn(() => ({ unwrap: () => Promise.resolve() }));
    vi.spyOn(categoryApi, "useGetCategoryByIdQuery").mockReturnValue({
      data: { id: 1, name: "Old", slug: "old", image: "old.jpg" },
      error: null,
      isLoading: false,
      isFetching: false,
      refetch: (() => {}) as any,
    } as any);
    vi.spyOn(categoryApi, "useUpdateCategoryMutation").mockReturnValue([mockUpdate] as any);

    render(
        <Provider store={store}>
          <MemoryRouter>
            <CategoryForm />
          </MemoryRouter>
        </Provider>
    );

    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: "Updated" } });
    fireEvent.click(screen.getByText("Update"));

    await waitFor(() => {
      expect(mockUpdate).toHaveBeenCalledWith({
        id: 1,
        data: { name: "Updated", slug: "old", image: "old.jpg" },
      });
    });
  });
});

