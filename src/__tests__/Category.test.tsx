import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Category from "../components/category";
import * as categoryApi from "../core/features/categoryApi";
import type {
  QueryActionCreatorResult,
  QueryDefinition,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from "@reduxjs/toolkit/query";

vi.mock("react-router-dom", async () => {
  const actual: any = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useParams: vi.fn(),
  };
});

import * as router from "react-router-dom";
vi.mock("../assets/edit-icon.svg", () => {
  return {
    default: "edit-icon.svg",
  };
});

describe("Category Component", () => {
  const useParamsSpy = vi.spyOn(router, "useParams");
  const useGetCategoryByIdQuerySpy = vi.spyOn(
    categoryApi,
    "useGetCategoryByIdQuery"
  );

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("renders loding state", () => {
    useParamsSpy.mockReturnValue({ id: "1" });
    useGetCategoryByIdQuerySpy.mockReturnValue({
      data: null,
      error: null,
      isLoading: true,
      isFetching: false,
      refetch: function (): QueryActionCreatorResult<
        QueryDefinition<
          number,
          BaseQueryFn<
            string | FetchArgs,
            unknown,
            FetchBaseQueryError,
            {},
            FetchBaseQueryMeta
          >,
          "Category",
          typeof Category,
          "categoryApi",
          unknown
        >
      > {
        throw new Error("Function not implemented.");
      },
    });
    render(
      <MemoryRouter>
        <Category />
      </MemoryRouter>
    );

    expect(screen.getByText("Loading Category...")).toBeInTheDocument();
  });

  it("renders error state", () => {
    (router.useParams as any).mockReturnValue({ id: "1" });
    vi.spyOn(categoryApi, "useGetCategoryByIdQuery").mockReturnValue({
      data: null,
      error: { message: "Failed" },
      isLoading: false,
      isFetching: false,
      refetch: () => {},
    });
    render(
      <MemoryRouter>
        <Category />
      </MemoryRouter>
    );
    expect(screen.getByText("Error Occured!!!")).toBeInTheDocument();
  });

  it("renders category data", () => {
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
      refetch: () => {},
    });

    render(
      <MemoryRouter>
        <Category />
      </MemoryRouter>
    );

    expect(screen.getByText("Test Category")).toBeInTheDocument();
    expect(screen.getByText("Slug: test-category")).toBeInTheDocument();
    expect(
      screen
        .getAllByRole("img")
        .find((img) => img.getAttribute("src") === "test.jpg")
    ).toHaveAttribute("src", "test.jpg");
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "/category-detail/1/edit"
    );
  });
});
