import { Link } from "react-router-dom";
import { useState } from "react";
import addToCartsvg from "../../assets/add-to-cart.svg";
import { useDispatch, useSelector } from "react-redux";
import { Slider } from "@mui/material";
import { addToCart } from "../../core/features/cartSlice";
import { useGetAllCategoriesQuery } from "../../core/features/categoryApi";
import { useGetProductsQuery } from "../../core/features/productApi";
import type { Category } from "../../core/interfaces/category";
import type { Product } from "../../core/interfaces/product";
import { updateQuantity } from "../../core/features/cartSlice";
import type { RootState } from "../../core/store/store";

export default function Products() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const defaultFilters = {
    title: "",
    price_min: 0,
    price_max: 200,
    categoryId: "",
    limit: 25,
    offset: 0,
  };

  const [filters, setFilters] = useState(defaultFilters);

  const { data: products, error, isLoading } = useGetProductsQuery(filters);
  const { data: categories } = useGetAllCategoriesQuery();

  const handlePriceChange = (_: Event, newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      setFilters({
        ...filters,
        price_min: newValue[0],
        price_max: newValue[1],
      });
    }
  };

  const handleResetFilters = () => {
    setFilters(defaultFilters);
  };

  if (isLoading) return <p className="text-center mt-10">Loading Products...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">Error Occurred !!!</p>;

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="font-bold text-2xl mb-3 sm:mb-0 text-gray-800">🛍️ Products</h1>
        <Link to="product/create">
          <button className="py-2 px-5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200">
            + Add Product
          </button>
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="lg:w-1/4 bg-gray-50 p-5 rounded-lg shadow-sm border border-gray-200 h-fit">
          <h2 className="text-lg font-semibold mb-4 text-gray-700 flex justify-between items-center">
            Filterss
            <button
              onClick={handleResetFilters}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium underline transition"
            >
              Reset
            </button>
          </h2>

          {/* Search */}
          <label htmlFor="name" className="block font-medium text-gray-600 mb-1">
            Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Search by name..."
            value={filters.title}
            onChange={(e) =>
              setFilters({ ...filters, title: e.target.value })
            }
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          {/* Price Range */}
          <div className="mt-6">
            <label className="block font-medium text-gray-600 mb-2">
              Price Range
            </label>
            <Slider
              value={[filters.price_min, filters.price_max]}
              onChange={handlePriceChange}
              valueLabelDisplay="auto"
              min={0}
              max={200}
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>${filters.price_min}</span>
              <span>${filters.price_max}</span>
            </div>
          </div>

          {/* Category Filter */}
          <div className="mt-6">
            <label htmlFor="category" className="block font-medium text-gray-600 mb-2">
              Category
            </label>
            <select
              id="category"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={filters.categoryId}
              onChange={(e) =>
                setFilters({ ...filters, categoryId: e.target.value })
              }
            >
              <option value="">All</option>
              {categories?.map((x: Category) => (
                <option key={x.id} value={x.id}>
                  {x.name}
                </option>
              ))}
            </select>
          </div>

          {/* Show Items */}
          <div className="mt-6">
            <label htmlFor="limit" className="block font-medium text-gray-600 mb-2">
              Show Items
            </label>
            <select
              id="limit"
              value={filters.limit}
              onChange={(e) => setFilters({ ...filters, limit: +e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {[25, 50, 75, 100].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <div className="lg:w-3/4">
          {products?.length ? (
            <>
              <div
                className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
                style={{ maxHeight: "75vh", overflowY: "auto" }}
              >
                {products.map((p: Product) => {
                  const cartItem = cartItems.find((item) => item.id === p.id);
                  const quantity = cartItem ? cartItem.quantity : 0;

                  return (
                    <div
                      key={p.id}
                      className="bg-white border border-gray-200 rounded-lg shadow hover:shadow-md transition-all duration-200 p-3 flex flex-col"
                    >
                      <Link to={`product-detail/${p.id}`}>
                        <img
                          src={p.images[0]}
                          alt={p.title}
                          className="w-full h-48 object-cover rounded-md"
                        />
                        <h3 className="mt-3 font-medium text-gray-800 text-sm sm:text-base truncate">
                          {p.title}
                        </h3>
                      </Link>

                      <div className="flex justify-between items-center mt-2">
                        <h4 className="font-semibold text-blue-600">${p.price}</h4>

                        <div className="flex items-center gap-2">
                          {quantity > 0 ? (
                            <>
                              <button
                                onClick={() =>
                                  dispatch(updateQuantity({ id: p.id, quantity: quantity - 1 }))
                                }
                                className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded"
                              >
                                -
                              </button>
                              <input
                                type="number"
                                min="1"
                                value={quantity}
                                onChange={(e) =>
                                  dispatch(
                                    updateQuantity({
                                      id: p.id,
                                      quantity: Math.max(1, +e.target.value || 1),
                                    })
                                  )
                                }
                                className="w-10 text-center border rounded"
                              />
                              <button
                                onClick={() =>
                                  dispatch(updateQuantity({ id: p.id, quantity: quantity + 1 }))
                                }
                                className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded"
                              >
                                +
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => dispatch(addToCart(p))}
                              aria-label={`Add ${p.title} to cart`}
                              className="p-2 rounded-full hover:bg-blue-100 transition"
                            >
                              <img src={addToCartsvg} alt="add to cart" width="20px" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Show More */}
              <div className="text-center mt-8">
                <button
                  className="py-2 px-5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200"
                  onClick={() =>
                    setFilters({ ...filters, limit: filters.limit + 25 })
                  }
                >
                  Show More
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center mt-10 text-gray-500">
              <p className="text-lg font-medium">No products found</p>
              <p className="text-sm">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
